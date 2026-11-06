import {
  PiloterrApiError,
  PiloterrConfigurationError,
  PiloterrResponseDecodingError,
  PiloterrSerializationError,
  PiloterrTransportError,
  PiloterrJobTimeoutError,
} from "./errors.js";
import { ENDPOINTS, type EndpointName } from "./endpoints.js";
import type * as Params from "./params.js";
import { encodeQueryPairs, serializeRequest } from "./serialization.js";
import type {
  ApiResponse,
  BatchOptions,
  BatchResult,
  BinaryResponse,
  HttpMethod,
  JsonResponse,
  RawResponse,
  RequestOptions,
  PiloterrClientOptions,
  PiloterrFetch,
  WaitForJobOptions,
} from "./types.js";
import { VERSION } from "./version.js";

export const DEFAULT_BASE_URL = "https://api.piloterr.com";
export const DEFAULT_TIMEOUT_MS = 120_000;
/** Retries after a network error or a 408, 429, 500, 502, 503 or 504 response. */
export const MAX_RETRIES = 3;
/** Delay before the first retry, in milliseconds. */
export const DEFAULT_RETRY_DELAY_MS = 1_000;
/** Each retry waits this many times longer than the previous one (a Retry-After header wins). */
export const RETRY_BACKOFF_FACTOR = 1.5;
/** Longest wait between two attempts, in milliseconds. */
export const MAX_RETRY_DELAY_MS = 30_000;
/** Tasks run at the same time by batch(). */
export const DEFAULT_CONCURRENCY = 10;
const RETRYABLE_STATUSES = new Set([408, 500, 502, 503, 504]);

/**
 * Server errors and plan rate limits are retried. The API reports rate limits as 401 (or 429) with a
 * "Rate limit exceeded" message; per-key quotas ("…: quota daily") do not reset within seconds, so they are not.
 */
function isRetryable(rawResponse: RawResponse): boolean {
  if (RETRYABLE_STATUSES.has(rawResponse.status)) return true;
  if (rawResponse.status !== 401 && rawResponse.status !== 429) return false;
  const message = (
    createApiError(rawResponse).errorMessage ?? ""
  ).toLowerCase();
  if (message.includes("quota")) return false;
  return (
    message.includes("rate limit") ||
    (rawResponse.status === 429 && message === "")
  );
}
const API_KEY_ENVIRONMENT_VARIABLE = "PILOTERR_API_KEY";

type EmptyParams = Params.EmptyParams;

/**
 * Official Piloterr API client. Create one instance and reuse it.
 */
export class PiloterrClient {
  readonly #apiKey: string;
  readonly #baseUrl: string;
  readonly #timeout: number;
  readonly #maxRetries: number;
  readonly #retryDelay: number;
  readonly #headers: Readonly<Record<string, string>>;
  readonly #fetch: PiloterrFetch;

  constructor(options: PiloterrClientOptions = {}) {
    if (
      typeof options !== "object" ||
      options === null ||
      Array.isArray(options)
    ) {
      throw new PiloterrConfigurationError(
        "PiloterrClient options must be an object.",
      );
    }
    const apiKey =
      options.apiKey ?? readEnvironment(API_KEY_ENVIRONMENT_VARIABLE);
    if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
      throw new PiloterrConfigurationError(
        `A non-blank Piloterr API key is required. Pass apiKey or set ${API_KEY_ENVIRONMENT_VARIABLE}.`,
      );
    }
    try {
      new Headers({ "x-api-key": apiKey });
    } catch (cause) {
      throw new PiloterrConfigurationError(
        "The Piloterr API key cannot be used in an HTTP header.",
        { cause },
      );
    }

    const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    let parsedBaseUrl: URL;
    try {
      parsedBaseUrl = new URL(baseUrl);
    } catch (cause) {
      throw new PiloterrConfigurationError("baseUrl must be an absolute URL.", {
        cause,
      });
    }
    if (
      parsedBaseUrl.protocol !== "https:" &&
      parsedBaseUrl.protocol !== "http:"
    ) {
      throw new PiloterrConfigurationError("baseUrl must use http or https.");
    }

    const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
    if (
      typeof timeout !== "number" ||
      !Number.isFinite(timeout) ||
      timeout < 0
    ) {
      throw new PiloterrConfigurationError(
        "timeout must be a non-negative number of milliseconds.",
      );
    }

    const maxRetries = options.maxRetries ?? MAX_RETRIES;
    if (!Number.isInteger(maxRetries) || maxRetries < 0) {
      throw new PiloterrConfigurationError(
        "maxRetries must be a non-negative integer.",
      );
    }
    const retryDelayMs = options.retryDelay ?? DEFAULT_RETRY_DELAY_MS;
    if (
      typeof retryDelayMs !== "number" ||
      !Number.isFinite(retryDelayMs) ||
      retryDelayMs < 0
    ) {
      throw new PiloterrConfigurationError(
        "retryDelay must be a non-negative number of milliseconds.",
      );
    }

    const fetchImplementation = options.fetch ?? globalThis.fetch;
    if (typeof fetchImplementation !== "function") {
      throw new PiloterrConfigurationError(
        "A Fetch-compatible transport is required.",
      );
    }

    this.#apiKey = apiKey;
    this.#baseUrl = baseUrl.replace(/\/+$/, "");
    this.#timeout = timeout;
    this.#maxRetries = maxRetries;
    this.#retryDelay = retryDelayMs;
    this.#headers = Object.freeze({ ...(options.headers ?? {}) });
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  /**
   * Sends any request to the Piloterr API. Use it for endpoints released after this SDK version.
   * GET parameters travel in the query string; POST parameters travel in a JSON body.
   */
  async request<T = any>(
    method: HttpMethod,
    path: string,
    params?: Readonly<Record<string, unknown>> | null,
    options?: RequestOptions | null,
  ): Promise<ApiResponse<T>> {
    return this.#send<T>(method, path, params, options, "any");
  }

  /**
   * Runs `task` for every item with at most `concurrency` tasks in flight (default 10) and returns one result per
   * item, in input order. A failing item never stops the others.
   *
   * ```ts
   * const results = await client.batch(ids, (id) => client.someEndpoint({ query: id }));
   * ```
   */
  async batch<I, T>(
    items: Iterable<I>,
    task: (item: I, index: number) => Promise<T>,
    options: BatchOptions = {},
  ): Promise<BatchResult<T>[]> {
    const list = [...items];
    const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new PiloterrConfigurationError(
        "concurrency must be a positive integer.",
      );
    }
    const results: BatchResult<T>[] = new Array(list.length);
    let next = 0;
    const worker = async (): Promise<void> => {
      while (next < list.length) {
        const index = next++;
        options.signal?.throwIfAborted();
        try {
          results[index] = {
            status: "fulfilled",
            index,
            value: await task(list[index]!, index),
          };
        } catch (reason) {
          results[index] = { status: "rejected", index, reason };
        }
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(concurrency, list.length) }, worker),
    );
    return results;
  }

  /**
   * About You Product. Read one About You product from a product URL or a keyword. A keyword opens the first search hit. Set region when the query does not already name the shop. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/aboutyou/product`
   */
  aboutyouProduct<T = any>(
    params: Params.AboutyouProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aboutyou_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * About You Search. Search an About You shop with a keyword or a search URL. Pick the country with region, or let a full link choose the shop. Cards include brand, price, and the product link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/aboutyou/search`
   */
  aboutyouSearch<T = any>(
    params: Params.AboutyouSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aboutyou_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Action Product. Action Product API: fetch full product page data from a product ID or URL on Action.com. Returns pricing, specs, images, breadcrumbs and availability via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/action/product`
   */
  actionProduct<T = any>(
    params: Params.ActionProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("action_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Action Search. Action Search API: search product listings by keyword or URL on Action.com across European locales. Returns prices, images, locale, currency and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/action/search`
   */
  actionSearch<T = any>(
    params: Params.ActionSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("action_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Aldi Product. Aldi Product API: fetch full product page data from an Aldi URL or path slug. Returns pricing, images, description, category and cooling flags. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/aldi/product`
   */
  aldiProduct<T = any>(
    params: Params.AldiProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aldi_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Aldi Search. Aldi Search API: list products from an Aldi category page URL or path across FR, DE, NL and Canarias shops. Returns prices, thumbnails and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/aldi/search`
   */
  aldiSearch<T = any>(
    params: Params.AldiSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aldi_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Alibaba Product. Alibaba Product API. Fetch a full B2B product page by URL or product ID with optional locale subdomain. Browser rendering returns tiered pricing, seller profile and lead times. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/alibaba/product`
   */
  alibabaProduct<T = any>(
    params: Params.AlibabaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("alibaba_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Alibaba Search. Alibaba Search API. Query B2B product listings by keyword or search URL across 17 locale subdomains. Request mode returns prices, MOQ, seller data and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/alibaba/search`
   */
  alibabaSearch<T = any>(
    params: Params.AlibabaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("alibaba_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * AliExpress Product. AliExpress Product API: scrape live /item/ product pages from a full URL. Get title, images, seller identity, pricing, specs, delivery, and FAQs as JSON via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/aliexpress/product`
   */
  aliexpressProduct<T = any>(
    params: Params.AliexpressProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aliexpress_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * AliExpress Reviews. AliExpress Reviews API: list buyer reviews for a product id or item URL. Each review includes author, star rating, text, date, and photos when the buyer attached them. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/aliexpress/product/reviews`
   */
  aliexpressProductReviews<T = any>(
    params: Params.AliexpressProductReviewsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aliexpress_product_reviews", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * AliExpress Search. AliExpress Search API: search by keyword or wholesale URL and get product listings with prices, ratings, sold counts, and pagination as JSON via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/aliexpress/search`
   */
  aliexpressSearch<T = any>(
    params: Params.AliexpressSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aliexpress_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * AliExpress Store Product. AliExpress Store Product API: list products from an AliExpress seller store by URL or store ID. Returns store metadata and product cards (~40 SSR items) as JSON via browser rendering. Pagination is not supported. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/aliexpress/store/product`
   */
  aliexpressStoreProduct<T = any>(
    params: Params.AliexpressStoreProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("aliexpress_store_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Allegro Product. Allegro Product API. Extract full product page data from allegro.pl by URL (/produkt/, /oferta/, /ogloszenie/). Browser rendering, 3 credits per call. Pair with Allegro Search (3 credits) for listing discovery. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/allegro/product`
   */
  allegroProduct<T = any>(
    params: Params.AllegroProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("allegro_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Allegro Search. Allegro Search API. Query product listings by keyword, optional page number, or full allegro.pl listing URL. Returns results with prices, sellers, sponsorship flags and pagination. 3 credits per call. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/allegro/search`
   */
  allegroSearch<T = any>(
    params: Params.AllegroSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("allegro_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Amazon Product. Efficiently extract product details from Amazon for dynamic retail insights, including price, stock, features, and seller data. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/amazon/product`
   */
  amazonProduct<T = any>(
    params: Params.AmazonProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("amazon_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Amazon Product Offer. Efficiently extract details of third-party seller offers for any Amazon product across multiple marketplaces. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/amazon/product/offer`
   */
  amazonProductOffer<T = any>(
    params: Params.AmazonProductOfferParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("amazon_product_offer", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Amazon Search. Efficiently scrape Amazon search results for real-time product data and insights across multiple Amazon marketplaces. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/amazon/search`
   */
  amazonSearch<T = any>(
    params: Params.AmazonSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("amazon_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Apartments Property. Extract a full Apartments.com rental listing from a property URL, including amenities, gallery, description, geolocation, and unit details via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/apartments/property`
   */
  apartmentsProperty<T = any>(
    params: Params.ApartmentsPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("apartments_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Apartments Search. Search Apartments.com rentals from a full city or browse URL and retrieve prices, photos, addresses, phone numbers, and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/apartments/search`
   */
  apartmentsSearch<T = any>(
    params: Params.ApartmentsSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("apartments_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Argenprop Property. Read one Argenprop listing from its URL or id. You get price, address, rooms, expenses, and the agent when the page shows them. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/argenprop/property`
   */
  argenpropProperty<T = any>(
    params: Params.ArgenpropPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("argenprop_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Argenprop Search. Search Argenprop by neighbourhood or city. Set operation to venta or alquiler, and property_type such as departamentos or casas. Page with pagina. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/argenprop/search`
   */
  argenpropSearch<T = any>(
    params: Params.ArgenpropSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("argenprop_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Argos Product. Argos Product API: one UK product by id or URL. Browser rendering (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/argos/product`
   */
  argosProduct<T = any>(
    params: Params.ArgosProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("argos_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Argos Search. Search the Argos UK catalogue by keyword and page the results. Prices are in pounds. A one-word query that Argos turns into a brand page with no product cards returns no results. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/argos/search`
   */
  argosSearch<T = any>(
    params: Params.ArgosSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("argos_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * arXiv Paper. Fetch one arXiv paper by id or by an abs, pdf, or html URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/arxiv/paper`
   */
  arxivPaper<T = any>(
    params: Params.ArxivPaperParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("arxiv_paper", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * arXiv Search. Search arXiv papers by keyword, author query such as au:einstein, or arXiv id. A paper URL returns 400. Page through results when the match count is large. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/arxiv/search`
   */
  arxivSearch<T = any>(
    params: Params.ArxivSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("arxiv_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Auchan Product. Effortlessly extract product details from Auchan for dynamic business insights, including nutritional information, ingredients, ratings, and reviews. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/auchan/product`
   */
  auchanProduct<T = any>(
    params: Params.AuchanProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("auchan_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Auchan Search. Extract Auchan product listings from keyword searches for insightful market analysis and competitive edge. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/auchan/search`
   */
  auchanSearch<T = any>(
    params: Params.AuchanSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("auchan_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Autodoc Product. Scrape Autodoc product pages: price, specs, EAN, images, compatibility, and TecDoc-related vehicle data via the Related endpoint. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/autodoc/product`
   */
  autodocProduct<T = any>(
    params: Params.AutodocProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autodoc_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Autodoc Product Related. Vehicle fitment lines per maker for an Autodoc product. All parameters from Product fetch.params are required. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/autodoc/product/related`
   */
  autodocProductRelated<T = any>(
    params: Params.AutodocProductRelatedParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autodoc_product_related", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Autodoc Search. Search Autodoc by URL: keyword pages use /search?keyword=… (e.g. frein on auto-doc.fr). Extract product cards, prices, and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/autodoc/search`
   */
  autodocSearch<T = any>(
    params: Params.AutodocSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autodoc_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Auto Europe Result. Read one vehicle from an Auto Europe quote. Pass the offer id from Search, with the same pickup and dates. You get the supplier, the SIPP code, and the package prices. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/autoeurope/result`
   */
  autoeuropeResult<T = any>(
    params: Params.AutoeuropeResultParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autoeurope_result", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Auto Europe Search. Quote a rental car on Auto Europe. Pass pickup, pickup date, and dropoff date. Region chooses the country site and its currency. The whole quote comes back on one page. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/autoeurope/search`
   */
  autoeuropeSearch<T = any>(
    params: Params.AutoeuropeSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autoeurope_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * AutoScout24 Ad. Read one AutoScout24 listing, including an inactive ad that still exposes the listing. Price, vehicle, seller, and location. (1 credit) Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/autoscout24/ad`
   */
  autoscout24Ad<T = any>(
    params: Params.Autoscout24AdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autoscout24_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * AutoScout24 Search. Search AutoScout24 listings from a search URL. Each card has make, model, numeric price, mileage, and the listing URL. (1 credit) Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/autoscout24/search`
   */
  autoscout24Search<T = any>(
    params: Params.Autoscout24SearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autoscout24_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Autotrader Ad. Extract full vehicle details from an AutoTrader UK car-details URL, including price, specs, gallery, seller, and description via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/autotrader/ad`
   */
  autotraderAd<T = any>(
    params: Params.AutotraderAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autotrader_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Autotrader Search. Search AutoTrader UK listings from a car-search URL and retrieve prices, specs, photos, seller info, and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/autotrader/search`
   */
  autotraderSearch<T = any>(
    params: Params.AutotraderSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("autotrader_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Best Buy Product. Get a Best Buy US or Canada product page: title, price, brand, stock, images, categories and specs via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/bestbuy/product`
   */
  bestbuyProduct<T = any>(
    params: Params.BestbuyProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bestbuy_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Best Buy Reviews. Get customer reviews for a Best Buy product URL: rating, review text, author, photos and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/bestbuy/product/reviews`
   */
  bestbuyProductReviews<T = any>(
    params: Params.BestbuyProductReviewsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bestbuy_product_reviews", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Best Buy Search. Search Best Buy US or Canada by keyword or search URL. Returns product listings with price, rating and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/bestbuy/search`
   */
  bestbuySearch<T = any>(
    params: Params.BestbuySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bestbuy_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * B&H Photo Video Product. Read a B&H Photo Video product from its URL or id. Returns price, rating, specifications, and box contents. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bhphotovideo/product`
   */
  bhphotovideoProduct<T = any>(
    params: Params.BhphotovideoProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bhphotovideo_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * B&H Photo Video Search. Search B&H Photo Video by keyword or search URL. Returns BH numbers, dollar prices, and a next page URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bhphotovideo/search`
   */
  bhphotovideoSearch<T = any>(
    params: Params.BhphotovideoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bhphotovideo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bing Search. Scrape real-time Bing search results with full control over location, language, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bing/search`
   */
  bingSearch<T = any>(
    params: Params.BingSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bing_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bitiba Product. Read one product from a live Bitiba shop, including the selected variant price and the pack list. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bitiba/product`
   */
  bitibaProduct<T = any>(
    params: Params.BitibaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bitiba_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bitiba Search. Search a live Bitiba country shop. Germany is the default. www.bitiba.com is closed and returns 400. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bitiba/search`
   */
  bitibaSearch<T = any>(
    params: Params.BitibaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bitiba_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bol Product. Read one bol.com product by URL or product id, in nl, be-nl, or be-fr. You get the selling price, the list price, and the seller. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/bol/product`
   */
  bolProduct<T = any>(
    params: Params.BolProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bol_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bol Search. Search bol.com by keyword. Region is nl, be-nl, or be-fr. Page the product cards. Sponsored ads can repeat across pages. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/bol/search`
   */
  bolSearch<T = any>(
    params: Params.BolSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bol_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Boulanger Product. Read one Boulanger product from its URL or product id. You get price, brand, rating, seller, and specifications. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/boulanger/product`
   */
  boulangerProduct<T = any>(
    params: Params.BoulangerProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("boulanger_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Boulanger Search. Search Boulanger by keyword and page the product grid. Cards include price, brand, seller, and the product URL. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/boulanger/search`
   */
  boulangerSearch<T = any>(
    params: Params.BoulangerSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("boulanger_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Brave Search. Access the Brave search engine results directly through our efficient Piloterr service for reliable data scraping. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/brave/search`
   */
  braveSearch<T = any>(
    params: Params.BraveSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("brave_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Brico Dépôt Product. Read one Brico Dépôt product from its product URL. You get price, brand, SKU, and availability. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bricodepot/product`
   */
  bricodepotProduct<T = any>(
    params: Params.BricodepotProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bricodepot_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Brico Dépôt Search. Search Brico Dépôt with a /produits/ listing URL, not a keyword box. Page 2 is the same path with /2 at the end. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bricodepot/search`
   */
  bricodepotSearch<T = any>(
    params: Params.BricodepotSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bricodepot_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bricorama Product. Read one Bricorama product from its URL. You get price, brand, and the product details. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bricorama/product`
   */
  bricoramaProduct<T = any>(
    params: Params.BricoramaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bricorama_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Bricorama Search. Search Bricorama by keyword or search URL and page the home-improvement grid. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/bricorama/search`
   */
  bricoramaSearch<T = any>(
    params: Params.BricoramaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("bricorama_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Carrefour Product. Read one Carrefour.fr product from its page URL. Every product returns the same keys: price, brand, pack size, Nutriscore, categories, unit price, and customer reviews. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/carrefour/product`
   */
  carrefourProduct<T = any>(
    params: Params.CarrefourProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("carrefour_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Carrefour Search. Search for products on Carrefour by keyword or URL, returning structured listings with prices, ratings, and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/carrefour/search`
   */
  carrefourSearch<T = any>(
    params: Params.CarrefourSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("carrefour_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Carrefour Suggest. Get product suggestions from Carrefour by keyword or EAN, returning matching products with pricing, availability, and product details. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/carrefour/suggest`
   */
  carrefourSuggest<T = any>(
    params: Params.CarrefourSuggestParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("carrefour_suggest", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Castorama Product. Read one Castorama product from its URL. You get price, brand, and specifications. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/castorama/product`
   */
  castoramaProduct<T = any>(
    params: Params.CastoramaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("castorama_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Castorama Search. Search Castorama by keyword or search URL and page the DIY listings. Cards include title, price, and product link. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/castorama/search`
   */
  castoramaSearch<T = any>(
    params: Params.CastoramaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("castorama_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Cdiscount Product. Extract full product details from a Cdiscount product page, including price, seller, ratings, specifications, and offers. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/cdiscount/product`
   */
  cdiscountProduct<T = any>(
    params: Params.CdiscountProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("cdiscount_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Cdiscount Product Offer. Retrieve all marketplace seller offers for a Cdiscount product, including prices, seller ratings, shipping costs, and availability. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/cdiscount/product/offer`
   */
  cdiscountProductOffer<T = any>(
    params: Params.CdiscountProductOfferParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("cdiscount_product_offer", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Cdiscount Search. Extract product listings from Cdiscount search results or category pages for market intelligence and competitive analysis. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/cdiscount/search`
   */
  cdiscountSearch<T = any>(
    params: Params.CdiscountSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("cdiscount_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Centris Property. Read one Centris property from its URL or listing id. You get price, address, rooms, and the broker. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/centris/property`
   */
  centrisProperty<T = any>(
    params: Params.CentrisPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("centris_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Centris Search. Search Centris listings by city or by a full results URL. Use the English or French path. Page through properties for sale. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/centris/search`
   */
  centrisSearch<T = any>(
    params: Params.CentrisSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("centris_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Chewy Product. Read one Chewy product by URL or numeric id. The default mode is expert and returns the historical product cache. simple returns one snake_case product. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/chewy/product`
   */
  chewyProduct<T = any>(
    params: Params.ChewyProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("chewy_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Chewy Search. Search Chewy by keyword or listing URL. The default mode is expert and returns the historical listing objects. simple returns short snake_case cards. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/chewy/search`
   */
  chewySearch<T = any>(
    params: Params.ChewySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("chewy_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ClearedJobs Job. Fetch one cleared job by its URL or by a slug that ends in the numeric id. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/clearedjobs/job`
   */
  clearedjobsJob<T = any>(
    params: Params.ClearedjobsJobParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("clearedjobs_job", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ClearedJobs Search. Search cleared jobs by keyword. Only the first HTML page is available, so pagination.next is null and page 2 returns 404. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/clearedjobs/search`
   */
  clearedjobsSearch<T = any>(
    params: Params.ClearedjobsSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("clearedjobs_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Company Database. Retrieve comprehensive company data including financials, technologies, social profiles, and location by domain name. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/company`
   */
  company<T = any>(
    params: Params.CompanyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("company", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Coolblue Product. Read one Coolblue product by article id or product URL, in the region of that shop. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/coolblue/product`
   */
  coolblueProduct<T = any>(
    params: Params.CoolblueProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("coolblue_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Coolblue Search. Search Coolblue with a product keyword. Region defaults to Belgium. Also use nl or de. Page through product cards. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/coolblue/search`
   */
  coolblueSearch<T = any>(
    params: Params.CoolblueSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("coolblue_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Copart Lot. Copart Lot API: retrieve structured auction lot data by lot number or URL. Specs, damage, bids, photos, yard location and sale status across regional Copart sites. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/copart/lot`
   */
  copartLot<T = any>(
    params: Params.CopartLotParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("copart_lot", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Copart Search. Copart Search API: search auction lots by keyword or URL across Copart regional sites. Returns lot listings and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/copart/search`
   */
  copartSearch<T = any>(
    params: Params.CopartSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("copart_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Costco Product. Costco Product API: fetch full product page data from a product ID or URL across regional Costco sites. Returns pricing, availability, ratings, images and breadcrumbs via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/costco/product`
   */
  costcoProduct<T = any>(
    params: Params.CostcoProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("costco_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Costco Search. Costco Search API: search product listings by keyword or URL across 13 regional Costco sites. Returns prices, availability, review counts and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/costco/search`
   */
  costcoSearch<T = any>(
    params: Params.CostcoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("costco_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Crunchbase Company Info. Convert URLs into detailed Crunchbase profiles for immediate company insights. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/crunchbase/company/info`
   */
  crunchbaseCompanyInfo<T = any>(
    params?: Params.CrunchbaseCompanyInfoParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("crunchbase_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Crunchbase Event. Retrieve detailed Crunchbase event profiles with speakers, sponsors, exhibitors, and press timelines. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/crunchbase/event`
   */
  crunchbaseEvent<T = any>(
    params: Params.CrunchbaseEventParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("crunchbase_event", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Crunchbase Funding Round. Retrieve full details of a specific Crunchbase funding round including investors and press timeline. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/crunchbase/funding_round`
   */
  crunchbaseFundingRound<T = any>(
    params: Params.CrunchbaseFundingRoundParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("crunchbase_funding_round", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Crunchbase Funding Rounds. Monitor funding history and financial milestones of companies with Crunchbase data. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/crunchbase/funding_rounds`
   */
  crunchbaseFundingRounds<T = any>(
    params?: Params.CrunchbaseFundingRoundsParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("crunchbase_funding_rounds", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Crunchbase People Info. Retrieve detailed Crunchbase profiles for individuals including career history, investments, and board positions. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/crunchbase/people/info`
   */
  crunchbasePeopleInfo<T = any>(
    params: Params.CrunchbasePeopleInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("crunchbase_people_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Crunchbase Search. Search Crunchbase for companies and people by keyword and retrieve their profiles and Crunchbase identifiers. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/crunchbase/search`
   */
  crunchbaseSearch<T = any>(
    params: Params.CrunchbaseSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("crunchbase_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Cultura Product. Read one Cultura product from its URL or SKU. You get price, EAN, seller, condition, and stock wording. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/cultura/product`
   */
  culturaProduct<T = any>(
    params: Params.CulturaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("cultura_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Cultura Search. Search Cultura by keyword and page through books, games, and culture products. Cards include title, price, availability, and the product link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/cultura/search`
   */
  culturaSearch<T = any>(
    params: Params.CulturaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("cultura_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Darty Product. Read one Darty product sheet from a product URL or a Darty product id. You get price, brand, availability, rating, and specifications. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/darty/product`
   */
  dartyProduct<T = any>(
    params: Params.DartyProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("darty_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Darty Search. Search Darty by keyword or search URL and page through the listing. Each card has title, price, brand, seller, and product link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/darty/search`
   */
  dartySearch<T = any>(
    params: Params.DartySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("darty_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Dataset Linkedin Company. Query the LinkedIn company dataset with Elasticsearch Query DSL. Filter by name, domain, industry, headcount, and country. POST-only, 1 credit per row returned. Credit cost: 1 credit per row.
   *
   * `POST /v2/datasets/linkedin/company`
   */
  datasetsLinkedinCompany<T = any>(
    params?: Params.DatasetsLinkedinCompanyParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("datasets_linkedin_company", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Decathlon Product. Read one Decathlon product from a product URL, a product path, or a keyword. A keyword uses the first search hit. Set region when the query does not already name the shop. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/decathlon/product`
   */
  decathlonProduct<T = any>(
    params: Params.DecathlonProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("decathlon_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Decathlon Search. Search a Decathlon shop with a keyword or a search URL. Choose the country with region, or let a full link pick the shop, then page through titles, prices, and product links. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/decathlon/search`
   */
  decathlonSearch<T = any>(
    params: Params.DecathlonSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("decathlon_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DigiKey Product. Get a DigiKey product page: part numbers, manufacturer, price tiers, stock, images, datasheet and specs via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/digikey/product`
   */
  digikeyProduct<T = any>(
    params: Params.DigikeyProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("digikey_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DigiKey Search. Search DigiKey country sites by keyword or result/filter URL. Returns category branches or product listings with pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/digikey/search`
   */
  digikeySearch<T = any>(
    params: Params.DigikeySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("digikey_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DOAJ Article. Fetch one DOAJ article by its id or by a doaj.org article URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/doaj/article`
   */
  doajArticle<T = any>(
    params: Params.DoajArticleParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("doaj_article", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DOAJ Journal. Fetch one DOAJ journal by ISSN, journal id, or a doaj.org toc URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/doaj/journal`
   */
  doajJournal<T = any>(
    params: Params.DoajJournalParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("doaj_journal", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DOAJ Search. Search DOAJ articles or journals. kind is article (default) or journal. Article ids and journal ISSNs are the detail keys. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/doaj/search`
   */
  doajSearch<T = any>(
    params: Params.DoajSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("doaj_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Domain DNSBL. Check if a domain or IP address is listed in DNS-based blacklists (DNSBL), with detailed provider-level detection and category information. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/domain/dnsbl`
   */
  domainDnsbl<T = any>(
    params: Params.DomainDnsblParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("domain_dnsbl", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Domain Malicious. Check if a domain or IP address has been flagged as malicious across multiple threat intelligence feeds, with source attribution. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/domain/malicious`
   */
  domainMalicious<T = any>(
    params: Params.DomainMaliciousParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("domain_malicious", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Domain Whois. Retrieve WHOIS registration data for any domain, including registration dates, registrar details, name servers, and contact information. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/domain/whois`
   */
  domainWhois<T = any>(
    params: Params.DomainWhoisParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("domain_whois", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Domain.com.au Property. Read one Domain.com.au listing from its URL. The response is a flat object with price, address, agency, and photos. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/domaincomau/property`
   */
  domaincomauProperty<T = any>(
    params: Params.DomaincomauPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("domaincomau_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Domain.com.au Search. Search Domain.com.au by suburb. mode is sale, rent, or sold. page starts at 1. Each card has a dollar price and a price label rebuilt from that amount. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/domaincomau/search`
   */
  domaincomauSearch<T = any>(
    params: Params.DomaincomauSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("domaincomau_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * DuckDuckGo Search. Query DuckDuckGo via API and retrieve structured organic results with region and language. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/duckduckgo/search`
   */
  duckduckgoSearch<T = any>(
    params: Params.DuckduckgoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("duckduckgo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * eBay Product. eBay Product API: one listing on a supported eBay site, by URL or item id (3 credits). Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/ebay/product`
   */
  ebayProduct<T = any>(
    params: Params.EbayProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ebay_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * eBay Search. eBay Search API: search listings on supported eBay sites. Returns price, seller, and pagination (3 credits). Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/ebay/search`
   */
  ebaySearch<T = any>(
    params: Params.EbaySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ebay_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * El Corte Inglés Product. El Corte Inglés Product API. Fetch a full product page from elcorteingles.es by URL or product id. Returns pricing, stock, images and identifiers via browser rendering. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/elcorteingles/product`
   */
  elcorteinglesProduct<T = any>(
    params: Params.ElcorteinglesProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("elcorteingles_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * El Corte Inglés Search. El Corte Inglés Search API. Search product listings on elcorteingles.es by keyword or URL. Returns prices, brands, images and pagination via webunlocker. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/elcorteingles/search`
   */
  elcorteinglesSearch<T = any>(
    params: Params.ElcorteinglesSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("elcorteingles_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * E.Leclerc Product. Read one E.Leclerc product by EAN or product URL. Pass store_id to get that store's price and stock. Another store returns a different price and stock. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/eleclerc/product`
   */
  eleclercProduct<T = any>(
    params: Params.EleclercProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("eleclerc_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * E.Leclerc Search. Search for products on E.Leclerc by keyword with optional store-specific filtering and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/eleclerc/search`
   */
  eleclercSearch<T = any>(
    params: Params.EleclercSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("eleclerc_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * E.Leclerc Suggest. Get instant product autocomplete suggestions from E.Leclerc for a given keyword or EAN. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/eleclerc/suggest`
   */
  eleclercSuggest<T = any>(
    params: Params.EleclercSuggestParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("eleclerc_suggest", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Email Analyzes. Analyze a domain to retrieve its email infrastructure. Microsoft 365 and Google Workspace domains, SPF records, and DNS configurations. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/email/analyzes`
   */
  emailAnalyzes<T = any>(
    params: Params.EmailAnalyzesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("email_analyzes", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Email Finder. Find verified professional email addresses by combining a person's full name with their company domain or company name. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/email/finder`
   */
  emailFinder<T = any>(
    params: Params.EmailFinderParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("email_finder", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Email Verify. Verify whether an email address is valid and deliverable, returning a clear status to prevent bounces and maintain list hygiene. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/email/verify`
   */
  emailVerify<T = any>(
    params: Params.EmailVerifyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("email_verify", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Europages Company. Europages company profile with address, supplier type and the products listed on the page (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/europages/company`
   */
  europagesCompany<T = any>(
    params: Params.EuropagesCompanyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("europages_company", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Europages Search. Search Europages suppliers by keyword or category URL. Returns company cards and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/europages/search`
   */
  europagesSearch<T = any>(
    params: Params.EuropagesSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("europages_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Eventbrite Event. Get one Eventbrite event by detail URL or numeric id: venue, organizer, schedule, and description (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/eventbrite/event`
   */
  eventbriteEvent<T = any>(
    params: Params.EventbriteEventParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("eventbrite_event", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Eventbrite Search. Search Eventbrite events by keyword or paste a city/category URL. Returns event cards and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/eventbrite/search`
   */
  eventbriteSearch<T = any>(
    params?: Params.EventbriteSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("eventbrite_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Expedia Ad. Fetch one Expedia hotel from its information URL: name, postal address, and amenity groups. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/expedia/ad`
   */
  expediaAd<T = any>(
    params: Params.ExpediaAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("expedia_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Expedia Flight. Search Expedia flights by airport route and dates, or by a flight search URL. Each offer includes the airline, times, stops, and displayed price. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/expedia/flight`
   */
  expediaFlight<T = any>(
    params: Params.ExpediaFlightParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("expedia_flight", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Expedia Search. Execute a hotel search on Expedia using a direct search URL and receive structured hotel listings with prices, ratings, and availability. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/expedia/search`
   */
  expediaSearch<T = any>(
    params: Params.ExpediaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("expedia_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fashionphile Product. Load one Fashionphile product from a handle or a product URL. Keywords and search URLs belong on the search endpoint. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/fashionphile/product`
   */
  fashionphileProduct<T = any>(
    params: Params.FashionphileProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fashionphile_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fashionphile Search. Search Fashionphile by keywords, a search URL, a collection URL, or a products.json URL. A product handle or product URL belongs on the product endpoint. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/fashionphile/search`
   */
  fashionphileSearch<T = any>(
    params: Params.FashionphileSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fashionphile_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Chewy Products Finder. Find Chewy product URLs by product name, ID, or any combination of filters to use in product detail and rendering API calls.
   *
   * `GET / POST /v2/finder/chewy-products`
   */
  finderChewyProducts<T = any>(
    params?: Params.FinderChewyProductsParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_chewy_products", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Eleclerc Stores Finder. Search Eleclerc stores by name or city to retrieve contact details, opening hours, and geolocation.
   *
   * `GET / POST /v2/finder/eleclerc-stores`
   */
  finderEleclercStores<T = any>(
    params: Params.FinderEleclercStoresParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_eleclerc_stores", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Countries Finder. Search the list of Google-supported countries by name or country code to use in Google Search API requests.
   *
   * `GET / POST /v2/finder/google-countries`
   */
  finderGoogleCountries<T = any>(
    params: Params.FinderGoogleCountriesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_google_countries", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Languages Finder. Search the list of Google-supported languages by name to retrieve language codes for use in Google Search API requests.
   *
   * `GET / POST /v2/finder/google-languages`
   */
  finderGoogleLanguages<T = any>(
    params: Params.FinderGoogleLanguagesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_google_languages", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Locations Finder. Search Google-supported locations by name to retrieve location IDs and GPS coordinates for geo-targeted search API calls.
   *
   * `GET / POST /v2/finder/google-locations`
   */
  finderGoogleLocations<T = any>(
    params: Params.FinderGoogleLocationsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_google_locations", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Leroy Merlin Products Finder. Find Leroy Merlin product URLs by product name, ID, or any combination of filters to use in product detail and rendering API calls.
   *
   * `GET / POST /v2/finder/leroymerlin-products`
   */
  finderLeroymerlinProducts<T = any>(
    params?: Params.FinderLeroymerlinProductsParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call(
      "finder_leroymerlin_products",
      params,
      options,
    ) as Promise<JsonResponse<T>>;
  }

  /**
   * Leroy Merlin Stores Finder. Search Leroy Merlin stores by name, city or postal code to retrieve their store ID, slug, address and store locator URL.
   *
   * `GET / POST /v2/finder/leroymerlin-stores`
   */
  finderLeroymerlinStores<T = any>(
    params: Params.FinderLeroymerlinStoresParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_leroymerlin_stores", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Industries Finder. Search LinkedIn industry taxonomy to retrieve industry IDs and hierarchies for use in LinkedIn API calls and data enrichment.
   *
   * `GET / POST /v2/finder/linkedin-industries`
   */
  finderLinkedinIndustries<T = any>(
    params: Params.FinderLinkedinIndustriesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_linkedin_industries", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Mr.Bricolage Stores Finder. Search Mr.Bricolage stores by name, city or postal code to retrieve their store ID, slug, contact information and geolocation.
   *
   * `GET / POST /v2/finder/mrbricolage-stores`
   */
  finderMrbricolageStores<T = any>(
    params: Params.FinderMrbricolageStoresParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("finder_mrbricolage_stores", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fiverr Profile Info. Extract complete public profile data from any Fiverr seller, including gigs, ratings, reviews, skills, portfolio, and consultation pricing. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/fiverr/profile/info`
   */
  fiverrProfileInfo<T = any>(
    params: Params.FiverrProfileInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fiverr_profile_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fiverr Search. Search Fiverr gigs using a direct search URL and receive paginated listings with seller information, gig titles, images, and seller levels. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/fiverr/search`
   */
  fiverrSearch<T = any>(
    params: Params.FiverrSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fiverr_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fnac Product. Read one Fnac product from its URL or product id. You get the price, brand, EAN, seller, and rating. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/fnac/product`
   */
  fnacProduct<T = any>(
    params: Params.FnacProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fnac_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fnac Search. Search Fnac for a keyword or a SearchResult URL. Each card has the product id, name, price, seller, and stock. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/fnac/search`
   */
  fnacSearch<T = any>(
    params: Params.FnacSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fnac_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fotocasa Property Ad. Get a full Fotocasa listing by URL: price, features, coordinates, energy certificate, images, and agency (browser rendering, 2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/fotocasa/ad`
   */
  fotocasaAd<T = any>(
    params: Params.FotocasaAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fotocasa_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fotocasa Property Search. Search Fotocasa listings by city or search URL. Returns prices, rooms, area, coordinates, and agency data via browser rendering (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/fotocasa/search`
   */
  fotocasaSearch<T = any>(
    params: Params.FotocasaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fotocasa_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Franchise Direct Franchise. Read one Franchise Direct profile: cash requirement, franchise fee, investment range, and training. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/franchisedirect/franchise`
   */
  franchisedirectFranchise<T = any>(
    params: Params.FranchisedirectFranchiseParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("franchisedirect_franchise", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Franchise Direct Search. Search Franchise Direct listings by keyword or listing URL. Each card includes a USD cash figure and a numeric minimum. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/franchisedirect/search`
   */
  franchisedirectSearch<T = any>(
    params: Params.FranchisedirectSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("franchisedirect_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fressnapf Product. Read a Fressnapf Germany product sheet from its URL. Returns sku, GTIN, euro price, unit price, and pack variants. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/fressnapf/product`
   */
  fressnapfProduct<T = any>(
    params: Params.FressnapfProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fressnapf_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Fressnapf Search. Search Fressnapf Germany by keyword or category URL. Returns product cards with euro prices and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/fressnapf/search`
   */
  fressnapfSearch<T = any>(
    params: Params.FressnapfSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("fressnapf_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Funda Property. Read one Funda listing from its URL. You get the asking price, living area, and the feature groups. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/funda/property`
   */
  fundaProperty<T = any>(
    params: Params.FundaPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("funda_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Funda Search. Search Funda by place. Set offering to koop for sale or huur for rent, then page the listings. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/funda/search`
   */
  fundaSearch<T = any>(
    params: Params.FundaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("funda_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * G2 Product Info. Read a G2 product reviews page: rating, pricing, categories, alternatives, screenshots, and the reviews shown on the page. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/g2/product/info`
   */
  g2ProductInfo<T = any>(
    params: Params.G2ProductInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("g2_product_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * GitHub User Info. Retrieve public GitHub user profile data including bio, company, location, follower count, repositories, and associated email addresses. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/github/user/info`
   */
  githubUserInfo<T = any>(
    params: Params.GithubUserInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("github_user_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Glassdoor Company Info. Get one Glassdoor company profile by URL or employer id (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/glassdoor/company/info`
   */
  glassdoorCompanyInfo<T = any>(
    params: Params.GlassdoorCompanyInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("glassdoor_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Glassdoor Company Search. Search Glassdoor employers by keyword across country sites (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/glassdoor/company/search`
   */
  glassdoorCompanySearch<T = any>(
    params: Params.GlassdoorCompanySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("glassdoor_company_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Glassdoor Job Info. Get one Glassdoor job listing by URL or jl id (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/glassdoor/job/info`
   */
  glassdoorJobInfo<T = any>(
    params: Params.GlassdoorJobInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("glassdoor_job_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Glassdoor Job Search. Search Glassdoor jobs by keyword or SEO URL, with domain and filters (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/glassdoor/job/search`
   */
  glassdoorJobSearch<T = any>(
    params: Params.GlassdoorJobSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("glassdoor_job_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Goodreads Book. Read one Goodreads book by the numeric id from search, such as 44767458 for Dune. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/goodreads/book`
   */
  goodreadsBook<T = any>(
    params: Params.GoodreadsBookParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("goodreads_book", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Goodreads Search. Search Goodreads books by keyword. pagination.next is a Goodreads search URL for the following page. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/goodreads/search`
   */
  goodreadsSearch<T = any>(
    params: Params.GoodreadsSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("goodreads_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Images. Google Images Scraper API – bringing the power of visual search to your fingertips. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/images`
   */
  googleImages<T = any>(
    params: Params.GoogleImagesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_images", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Jobs. Extract job listings from Google Careers for enhanced recruitment and market analysis. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/jobs`
   */
  googleJobs<T = any>(
    params: Params.GoogleJobsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_jobs", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Maps. Extract comprehensive company data from Google Maps for enhanced business insights. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/google/maps`
   */
  googleMaps<T = any>(
    params: Params.GoogleMapsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_maps", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google News. Extract real-time news articles from Google News with advanced filtering by topic, location, language, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/news`
   */
  googleNews<T = any>(
    params: Params.GoogleNewsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_news", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Search. Scrape real-time Google search results with organic listings, knowledge graph, related searches, and advanced filters. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/search`
   */
  googleSearch<T = any>(
    params: Params.GoogleSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google AI Mode. Scrape real-time Google AI Mode answers: text_blocks, references, and shopping_results. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/google/search/ai`
   */
  googleSearchAi<T = any>(
    params: Params.GoogleSearchAiParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search_ai", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Search Autocomplete. Retrieve real-time Google Search autocomplete suggestions for any query, with support for language and country localization. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/search/autocomplete`
   */
  googleSearchAutocomplete<T = any>(
    params: Params.GoogleSearchAutocompleteParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_search_autocomplete", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Shopping. Search Google Shopping and retrieve structured product listings with prices, ratings, merchants, and product IDs. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/shopping`
   */
  googleShopping<T = any>(
    params: Params.GoogleShoppingParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_shopping", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Videos. Scrape video results from Google Videos search including YouTube, Reddit, and other video platforms, with location and language support. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/google/videos`
   */
  googleVideos<T = any>(
    params: Params.GoogleVideosParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("google_videos", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Ads Transparency Ad. Get one Google Ads Transparency creative by URL: dates, impressions, platforms, regions, and the text read from the preview image (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/googleadstransparency/ad`
   */
  googleadstransparencyAd<T = any>(
    params: Params.GoogleadstransparencyAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("googleadstransparency_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Google Ads Transparency Search. Search the Google Ads Transparency Center by domain, advertiser, region, format, platform, and date. Returns creative cards and pagination (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/googleadstransparency/search`
   */
  googleadstransparencySearch<T = any>(
    params: Params.GoogleadstransparencySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call(
      "googleadstransparency_search",
      params,
      options,
    ) as Promise<JsonResponse<T>>;
  }

  /**
   * Grainger Product. Get a Grainger US or Canada product page: SKU, brand, price, images, description and specs via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/grainger/product`
   */
  graingerProduct<T = any>(
    params: Params.GraingerProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("grainger_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Grainger Search. Search Grainger US or Canada by keyword, category URL or SKU. Returns product listings, category branches and suggestions via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/grainger/search`
   */
  graingerSearch<T = any>(
    params: Params.GraingerSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("grainger_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Greenhouse Job. Fetch one Greenhouse job by board/id, such as discord/8806482002, or by a job-boards.greenhouse.io job URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/greenhouse/job`
   */
  greenhouseJob<T = any>(
    params: Params.GreenhouseJobParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("greenhouse_job", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Greenhouse Search. List jobs on a Greenhouse board. query is the board token, such as discord. keyword filters title and location. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/greenhouse/search`
   */
  greenhouseSearch<T = any>(
    params: Params.GreenhouseSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("greenhouse_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * GSA eLibrary Contract. Read one GSA eLibrary contractor record from the contract URL returned by search. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/gsaelibrary/contract`
   */
  gsaelibraryContract<T = any>(
    params: Params.GsaelibraryContractParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("gsaelibrary_contract", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * GSA eLibrary Search. Search GSA eLibrary for schedule, SIN, and contract rows by keyword or by a full search URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/gsaelibrary/search`
   */
  gsaelibrarySearch<T = any>(
    params: Params.GsaelibrarySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("gsaelibrary_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Homestra Ad. Retrieve detailed property listing data from Homestra, including price, size, location, features, photos, and nearby properties. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/homestra/ad`
   */
  homestraAd<T = any>(
    params: Params.HomestraAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("homestra_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Homestra Search. Search Homestra property listings using a direct search URL with filters, returning structured results with prices, sizes, locations, and photos. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/homestra/search`
   */
  homestraSearch<T = any>(
    params: Params.HomestraSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("homestra_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Hugging Face Model. Read one public Hugging Face model by an id such as google-bert/bert-base-uncased. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/huggingface/model`
   */
  huggingfaceModel<T = any>(
    params: Params.HuggingfaceModelParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("huggingface_model", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Hugging Face Search. Search the public Hugging Face models API by keyword and follow pagination.next to the next cursor page. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/huggingface/search`
   */
  huggingfaceSearch<T = any>(
    params: Params.HuggingfaceSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("huggingface_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Idealista Property. Extract full property details from an Idealista listing URL, including price, specs, photos by room, features, energy rating, and advertiser data. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/idealista/property`
   */
  idealistaProperty<T = any>(
    params: Params.IdealistaPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("idealista_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Idealista Provinces. List the 50 Spanish provinces Idealista shows for homes for sale. Each row includes the sale search URL to pass as query to Idealista Search. Madrid is madrid-provincia. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/idealista/provinces`
   */
  idealistaProvinces<T = any>(
    params?: Params.IdealistaProvincesParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("idealista_provinces", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Idealista Search. Search Idealista listings from a search URL and retrieve prices, specs, photos, agency info, and pagination. Pass a province URL from /v2/idealista/provinces (results[].url) as query. Madrid is `https://www.idealista.com/venta-vivien… Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/idealista/search`
   */
  idealistaSearch<T = any>(
    params: Params.IdealistaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("idealista_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Idealo Product. Get an Idealo product from Spain, France, or Germany. URL or product id. Offers, shipping, specs, and images via WebUnlocker (3 credits). Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/idealo/product`
   */
  idealoProduct<T = any>(
    params: Params.IdealoProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("idealo_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Idealo Search. Search Idealo Spain, France, and Germany. Keyword or search URL. Prices, shipping, ratings, and pagination via WebUnlocker (3 credits). Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/idealo/search`
   */
  idealoSearch<T = any>(
    params: Params.IdealoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("idealo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * IKEA Product. Extract full IKEA product details from a product URL, including price, gallery, variants, dimensions, and breadcrumb. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ikea/product`
   */
  ikeaProduct<T = any>(
    params: Params.IkeaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ikea_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * IKEA Search. Search IKEA products from a search URL and retrieve prices, ratings, dimensions, images, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ikea/search`
   */
  ikeaSearch<T = any>(
    params: Params.IkeaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ikea_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ImmobilienScout24 Property. Read one ImmobilienScout24 expose by URL or numeric id. You get cold rent or purchase price, address, and area. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/immobilienscout24/property`
   */
  immobilienscout24Property<T = any>(
    params: Params.Immobilienscout24PropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("immobilienscout24_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ImmobilienScout24 Search. Search ImmobilienScout24 by region and property type. real_estate_type covers rent, buy, house, and land. Page with pagenumber. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/immobilienscout24/search`
   */
  immobilienscout24Search<T = any>(
    params: Params.Immobilienscout24SearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("immobilienscout24_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ImmoScout24 Switzerland Search. Search ImmoScout24.ch listings by city or search URL and retrieve the CHF price, rooms, living area, and address. Property pages are not available. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/immoscout24ch/search`
   */
  immoscout24chSearch<T = any>(
    params: Params.Immoscout24chSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("immoscout24ch_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Immowelt Property. Extract full property details from an Immowelt listing URL, including price, specs, photo gallery, energy certificate, location, and contact data. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/immowelt/property`
   */
  immoweltProperty<T = any>(
    params: Params.ImmoweltPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("immowelt_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Immowelt Search. Search Immowelt listings from a search URL and retrieve prices, specs, photos, agency info, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/immowelt/search`
   */
  immoweltSearch<T = any>(
    params: Params.ImmoweltSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("immowelt_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ImoveisWeb Property. Read one Imobiliária Aquários listing from its imoveisweb.com.br URL. price_display is rebuilt from the asking amount. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/imoveisweb/property`
   */
  imoveiswebProperty<T = any>(
    params: Params.ImoveiswebPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("imoveisweb_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ImoveisWeb Search. Search the Imobiliária Aquários catalog on imoveisweb.com.br. Pass a catalog name such as casas. price_display is rebuilt from the asking amount. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/imoveisweb/search`
   */
  imoveiswebSearch<T = any>(
    params: Params.ImoveiswebSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("imoveisweb_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Indeed Company Info. Indeed Company Info API. Full employer profile by slug or URL. Browser rendering returns headcount, revenue, industry and FAQ or review blocks. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/indeed/company/info`
   */
  indeedCompanyInfo<T = any>(
    params: Params.IndeedCompanyInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("indeed_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Indeed Company Search. Indeed Company Search API. Search fr.indeed.com employer profiles by keyword or URL. Browser rendering returns ratings, industry and profile links. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/indeed/company/search`
   */
  indeedCompanySearch<T = any>(
    params: Params.IndeedCompanySearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("indeed_company_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Indeed Job Info. Indeed Job Info API. Fetch a full job posting by viewjob URL, sponsored click URL or job key. Browser rendering returns description and structured salary. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/indeed/job/info`
   */
  indeedJobInfo<T = any>(
    params: Params.IndeedJobInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("indeed_job_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Indeed Job Salary. Indeed Job Salary API. Career salary aggregates by job title slug or URL. Browser rendering returns median, percentiles and top paying cities. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/indeed/job/salary`
   */
  indeedJobSalary<T = any>(
    params: Params.IndeedJobSalaryParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("indeed_job_salary", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Indeed Job Search. Indeed Job Search API. Search fr.indeed.com job listings by keyword or URL. Browser rendering returns cards with salary snippets and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/indeed/job/search`
   */
  indeedJobSearch<T = any>(
    params: Params.IndeedJobSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("indeed_job_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Inet Product. Read one Inet.se product by article number or URL, including SEK price, specs, and warehouse stock. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/inet/product`
   */
  inetProduct<T = any>(
    params: Params.InetProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("inet_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Inet Search. Search Inet.se by keyword or category. Prices are inc-VAT SEK, with the next page URL when more results exist. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/inet/search`
   */
  inetSearch<T = any>(
    params: Params.InetSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("inet_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Instagram Post Info. Monitor competitors and market trends by scraping Instagram posts for valuable data. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/instagram/post/info`
   */
  instagramPostInfo<T = any>(
    params: Params.InstagramPostInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("instagram_post_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Instagram User Info. Gather user insights efficiently from Instagram for targeted marketing strategies. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/instagram/user/info`
   */
  instagramUserInfo<T = any>(
    params: Params.InstagramUserInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("instagram_user_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Intermarché Product. Get an Intermarché product sheet for a store (shop_id). Try an EAN or product URL with shop_id=11301. 3 credits per call. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/intermarche/product`
   */
  intermarcheProduct<T = any>(
    params: Params.IntermarcheProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("intermarche_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Intermarché Search. Search Intermarché products for a store (shop_id). Try query=lait and shop_id=11301. 3 credits per call. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/intermarche/search`
   */
  intermarcheSearch<T = any>(
    params: Params.IntermarcheSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("intermarche_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Intersport Product. Read one Intersport product from its URL. You get price, brand, and the product details. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/intersport/product`
   */
  intersportProduct<T = any>(
    params: Params.IntersportProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("intersport_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Intersport Search. Search Intersport by keyword and page the sports grid. Cards include title, price, and product link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/intersport/search`
   */
  intersportSearch<T = any>(
    params: Params.IntersportSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("intersport_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * JamesEdition Property. Read one JamesEdition listing from its URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/jamesedition/property`
   */
  jameseditionProperty<T = any>(
    params: Params.JameseditionPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("jamesedition_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * JamesEdition Search. Search JamesEdition luxury homes by keyword or by a results URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/jamesedition/search`
   */
  jameseditionSearch<T = any>(
    params: Params.JameseditionSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("jamesedition_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Jobs. Poll the status, progress (0–100) and result of a job started with is_async=true. Polling is free. Poll until status is terminal: CompletedJob, Error, NotFound or BadRequest.
   *
   * `GET /v1/jobs/{id}`
   */
  jobs<T = any>(
    params: Params.JobsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("jobs", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Kick User Info. Retrieve complete public channel data from Kick including streamer profile, follower count, live status, and recent categories. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/kick/user/info`
   */
  kickUserInfo<T = any>(
    params: Params.KickUserInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("kick_user_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Kijiji Ad. Read one Kijiji ad from its id or URL. You get the asking price, the title, and the city. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/kijiji/ad`
   */
  kijijiAd<T = any>(
    params: Params.KijijiAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("kijiji_ad", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Kijiji Search. Search Kijiji with a results URL or a city and category. Language can be English or French. Page through classified ads. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/kijiji/search`
   */
  kijijiSearch<T = any>(
    params: Params.KijijiSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("kijiji_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Kroger Product. Read one Kroger product by UPC. The sheet uses the same default store as search. You get the shelf price and the previous price when Kroger shows one. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/kroger/product`
   */
  krogerProduct<T = any>(
    params: Params.KrogerProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("kroger_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Kroger Search. Search Kroger groceries by keyword and page the results. Prices come from the default pickup store returned in the response. A location id you pass is not applied. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/kroger/search`
   */
  krogerSearch<T = any>(
    params: Params.KrogerSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("kroger_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Lamudi Ad. Get a full Lamudi listing by URL: price, area, amenities, coordinates, images, and agent (browser rendering, 2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/lamudi/ad`
   */
  lamudiAd<T = any>(
    params: Params.LamudiAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("lamudi_ad", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Lamudi Search. Search Lamudi Philippines and Indonesia listings. Pass a search URL in query, or use location and filters. Prices, area, rooms, tags, and pagination via browser rendering (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/lamudi/search`
   */
  lamudiSearch<T = any>(
    params?: Params.LamudiSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("lamudi_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Leboncoin Ad. Extract full details from a Leboncoin ad including price, location, attributes, seller info, and images. Returns structured JSON by default, or raw HTML on demand. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/leboncoin/ad`
   */
  leboncoinAd<T = any>(
    params: Params.LeboncoinAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("leboncoin_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Leboncoin Search. Scrape Leboncoin search results or category pages by URL, returning paginated listings with price, location, and attributes. Returns structured JSON. return_page_source is deprecated and returns 400. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/leboncoin/search`
   */
  leboncoinSearch<T = any>(
    params: Params.LeboncoinSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("leboncoin_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Leboncoin Search API. Search Leboncoin listings via structured POST API with advanced filters for category, location, price range, seller type, and sorting. Credit cost: 1 credit per call.
   *
   * `POST /v2/leboncoin/search_api`
   */
  leboncoinSearchApi<T = any>(
    params?: Params.LeboncoinSearchApiParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("leboncoin_search_api", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Lenovo Product. Extract a Lenovo product page by URL: id, name, price, currency, availability, images, and description (browser rendering, 2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/lenovo/product`
   */
  lenovoProduct<T = any>(
    params: Params.LenovoProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("lenovo_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Lenovo Search. Search Lenovo products by keyword or listing URL. Returns product id, price, currency, series, and availability via browser rendering (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/lenovo/search`
   */
  lenovoSearch<T = any>(
    params: Params.LenovoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("lenovo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Leroy Merlin Product. Live Leroy Merlin product detail for France and Romania from a URL or identifier: offers, currency, images, features and store context. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/leroymerlin/product`
   */
  leroymerlinProduct<T = any>(
    params: Params.LeroymerlinProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("leroymerlin_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Leroy Merlin Search. Live Leroy Merlin search across France and Romania: title, URL, price, currency, brand, seller, rating and pagination. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/leroymerlin/search`
   */
  leroymerlinSearch<T = any>(
    params: Params.LeroymerlinSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("leroymerlin_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Lidl Product. Lidl Product API: fetch full product page data from a Lidl URL or ERP id. Returns pricing, images, description, availability and category via Nuxt SSR parsing. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/lidl/product`
   */
  lidlProduct<T = any>(
    params: Params.LidlProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("lidl_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Lidl Search. Lidl Search API: search product listings by keyword or URL across Lidl online shops in 27 countries. Parses Nuxt SSR payload from HTML; returns prices, ratings, brand and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/lidl/search`
   */
  lidlSearch<T = any>(
    params: Params.LidlSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("lidl_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Company Info. LinkedIn Company Info API. Fetch firmographics by LinkedIn slug, URL, company ID, or reverse domain lookup (guideflow.com). Industry, headcount, HQ, posts, and more. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/company/info`
   */
  linkedinCompanyInfo<T = any>(
    params?: Params.LinkedinCompanyInfoParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Job Count. Obtain real-time job counts on LinkedIn by industry, region, and role for strategic planning. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/job/count`
   */
  linkedinJobCount<T = any>(
    params?: Params.LinkedinJobCountParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_job_count", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Job Info. Dive into LinkedIn job data and trends for in-depth labor market insights. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/job/info`
   */
  linkedinJobInfo<T = any>(
    params: Params.LinkedinJobInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_job_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Job Search. Experience advanced job data extraction from LinkedIn, enhancing your recruitment strategy. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/job/search`
   */
  linkedinJobSearch<T = any>(
    params?: Params.LinkedinJobSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_job_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Job Suggest. Get personalized job suggestions based on keywords or locations to streamline your job search. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/job/suggest`
   */
  linkedinJobSuggest<T = any>(
    params: Params.LinkedinJobSuggestParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_job_suggest", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Post Info. Simplify LinkedIn post retrieval with our efficient API for enhanced content analysis. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/post/info`
   */
  linkedinPostInfo<T = any>(
    params: Params.LinkedinPostInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_post_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Product Info. Gain competitive insights with detailed LinkedIn product information for strategic advantage. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/product/info`
   */
  linkedinProductInfo<T = any>(
    params: Params.LinkedinProductInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_product_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Profile Info. Streamline recruitment and business development by extracting valuable LinkedIn profile insights. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/linkedin/profile/info`
   */
  linkedinProfileInfo<T = any>(
    params: Params.LinkedinProfileInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedin_profile_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Ad Library Ad. Get one LinkedIn Ad Library creative by URL or id: copy, CTA, payer, impressions, and targeting (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/linkedinadlibrary/ad`
   */
  linkedinadlibraryAd<T = any>(
    params: Params.LinkedinadlibraryAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedinadlibrary_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LinkedIn Ad Library Search. Search the LinkedIn Ad Library by advertiser, keyword, country, and date. Returns ad cards and pagination (2 credits). Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/linkedinadlibrary/search`
   */
  linkedinadlibrarySearch<T = any>(
    params?: Params.LinkedinadlibrarySearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("linkedinadlibrary_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LoopNet Property. Read one LoopNet commercial listing from its URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/loopnet/property`
   */
  loopnetProperty<T = any>(
    params: Params.LoopnetPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("loopnet_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * LoopNet Search. Search LoopNet commercial listings by city or by a results URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/loopnet/search`
   */
  loopnetSearch<T = any>(
    params: Params.LoopnetSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("loopnet_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Maersk Tracking. Track a Maersk container or BOL: origin, destination, current milestone and full transport-plan events via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/maersk/tracking`
   */
  maerskTracking<T = any>(
    params: Params.MaerskTrackingParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("maersk_tracking", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ManoMano Product. Read a ManoMano product URL. The body is the product page: brand and seller are objects, and the current price is price.primary_price.amount_with_vat. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/manomano/product`
   */
  manomanoProduct<T = any>(
    params: Params.ManomanoProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("manomano_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ManoMano Product Offer. List the other sellers for a ManoMano product id. Each offer adds price and price_display on top of the site offer. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/manomano/product/offer`
   */
  manomanoProductOffer<T = any>(
    params: Params.ManomanoProductOfferParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("manomano_product_offer", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ManoMano Search. Read a ManoMano category URL or keyword. Each card keeps the site fields and adds prices.main, brand_name, and image_fullpath. pagination.next is a boolean. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/manomano/search`
   */
  manomanoSearch<T = any>(
    params: Params.ManomanoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("manomano_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Mascus Ad. Get full details for a Mascus used equipment listing: specs, price, seller and description. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/mascus/ad`
   */
  mascusAd<T = any>(
    params: Params.MascusAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mascus_ad", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Mascus Search. Search used equipment listings on Mascus from a category URL, with pagination that keeps country and category filters. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/mascus/search`
   */
  mascusSearch<T = any>(
    params: Params.MascusSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mascus_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * MediaMarkt Product. Read one MediaMarkt product by id or product URL, in the region you choose. You get price, currency, EAN, and availability. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/mediamarkt/product`
   */
  mediamarktProduct<T = any>(
    params: Params.MediamarktProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mediamarkt_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * MediaMarkt Search. Search a MediaMarkt shop by keyword. Set region for Switzerland, Germany, Austria, and the other MediaMarktSaturn countries, then page the results. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/mediamarkt/search`
   */
  mediamarktSearch<T = any>(
    params: Params.MediamarktSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mediamarkt_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Micromania Product. Read one Micromania product from its URL or product id. You get the price, brand, EAN, platform, and stock. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/micromania/product`
   */
  micromaniaProduct<T = any>(
    params: Params.MicromaniaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("micromania_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Micromania Search. Search Micromania for a keyword or a Search-Show URL. Each card has the product id, name, brand, EAN, price, and stock. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/micromania/search`
   */
  micromaniaSearch<T = any>(
    params: Params.MicromaniaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("micromania_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Mobile Ad. Mobile Ad API. Fetch full car listing data from a mobile.de ad URL or numeric id. Returns pricing, specs, images and features via webunlocker. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/mobile/ad`
   */
  mobileAd<T = any>(
    params: Params.MobileAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mobile_ad", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Mobile Search. Mobile Search API. Same mobile.de inventory for every locale. locale sets the language label and ad links, not which cars are returned. (3 credits) Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/mobile/search`
   */
  mobileSearch<T = any>(
    params: Params.MobileSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mobile_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Morele Product. Read one morele.net product page. Flat JSON with PLN price, EAN, specs, and availability. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/morele/product`
   */
  moreleProduct<T = any>(
    params: Params.MoreleProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("morele_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Morele Search. Search morele.net by keyword or search URL. Returns product cards with PLN prices and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/morele/search`
   */
  moreleSearch<T = any>(
    params: Params.MoreleSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("morele_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Mr.Bricolage Suggest. Live Mr.Bricolage product suggestions for a search keyword or EAN, including title, URL, image, price and currency. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/mrbricolage/suggest`
   */
  mrbricolageSuggest<T = any>(
    params: Params.MrbricolageSuggestParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("mrbricolage_suggest", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Newegg Product. Read a Newegg product from an item number, catalog id, or URL. Returns price, specs, images, and seller. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/newegg/product`
   */
  neweggProduct<T = any>(
    params: Params.NeweggProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("newegg_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Newegg Search. Search Newegg by keyword or search URL. Returns item numbers, dollar prices, stock, and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/newegg/search`
   */
  neweggSearch<T = any>(
    params: Params.NeweggSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("newegg_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * North Data Company. North Data company profile: register, address, financials and history (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/northdata/company`
   */
  northdataCompany<T = any>(
    params: Params.NorthdataCompanyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("northdata_company", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * North Data Search. Search North Data companies and people by name. Returns suggestion cards and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/northdata/search`
   */
  northdataSearch<T = any>(
    params: Params.NorthdataSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("northdata_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * NPI Provider. Fetch one NPPES provider or organization by 10-digit NPI or provider-view URL, including addresses and taxonomies. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/npi/provider`
   */
  npiProvider<T = any>(
    params: Params.NpiProviderParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("npi_provider", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * NPI Search. Search the NPPES NPI registry by person name, organization, or 10-digit NPI. With NPI-2, a text query is the organization name. total_results is null, and next is set only when the page is full. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/npi/search`
   */
  npiSearch<T = any>(
    params?: Params.NpiSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("npi_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Oceanio Search. Search Ocean.io by domain or company name to find the matching company, similar companies, contacts, and people. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/oceanio/search`
   */
  oceanioSearch<T = any>(
    params: Params.OceanioSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("oceanio_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * OLX Ad. Read one OLX ad from its id or URL. You get the asking price, the city, and the seller name. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/olx/ad`
   */
  olxAd<T = any>(
    params: Params.OlxAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("olx_ad", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * OLX Product. Read one OLX ad from its id or URL. You get the asking price, the city, and the seller name. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/olx/product`
   */
  olxProduct<T = any>(
    params: Params.OlxProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("olx_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * OLX Search. Search OLX Brazil classifieds by keyword and get title, price, location, seller type, and condition as structured JSON in real time. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/olx/search`
   */
  olxSearch<T = any>(
    params: Params.OlxSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("olx_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Oscaro Product. Oscaro Product API. Fetch full auto parts product data from an Oscaro product URL. Returns pricing, brand, reference, images and availability via browser rendering and JSON-LD parsing. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/oscaro/product`
   */
  oscaroProduct<T = any>(
    params: Params.OscaroProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("oscaro_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Oscaro Search. Oscaro Search API. Search auto parts by keyword, search URL or category listing on oscaro.com, oscaro.es and oscaro.pt. Returns prices and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/oscaro/search`
   */
  oscaroSearch<T = any>(
    params: Params.OscaroSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("oscaro_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Ovoko Ad. Extract an Ovoko listing from a SKU URL: price, currency, images, seller, quality, vehicle make, part numbers, and warranty. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ovoko/ad`
   */
  ovokoAd<T = any>(
    params: Params.OvokoAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ovoko_ad", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * Ovoko Search. Search Ovoko used-parts listings from a search URL and retrieve title, price, OEM codes, seller, vehicle text, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ovoko/search`
   */
  ovokoSearch<T = any>(
    params: Params.OvokoSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ovoko_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Owler Company Info. Retrieve detailed company intelligence from Owler, including revenue, employee count, CEO info, competitors, funding, and industry sectors. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/owler/company/info`
   */
  owlerCompanyInfo<T = any>(
    params: Params.OwlerCompanyInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("owler_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Owler Search. Search for companies on Owler by name or keyword, returning a list of matching companies with slugs, logos, domains, and profile URLs. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/owler/search`
   */
  owlerSearch<T = any>(
    params: Params.OwlerSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("owler_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PagesJaunes Page Info. Retrieve detailed business information from a PagesJaunes page, including contact details, opening hours, services, payment methods, and SIREN number. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/pagesjaunes/page/info`
   */
  pagesjaunesPageInfo<T = any>(
    params: Params.PagesjaunesPageInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pagesjaunes_page_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PagesJaunes Search. Search PagesJaunes for French local businesses by category and location, returning paginated results with contact details and ratings. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/pagesjaunes/search`
   */
  pagesjaunesSearch<T = any>(
    params: Params.PagesjaunesSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pagesjaunes_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Patreon Profile Info. Retrieve a Patreon creator profile with patron counts, membership tiers, campaign summary, and creator metadata. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/patreon/profile/info`
   */
  patreonProfileInfo<T = any>(
    params: Params.PatreonProfileInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("patreon_profile_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Patreon Search. Search Patreon creators by keyword and retrieve campaign cards with patron counts, post counts, and profile URLs. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/patreon/search`
   */
  patreonSearch<T = any>(
    params: Params.PatreonSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("patreon_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PetSmart Product. Read one PetSmart product URL, including the selected size, dollar price, flavor, and item number. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/petsmart/product`
   */
  petsmartProduct<T = any>(
    params: Params.PetsmartProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("petsmart_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PetSmart Search. Search PetSmart by keyword or search URL. Page through pet food, litter, and supplies with dollar prices. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/petsmart/search`
   */
  petsmartSearch<T = any>(
    params: Params.PetsmartSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("petsmart_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Picard Product. Picard Product API. Fetch full frozen food product data from a Picard URL or reference. Returns pricing, images, description, Nutri-Score, Planet-Score, breadcrumb and reviews. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/picard/product`
   */
  picardProduct<T = any>(
    params: Params.PicardProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("picard_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Picard Search. Picard Search API. Search frozen food listings on picard.fr by keyword or URL. Parses SFCC Search-UpdateGrid HTML; returns prices, Nutri-Score, ratings and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/picard/search`
   */
  picardSearch<T = any>(
    params: Params.PicardSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("picard_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Pinterest User Info. Access Pinterest user profiles and analytics for targeted marketing and audience insights. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/pinterest/user/info`
   */
  pinterestUserInfo<T = any>(
    params: Params.PinterestUserInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pinterest_user_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PitchBook Company Info. Get a PitchBook company profile: overview, funding, competitors and more via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/pitchbook/company/info`
   */
  pitchbookCompanyInfo<T = any>(
    params: Params.PitchbookCompanyInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pitchbook_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PitchBook Search. Search PitchBook for companies, news and profiles by keyword or search URL via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/pitchbook/search`
   */
  pitchbookSearch<T = any>(
    params: Params.PitchbookSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pitchbook_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Point.P Product. Point.P Product API: scrape live /p/ product pages from a full URL. Get title, images, EAN, pricing, specifications, and breadcrumbs as JSON via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/pointp/product`
   */
  pointpProduct<T = any>(
    params: Params.PointpProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pointp_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Point.P Search. Point.P Search API: search by keyword or URL and get building-material listings with prices, brands, ratings, units, and pagination as JSON via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/pointp/search`
   */
  pointpSearch<T = any>(
    params: Params.PointpSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("pointp_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PR Newswire Article. Read one PR Newswire press release from its URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/prnewswire/article`
   */
  prnewswireArticle<T = any>(
    params: Params.PrnewswireArticleParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("prnewswire_article", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * PR Newswire Search. Search PR Newswire press releases by keyword or by a news-search URL. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/prnewswire/search`
   */
  prnewswireSearch<T = any>(
    params: Params.PrnewswireSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("prnewswire_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ProductHunt Product Info. Retrieve product data from ProductHunt, including tagline, categories, screenshots, reviews rating, and social links. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/producthunt/product/info`
   */
  producthuntProductInfo<T = any>(
    params: Params.ProducthuntProductInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("producthunt_product_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Proshop Product. Read one proshop.dk product page. Flat JSON with DKK price, EAN, specs, and stock text. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/proshop/product`
   */
  proshopProduct<T = any>(
    params: Params.ProshopProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("proshop_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Proshop Search. Search proshop.dk by keyword or search URL. Returns product cards with DKK prices and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/proshop/search`
   */
  proshopSearch<T = any>(
    params: Params.ProshopSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("proshop_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rappi Product. Fetch one Rappi Mexico product, including the primary store price and the other store offers. The primary price can differ from a search card. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/rappi/product`
   */
  rappiProduct<T = any>(
    params: Params.RappiProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rappi_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rappi Search. Search Rappi Mexico on rappi.com.mx. The city resolves to Mexico City. Each row is one store offer, and next is null. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/rappi/search`
   */
  rappiSearch<T = any>(
    params: Params.RappiSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rappi_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rate My Professors Professor. Read one Rate My Professors profile, including difficulty and would-take-again when the page shows them. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/ratemyprofessors/professor`
   */
  ratemyprofessorsProfessor<T = any>(
    params: Params.RatemyprofessorsProfessorParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ratemyprofessors_professor", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rate My Professors Search. Search Rate My Professors by name. Cards include school, department, difficulty, and would-take-again when the card shows them. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/ratemyprofessors/search`
   */
  ratemyprofessorsSearch<T = any>(
    params: Params.RatemyprofessorsSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ratemyprofessors_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * realestate.com.au Search. Search realestate.com.au buy, rent, or sold results. A place such as Sydney, NSW defaults to homes for sale. Each card has price, address, rooms, and a property URL. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/realestatecomau/search`
   */
  realestatecomauSearch<T = any>(
    params: Params.RealestatecomauSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("realestatecomau_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Realtor Property. Extract full property details from a Realtor.com listing URL, including price, specs, photos, agents, features, and location data. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/realtor/property`
   */
  realtorProperty<T = any>(
    params: Params.RealtorPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("realtor_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Realtor Search. Search Realtor.com listings from a search URL and retrieve prices, beds, baths, sqft, photos, and property metadata. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/realtor/search`
   */
  realtorSearch<T = any>(
    params: Params.RealtorSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("realtor_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Redfin Property. Read one for-sale Redfin home. Pass the url from search, which already includes the market id. The response is a flat listing, the same fields as one search result. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/redfin/property`
   */
  redfinProperty<T = any>(
    params: Params.RedfinPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("redfin_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Redfin Search. Search for-sale homes on Redfin from a city, neighborhood, or county link. Each listing url includes the market id to pass to the property endpoint. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/redfin/search`
   */
  redfinSearch<T = any>(
    params: Params.RedfinSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("redfin_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Reichelt Product. Read one reichelt.de product URL, including article number, EAN, and the euro price. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/reichelt/product`
   */
  reicheltProduct<T = any>(
    params: Params.ReicheltProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("reichelt_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Reichelt Search. Search reichelt.de by keyword or category. Euro prices are rebuilt from the number, including whole-euro amounts. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/reichelt/search`
   */
  reicheltSearch<T = any>(
    params: Params.ReicheltSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("reichelt_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Reverb Product. Reverb Product API: fetch full listing data from a Reverb URL or listing id. Returns pricing, specs, images, description and shop info via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/reverb/product`
   */
  reverbProduct<T = any>(
    params: Params.ReverbProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("reverb_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Reverb Search. Reverb Search API: search music gear listings by keyword, query string or marketplace URL on Reverb. Returns prices, thumbnails and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/reverb/search`
   */
  reverbSearch<T = any>(
    params: Params.ReverbSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("reverb_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rexel Product. Get a Rexel France product page: references, EAN, descriptions, images and specs via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/rexel/product`
   */
  rexelProduct<T = any>(
    params: Params.RexelProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rexel_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rexel Search. Search Rexel France by keyword, EAN or search URL. Returns product cards and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/rexel/search`
   */
  rexelSearch<T = any>(
    params: Params.RexelSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rexel_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rightmove Property. Read one Rightmove property from its URL or numeric id. The response is a flat object with price, tenure, floor area, stations, and the agent. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/rightmove/property`
   */
  rightmoveProperty<T = any>(
    params: Params.RightmovePropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rightmove_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Rightmove Search. Search Rightmove by a UK place name or a search URL. Each card has a numeric price, a price label rebuilt from that number, the address, the agent, and a property URL. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/rightmove/search`
   */
  rightmoveSearch<T = any>(
    params: Params.RightmoveSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rightmove_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * RS Online Product. Read one RS Online UK product URL, including the RS stock number, manufacturer part, and pound price. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/rsonline/product`
   */
  rsonlineProduct<T = any>(
    params: Params.RsonlineProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rsonline_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * RS Online Search. Search RS Online UK by keyword or category. Pound prices keep the amount printed on the page. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/rsonline/search`
   */
  rsonlineSearch<T = any>(
    params: Params.RsonlineSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("rsonline_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SEEK Job. Read one SEEK Australia job from its URL or numeric id. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seek/job`
   */
  seekJob<T = any>(
    params: Params.SeekJobParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seek_job", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * SEEK Search. Search SEEK Australia jobs by keyword or by a results URL. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seek/search`
   */
  seekSearch<T = any>(
    params: Params.SeekSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seek_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SeLoger Agency. Retrieve detailed profile information for a SeLoger real estate agency including contact details, ratings, reviews, and address. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seloger/agency`
   */
  selogerAgency<T = any>(
    params: Params.SelogerAgencyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seloger_agency", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SeLoger Agency Rent. Retrieve paginated rental property listings published by a specific SeLoger agency using its numeric agency ID. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seloger/agency/rent`
   */
  selogerAgencyRent<T = any>(
    params: Params.SelogerAgencyRentParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seloger_agency_rent", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SeLoger Agency Sale. Retrieve paginated sale property listings published by a specific SeLoger agency using its numeric agency ID. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seloger/agency/sale`
   */
  selogerAgencySale<T = any>(
    params: Params.SelogerAgencySaleParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seloger_agency_sale", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SeLoger Property. Efficiently extract detailed data from a SeLoger real estate listing including agency info, pricing, photos, description, and property criteria. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seloger/property`
   */
  selogerProperty<T = any>(
    params: Params.SelogerPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seloger_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SeLoger Search. Efficiently extract real estate listings from SeLoger search pages for market insights, property management, and investment analysis. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/seloger/search`
   */
  selogerSearch<T = any>(
    params: Params.SelogerSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("seloger_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Sephora Product. Read one European Sephora product by id or product URL. Set region when you are not on the French shop. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/sephora/product`
   */
  sephoraProduct<T = any>(
    params: Params.SephoraProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("sephora_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Sephora Search. Search a European Sephora shop by keyword. Region defaults to France. Page through makeup and skincare cards. The US site is a different page and is not included. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/sephora/search`
   */
  sephoraSearch<T = any>(
    params: Params.SephoraSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("sephora_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Shophouzz Product. Retrieve full product details from Shophouzz, including title, price, variants, images, vendor, and structured metadata. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/shophouzz/product`
   */
  shophouzzProduct<T = any>(
    params: Params.ShophouzzProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("shophouzz_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Shopify Apps. Retrieve structured details about any Shopify App Store listing, including title, logo, screenshots, pricing plans, categories, and description. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/shopify/apps`
   */
  shopifyApps<T = any>(
    params: Params.ShopifyAppsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("shopify_apps", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Shopify Catalog. List products from a Shopify shop. query is the shop domain or a URL on that shop. page and limit choose the slice. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/shopify/catalog`
   */
  shopifyCatalog<T = any>(
    params: Params.ShopifyCatalogParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("shopify_catalog", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Shopify Collections. List collections from a Shopify shop. query is the shop domain or a URL on that shop. page and limit choose the slice. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/shopify/collections`
   */
  shopifyCollections<T = any>(
    params: Params.ShopifyCollectionsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("shopify_collections", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Shopify Product. Extract full product details from any Shopify store product page, including title, variants, pricing, images, inventory, and options. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/shopify/product`
   */
  shopifyProduct<T = any>(
    params: Params.ShopifyProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("shopify_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SimilarWeb Domain. Retrieve website traffic and engagement metrics for a domain from the public Similarweb page, including visits, bounce rate, rank, keywords, and traffic sources. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/similarweb/domain`
   */
  similarwebDomain<T = any>(
    params: Params.SimilarwebDomainParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("similarweb_domain", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Similarweb Search. Search the public Similarweb page for websites, companies, and mobile apps related to a keyword. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/similarweb/search`
   */
  similarwebSearch<T = any>(
    params: Params.SimilarwebSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("similarweb_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SnapEDA Product. SnapEDA Product API: fetch full part page data from a SnapEDA URL or MPN/manufacturer slug. Returns CAD models, datasheet, RoHS, distributor pricing and availability via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/snapeda/product`
   */
  snapedaProduct<T = any>(
    params: Params.SnapedaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("snapeda_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * SnapEDA Search. SnapEDA Search API: search electronic parts by keyword or URL on SnapMagic Search (ex-SnapEDA). Returns MPN, manufacturer, pricing, CAD availability and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/snapeda/search`
   */
  snapedaSearch<T = any>(
    params: Params.SnapedaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("snapeda_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Starbucks Menu. Full Starbucks menu for one café, with the default-size price of each item. Prices use browser rendering. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/starbucks/menu`
   */
  starbucksMenu<T = any>(
    params?: Params.StarbucksMenuParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("starbucks_menu", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Starbucks Product. One Starbucks item at one café, with a price for every size. Get the café from Search first. Prices use browser rendering. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/starbucks/product`
   */
  starbucksProduct<T = any>(
    params: Params.StarbucksProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("starbucks_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Starbucks Search. Nearest Starbucks cafés from coordinates or a store-locator URL. Returns address, hours, amenities, and the store number used by Menu and Product. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/starbucks/search`
   */
  starbucksSearch<T = any>(
    params?: Params.StarbucksSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("starbucks_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Stats. Infrastructure health for an engine or endpoint over the last hour. Not scoped to your account or tenant. Enabled per account: HTTP 403 means contact support to activate it.
   *
   * `GET /v2/stats`
   */
  stats<T = any>(
    params?: Params.StatsParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stats", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * StockX Product. Retrieve detailed product information from StockX, including market prices, bid/ask data, size variants, and product metadata. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/stockx/product`
   */
  stockxProduct<T = any>(
    params: Params.StockxProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stockx_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * StockX Search. Search StockX for products by name, brand, SKU, or slug and receive a list of matching items with product IDs, slugs, images, and colorways. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/stockx/search`
   */
  stockxSearch<T = any>(
    params: Params.StockxSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stockx_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * StockX Trends. Retrieve trending products on StockX by category, with options to sort by featured, most active, or release date. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/stockx/trends`
   */
  stockxTrends<T = any>(
    params: Params.StockxTrendsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stockx_trends", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * StubHub Event. Read one StubHub event from its URL or numeric id, including the lowest printed ticket price. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/stubhub/event`
   */
  stubhubEvent<T = any>(
    params: Params.StubhubEventParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stubhub_event", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * StubHub Search. Search StubHub events by keyword or by a StubHub search URL. The response is the first embedded page. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/stubhub/search`
   */
  stubhubSearch<T = any>(
    params: Params.StubhubSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("stubhub_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Target Product. Get a Target.com product page: price, description, images and variations via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/target/product`
   */
  targetProduct<T = any>(
    params: Params.TargetProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("target_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Target Search. Search Target.com by keyword or search URL. Returns product cards with price, rating and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/target/search`
   */
  targetSearch<T = any>(
    params: Params.TargetSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("target_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TDLR License. Fetch one TDLR license by detail id or SearchResultDetail URL, including status, subtype, DBA, and notes. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/tdlr/license`
   */
  tdlrLicense<T = any>(
    params: Params.TdlrLicenseParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("tdlr_license", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TDLR License Search. Search Texas TDLR licenses by name, city, county, or ZIP. license_type such as AIRREF is required for a useful search. 25 rows per page. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/tdlr/search`
   */
  tdlrSearch<T = any>(
    params?: Params.TdlrSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("tdlr_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TED Notice. TED notice profile: buyer, lots, deadline, value and documents (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ted/notice`
   */
  tedNotice<T = any>(
    params: Params.TedNoticeParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ted_notice", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TED Search. Search TED procurement notices by keyword or filters. Returns notice cards and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ted/search`
   */
  tedSearch<T = any>(
    params?: Params.TedSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ted_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Thalia Product. Read one Thalia product from its URL. You get price, author or brand, and the product details. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/thalia/product`
   */
  thaliaProduct<T = any>(
    params: Params.ThaliaProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("thalia_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Thalia Search. Search Thalia by keyword and page books, media, and gifts. Cards include title, price, and the product link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/thalia/search`
   */
  thaliaSearch<T = any>(
    params: Params.ThaliaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("thalia_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TheFork Restaurant. Extract a full TheFork restaurant profile from a restaurant page URL, including ratings, tags, photo gallery, opening hours, and AI review summaries via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/thefork/restaurant`
   */
  theforkRestaurant<T = any>(
    params: Params.TheforkRestaurantParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("thefork_restaurant", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TheFork Search. Search TheFork restaurants from a full search or city URL and retrieve ratings, cuisine, prices, availability, review summaries, and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/thefork/search`
   */
  theforkSearch<T = any>(
    params: Params.TheforkSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("thefork_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Thomasnet Company. Get a full Thomasnet supplier profile from a company URL, including contact details, product categories, and business information. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/thomasnet/company`
   */
  thomasnetCompany<T = any>(
    params: Params.ThomasnetCompanyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("thomasnet_company", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Thomasnet Search. Search Thomasnet suppliers from a search or category URL and get company listings, filters, name suggestions, and pagination. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/thomasnet/search`
   */
  thomasnetSearch<T = any>(
    params: Params.ThomasnetSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("thomasnet_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Ticketmaster Event. Fetch one Ticketmaster event from a slugged event URL. The slug is searched and the matching event id is returned with the venue address. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ticketmaster/event`
   */
  ticketmasterEvent<T = any>(
    params: Params.TicketmasterEventParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ticketmaster_event", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Ticketmaster Search. Search Ticketmaster events by keyword. Returns event cards, including Ticketweb partner rows, and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/ticketmaster/search`
   */
  ticketmasterSearch<T = any>(
    params: Params.TicketmasterSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("ticketmaster_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TikTok Top Ads Ad. Get one TikTok Creative Center Top Ad by URL or id: creative, landing page, CTR, and engagement (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/tiktoktopads/ad`
   */
  tiktoktopadsAd<T = any>(
    params: Params.TiktoktopadsAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("tiktoktopads_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * TikTok Top Ads Search. Search TikTok Creative Center Top Ads by region, objective, period, and keyword. Returns ad cards and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/tiktoktopads/search`
   */
  tiktoktopadsSearch<T = any>(
    params?: Params.TiktoktopadsSearchParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("tiktoktopads_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Trade-A-Plane Listing. Read one Trade-A-Plane aircraft listing from its URL. You get the asking price, the airframe details, and the seller. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/tradeaplane/listing`
   */
  tradeaplaneListing<T = any>(
    params: Params.TradeaplaneListingParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("tradeaplane_listing", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Trade-A-Plane Search. Search Trade-A-Plane aircraft listings by keyword and page the results. Cards include title, price, and the listing link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/tradeaplane/search`
   */
  tradeaplaneSearch<T = any>(
    params: Params.TradeaplaneSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("tradeaplane_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Trustpilot Company Info. Retrieve Trustpilot company profile data, including trust score, star rating, categories, contact info, and review response behavior. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/trustpilot/company/info`
   */
  trustpilotCompanyInfo<T = any>(
    params: Params.TrustpilotCompanyInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("trustpilot_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Untappd Beer. Read one Untappd beer, including ABV, IBU, and brewery. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/untappd/beer`
   */
  untappdBeer<T = any>(
    params: Params.UntappdBeerParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("untappd_beer", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Untappd Search. Search Untappd beers by keyword. Cards include brewery, ABV, and IBU. next is null when Untappd does not expose a next page. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/untappd/search`
   */
  untappdSearch<T = any>(
    params: Params.UntappdSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("untappd_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Upwork Freelancer. Upwork Freelancer API: fetch public freelancer profile data from a profile ID, username or URL. Returns bio, hourly rate, skills, ratings and agency info via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/upwork/freelancer`
   */
  upworkFreelancer<T = any>(
    params: Params.UpworkFreelancerParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("upwork_freelancer", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Upwork Jobs. Upwork Jobs API: search freelance job listings by skill slug or URL. Returns budgets, skills, experience level and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/upwork/jobs`
   */
  upworkJobs<T = any>(
    params: Params.UpworkJobsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("upwork_jobs", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Upwork Services. Upwork Services API: browse Project Catalog listings by category slug or URL. Returns prices, product IDs and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/upwork/services`
   */
  upworkServices<T = any>(
    params: Params.UpworkServicesParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("upwork_services", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Upwork Services Info. Upwork Services Info API: fetch Project Catalog product details from a product URL. Returns packages, pricing, seller, media and breadcrumbs via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/upwork/services/info`
   */
  upworkServicesInfo<T = any>(
    params: Params.UpworkServicesInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("upwork_services_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Usage. Retrieve real-time usage statistics and credit balance for your Piloterr account.
   *
   * `GET /v2/usage`
   */
  usage<T = any>(
    params?: EmptyParams | null,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("usage", params, options) as Promise<JsonResponse<T>>;
  }

  /**
   * USAspending Award. Fetch one US federal award by its generated id or by a usaspending.gov award URL. Amounts are a number plus a display string. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/usaspending/award`
   */
  usaspendingAward<T = any>(
    params: Params.UsaspendingAwardParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("usaspending_award", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * USAspending Search. Search US federal awards by keyword. award_type selects one group: contract (default), grant, idv, or loan. Amounts are a number plus a display string. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/usaspending/search`
   */
  usaspendingSearch<T = any>(
    params: Params.UsaspendingSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("usaspending_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Vestiaire Collective Product. Fetch one Vestiaire Collective listing by product URL. The response is a flat object with price, size, condition, and seller. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/vestiairecollective/product`
   */
  vestiairecollectiveProduct<T = any>(
    params: Params.VestiairecollectiveProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call(
      "vestiairecollective_product",
      params,
      options,
    ) as Promise<JsonResponse<T>>;
  }

  /**
   * Vestiaire Collective Search. Search Vestiaire Collective by keyword or catalog URL. Each card has brand, name, price, size, and a product link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/vestiairecollective/search`
   */
  vestiairecollectiveSearch<T = any>(
    params: Params.VestiairecollectiveSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("vestiairecollective_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Vinted Item. Fetch a Vinted listing by item URL or numeric ID. Parses the public item page (Next.js payload), returns a normalized snake_case object with photos, attributes, shipping, pricing, and optional seller profile. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/vinted/item`
   */
  vintedItem<T = any>(
    params: Params.VintedItemParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("vinted_item", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Vinted Search. Search Vinted second-hand listings by keyword or catalog URL across vinted.fr, vinted.com and other domains. Returns results and pagination. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/vinted/search`
   */
  vintedSearch<T = any>(
    params: Params.VintedSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("vinted_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Vinted User Info. Retrieve public Vinted seller profile by member URL or user ID. Returns the raw /api/v2/users/{id} object: login, photo, feedback stats, followers, verification, bundle discounts, and listing counts. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/vinted/user/info`
   */
  vintedUserInfo<T = any>(
    params: Params.VintedUserInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("vinted_user_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Viva Real Property. Read one Viva Real property from its URL. The price follows the operation of that URL, so a sale link stays a sale price. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/vivareal/property`
   */
  vivarealProperty<T = any>(
    params: Params.VivarealPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("vivareal_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Viva Real Search. Search Viva Real by city and operation, sale or rent. Page with pagina. Development cards and 'from' prices are left out. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/vivareal/search`
   */
  vivarealSearch<T = any>(
    params: Params.VivarealSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("vivareal_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Walmart Product. Extract full Walmart product page (PDP) data from a /ip/ URL: pricing, ratings, images, fulfillment, specs, badges, and availability via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/walmart/product`
   */
  walmartProduct<T = any>(
    params: Params.WalmartProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("walmart_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Walmart Search. Scrape Walmart.com search result pages from a full URL and retrieve product cards with pricing, ratings, availability, and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/walmart/search`
   */
  walmartSearch<T = any>(
    params: Params.WalmartSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("walmart_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Walmart Suggest. Get Walmart.com search autocomplete suggestions for a keyword via browser rendering, with optional US ZIP code localization. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/walmart/suggest`
   */
  walmartSuggest<T = any>(
    params: Params.WalmartSuggestParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("walmart_suggest", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Website Antibot. Detect which anti-bot protection protects a website before you scrape. Get the vendor, confidence level, and matching clues from a single URL check. Credit cost: 1 credit per call.
   *
   * `GET /v2/website/antibot`
   */
  websiteAntibot<T = any>(
    params: Params.WebsiteAntibotParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("website_antibot", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Website Crawler. Fetch public pages with fast HTTP crawling (no JavaScript). Best first choice for static or server-rendered HTML; use Rendering or WebUnlocker when JS or anti-bot blocks you. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/website/crawler`
   */
  websiteCrawler<T = any>(
    params: Params.WebsiteCrawlerParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("website_crawler", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Website Email Phone Extractor. Extract emails and phone numbers from websites for comprehensive contact details, including social media profiles across 12+ platforms. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/website/email_phone_extractor`
   */
  websiteEmailPhoneExtractor<T = any>(
    params: Params.WebsiteEmailPhoneExtractorParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call(
      "website_email_phone_extractor",
      params,
      options,
    ) as Promise<JsonResponse<T>>;
  }

  /**
   * Website Rendering. Render JavaScript-heavy pages in a headless browser and return post-render HTML. Use when Crawler returns empty DOM; escalate to WebUnlocker if bot protection blocks the session. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/website/rendering`
   */
  websiteRendering<T = any>(
    params: Params.WebsiteRenderingParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("website_rendering", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Website Screenshot. Browser-like Screenshot API that captures webpages as PNG/JPEG/WebP or PDF for previews, QA, reporting, monitoring, and archiving no headless setup. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/website/screenshot`
   */
  websiteScreenshot<T = any>(
    params: Params.WebsiteScreenshotParams,
    options?: RequestOptions | null,
  ): Promise<ApiResponse<T>> {
    return this.#call("website_screenshot", params, options) as Promise<
      ApiResponse<T>
    >;
  }

  /**
   * Website Technology. Identify the technologies behind any website CMS, frameworks, analytics, CDN, hosting, and more, for competitive market analysis and technological insight. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/website/technology`
   */
  websiteTechnology<T = any>(
    params: Params.WebsiteTechnologyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("website_technology", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Website WebUnlocker. Bypass advanced anti-bot systems (Cloudflare, DataDome, Akamai, PerimeterX) on whitelisted domains. Combines browser rendering and unlock tooling; use after Crawler and Rendering fail. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/website/webunlocker`
   */
  websiteWebunlocker<T = any>(
    params: Params.WebsiteWebunlockerParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("website_webunlocker", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Weibo Post Info. Retrieve one public Weibo post by post id, including text, images, publish time, engagement counts, and author profile. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/weibo/post/info`
   */
  weiboPostInfo<T = any>(
    params: Params.WeiboPostInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("weibo_post_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Weibo Search. Search public Weibo posts by keywords. Each post includes the author, text, publish time, engagement counts, image, and video link. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/weibo/search`
   */
  weiboSearch<T = any>(
    params: Params.WeiboSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("weibo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Welcome to the Jungle Company. Welcome to the Jungle company profile: headcount, offices, sectors and website (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/welcometothejungle/company`
   */
  welcometothejungleCompany<T = any>(
    params: Params.WelcometothejungleCompanyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("welcometothejungle_company", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Welcome to the Jungle Search. Search Welcome to the Jungle jobs. Returns offer cards and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/welcometothejungle/search`
   */
  welcometothejungleSearch<T = any>(
    params: Params.WelcometothejungleSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("welcometothejungle_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Wellfound Company Info. Retrieve startup and company data from Wellfound (formerly AngelList), including description, funding, team size, hiring status, and social links. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/wellfound/company/info`
   */
  wellfoundCompanyInfo<T = any>(
    params: Params.WellfoundCompanyInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("wellfound_company_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * X Post Info (twitter). X Post Info API: fetch public tweet data (text, likes, retweets, views, media) from a status URL or tweet ID via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/x/post/info`
   */
  xPostInfo<T = any>(
    params: Params.XPostInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("x_post_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * X Profile Info (twitter). X Profile Info API: fetch public X/Twitter profile data (bio, followers, verification, avatars) from a username or URL via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/x/profile/info`
   */
  xProfileInfo<T = any>(
    params: Params.XProfileInfoParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("x_profile_info", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Yahoo Search. Query Yahoo via API and retrieve structured organic results with country and language. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/yahoo/search`
   */
  yahooSearch<T = any>(
    params: Params.YahooSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yahoo_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Yellowpages Business. Extract a full Yellow Pages business profile from a listing URL, including phone, website, categories, and ratings via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/yellowpages/business`
   */
  yellowpagesBusiness<T = any>(
    params: Params.YellowpagesBusinessParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yellowpages_business", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Yellowpages Search. Search Yellow Pages businesses from a full search URL and retrieve names, phones, addresses, ratings, opening hours, and pagination via browser rendering. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/yellowpages/search`
   */
  yellowpagesSearch<T = any>(
    params: Params.YellowpagesSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yellowpages_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Yelp Business. Fetch a Yelp business profile from a full business URL with phone, address, website, logo, hours, and claim status. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/yelp/business`
   */
  yelpBusiness<T = any>(
    params: Params.YelpBusinessParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yelp_business", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Yelp Reviews. Fetch paginated Yelp reviews for a business with rating, text, author profile, reactions, and attached photos or videos. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/yelp/reviews`
   */
  yelpReviews<T = any>(
    params: Params.YelpReviewsParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yelp_reviews", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Yelp Search. Search Yelp by keyword and location and retrieve paginated business cards with ratings, categories, photos, and sponsored flags. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/yelp/search`
   */
  yelpSearch<T = any>(
    params: Params.YelpSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("yelp_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zap Imóveis Ad. Get a full Zap Imóveis listing by URL: price, IPTU, features, coordinates, images, and publisher (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/zapimoveis/ad`
   */
  zapimoveisAd<T = any>(
    params: Params.ZapimoveisAdParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zapimoveis_ad", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zap Imóveis Search. Search Zap Imóveis listings by city or search URL. Returns prices, IPTU, condominium fees, rooms, and pagination (1 credit). Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/zapimoveis/search`
   */
  zapimoveisSearch<T = any>(
    params: Params.ZapimoveisSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zapimoveis_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zazzle Product. Fetch one Zazzle product by its product URL or by a slug that ends in the numeric product id. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zazzle/product`
   */
  zazzleProduct<T = any>(
    params: Params.ZazzleProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zazzle_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zazzle Search. Search Zazzle products by keyword. page maps to the pg parameter. Prices are a number plus a display string. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/zazzle/search`
   */
  zazzleSearch<T = any>(
    params: Params.ZazzleSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zazzle_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zillow Property. Extract full property details from a Zillow homedetails URL, including specs, photos, schools, tax history, and agent attribution. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/zillow/property`
   */
  zillowProperty<T = any>(
    params: Params.ZillowPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zillow_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zillow Search. Search Zillow listings from a search or map URL and retrieve prices, beds, baths, coordinates, and listing status. Credit cost: 3 credits per call.
   *
   * `GET / POST /v2/zillow/search`
   */
  zillowSearch<T = any>(
    params: Params.ZillowSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zillow_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ZonaProp Property. Read one ZonaProp listing from its URL. You get the asking price in USD or ARS, the address, and the publisher. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zonaprop/property`
   */
  zonapropProperty<T = any>(
    params: Params.ZonapropPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zonaprop_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * ZonaProp Search. Search ZonaProp for apartments or houses in an Argentine city. Page with pagina. A few featured ads can repeat. Development projects priced 'from' are left out. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zonaprop/search`
   */
  zonapropSearch<T = any>(
    params: Params.ZonapropSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zonaprop_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zoopla Property. Extract full property details from a Zoopla listing URL, including price, specs, photo gallery, EPC rating, coordinates, and agent data. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zoopla/property`
   */
  zooplaProperty<T = any>(
    params: Params.ZooplaPropertyParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zoopla_property", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zoopla Search. Search Zoopla listings from a search URL and retrieve prices, specs, photos, agency info, and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zoopla/search`
   */
  zooplaSearch<T = any>(
    params: Params.ZooplaSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zoopla_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zooplus Product. Read one Zooplus product by id or URL, in the region of that shop. Variants keep their own price and EAN. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/zooplus/product`
   */
  zooplusProduct<T = any>(
    params: Params.ZooplusProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zooplus_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zooplus Search. Search a Zooplus country shop by keyword. Region defaults to France. Page through food, litter, and accessory cards with local prices. Credit cost: 1 credit per call.
   *
   * `GET / POST /v2/zooplus/search`
   */
  zooplusSearch<T = any>(
    params: Params.ZooplusSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zooplus_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zoro Product. Get a Zoro product page: title, brand, USD price, Zoro number, manufacturer number, images, and specifications. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zoro/product`
   */
  zoroProduct<T = any>(
    params: Params.ZoroProductParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zoro_product", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Zoro Search. Search Zoro by keyword or category URL. Returns product cards with USD price, brand, Zoro number, and pagination. Credit cost: 2 credits per call.
   *
   * `GET / POST /v2/zoro/search`
   */
  zoroSearch<T = any>(
    params: Params.ZoroSearchParams,
    options?: RequestOptions | null,
  ): Promise<JsonResponse<T>> {
    return this.#call("zoro_search", params, options) as Promise<
      JsonResponse<T>
    >;
  }

  /**
   * Polls `GET /v1/jobs/{id}` until the job reaches a terminal status
   * (CompletedJob, Error, NotFound, BadRequest) and returns the final job document.
   */
  async waitForJob<T = any>(
    jobId: string,
    options: WaitForJobOptions = {},
  ): Promise<JsonResponse<T>> {
    if (typeof jobId !== "string" || jobId.trim().length === 0) {
      throw new PiloterrSerializationError(
        "A non-blank job id is required.",
        "id",
      );
    }
    let delayMs = options.intervalMs ?? 3_000;
    const maxDelayMs = Math.max(delayMs, MAX_POLL_INTERVAL_MS);
    const timeoutMs = options.timeoutMs ?? 43_200_000;
    const startedAt = Date.now();
    let last: JsonResponse<T> | undefined;
    for (;;) {
      options.signal?.throwIfAborted();
      const response = await this.request<T>(
        "GET",
        "/v1/jobs/{id}",
        { id: jobId },
        options.signal ? { signal: options.signal } : null,
      );
      if (response.kind !== "json") {
        throw new PiloterrResponseDecodingError(
          "The job endpoint did not return JSON.",
          response.rawResponse,
        );
      }
      last = response;
      options.onProgress?.(last.data);
      const status = (last.data as { status?: unknown } | null)?.status;
      if (typeof status === "string" && JOB_TERMINAL_STATUSES.includes(status))
        return last;
      if (Date.now() - startedAt + delayMs > timeoutMs) {
        throw new PiloterrJobTimeoutError(jobId, last);
      }
      await sleep(delayMs, options.signal ?? undefined);
      delayMs = Math.min(delayMs * 1.5, maxDelayMs);
    }
  }

  async #call(
    name: EndpointName,
    params: Readonly<object> | null | undefined,
    options: RequestOptions | null | undefined,
  ): Promise<ApiResponse> {
    const endpoint = ENDPOINTS[name];
    const supported: readonly HttpMethod[] = endpoint.methods;
    const method = options?.method ?? supported[0] ?? "GET";
    if (!supported.includes(method)) {
      throw new PiloterrConfigurationError(
        `${endpoint.path} supports ${supported.join(", ")}, not ${method}.`,
      );
    }
    const values = (params ?? {}) as Readonly<Record<string, unknown>>;
    for (const name of endpoint.required as readonly string[]) {
      if (values[name] === undefined || values[name] === null) {
        throw new PiloterrSerializationError(
          `The "${name}" parameter is required.`,
          name,
        );
      }
    }
    return this.#send(
      method,
      endpoint.path,
      values,
      { ...options, method },
      endpoint.response,
    );
  }

  async #send<T>(
    method: HttpMethod,
    path: string,
    params: Readonly<Record<string, unknown>> | null | undefined,
    options: RequestOptions | null | undefined,
    expected: "json" | "any",
  ): Promise<ApiResponse<T>> {
    if (method !== "GET" && method !== "POST") {
      throw new PiloterrConfigurationError(
        `Unsupported HTTP method: ${String(method)}.`,
      );
    }
    if (typeof path !== "string" || !path.startsWith("/")) {
      throw new PiloterrConfigurationError(
        'The request path must start with "/".',
      );
    }
    const serialized = serializeRequest(method, path, params);
    const url = new URL(this.#baseUrl + serialized.path);
    if (serialized.query.length > 0)
      url.search = encodeQueryPairs(serialized.query);

    const headers = new Headers({
      Accept: "application/json, */*;q=0.8",
      "User-Agent": `piloterr-node/${VERSION}`,
      ...this.#headers,
      ...(options?.headers ?? {}),
      "x-api-key": this.#apiKey,
    });
    const init: RequestInit = { method, headers, redirect: "manual" };
    if (serialized.body !== undefined) {
      headers.set("Content-Type", "application/json");
      init.body = JSON.stringify(serialized.body);
    }

    const timeout = options?.timeout ?? this.#timeout;
    const maxRetries = options?.maxRetries ?? this.#maxRetries;
    let rawResponse: RawResponse;
    for (let attempt = 0; ; attempt++) {
      options?.signal?.throwIfAborted();
      const signals: AbortSignal[] = [];
      if (options?.signal) signals.push(options.signal);
      const deadline = timeout > 0 ? AbortSignal.timeout(timeout) : undefined;
      if (deadline) signals.push(deadline);
      if (signals.length > 0)
        init.signal =
          signals.length === 1 ? signals[0]! : AbortSignal.any(signals);

      try {
        const response = await this.#fetch(url, init);
        const body = new Uint8Array(await response.arrayBuffer());
        rawResponse = createRawResponse(response, body);
      } catch (cause) {
        if (options?.signal?.aborted) throw cause;
        if (deadline?.aborted) {
          throw new PiloterrTransportError(
            `Piloterr request timed out after ${timeout} ms.`,
            cause,
          );
        }
        if (attempt < maxRetries) {
          await sleep(
            retryDelay(this.#retryDelay, attempt, undefined),
            options?.signal ?? undefined,
          );
          continue;
        }
        throw new PiloterrTransportError(
          "Piloterr request failed before an HTTP response body was received.",
          cause,
        );
      }

      if (rawResponse.status >= 200 && rawResponse.status <= 299) break;
      if (isRetryable(rawResponse) && attempt < maxRetries) {
        const retryAfter = rawResponse.headers.get("retry-after")?.[0];
        await sleep(
          retryDelay(this.#retryDelay, attempt, retryAfter),
          options?.signal ?? undefined,
        );
        continue;
      }
      throw createApiError(rawResponse);
    }
    return decodeSuccessResponse<T>(rawResponse, expected);
  }
}

function retryDelay(
  baseMs: number,
  attempt: number,
  retryAfter: string | undefined,
): number {
  const seconds = retryAfter === undefined ? Number.NaN : Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0)
    return Math.min(seconds * 1_000, 60_000);
  return Math.min(baseMs * RETRY_BACKOFF_FACTOR ** attempt, MAX_RETRY_DELAY_MS);
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function readEnvironment(name: string): string | undefined {
  const env = (
    globalThis as { process?: { env?: Record<string, string | undefined> } }
  ).process?.env;
  const value = env?.[name];
  return value === undefined || value === "" ? undefined : value;
}

function createRawResponse(response: Response, body: Uint8Array): RawResponse {
  const headers = new Map<string, readonly string[]>();
  for (const [name, value] of response.headers) {
    headers.set(name.toLowerCase(), Object.freeze([value]));
  }
  const getSetCookie = (
    response.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie;
  if (typeof getSetCookie === "function") {
    const values = getSetCookie.call(response.headers);
    if (values.length > 0)
      headers.set("set-cookie", Object.freeze([...values]));
  }
  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    contentType: response.headers.get("content-type"),
    body,
  };
}

function createApiError(rawResponse: RawResponse): PiloterrApiError {
  const parsed = tryParseJson(rawResponse.body);
  const objectBody =
    parsed.ok && isJsonObject(parsed.value) ? parsed.value : null;
  let errorMessage: string | undefined;
  for (const key of ["error", "message", "error_message", "detail"]) {
    const value = objectBody?.[key];
    if (typeof value === "string" && value.length > 0) {
      errorMessage = value;
      break;
    }
  }
  return new PiloterrApiError({
    rawResponse,
    ...(parsed.ok ? { responseBody: parsed.value } : {}),
    ...(errorMessage === undefined ? {} : { errorMessage }),
  });
}

function decodeSuccessResponse<T>(
  rawResponse: RawResponse,
  expected: "json" | "any",
): ApiResponse<T> {
  if (!isJsonMediaType(rawResponse.contentType)) {
    if (expected === "json") {
      throw new PiloterrResponseDecodingError(
        "Piloterr returned a successful non-JSON response for a JSON operation.",
        rawResponse,
        new TypeError(
          `Unexpected content type: ${rawResponse.contentType ?? "none"}.`,
        ),
      );
    }
    const binary: BinaryResponse = {
      kind: "binary",
      bytes: rawResponse.body,
      contentType: rawResponse.contentType,
      rawResponse,
    };
    return binary;
  }
  const parsed = tryParseJson(rawResponse.body);
  if (!parsed.ok) {
    throw new PiloterrResponseDecodingError(
      "Piloterr returned a successful JSON response that could not be decoded.",
      rawResponse,
      parsed.cause,
    );
  }
  const json: JsonResponse<T> = {
    kind: "json",
    data: parsed.value as T,
    rawResponse,
  };
  return json;
}

function isJsonMediaType(contentType: string | null): boolean {
  if (contentType === null) return false;
  const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
  return (
    mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"))
  );
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function tryParseJson(
  body: Uint8Array,
): { ok: true; value: unknown } | { ok: false; cause: unknown } {
  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(body)) };
  } catch (cause) {
    return { ok: false, cause };
  }
}

export const JOB_TERMINAL_STATUSES: readonly string[] = [
  "CompletedJob",
  "Error",
  "NotFound",
  "BadRequest",
];
const MAX_POLL_INTERVAL_MS = 60_000;
