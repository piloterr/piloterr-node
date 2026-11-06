// Generated from the Piloterr OpenAPI document. Do not edit by hand.

import type { OpenString } from "./types.js";

/** Parameters for operations that take none. */
export type EmptyParams = Record<string, never>;

/** Parameters for `aboutyouProduct()` — `GET / POST /v2/aboutyou/product`. */
export interface AboutyouProductParams {
  /** Product URL or keyword. A keyword opens the first search result. */
  query: string;
  /** Shop code. Default is fr. A full link in query picks the shop, and a conflicting region returns 400. */
  region?: string | undefined;
  /** Return the rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aboutyouSearch()` — `GET / POST /v2/aboutyou/search`. */
export interface AboutyouSearchParams {
  /** Keyword or About You search, category, or brand URL. */
  query: string;
  /** Shop code. Default is fr. A full link in query picks the shop, and a conflicting region returns 400. */
  region?: string | undefined;
  /** Only page 1 is available. */
  page?: number | undefined;
  /** Return the rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `actionProduct()` — `GET / POST /v2/action/product`. */
export interface ActionProductParams {
  /** Action product ID or full product URL. */
  query: string;
  /** Locale (fr-fr, de-de, pt-pt, …) or country code (fr, de, pt). Default: fr-fr. */
  region?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `actionSearch()` — `GET / POST /v2/action/search`. */
export interface ActionSearchParams {
  /** Search keyword or full Action.com search URL. */
  query: string;
  /** Locale (fr-fr, de-de, pt-pt, …) or country code (fr, de, pt). Default: fr-fr. */
  region?: string | undefined;
  /** 1-based page number (default: 1). */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aldiProduct()` — `GET / POST /v2/aldi/product`. */
export interface AldiProductParams {
  /** Aldi product page URL or site path slug. */
  query: string;
  /** Target country when query is a path only (default: fr). Ignored for full product URLs. */
  region?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aldiSearch()` — `GET / POST /v2/aldi/search`. */
export interface AldiSearchParams {
  /** Aldi category page URL or site path. */
  query: string;
  /** Target country when query is a path only (default: fr). */
  region?: string | undefined;
  /** 1-based page number override (default: read from URL or 1). */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `alibabaProduct()` — `GET / POST /v2/alibaba/product`. */
export interface AlibabaProductParams {
  /** Full Alibaba product URL or numeric product ID. */
  query: string;
  /** Locale subdomain when query is a bare product ID, or to override the host on a product URL. */
  subdomain?: string | undefined;
  /** When true, return the rendered HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `alibabaSearch()` — `GET / POST /v2/alibaba/search`. */
export interface AlibabaSearchParams {
  /** Search keyword or full Alibaba search URL. */
  query: string;
  /** Locale subdomain for keyword searches when query is not a full URL. */
  subdomain?: string | undefined;
  /** 1-based page number (20 results per page). Default: 1. */
  page?: number | undefined;
  /** When true, return the raw open-s JSON as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aliexpressProduct()` — `GET / POST /v2/aliexpress/product`. */
export interface AliexpressProductParams {
  /** Full AliExpress product page URL (/item/{id}.html). */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of parsed JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aliexpressProductReviews()` — `GET / POST /v2/aliexpress/product/reviews`. */
export interface AliexpressProductReviewsParams {
  /** AliExpress product id or item URL. */
  query: string;
  /** Page number, starting at 1. Defaults to 1. The feed returns up to 20 reviews per page. pagination.next is the next page URL, or null on the last page. */
  page?: number | undefined;
  /** When true, return the raw feed body as {"result": "..."} instead of parsed JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aliexpressSearch()` — `GET / POST /v2/aliexpress/search`. */
export interface AliexpressSearchParams {
  /** Search keyword or full AliExpress search results URL. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `aliexpressStoreProduct()` — `GET / POST /v2/aliexpress/store/product`. */
export interface AliexpressStoreProductParams {
  /** AliExpress store URL or numeric store ID. */
  query: string;
  /** Optional sort alias for the store all-items page. */
  sort?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `allegroProduct()` — `GET / POST /v2/allegro/product`. */
export interface AllegroProductParams {
  /** Full allegro.pl product or offer URL to extract structured PDP data. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `allegroSearch()` — `GET / POST /v2/allegro/search`. */
export interface AllegroSearchParams {
  /** Search keyword or full Allegro listing URL. */
  query: string;
  /** Page number for keyword searches (default 1). */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `amazonProduct()` — `GET / POST /v2/amazon/product`. */
export interface AmazonProductParams {
  /** Amazon product ASIN (Amazon Standard Identification Number) to retrieve full product details for. */
  query: string;
  /** Amazon domain extension to query. Controls which Amazon marketplace is targeted. Default: `"com"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `amazonProductOffer()` — `GET / POST /v2/amazon/product/offer`. */
export interface AmazonProductOfferParams {
  /** Amazon product ASIN (Amazon Standard Identification Number) to retrieve third-party seller offers for. */
  query: string;
  /** Amazon domain extension to query. Controls which Amazon marketplace is targeted. Default: `"com"`. */
  domain?: string | undefined;
  /** Page number for paginated offer results. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `amazonSearch()` — `GET / POST /v2/amazon/search`. */
export interface AmazonSearchParams {
  /** Keyword or phrase to search for products on Amazon. */
  query: string;
  /** Amazon domain extension to query. Controls which Amazon marketplace is searched. Default: `"com"`. */
  domain?: string | undefined;
  /** Page number for paginated search results. Each page returns up to 60 results. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `apartmentsProperty()` — `GET / POST /v2/apartments/property`. */
export interface ApartmentsPropertyParams {
  /** Full Apartments.com property listing URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `apartmentsSearch()` — `GET / POST /v2/apartments/search`. */
export interface ApartmentsSearchParams {
  /** Full Apartments.com search or city browse URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `argenpropProperty()` — `GET / POST /v2/argenprop/property`. */
export interface ArgenpropPropertyParams {
  /** The full listing page on argenprop.com. Copy it from results[].url on [Argenprop Search](https://www.piloterr.com/library/argenprop-search). The listing id is the number after the double dash. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `argenpropSearch()` — `GET / POST /v2/argenprop/search`. */
export interface ArgenpropSearchParams {
  /** The place to search, or a full Argenprop results page. */
  query: string;
  /** Which page of the list to open. The first page is 1. The placeholder is 2. Default: `1`. */
  page?: number | undefined;
  /** Sale or rent, when query is a place name. The placeholder is venta, which means for sale. alquiler is a long-term rental. alquiler-temporal is a short stay. sale, buy, and rent are accepted as aliases. Default: `"venta"`. */
  operation?: string | undefined;
  /** The kind of home, when query is a place name. The placeholder is departamentos, which means apartments. Also accepted: casas (houses), ph, terrenos, locales, oficinas, and quintas. casa and house map to casas. Default: `"departamentos"`. */
  property_type?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `argosProduct()` — `GET / POST /v2/argos/product`. */
export interface ArgosProductParams {
  /** Argos product id or product URL. */
  query: string;
  /** When true, return raw HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `argosSearch()` — `GET / POST /v2/argos/search`. */
export interface ArgosSearchParams {
  /** Keyword or Argos UK search URL. */
  query: string;
  /** Page number from 1. */
  page?: number | undefined;
  /** When true, return raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `arxivPaper()` — `GET / POST /v2/arxiv/paper`. */
export interface ArxivPaperParams {
  /** Required. arXiv id or an abs, pdf, or html URL. Example: 2201.00978 or https://arxiv.org/abs/cond-mat/0011267v1. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `arxivSearch()` — `GET / POST /v2/arxiv/search`. */
export interface ArxivSearchParams {
  /** Required. Keyword, fielded query such as au:einstein, arXiv id, or an arxiv.org search URL. Example: electron. A paper URL such as https://arxiv.org/abs/2201.00978 returns 400. */
  query: string;
  /** Optional. Page number from 1. Example: 2. Defaults to 1. Each page has 10 papers. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `auchanProduct()` — `GET / POST /v2/auchan/product`. */
export interface AuchanProductParams {
  /** URL of the Auchan product page to extract data from. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `auchanSearch()` — `GET / POST /v2/auchan/search`. */
export interface AuchanSearchParams {
  /** Search keyword or Auchan search URL to retrieve product listings. */
  query: string;
  /** Page number for paginated search results. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autodocProduct()` — `GET / POST /v2/autodoc/product`. */
export interface AutodocProductParams {
  /** HTTPS URL of an Autodoc product page. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autodocProductRelated()` — `GET / POST /v2/autodoc/product/related`. */
export interface AutodocProductRelatedParams {
  /** Same HTTPS product page URL as Product. */
  query: string;
  /** TecDoc maker id from compatibility.cars[] / compatibility.trucks[], e.g. 93 for RENAULT. */
  maker_id: number;
  /** Required. pkw (passenger cars) or lkw (commercial). Must match the compatibility row. Default: `"pkw"`. */
  vehicle_type: string;
  /** Required maker label from compatibility, e.g. RENAULT. Used to parse vehicle lines. */
  maker_name: string;
  /** Required article id from Product response or URL path, e.g. 7999541. */
  product_id: number;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autodocSearch()` — `GET / POST /v2/autodoc/search`. */
export interface AutodocSearchParams {
  /** Full Autodoc search/listing URL, or path only when domain sets the shop. */
  query: string;
  /** Regional shop hostname without https:// or www. (e.g. auto-doc.fr, autodoc.de). Omit to default to autodoc.de. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autoeuropeResult()` — `GET / POST /v2/autoeurope/result`. */
export interface AutoeuropeResultParams {
  /** Vehicle id from search results[].id, or a package id of that vehicle. */
  offer_id: string;
  /** Same pickup place as the search. Example: CDG */
  pickup: string;
  /** Same pickup date as the search, YYYY-MM-DD. Example: 2026-11-06 */
  pickup_date: string;
  /** Same return date as the search, YYYY-MM-DD, after pickup_date. Example: 2026-11-09 */
  dropoff_date: string;
  /** Country site used for the search. Default fr. Example: fr. There is no page parameter. */
  region?: string | undefined;
  /** Return place when it differs from pickup. */
  dropoff?: string | undefined;
  /** Pickup time HH:MM. Default 10:00. Default: `"10:00"`. */
  pickup_time?: string | undefined;
  /** Return time HH:MM. Default 10:00. Default: `"10:00"`. */
  dropoff_time?: string | undefined;
  /** Driver age from 18 to 99. Default 40. */
  driver_age?: number | undefined;
  /** When true, return the raw quote HTML instead of JSON. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autoeuropeSearch()` — `GET / POST /v2/autoeurope/search`. */
export interface AutoeuropeSearchParams {
  /** Pickup place or airport code. */
  pickup: string;
  /** Pickup date, YYYY-MM-DD. */
  pickup_date: string;
  /** Return date, YYYY-MM-DD, after pickup_date. */
  dropoff_date: string;
  /** Country site. Default fr. Example: fr. A code such as de or uk, or a full Auto Europe URL. There is no page parameter. */
  region?: string | undefined;
  /** Return place when it differs from pickup. */
  dropoff?: string | undefined;
  /** Pickup time HH:MM. Default 10:00. Default: `"10:00"`. */
  pickup_time?: string | undefined;
  /** Return time HH:MM. Default 10:00. Default: `"10:00"`. */
  dropoff_time?: string | undefined;
  /** Driver age from 18 to 99. Default 40. */
  driver_age?: number | undefined;
  /** When true, return the raw quote HTML instead of JSON. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autoscout24Ad()` — `GET / POST /v2/autoscout24/ad`. */
export interface Autoscout24AdParams {
  /** Full AutoScout24 listing URL. An inactive listing that still contains script#__NEXT_DATA__ is returned with status Inactive. A page without that selector returns 404. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autoscout24Search()` — `GET / POST /v2/autoscout24/search`. */
export interface Autoscout24SearchParams {
  /** Full AutoScout24 search URL. Filters and page in the URL are kept. page starts at 1. A page with no cards returns 404. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autotraderAd()` — `GET / POST /v2/autotrader/ad`. */
export interface AutotraderAdParams {
  /** Full AutoTrader UK car details URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `autotraderSearch()` — `GET / POST /v2/autotrader/search`. */
export interface AutotraderSearchParams {
  /** Full AutoTrader UK car search URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bestbuyProduct()` — `GET / POST /v2/bestbuy/product`. */
export interface BestbuyProductParams {
  /** Full Best Buy product URL. */
  query: string;
  /** When true, return rendered HTML as {"result": "..."} instead of JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bestbuyProductReviews()` — `GET / POST /v2/bestbuy/product/reviews`. */
export interface BestbuyProductReviewsParams {
  /** Best Buy product URL or reviews URL. */
  query: string;
  /** Page number, starting at 1. Default 1. A value above 1 overrides page on the Best Buy URL. If this stays at 1, a page already on the URL is kept. */
  page?: number | undefined;
  /** When true, return the rendered HTML instead of JSON. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bestbuySearch()` — `GET / POST /v2/bestbuy/search`. */
export interface BestbuySearchParams {
  /** Keyword or full Best Buy search URL. */
  query: string;
  /** Best Buy country when query is not a full URL (default: com). */
  region?: string | undefined;
  /** Page number (default: 1). */
  page?: number | undefined;
  /** Sort order (default: best_selling). Default: `"best_selling"`. */
  sort?: string | undefined;
  /** When true, return rendered HTML as {"result": "..."} instead of JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bhphotovideoProduct()` — `GET / POST /v2/bhphotovideo/product`. */
export interface BhphotovideoProductParams {
  /** Product URL or id. */
  query: string;
  /** When true, return the raw HTML. The string false stays false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bhphotovideoSearch()` — `GET / POST /v2/bhphotovideo/search`. */
export interface BhphotovideoSearchParams {
  /** Keyword or a bhphotovideo.com search URL. */
  query: string;
  /** Page number, starting at 1. Example: 2. */
  page?: number | undefined;
  /** When true, return the raw HTML. The string false stays false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bingSearch()` — `GET / POST /v2/bing/search`. */
export interface BingSearchParams {
  /** The search query to execute on Bing. Supports all Bing advanced search operators. */
  query: string;
  /** Page number of results to retrieve. Used for pagination. */
  page?: number | undefined;
  /** Number of results per page. Minimum: 10, Maximum: 50. */
  num?: number | undefined;
  /** City or region from which the search should originate. If multiple locations match, the most popular one is selected. */
  location?: string | undefined;
  /** GPS latitude coordinate for the search origin. */
  lat?: number | undefined;
  /** GPS longitude coordinate for the search origin. */
  lon?: number | undefined;
  /** Market code combining language and country, in the form <language>-<country>. Defines where the results come from. */
  mkt?: string | undefined;
  /** Two-letter ISO 3166-1 country code defining the country to search from. */
  cc?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bitibaProduct()` — `GET / POST /v2/bitiba/product`. */
export interface BitibaProductParams {
  /** Product URL, shop path, or product number. Example: 75036. A search link returns 400. */
  query: string;
  /** Shop used when query is a number or a path. de is Germany (default). Default: `"de"`. */
  region?: string | undefined;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bitibaSearch()` — `GET / POST /v2/bitiba/search`. */
export interface BitibaSearchParams {
  /** What to look for. A word such as hundefutter, or a Bitiba search link. A product link returns 400. www.bitiba.com returns 400. */
  query: string;
  /** Country shop. de is Germany (default), fr is France, uk is the United Kingdom. gb means uk. Default: `"de"`. */
  region?: string | undefined;
  /** Page number, starting at 1. Page 2 uses p=2. */
  page?: number | undefined;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bolProduct()` — `GET / POST /v2/bol/product`. */
export interface BolProductParams {
  /** Product URL or numeric product id. */
  query: string;
  /** Shop. Use nl for the Netherlands in Dutch, be-nl for Belgium in Dutch, or be-fr for Belgium in French. Leave empty for nl. A full URL picks the shop from the path. */
  region?: string | undefined;
  /** When true, return the raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bolSearch()` — `GET / POST /v2/bol/search`. */
export interface BolSearchParams {
  /** Keyword or full bol.com search URL. A product URL is rejected. */
  query: string;
  /** Shop. Use nl for the Netherlands in Dutch, be-nl for Belgium in Dutch, or be-fr for Belgium in French. Leave empty for nl. A full URL picks the shop from /nl/nl/, /be/nl/, or /be/fr/. */
  region?: string | undefined;
  /** Page number, starting at 1. Page 2 asks bol for the next screen of the same search. */
  page?: number | undefined;
  /** When true, return the raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `boulangerProduct()` — `GET / POST /v2/boulanger/product`. */
export interface BoulangerProductParams {
  /** Product URL /ref/{id}, or the numeric product id. */
  query: string;
  /** When true, returns the raw HTML instead of the parsed JSON. The response shape is {"result": "<html>..."}. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `boulangerSearch()` — `GET / POST /v2/boulanger/search`. */
export interface BoulangerSearchParams {
  /** Keyword, a Boulanger /resultats URL, or a /c/ category URL. */
  query: string;
  /** Page number, from 1. Default is 1. Page 2 is sent as numPage=2 and returns different product ids. */
  page?: number | undefined;
  /** When true, returns the raw HTML instead of the parsed JSON. The response shape is {"result": "<html>..."}. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `braveSearch()` — `GET / POST /v2/brave/search`. */
export interface BraveSearchParams {
  /** The search query to execute on Brave Search. Supports all standard Brave search operators. */
  query: string;
  /** Page number of results to retrieve. Used for pagination. Default: `1`. */
  page?: number | undefined;
  /** Country code, for example us, fr, gb, de. Default: `"us"`. */
  gl?: string | undefined;
  /** Language code, for example en, fr, de. Default: `"en"`. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bricodepotProduct()` — `GET / POST /v2/bricodepot/product`. */
export interface BricodepotProductParams {
  /** Product URL /p/{ean}/{slug}. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bricodepotSearch()` — `GET / POST /v2/bricodepot/search`. */
export interface BricodepotSearchParams {
  /** Brico Dépôt listing URL under /produits/. */
  query: string;
  /** Page from 1. Page 2 is the /2 path suffix. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bricoramaProduct()` — `GET / POST /v2/bricorama/product`. */
export interface BricoramaProductParams {
  /** Product URL /p/{slug}/{ean}. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `bricoramaSearch()` — `GET / POST /v2/bricorama/search`. */
export interface BricoramaSearchParams {
  /** Keyword, or a Bricorama /search URL. */
  query: string;
  /** Page from 1. Sent as ?page= on the listing. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `carrefourProduct()` — `GET / POST /v2/carrefour/product`. */
export interface CarrefourProductParams {
  /** Product page URL on www.carrefour.fr. The path starts with /p/. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `carrefourSearch()` — `GET / POST /v2/carrefour/search`. */
export interface CarrefourSearchParams {
  /** Search keyword or full Carrefour search page URL. */
  query: string;
  /** Carrefour domain to search on. Default: `"fr"`. */
  domain?: string | undefined;
  /** Page number to retrieve. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `carrefourSuggest()` — `GET / POST /v2/carrefour/suggest`. */
export interface CarrefourSuggestParams {
  /** Search keyword or EAN code to get product suggestions from Carrefour. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `castoramaProduct()` — `GET / POST /v2/castorama/product`. */
export interface CastoramaProductParams {
  /** Product URL ending in _CAFR.prd. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `castoramaSearch()` — `GET / POST /v2/castorama/search`. */
export interface CastoramaSearchParams {
  /** Keyword, or a Castorama listing URL (/search or a .cat category). */
  query: string;
  /** Page from 1. Sent as ?page= on the listing. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `cdiscountProduct()` — `GET / POST /v2/cdiscount/product`. */
export interface CdiscountProductParams {
  /** Full Cdiscount product page URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `cdiscountProductOffer()` — `GET / POST /v2/cdiscount/product/offer`. */
export interface CdiscountProductOfferParams {
  /** Cdiscount product offer page URL. Pass the multiple_offer_url value returned by the Cdiscount Product API. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `cdiscountSearch()` — `GET / POST /v2/cdiscount/search`. */
export interface CdiscountSearchParams {
  /** Cdiscount search results page URL. Use any URL from a search or category browse on cdiscount.com. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `centrisProperty()` — `GET / POST /v2/centris/property`. */
export interface CentrisPropertyParams {
  /** Full Centris listing URL, in English or French. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `centrisSearch()` — `GET / POST /v2/centris/search`. */
export interface CentrisSearchParams {
  /** Place name or a full Centris results URL. */
  query: string;
  /** Page number, starting at 1. Default is 1. Default: `1`. */
  page?: number | undefined;
  /** Results language when query is a place name. Default is en. Default: `"en"`. */
  language?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `chewyProduct()` — `GET / POST /v2/chewy/product`. */
export interface ChewyProductParams {
  /** Which product to read. A Chewy product URL such as https://www.chewy.com/purina-pro-plan-adult-sensitive-skin/dp/128666, or just the numeric id 128666. A search link, a keyword, or another website returns 400. */
  query: string;
  /** Which JSON to return. Default expert. Default: `"expert"`. */
  mode?: string | undefined;
  /** Set to true to get the rendered HTML in result instead of JSON. Default false. The string false stays false and still returns JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `chewySearch()` — `GET / POST /v2/chewy/search`. */
export interface ChewySearchParams {
  /** What to search for. A keyword such as salmon kibble, or a Chewy search or category link such as https://www.chewy.com/s?query=dog+food. A product link (a URL that contains /dp/) returns 400. Another website returns 400. */
  query: string;
  /** Which page to fetch, starting at 1. Leave this empty for page 1. If query is a listing link that already has page=2, this value replaces that page. In simple mode, pagination.page is this page and pagination.next is the next page URL or null. */
  page?: number | undefined;
  /** Which JSON to return. Default expert. Default: `"expert"`. */
  mode?: string | undefined;
  /** Set to true to get the rendered HTML in result instead of JSON. Default false. The string false stays false and still returns JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `clearedjobsJob()` — `GET / POST /v2/clearedjobs/job`. */
export interface ClearedjobsJobParams {
  /** Required. Job URL or slug ending in the numeric id. Example: analyst-washington-district-of-columbia-1902823. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `clearedjobsSearch()` — `GET / POST /v2/clearedjobs/search`. */
export interface ClearedjobsSearchParams {
  /** Required. Keyword or a clearedjobs.net jobs URL. Example: analyst. A job URL returns 400. */
  query: string;
  /** Optional. Only page 1 is available. Example: 1. page=2 returns 404. pagination.next is always null. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `company()` — `GET / POST /v2/company`. */
export interface CompanyParams {
  /** The domain name of the company to look up. Accepts multiple formats: */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `coolblueProduct()` — `GET / POST /v2/coolblue/product`. */
export interface CoolblueProductParams {
  /** Product link, or the article number. */
  query: string;
  /** Shop for a bare article number. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `coolblueSearch()` — `GET / POST /v2/coolblue/search`. */
export interface CoolblueSearchParams {
  /** Search words, or a Coolblue listing link. */
  query: string;
  /** Page number, from 1. */
  page?: number | undefined;
  /** Shop, when query is words rather than a full link. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `copartLot()` — `GET / POST /v2/copart/lot`. */
export interface CopartLotParams {
  /** Copart lot number or full lot URL. */
  query: string;
  /** Regional Copart site when query is a lot number only. Defaults to US. */
  region?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `copartSearch()` — `GET / POST /v2/copart/search`. */
export interface CopartSearchParams {
  /** Search keyword or full Copart search URL. */
  query: string;
  /** Copart regional site when query is a keyword or lot number only. Defaults to US. */
  region?: string | undefined;
  /** Page number (default: 1). */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `costcoProduct()` — `GET / POST /v2/costco/product`. */
export interface CostcoProductParams {
  /** Costco product ID or full product URL. */
  query: string;
  /** Regional Costco site. Accepts a region code (us, fr, ca, uk, …) or full host (www.costco.fr). Defaults to US (www.costco.com) when omitted. */
  region?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `costcoSearch()` — `GET / POST /v2/costco/search`. */
export interface CostcoSearchParams {
  /** Search keyword or full regional search URL. */
  query: string;
  /** Regional Costco site. Accepts a region code (us, fr, ca, uk, …) or full host (www.costco.fr). Defaults to US (www.costco.com) when omitted. */
  region?: string | undefined;
  /** 1-based page number override. Uses currentPage (most regions) or page (UK) when rebuilding pagination URLs. */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `crunchbaseCompanyInfo()` — `GET / POST /v2/crunchbase/company/info`. */
export interface CrunchbaseCompanyInfoParams {
  /** Search for a company by its name, permalink, or full Crunchbase URL. */
  query?: string | undefined;
  /** Perform a reverse lookup by domain name to find the associated Crunchbase company profile. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `crunchbaseEvent()` — `GET / POST /v2/crunchbase/event`. */
export interface CrunchbaseEventParams {
  /** Retrieve event data using its Crunchbase permalink or full URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `crunchbaseFundingRound()` — `GET / POST /v2/crunchbase/funding_round`. */
export interface CrunchbaseFundingRoundParams {
  /** The permalink of the specific funding round to retrieve. This is the unique identifier found in the Crunchbase funding round URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `crunchbaseFundingRounds()` — `GET / POST /v2/crunchbase/funding_rounds`. */
export interface CrunchbaseFundingRoundsParams {
  /** Filter funding rounds announced within the last N days. Default: `1`. */
  days_since_announcement?: number | undefined;
  /** Filter by funding round type. Accepted values: */
  investment_type?: string | undefined;
  /** Filter rounds by a specific investor using their Crunchbase UUID. */
  investor_identifiers?: string | undefined;
  /** Filter rounds by a specific funded organization using their Crunchbase UUID. */
  funded_organization_identifier?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `crunchbasePeopleInfo()` — `GET / POST /v2/crunchbase/people/info`. */
export interface CrunchbasePeopleInfoParams {
  /** Search for a person by their name, Crunchbase permalink, or full Crunchbase profile URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `crunchbaseSearch()` — `GET / POST /v2/crunchbase/search`. */
export interface CrunchbaseSearchParams {
  /** The search keyword or phrase to query across Crunchbase. Searches both organizations and people. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `culturaProduct()` — `GET / POST /v2/cultura/product`. */
export interface CulturaProductParams {
  /** Link of the Cultura product page. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `culturaSearch()` — `GET / POST /v2/cultura/search`. */
export interface CulturaSearchParams {
  /** Words to search for on Cultura, or the search page link. */
  query: string;
  /** Page number, starting at 1. For example, 2 returns the next page of results. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `dartyProduct()` — `GET / POST /v2/darty/product`. */
export interface DartyProductParams {
  /** Product URL on www.darty.com. The path is under /nav/achat/ and ends in .html. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `dartySearch()` — `GET / POST /v2/darty/search`. */
export interface DartySearchParams {
  /** Keyword or a Darty search URL on www.darty.com. */
  query: string;
  /** 1-based page number. Defaults to 1. Page 2 returns the next 30 products. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `datasetsLinkedinCompany()` — `POST /v2/datasets/linkedin/company`. */
export interface DatasetsLinkedinCompanyParams {
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `decathlonProduct()` — `GET / POST /v2/decathlon/product`. */
export interface DecathlonProductParams {
  /** Product link, a /p/... or /products/... path, or a keyword. A keyword opens the first search hit. A search link returns 400. */
  query: string;
  /** Country shop when query is a keyword or a path. Default is fr. A full product link picks the shop. Default: `"fr"`. */
  region?: string | undefined;
  /** Set to true to get the raw page body in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `decathlonSearch()` — `GET / POST /v2/decathlon/search`. */
export interface DecathlonSearchParams {
  /** Keyword, or a Decathlon search link. */
  query: string;
  /** Country shop. Default is fr. A full link in query picks the shop, and a conflicting region returns 400. Default: `"fr"`. */
  region?: string | undefined;
  /** Page number starting at 1. */
  page?: number | undefined;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `digikeyProduct()` — `GET / POST /v2/digikey/product`. */
export interface DigikeyProductParams {
  /** Full DigiKey product detail URL, or relative path. */
  query: string;
  /** DigiKey country TLD when query is a relative path. */
  region?: string | undefined;
  /** When true, return rendered HTML as {"result": "..."} instead of JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `digikeySearch()` — `GET / POST /v2/digikey/search`. */
export interface DigikeySearchParams {
  /** Keyword, DigiKey result/filter URL, or relative path. */
  query: string;
  /** DigiKey country TLD when query is not a full URL. */
  region?: string | undefined;
  /** When true, return rendered HTML as {"result": "..."} instead of JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `doajArticle()` — `GET / POST /v2/doaj/article`. */
export interface DoajArticleParams {
  /** Required. Article id or a doaj.org/article URL. Example: 000004687a3a411cb466625281f2ceb0. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `doajJournal()` — `GET / POST /v2/doaj/journal`. */
export interface DoajJournalParams {
  /** Required. Journal ISSN, journal id, or a doaj.org/toc URL. Example: 2747-173X. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `doajSearch()` — `GET / POST /v2/doaj/search`. */
export interface DoajSearchParams {
  /** Required. Keyword or a doaj.org search URL. Example: climate. An article or journal URL returns 400. */
  query: string;
  /** Optional. article or journal. Example: journal. Defaults to article. Default: `"article"`. */
  kind?: string | undefined;
  /** Optional. Page number from 1. Example: 2. Defaults to 1. Each page has 10 records. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `domainDnsbl()` — `GET / POST /v2/domain/dnsbl`. */
export interface DomainDnsblParams {
  /** A domain name or IP address to check against DNS-based blacklists (DNSBL). */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `domainMalicious()` — `GET / POST /v2/domain/malicious`. */
export interface DomainMaliciousParams {
  /** A domain name or IP address to check for malicious activity across multiple threat intelligence sources. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `domainWhois()` — `GET / POST /v2/domain/whois`. */
export interface DomainWhoisParams {
  /** A domain name for which you want to retrieve WHOIS registration information. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `domaincomauProperty()` — `GET / POST /v2/domaincomau/property`. */
export interface DomaincomauPropertyParams {
  /** Domain listing URL. The path ends with the listing id. */
  query: string;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `domaincomauSearch()` — `GET / POST /v2/domaincomau/search`. */
export interface DomaincomauSearchParams {
  /** Suburb with state and postcode, a location slug, or a Domain search URL. */
  query: string;
  /** sale, rent, or sold when query is a place. Default: `"sale"`. */
  mode?: string | undefined;
  /** Page from 1. Default: `1`. */
  page?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `duckduckgoSearch()` — `GET / POST /v2/duckduckgo/search`. */
export interface DuckduckgoSearchParams {
  /** Search query sent to DuckDuckGo Search. */
  query: string;
  /** Page number. Page 1 is the first page of results. Default: `1`. */
  page?: number | undefined;
  /** Country code, for example us, fr, gb, de, jp. */
  gl?: string | undefined;
  /** Language code, for example en, fr, de, ja, zh. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ebayProduct()` — `GET / POST /v2/ebay/product`. */
export interface EbayProductParams {
  /** Item id, or an item URL on a supported eBay site. */
  query: string;
  /** When true, return raw HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ebaySearch()` — `GET / POST /v2/ebay/search`. */
export interface EbaySearchParams {
  /** Keyword on www.ebay.com, or a search URL on a supported eBay site. */
  query: string;
  /** Page number, sent as _pgn. Default 1 for a keyword. On a URL, the page already in the URL is kept when this is empty. Below 1 returns 400. */
  page?: number | undefined;
  /** When true, return raw HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `elcorteinglesProduct()` — `GET / POST /v2/elcorteingles/product`. */
export interface ElcorteinglesProductParams {
  /** Product URL or product id (A… / MP_…). */
  query: string;
  /** When true, return the raw HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `elcorteinglesSearch()` — `GET / POST /v2/elcorteingles/search`. */
export interface ElcorteinglesSearchParams {
  /** Search keyword or full El Corte Inglés search URL. */
  query: string;
  /** 1-based page number. Overrides /search-nwx/{page}/ when present in the URL (default: from URL or 1). */
  page?: number | undefined;
  /** When true, return the raw HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `eleclercProduct()` — `GET / POST /v2/eleclerc/product`. */
export interface EleclercProductParams {
  /** E.Leclerc product EAN or product page URL. */
  query: string;
  /** E.Leclerc store sign code. This selects that store's price and stock. */
  store_id?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `eleclercSearch()` — `GET / POST /v2/eleclerc/search`. */
export interface EleclercSearchParams {
  /** Search keyword or phrase to query on E.Leclerc. */
  query: string;
  /** ID of a specific E.Leclerc store to search in. */
  store_id?: string | undefined;
  /** Page number for paginated results. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `eleclercSuggest()` — `GET / POST /v2/eleclerc/suggest`. */
export interface EleclercSuggestParams {
  /** Search term or EAN to get product suggestions for. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `emailAnalyzes()` — `GET / POST /v2/email/analyzes`. */
export interface EmailAnalyzesParams {
  /** The domain name you want to analyze for email infrastructure. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `emailFinder()` — `GET / POST /v2/email/finder`. */
export interface EmailFinderParams {
  /** Full name of the person whose professional email address you want to find. */
  query: string;
  /** The company's domain name. Multiple formats are accepted: */
  company_domain?: string | undefined;
  /** The company name of the person you are looking for. */
  company_name?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `emailVerify()` — `GET / POST /v2/email/verify`. */
export interface EmailVerifyParams {
  /** The email address you want to verify. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `europagesCompany()` — `GET / POST /v2/europages/company`. */
export interface EuropagesCompanyParams {
  /** Profile URL copied from a search card, or a slug. */
  query: string;
  /** Site when query is a slug. Same values as search. Default fr. Ignored when query is a URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `europagesSearch()` — `GET / POST /v2/europages/search`. */
export interface EuropagesSearchParams {
  /** Keyword, or a category / search URL on Europages. */
  query: string;
  /** Site of a keyword: fr (default), de, co.uk (en, uk, gb), es, it, nl, and the other Europages TLDs. Ignored when query is a URL. German uses /suche/. Default: `"fr"`. */
  domain?: string | undefined;
  /** Page from 1. Page 2 and after use /pg-N/. 30 companies per page. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `eventbriteEvent()` — `GET / POST /v2/eventbrite/event`. */
export interface EventbriteEventParams {
  /** Event detail URL or numeric id. */
  query: string;
  /** Country TLD when query is a bare id (fr, com, es, com.mx, …). Ignored if query is a full URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `eventbriteSearch()` — `GET / POST /v2/eventbrite/search`. */
export interface EventbriteSearchParams {
  /** Keyword, or paste a full Eventbrite city / category / search URL. */
  query?: string | undefined;
  /** Eventbrite TLD when query is a keyword (fr, com, es, com.mx, co.uk, …). Ignored if query is a full URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Location slug such as france--paris (keyword searches only). */
  location?: string | undefined;
  /** Page number. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `expediaAd()` — `GET / POST /v2/expedia/ad`. */
export interface ExpediaAdParams {
  /** An Expedia hotel information URL. The response is one flat hotel. hotel_id comes from .h{id}.Hotel-Information when that pattern is in the URL, and is null otherwise. A destination, a non-Expedia URL, or an empty value returns 400. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `expediaFlight()` — `GET / POST /v2/expedia/flight`. */
export interface ExpediaFlightParams {
  /** A route or a full Expedia Flights-Search URL. Empty, a route without two airport codes, or a non-Expedia URL returns 400. A full URL is opened as given. price stays the label on the offer. pagination.next is null. */
  query: string;
  /** Departure as YYYY-MM-DD for a route. Omit it and the route uses 2026-11-15. A value that is not YYYY-MM-DD returns 400. Ignored when query is a full URL. */
  departure_date?: string | undefined;
  /** Return date as YYYY-MM-DD. Omit it for a one-way trip. A value that is not YYYY-MM-DD returns 400. Ignored when query is a full URL. */
  return_date?: string | undefined;
  /** Adult passengers for a route. Omit it and the request uses 1. Ignored when query is a full URL. */
  adults?: number | undefined;
  /** Label copied onto every result as cabin_class. Omit it and each result uses economy. It does not add a cabin filter to the Expedia URL. */
  cabin_class?: string | undefined;
  /** Host for a route. Omit it for www.expedia.com. Allowed: us, ca, uk, au, fr, de, es, it, nl, mx. Any other value returns 400. Ignored when query is a full URL. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `expediaSearch()` — `GET / POST /v2/expedia/search`. */
export interface ExpediaSearchParams {
  /** A valid Expedia hotel search URL. Copy the URL directly from your Expedia search results page. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fashionphileProduct()` — `GET / POST /v2/fashionphile/product`. */
export interface FashionphileProductParams {
  /** Product handle or a fashionphile.com product URL. The request reads products/{handle}.js and returns one flat product. price is the USD amount and price_display is that amount rebuilt as a dollar string. */
  query: string;
  /** Default false. true replaces the product object with result, the raw Shopify JSON text. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fashionphileSearch()` — `GET / POST /v2/fashionphile/search`. */
export interface FashionphileSearchParams {
  /** Keywords, a Fashionphile search URL, a collection URL, or a products.json URL. Empty returns 400. */
  query: string;
  /** Page number starting at 1. Omit it for page 1. */
  page?: number | undefined;
  /** Default false. true replaces results and pagination with result, the raw Shopify JSON text. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderChewyProducts()` — `GET / POST /v2/finder/chewy-products`. */
export interface FinderChewyProductsParams {
  /** Free-text search across product titles and IDs. Optional if at least one filter is provided. */
  search?: string | undefined;
  /** Legacy alias of search. Kept for backward compatibility. */
  query?: string | undefined;
  /** Filter by one or several internal product IDs. Provide a comma-separated list to match multiple IDs. */
  id?: string | undefined;
  /** Filter by website domain. Comma-separated values are accepted. */
  domain?: string | undefined;
  /** Raw filter expression for advanced filtering. Combined with the shorthand filters using AND. */
  filter?: string | undefined;
  /** Maximum number of results to return. Default is 10, maximum is 100. Default: `10`. */
  limit?: number | undefined;
  /** Number of results to skip for pagination. Default is 0. Default: `0`. */
  offset?: number | undefined;
  /** Sort the results. Provide one or several attributes with :asc or :desc, comma-separated. */
  sort?: string | undefined;
  /** Comma-separated list of fields to return. Defaults to all fields. */
  fields?: string | undefined;
  /** When true, the response is wrapped in an object containing the total estimated count plus the hits: { count, hits }. When false or omitted, returns the raw hits array. Default: `false`. */
  count?: boolean | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderEleclercStores()` — `GET / POST /v2/finder/eleclerc-stores`. */
export interface FinderEleclercStoresParams {
  /** Filters stores based on a search string. The search is non-case-sensitive and returns all stores whose names contain the specified string. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderGoogleCountries()` — `GET / POST /v2/finder/google-countries`. */
export interface FinderGoogleCountriesParams {
  /** Filters countries based on a search string. The search is non-case-sensitive and returns all countries whose names contain the specified string. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderGoogleLanguages()` — `GET / POST /v2/finder/google-languages`. */
export interface FinderGoogleLanguagesParams {
  /** Filters languages based on a search string. The search is non-case-sensitive and returns all languages whose names contain the specified string. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderGoogleLocations()` — `GET / POST /v2/finder/google-locations`. */
export interface FinderGoogleLocationsParams {
  /** Restricts your search to locations that contain the supplied string. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderLeroymerlinProducts()` — `GET / POST /v2/finder/leroymerlin-products`. */
export interface FinderLeroymerlinProductsParams {
  /** Free-text search across product titles and IDs. Optional if at least one filter is provided. */
  search?: string | undefined;
  /** Legacy alias of search. Kept for backward compatibility. */
  query?: string | undefined;
  /** Filter by one or several internal product IDs. Provide a comma-separated list to match multiple IDs. */
  id?: string | undefined;
  /** Filter by website domain. Comma-separated values are accepted. */
  domain?: string | undefined;
  /** Raw filter expression for advanced filtering. Combined with the shorthand filters using AND. */
  filter?: string | undefined;
  /** Maximum number of results to return. Default is 10, maximum is 100. Default: `10`. */
  limit?: number | undefined;
  /** Number of results to skip for pagination. Default is 0. Default: `0`. */
  offset?: number | undefined;
  /** Sort the results. Provide one or several attributes with :asc or :desc, comma-separated. */
  sort?: string | undefined;
  /** Comma-separated list of fields to return. Defaults to all fields. */
  fields?: string | undefined;
  /** When true, the response is wrapped in an object containing the total estimated count plus the hits: { count, hits }. When false or omitted, returns the raw hits array. Default: `false`. */
  count?: boolean | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderLeroymerlinStores()` — `GET / POST /v2/finder/leroymerlin-stores`. */
export interface FinderLeroymerlinStoresParams {
  /** Filters Leroy Merlin stores based on a search string. The search is non-case-sensitive and matches store names, cities, postal codes and store slugs. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderLinkedinIndustries()` — `GET / POST /v2/finder/linkedin-industries`. */
export interface FinderLinkedinIndustriesParams {
  /** Restricts your search to industries that contain the supplied string. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `finderMrbricolageStores()` — `GET / POST /v2/finder/mrbricolage-stores`. */
export interface FinderMrbricolageStoresParams {
  /** Filters Mr.Bricolage stores based on a search string. The search is non-case-sensitive and matches store names, cities and postal codes. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fiverrProfileInfo()` — `GET / POST /v2/fiverr/profile/info`. */
export interface FiverrProfileInfoParams {
  /** Fiverr profile URL of the seller you want to extract information from. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fiverrSearch()` — `GET / POST /v2/fiverr/search`. */
export interface FiverrSearchParams {
  /** A Fiverr search URL for gigs. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fnacProduct()` — `GET / POST /v2/fnac/product`. */
export interface FnacProductParams {
  /** Product URL (/a{id} or /mp{id}) or the numeric Fnac id. A keyword or a search URL returns 400. */
  query: string;
  /** When true, returns the raw HTML instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fnacSearch()` — `GET / POST /v2/fnac/search`. */
export interface FnacSearchParams {
  /** Keyword or a Fnac SearchResult URL. A product URL returns 400. */
  query: string;
  /** Page number, from 1. Default is 1. Page 2 is sent as PageIndex=2. */
  page?: number | undefined;
  /** When true, returns the raw HTML instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fotocasaAd()` — `GET / POST /v2/fotocasa/ad`. */
export interface FotocasaAdParams {
  /** Full Fotocasa ad URL (/comprar/ or /alquiler/, ending with /d). */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fotocasaSearch()` — `GET / POST /v2/fotocasa/search`. */
export interface FotocasaSearchParams {
  /** City name or full Fotocasa search URL. */
  query: string;
  /** Used when query is a city name (ignored for full URLs). Default: `"buy"`. */
  operation?: string | undefined;
  /** Page number (1-based). Default: 1. Page 2 maps to /l/2. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `franchisedirectFranchise()` — `GET / POST /v2/franchisedirect/franchise`. */
export interface FranchisedirectFranchiseParams {
  /** Required. A Franchise Direct profile URL from search, or the same path beginning with /. A keyword or a listing URL returns 400. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `franchisedirectSearch()` — `GET / POST /v2/franchisedirect/search`. */
export interface FranchisedirectSearchParams {
  /** Required. A keyword, or a Franchise Direct listing URL (search, directory, or category). A profile URL such as /coffee-franchises/coffeenow returns 400 on this endpoint. Send that URL to /v2/franchisedirect/franchise. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fressnapfProduct()` — `GET / POST /v2/fressnapf/product`. */
export interface FressnapfProductParams {
  /** Product URL on www.fressnapf.de. */
  query: string;
  /** When true, return the raw HTML. The string false stays false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fressnapfSearch()` — `GET / POST /v2/fressnapf/search`. */
export interface FressnapfSearchParams {
  /** Keyword or a fressnapf.de search or category URL. */
  query: string;
  /** Page number, starting at 1. Example: 2. */
  page?: number | undefined;
  /** When true, return the raw HTML. The string false stays false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fundaProperty()` — `GET / POST /v2/funda/property`. */
export interface FundaPropertyParams {
  /** Listing URL on www.funda.nl, under /detail/koop or /detail/huur. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `fundaSearch()` — `GET / POST /v2/funda/search`. */
export interface FundaSearchParams {
  /** City, area, or a Funda search URL. */
  query: string;
  /** Sale or rent when query is a place. */
  offering?: string | undefined;
  /** Page from 1. Example: 2. Funda receives this as search_result=2. Page 1 and page 2 return different listings. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `g2ProductInfo()` — `GET / POST /v2/g2/product/info`. */
export interface G2ProductInfoParams {
  /** Product slug or a www.g2.com product URL. */
  query: string;
  /** Keep reviews of one star rating, from 1 to 5. Omit it to read the unfiltered reviews page. */
  nps_score?: number | undefined;
  /** Return the rendered HTML instead of the parsed product. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `githubUserInfo()` — `GET / POST /v2/github/user/info`. */
export interface GithubUserInfoParams {
  /** A GitHub user identifier. Multiple formats are accepted: */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `glassdoorCompanyInfo()` — `GET / POST /v2/glassdoor/company/info`. */
export interface GlassdoorCompanyInfoParams {
  /** Company URL or employer id.\n\nExample:\n\n 1692882 */
  query: string;
  /** Glassdoor TLD when query is not a full URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `glassdoorCompanySearch()` — `GET / POST /v2/glassdoor/company/search`. */
export interface GlassdoorCompanySearchParams {
  /** Employer keyword, or a full Glassdoor autocomplete URL.\n\nExample:\n\n airbus */
  query: string;
  /** Glassdoor TLD (fr, com, co.uk, …). Default: `"fr"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `glassdoorJobInfo()` — `GET / POST /v2/glassdoor/job/info`. */
export interface GlassdoorJobInfoParams {
  /** Job listing URL or jl id.\n\nExample:\n\n 1010283388161 */
  query: string;
  /** Glassdoor TLD when query is not a full URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `glassdoorJobSearch()` — `GET / POST /v2/glassdoor/job/search`. */
export interface GlassdoorJobSearchParams {
  /** Keyword or full Glassdoor job search URL. */
  query: string;
  /** Glassdoor TLD when query is not a full URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Page number. */
  page?: number | undefined;
  /** Glassdoor sortBy value (e.g. date_desc). */
  sort_by?: string | undefined;
  /** When true, set remoteWorkType=1. */
  remote?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `goodreadsBook()` — `GET / POST /v2/goodreads/book`. */
export interface GoodreadsBookParams {
  /** Required. The numeric Goodreads book id from search, or a /book/show/ URL. A title is not accepted. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `goodreadsSearch()` — `GET / POST /v2/goodreads/search`. */
export interface GoodreadsSearchParams {
  /** Required. A book keyword, or a Goodreads search URL (the path contains /search or the query contains q=). */
  query: string;
  /** Optional. Page number, starting at 1. Omitted or blank uses page 1. A value below 1 returns 400. When query is already a Goodreads search URL, this number replaces the page parameter in that URL. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleImages()` — `GET / POST /v2/google/images`. */
export interface GoogleImagesParams {
  /** The image search query to execute on Google Images. */
  query: string;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Page number for pagination. Images are returned in batches of 100 per page. Default: `1`. */
  page?: number | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleJobs()` — `GET / POST /v2/google/jobs`. */
export interface GoogleJobsParams {
  /** Job search term or keyword for querying Google job listings. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleMaps()` — `GET / POST /v2/google/maps`. */
export interface GoogleMapsParams {
  /** Business name or keyword to search for relevant data. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleNews()` — `GET / POST /v2/google/news`. */
export interface GoogleNewsParams {
  /** The news search query to execute on Google News. Supports standard Google search operators. */
  query: string;
  /** City or region from which the news search should originate. Simulates a search performed from the specified location. */
  location?: string | undefined;
  /** Google-encoded location string for precise geographic targeting. Use this instead of location when you need exact control. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Page number of news results to retrieve. Default: `1`. */
  page?: number | undefined;
  /** Maximum number of results to return per page. Default: `10`. */
  num?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearch()` — `GET / POST /v2/google/search`. */
export interface GoogleSearchParams {
  /** The search query to execute on Google. Supports all standard Google search operators. */
  query: string;
  /** Advanced time-range and filter string for Google Search. Used to restrict results by recency. */
  tbs?: string | undefined;
  /** City or region from which the search should originate. Simulates a real user's search from the specified location. */
  location?: string | undefined;
  /** Google-encoded location string for precise geographic targeting. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Page number of search results to retrieve. Default: `1`. */
  page?: number | undefined;
  /** Maximum number of results to return per page (e.g. 10, 40, 100). Default: `10`. */
  num?: number | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearchAi()` — `GET / POST /v2/google/search/ai`. */
export interface GoogleSearchAiParams {
  /** The question or search query to send to Google AI Mode. Natural-language questions work best; advanced operators are also accepted. */
  query: string;
  /** City or region from which the AI Mode search should originate. Simulates a real user searching from that location. */
  location?: string | undefined;
  /** Google-encoded location string for precise geographic targeting. Mutually exclusive with location. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleSearchAutocomplete()` — `GET / POST /v2/google/search/autocomplete`. */
export interface GoogleSearchAutocompleteParams {
  /** The partial or complete search query for which you want to retrieve autocomplete suggestions from Google. */
  query: string;
  /** Cursor position in the query string where autocomplete suggestions should be generated. Determines which part of the query is being completed. Default: `0`. */
  cp?: number | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleShopping()` — `GET / POST /v2/google/shopping`. */
export interface GoogleShoppingParams {
  /** Product search query on Google Shopping. Use a product name, brand, or category. */
  query: string;
  /** Page number of Shopping results. Each page returns about 20 products. There is no num parameter. Default: `1`. */
  page?: number | undefined;
  /** City or region used to localize Shopping results. Simulates a search from that location and generates the UULE parameter automatically. */
  location?: string | undefined;
  /** Google-encoded location string (UULE) for precise geo-targeting. Use location instead if you do not already have an encoded value. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleVideos()` — `GET / POST /v2/google/videos`. */
export interface GoogleVideosParams {
  /** The video search query to execute on Google Videos. Supports standard Google search operators. */
  query: string;
  /** City or region from which the video search should originate. */
  location?: string | undefined;
  /** Google-encoded location string for precise geographic targeting. */
  uule?: string | undefined;
  /** Google domain to use for the search. Defaults to google.com. Default: `"google.com"`. */
  google_domain?: string | undefined;
  /** Country to use for the Google search. Two-letter country code (e.g. us for the United States, uk for United Kingdom, or fr for France). Default: `"us"`. */
  gl?: string | undefined;
  /** Language to use for the Google search. Two or three-letter language code (e.g. en, es, fr), optionally followed by a region code (e.g. en-gb, es-419). Default: `"en"`. */
  hl?: string | undefined;
  /** Limit results to one or more countries. Use country{XX} with | as delimiter (e.g. countryFR|countryDE). */
  cr?: string | undefined;
  /** Limit results to one or more languages. Use lang_{xx} with | as delimiter (e.g. lang_fr|lang_de). */
  lr?: string | undefined;
  /** Page number of video results to retrieve. Default: `1`. */
  page?: number | undefined;
  /** Maximum number of video results to return per page. Default: `10`. */
  num?: number | undefined;
  /** Adult content filter. active enables Google SafeSearch; off disables it. Omit to use Google default. */
  safe?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleadstransparencyAd()` — `GET / POST /v2/googleadstransparency/ad`. */
export interface GoogleadstransparencyAdParams {
  /** Creative URL from search. */
  query: string;
  /** ISO alpha-2. The matching region is returned first. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `googleadstransparencySearch()` — `GET / POST /v2/googleadstransparency/search`. */
export interface GoogleadstransparencySearchParams {
  /** Domain name, advertiser name, advertiser id, or a full Ads Transparency URL. */
  query: string;
  /** Country. ISO alpha-2 (FR), anywhere, or a Transparency region code (2250 for France, 250 is also accepted). */
  region?: string | undefined;
  /** Domain filter. Used when query is not already a domain. */
  domain?: string | undefined;
  /** Advertiser id, AR followed by digits. */
  advertiser_id?: string | undefined;
  /** Creative format. */
  format?: string | undefined;
  /** Comma-separated surfaces. */
  platform?: string | undefined;
  /** Relative window. */
  preset_date?: string | undefined;
  /** Inclusive start date, YYYY-MM-DD or YYYYMMDD. */
  start_date?: string | undefined;
  /** Inclusive end date, YYYY-MM-DD or YYYYMMDD. A single day uses the same value as start_date. */
  end_date?: string | undefined;
  /** Ad topic. Default: commercial. Default: `"commercial"`. */
  topic?: string | undefined;
  /** Page number, from 1 to 20. Default: 1. Default: `1`. */
  page?: number | undefined;
  /** Page size, from 1 to 100. Default: 40. Default: `40`. */
  per_page?: number | undefined;
  /** Opaque cursor copied from pagination.next. */
  cursor?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `graingerProduct()` — `GET / POST /v2/grainger/product`. */
export interface GraingerProductParams {
  /** SKU, full Grainger product URL, or relative /product/... path. */
  query: string;
  /** Grainger country when query is not a full URL (default: com). */
  region?: string | undefined;
  /** When true, return rendered HTML as {"result": "..."} instead of JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `graingerSearch()` — `GET / POST /v2/grainger/search`. */
export interface GraingerSearchParams {
  /** Keyword, full Grainger search/category URL, category path, or SKU. */
  query: string;
  /** Grainger country when query is not a full URL (default: com). */
  region?: string | undefined;
  /** When true, return rendered HTML as {"result": "..."} instead of JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `greenhouseJob()` — `GET / POST /v2/greenhouse/job`. */
export interface GreenhouseJobParams {
  /** Required. board/id or a job URL. Example: discord/8806482002 or https://job-boards.greenhouse.io/discord/jobs/8806482002. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `greenhouseSearch()` — `GET / POST /v2/greenhouse/search`. */
export interface GreenhouseSearchParams {
  /** Required. Board token or a job-boards.greenhouse.io board URL. Example: discord. A job URL returns 400. */
  query: string;
  /** Optional. Case-insensitive filter on title and location. Example: policy. Omit it to list the whole board. */
  keyword?: string | undefined;
  /** Optional. Page number from 1. Example: 2. Defaults to 1. Page size is 20. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `gsaelibraryContract()` — `GET / POST /v2/gsaelibrary/contract`. */
export interface GsaelibraryContractParams {
  /** Required. The contractorInfo.do URL from a search contract row. A contract number is also accepted, but GS-07F-0239T alone currently returns 404 because GSA needs the contractor name that search includes in the URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `gsaelibrarySearch()` — `GET / POST /v2/gsaelibrary/search`. */
export interface GsaelibrarySearchParams {
  /** Required. A keyword, or a full search URL on gsaelibrary.gsa.gov. The URL must contain searchResults.do or searchText=. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `homestraAd()` — `GET / POST /v2/homestra/ad`. */
export interface HomestraAdParams {
  /** A Homestra property URL or slug. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `homestraSearch()` — `GET / POST /v2/homestra/search`. */
export interface HomestraSearchParams {
  /** A valid Homestra search URL with optional filters. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `huggingfaceModel()` — `GET / POST /v2/huggingface/model`. */
export interface HuggingfaceModelParams {
  /** Required. A public model id (owner/name) or a huggingface.co model URL. Reserved site paths such as models, datasets, or spaces return 400. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `huggingfaceSearch()` — `GET / POST /v2/huggingface/search`. */
export interface HuggingfaceSearchParams {
  /** Required. A model keyword, a huggingface.co/models URL, or the full pagination.next cursor URL from a previous page. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `idealistaProperty()` — `GET / POST /v2/idealista/property`. */
export interface IdealistaPropertyParams {
  /** Full Idealista property detail URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `idealistaProvinces()` — `GET / POST /v2/idealista/provinces`. */
export interface IdealistaProvincesParams {
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `idealistaSearch()` — `GET / POST /v2/idealista/search`. */
export interface IdealistaSearchParams {
  /** Full Idealista search results URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `idealoProduct()` — `GET / POST /v2/idealo/product`. */
export interface IdealoProductParams {
  /** Full Idealo product URL, or a numeric product id. */
  query: string;
  /** Region when query is a numeric product id. */
  country?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `idealoSearch()` — `GET / POST /v2/idealo/search`. */
export interface IdealoSearchParams {
  /** Keyword or full Idealo search URL for Spain, France, or Germany. */
  query: string;
  /** Region when query is a keyword. */
  country?: string | undefined;
  /** Search page. 2 appends ?page=2. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ikeaProduct()` — `GET / POST /v2/ikea/product`. */
export interface IkeaProductParams {
  /** Full IKEA product page URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ikeaSearch()` — `GET / POST /v2/ikea/search`. */
export interface IkeaSearchParams {
  /** Full IKEA search URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `immobilienscout24Property()` — `GET / POST /v2/immobilienscout24/property`. */
export interface Immobilienscout24PropertyParams {
  /** The expose id, or the expose page URL. Default: `"168052908"`. */
  query: string;
  /** When true, return the raw HTML in result instead of the parsed expose. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `immobilienscout24Search()` — `GET / POST /v2/immobilienscout24/search`. */
export interface Immobilienscout24SearchParams {
  /** Where to search. Default: `"berlin/berlin"`. */
  query: string;
  /** Rent or buy. */
  real_estate_type?: string | undefined;
  /** Page number, starting at 1. */
  page?: number | undefined;
  /** When true, return the raw HTML in result instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `immoscout24chSearch()` — `GET / POST /v2/immoscout24ch/search`. */
export interface Immoscout24chSearchParams {
  /** Swiss city or a full ImmoScout24.ch search URL. */
  query: string;
  /** rent or buy. */
  offer_type?: string | undefined;
  /** apartment, house, or all. */
  property_type?: string | undefined;
  /** Page from 1. Default: `1`. */
  page?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `immoweltProperty()` — `GET / POST /v2/immowelt/property`. */
export interface ImmoweltPropertyParams {
  /** Full Immowelt property detail URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `immoweltSearch()` — `GET / POST /v2/immowelt/search`. */
export interface ImmoweltSearchParams {
  /** Full Immowelt search URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `imoveiswebProperty()` — `GET / POST /v2/imoveisweb/property`. */
export interface ImoveiswebPropertyParams {
  /** Listing URL from search. */
  query: string;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `imoveiswebSearch()` — `GET / POST /v2/imoveisweb/search`. */
export interface ImoveiswebSearchParams {
  /** Catalog name or an ImoveisWeb results URL. This is Imobiliária Aquários, not ZonaProp. */
  query: string;
  /** Optional catalog when query is not already a catalog name. */
  property_type?: string | undefined;
  /** Page from 1. Default: `1`. */
  page?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `indeedCompanyInfo()` — `GET / POST /v2/indeed/company/info`. */
export interface IndeedCompanyInfoParams {
  /** Indeed company slug or full /cmp/ URL. */
  query: string;
  /** When true, return the raw HTML as {\"result\": \"...\"} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `indeedCompanySearch()` — `GET / POST /v2/indeed/company/search`. */
export interface IndeedCompanySearchParams {
  /** Company keyword or full Indeed companies search URL. */
  query: string;
  /** When true, return the raw HTML as {\"result\": \"...\"} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `indeedJobInfo()` — `GET / POST /v2/indeed/job/info`. */
export interface IndeedJobInfoParams {
  /** Indeed job URL, sponsored SERP click URL or 16-char jk job key. */
  query: string;
  /** When true, return the raw HTML as {\"result\": \"...\"} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `indeedJobSalary()` — `GET / POST /v2/indeed/job/salary`. */
export interface IndeedJobSalaryParams {
  /** Career salary slug, full /career/.../salaries URL or slug|location pair. */
  query: string;
  /** When true, return the raw HTML as {\"result\": \"...\"} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `indeedJobSearch()` — `GET / POST /v2/indeed/job/search`. */
export interface IndeedJobSearchParams {
  /** Keyword, Indeed /jobs URL or SEO search URL on fr.indeed.com (default domain). */
  query: string;
  /** 1-based page number (10 results per page). Default: 1. */
  page?: number | undefined;
  /** When true, return the raw HTML as {\"result\": \"...\"} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `inetProduct()` — `GET / POST /v2/inet/product`. */
export interface InetProductParams {
  /** Article number or product URL. Example: 4306287. A search link returns 400. */
  query: string;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `inetSearch()` — `GET / POST /v2/inet/search`. */
export interface InetSearchParams {
  /** What to look for. A word such as ssd, or an Inet search or category link. A product link returns 400. */
  query: string;
  /** Page number, starting at 1. Page 2 uses page=2. */
  page?: number | undefined;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `instagramPostInfo()` — `GET / POST /v2/instagram/post/info`. */
export interface InstagramPostInfoParams {
  /** The Instagram post or reel to retrieve. Accepts a full URL or a shortcode. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `instagramUserInfo()` — `GET / POST /v2/instagram/user/info`. */
export interface InstagramUserInfoParams {
  /** The Instagram user to look up. Accepts a full profile URL or a username. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `intermarcheProduct()` — `GET / POST /v2/intermarche/product`. */
export interface IntermarcheProductParams {
  /** Full Intermarché product URL, or an EAN barcode. */
  query: string;
  /** Intermarché store id. Resolve a city with the [Stores Finder](https://www.piloterr.com/library/finder-intermarche-stores) (for example query=Paris). */
  shop_id: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `intermarcheSearch()` — `GET / POST /v2/intermarche/search`. */
export interface IntermarcheSearchParams {
  /** Search keyword or full Intermarché search URL. */
  query: string;
  /** Intermarché store id. Resolve a city with the [Stores Finder](https://www.piloterr.com/library/finder-intermarche-stores) (for example query=Paris). */
  shop_id: string;
  /** Page number starting at 1. Use pagination.total_pages from a previous response to iterate. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `intersportProduct()` — `GET / POST /v2/intersport/product`. */
export interface IntersportProductParams {
  /** Product URL on intersport.fr, or a root-relative path ending in -p-{id}. */
  query: string;
  /** When true, returns the raw HTML instead of the parsed JSON. The response shape is {"result": "<html>..."}. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `intersportSearch()` — `GET / POST /v2/intersport/search`. */
export interface IntersportSearchParams {
  /** Keyword or an intersport.fr listing URL. A product URL returns 400. */
  query: string;
  /** Page number, from 1. Default is 1. Intersport's page query is zero-based, so page 2 is sent as page=1. */
  page?: number | undefined;
  /** When true, returns the raw HTML instead of the parsed JSON. The response shape is {"result": "<html>..."}. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `jameseditionProperty()` — `GET / POST /v2/jamesedition/property`. */
export interface JameseditionPropertyParams {
  /** Required. JamesEdition listing URL, for example https://www.jamesedition.com/real_estate/munich-germany/alpine-panorama-above-lake-starnberg-new-build-project-near-munich-17793477. A keyword is rejected. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `jameseditionSearch()` — `GET / POST /v2/jamesedition/search`. */
export interface JameseditionSearchParams {
  /** Required. Keyword, for example villa, or a JamesEdition results URL such as https://www.jamesedition.com/real_estate/france. A single listing URL is rejected. */
  query: string;
  /** Optional. Page number starting at 1. Example: 2. Omitted means page 1. A page already present in a results URL is kept when this is omitted or 1. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `jobs()` — `GET /v1/jobs/{id}`. */
export interface JobsParams {
  /** The job_id returned by an endpoint called with is_async=true. */
  id: string;
}

/** Parameters for `kickUserInfo()` — `GET / POST /v2/kick/user/info`. */
export interface KickUserInfoParams {
  /** The Kick channel to look up. Accepts a full channel URL or a username/slug. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `kijijiAd()` — `GET / POST /v2/kijiji/ad`. */
export interface KijijiAdParams {
  /** Full Kijiji listing URL or the numeric listing id. */
  query: string;
  /** Locale sent to Kijiji as the siteLocale cookie. en sets en-CA and prints $20. fr sets fr-CA and prints 20 $ on the same ad. Default: `"en"`. */
  language?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `kijijiSearch()` — `GET / POST /v2/kijiji/search`. */
export interface KijijiSearchParams {
  /** Keyword or full Kijiji results URL. */
  query: string;
  /** Results page, starting at 1. Page 2 of the City of Toronto bikes search returns a different set of listing ids. When page stays at 1, a page-N segment already present in the URL is kept. */
  page?: number | undefined;
  /** Locale sent to Kijiji as the siteLocale cookie. en sets en-CA. fr sets fr-CA. French cards print prices like 10,00 $. Default: `"en"`. */
  language?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `krogerProduct()` — `GET / POST /v2/kroger/product`. */
export interface KrogerProductParams {
  /** Kroger product URL or UPC. */
  query: string;
  /** Ignored. Prices stay on the default Rolla store, 02100537 (Kroger, 605 W 4th St, Rolla, MO 65401). The response location_id is the store that was actually priced. */
  location_id?: string | undefined;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `krogerSearch()` — `GET / POST /v2/kroger/search`. */
export interface KrogerSearchParams {
  /** Keyword or a full Kroger search URL. */
  query: string;
  /** Page number, 1-based. */
  page?: number | undefined;
  /** Ignored. Prices stay on the default Rolla store, 02100537 (Kroger, 605 W 4th St, Rolla, MO 65401). The response location_id is the store that was actually priced. */
  location_id?: string | undefined;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `lamudiAd()` — `GET / POST /v2/lamudi/ad`. */
export interface LamudiAdParams {
  /** Full Lamudi listing URL. Accepts lamudi.com.ph (/property/) and lamudi.co.id (/properti/). */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `lamudiSearch()` — `GET / POST /v2/lamudi/search`. */
export interface LamudiSearchParams {
  /** Full Lamudi search URL. Used first when set. Location and path filters are ignored. */
  query?: string | undefined;
  /** City or district. Used when query is empty. Builds a Philippines URL (lamudi.com.ph). For Indonesia, pass a search URL in query. */
  location?: string | undefined;
  /** Transaction type. Used when query is empty. Default: `"sale"`. */
  operation?: string | undefined;
  /** Property type. Used when query is empty. Maps to Lamudi slugs (condominium → /condo/, land → /lot/). */
  property_type?: string | undefined;
  /** Minimum asking price in PHP or IDR. */
  min_price?: number | undefined;
  /** Maximum asking price in PHP or IDR. */
  max_price?: number | undefined;
  /** Minimum bedroom count. */
  min_bedrooms?: number | undefined;
  /** Maximum bedroom count. */
  max_bedrooms?: number | undefined;
  /** Minimum bathroom count. */
  min_bathrooms?: number | undefined;
  /** Minimum area in m². */
  min_area?: number | undefined;
  /** Maximum area in m². */
  max_area?: number | undefined;
  /** Sort order. Default: `"relevance"`. */
  sort?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `leboncoinAd()` — `GET / POST /v2/leboncoin/ad`. */
export interface LeboncoinAdParams {
  /** Leboncoin ad ID or full ad URL. Both formats are accepted regardless of return_page_source. */
  query: string;
  /** Controls the response format. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `leboncoinSearch()` — `GET / POST /v2/leboncoin/search`. */
export interface LeboncoinSearchParams {
  /** Full Leboncoin search or category URL. Both keyword searches and category browse URLs are supported. */
  query: string;
  /** Deprecated. Sending true returns 400. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `leboncoinSearchApi()` — `POST /v2/leboncoin/search_api`. */
export interface LeboncoinSearchApiParams {
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `lenovoProduct()` — `GET / POST /v2/lenovo/product`. */
export interface LenovoProductParams {
  /** Full Lenovo product URL (must contain /p/). Bare part numbers are rejected. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `lenovoSearch()` — `GET / POST /v2/lenovo/search`. */
export interface LenovoSearchParams {
  /** Keyword or full Lenovo search / category URL. */
  query: string;
  /** Store locale when query is a keyword (ignored for full URLs). Default: `"fr/fr"`. */
  locale?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `leroymerlinProduct()` — `GET / POST /v2/leroymerlin/product`. */
export interface LeroymerlinProductParams {
  /** Full Leroy Merlin product URL, or an identifier (SKU / EAN / text). */
  query: string;
  /** Leroy Merlin country when query is a keyword or identifier (default: fr). Ignored when query is a full Leroy Merlin URL (country is detected from the domain). */
  region?: string | undefined;
  /** Optional store id for local offer context (prices, stock, deliveries). Must exist for the active region. Returns 400 when unknown. */
  store_id?: string | undefined;
  /** When set to true, returns the raw HTML of the product page instead of the parsed JSON payload. Useful for debugging or custom parsing. The response shape is {"return": "<html>..."}. Defaults to false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `leroymerlinSearch()` — `GET / POST /v2/leroymerlin/search`. */
export interface LeroymerlinSearchParams {
  /** Search keyword, SKU/EAN, or full Leroy Merlin search URL. */
  query: string;
  /** Leroy Merlin country when query is a keyword or identifier (default: fr). Ignored when query is a full Leroy Merlin URL (country is detected from the domain). */
  region?: string | undefined;
  /** 1-based page number for pagination. Defaults to 1 when omitted. Use the pagination.total_pages returned by a previous call to iterate. */
  page?: number | undefined;
  /** Optional store id for local prices and availability. Must exist for the active region (FR stores with region=fr, RO stores with region=ro). Returns 400 when unknown. */
  store_id?: string | undefined;
  /** When set to true, returns the raw HTML of the page instead of the parsed JSON payload. Useful for debugging or custom parsing. The response shape is {"return": "<html>..."}. Defaults to false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `lidlProduct()` — `GET / POST /v2/lidl/product`. */
export interface LidlProductParams {
  /** Lidl product URL or ERP id. */
  query: string;
  /** Target country when query is an ERP id only (default: fr). Ignored for full product URLs. */
  region?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `lidlSearch()` — `GET / POST /v2/lidl/search`. */
export interface LidlSearchParams {
  /** Search keyword or full Lidl search URL. */
  query: string;
  /** Target country when query is a keyword (default: fr). */
  region?: string | undefined;
  /** 1-based page number (default: 1). Lidl paginates by offset (48 items per page). */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinCompanyInfo()` — `GET / POST /v2/linkedin/company/info`. */
export interface LinkedinCompanyInfoParams {
  /** LinkedIn company identifier when you already know the page. */
  query?: string | undefined;
  /** Company website domain for reverse lookup when you do not have the LinkedIn URL. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinJobCount()` — `GET / POST /v2/linkedin/job/count`. */
export interface LinkedinJobCountParams {
  /** Job title or keyword to count matching postings. */
  keyword?: string | undefined;
  /** Filter by seniority level. */
  experience_level?: string | undefined;
  /** Filter by employment type. */
  job_type?: string | undefined;
  /** Filter by posting recency. */
  when?: string | undefined;
  /** Filter by work arrangement. */
  flexibility?: string | undefined;
  /** Maximum distance radius (in miles) from the target location (requires geo_id). */
  distance?: number | undefined;
  /** LinkedIn geo ID of the target location. */
  geo_id?: string | undefined;
  /** LinkedIn numeric company ID to restrict the count to jobs posted by a specific company. */
  company_id?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinJobInfo()` — `GET / POST /v2/linkedin/job/info`. */
export interface LinkedinJobInfoParams {
  /** The LinkedIn job posting to retrieve. Accepts a numeric job ID or a full job posting URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinJobSearch()` — `GET / POST /v2/linkedin/job/search`. */
export interface LinkedinJobSearchParams {
  /** Job title or keyword to search for. */
  keyword?: string | undefined;
  /** Filter by seniority level. */
  experience_level?: string | undefined;
  /** Filter by employment type. */
  job_type?: string | undefined;
  /** Filter by posting date recency. */
  when?: string | undefined;
  /** Filter by work arrangement. */
  flexibility?: string | undefined;
  /** Maximum radius in miles from the target location (requires geo_id). */
  distance?: number | undefined;
  /** LinkedIn geo ID for the target location. Default is 92000000 (worldwide). Default: `"92000000"`. */
  geo_id?: string | undefined;
  /** LinkedIn numeric company ID to filter results to jobs posted by a specific company. */
  company_id?: string | undefined;
  /** Page number for paginating through results. Default is 1. Each page returns up to 25 job listings. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinJobSuggest()` — `GET / POST /v2/linkedin/job/suggest`. */
export interface LinkedinJobSuggestParams {
  /** The keyword prefix to search for job title suggestions or location names. */
  query: string;
  /** Set to true to receive location (geo) suggestions instead of keyword suggestions. Default: `false`. */
  location?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinPostInfo()` — `GET / POST /v2/linkedin/post/info`. */
export interface LinkedinPostInfoParams {
  /** The LinkedIn post to retrieve. Accepts a numeric post ID or a full post URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinProductInfo()` — `GET / POST /v2/linkedin/product/info`. */
export interface LinkedinProductInfoParams {
  /** The full LinkedIn product page URL to retrieve. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinProfileInfo()` — `GET / POST /v2/linkedin/profile/info`. */
export interface LinkedinProfileInfoParams {
  /** The LinkedIn profile to retrieve. Accepts a username, full profile URL, or numeric member ID. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinadlibraryAd()` — `GET / POST /v2/linkedinadlibrary/ad`. */
export interface LinkedinadlibraryAdParams {
  /** Ad id or detail URL from search. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `linkedinadlibrarySearch()` — `GET / POST /v2/linkedinadlibrary/search`. */
export interface LinkedinadlibrarySearchParams {
  /** Full LinkedIn Ad Library search URL, or a keyword when account_owner is empty. */
  query?: string | undefined;
  /** Advertiser / company name filter (accountOwner). */
  account_owner?: string | undefined;
  /** Keyword filter on ad copy. */
  keyword?: string | undefined;
  /** Comma-separated ISO country codes, or ALL. */
  countries?: string | undefined;
  /** Date window: last-30-days, current-month, current-year, last-year, custom-date-range. */
  date_option?: string | undefined;
  /** Start date YYYY-MM-DD when date_option=custom-date-range. */
  start_date?: string | undefined;
  /** End date YYYY-MM-DD when date_option=custom-date-range. */
  end_date?: string | undefined;
  /** Opaque cursor from pagination.cursor / pagination.next. */
  cursor?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `loopnetProperty()` — `GET / POST /v2/loopnet/property`. */
export interface LoopnetPropertyParams {
  /** Required. LoopNet listing URL from search, for example https://www.loopnet.com/Listing/484-Amsterdam-Ave-New-York-NY/31379002/. A keyword is rejected. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `loopnetSearch()` — `GET / POST /v2/loopnet/search`. */
export interface LoopnetSearchParams {
  /** Required. City and state, for example New York, NY, or a LoopNet search URL such as https://www.loopnet.com/search/commercial-real-estate/new-york-ny/for-sale/. A listing URL is rejected. */
  query: string;
  /** Optional. Page number starting at 1. Example: 2. Omitted means page 1. A page already present in a search URL is kept when this is omitted or 1. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `maerskTracking()` — `GET / POST /v2/maersk/tracking`. */
export interface MaerskTrackingParams {
  /** Container / BOL tracking number, or full Maersk tracking URL. */
  query: string;
  /** When true, return the rendered HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `manomanoProduct()` — `GET / POST /v2/manomano/product`. */
export interface ManomanoProductParams {
  /** Full ManoMano product page URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `manomanoProductOffer()` — `GET / POST /v2/manomano/product/offer`. */
export interface ManomanoProductOfferParams {
  /** Numeric ManoMano product id from the product endpoint. */
  query: string;
  /** ManoMano country. FR, GB, DE, ES, or IT. Default FR. Default: `"FR"`. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `manomanoSearch()` — `GET / POST /v2/manomano/search`. */
export interface ManomanoSearchParams {
  /** ManoMano category URL or keyword. A keyword is opened on manomano.fr. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mascusAd()` — `GET / POST /v2/mascus/ad`. */
export interface MascusAdParams {
  /** Full Mascus listing URL. Usually taken from results[].url in search. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mascusSearch()` — `GET / POST /v2/mascus/search`. */
export interface MascusSearchParams {
  /** Full Mascus category or search URL. The country site comes from the host (mascus.be, mascus.nl, mascus.de, mascus.com, …). */
  query: string;
  /** Page number (default: 1). About 40 results per page. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mediamarktProduct()` — `GET / POST /v2/mediamarkt/product`. */
export interface MediamarktProductParams {
  /** Product URL or article id.  https://www.mediamarkt.ch/fr/product/_apple-iphone-15-2203371.html */
  query: string;
  /** Shop code when query is an article id. Example: ch-fr. Default ch-fr. */
  region?: string | undefined;
  /** When true, return raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mediamarktSearch()` — `GET / POST /v2/mediamarkt/search`. */
export interface MediamarktSearchParams {
  /** Keyword or MediaMarkt URL. Example: iphone */
  query: string;
  /** Shop code. Example: ch-fr or de. Default ch-fr. Ignored when query is a full URL. */
  region?: string | undefined;
  /** Page number from 1. Example: 1 */
  page?: number | undefined;
  /** When true, return raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `micromaniaProduct()` — `GET / POST /v2/micromania/product`. */
export interface MicromaniaProductParams {
  /** Product URL or the numeric Micromania id. A keyword or a search URL returns 400. */
  query: string;
  /** When true, returns the raw HTML instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `micromaniaSearch()` — `GET / POST /v2/micromania/search`. */
export interface MicromaniaSearchParams {
  /** Keyword or a Micromania Search-Show URL. A product URL returns 400. */
  query: string;
  /** Page number, from 1. Default is 1. Page 2 is sent as page=2. */
  page?: number | undefined;
  /** When true, returns the raw HTML instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mobileAd()` — `GET / POST /v2/mobile/ad`. */
export interface MobileAdParams {
  /** Mobile ad URL or numeric ad id. */
  query: string;
  /** Language for this ad. The same numeric id stays reachable for fr, es, de, and en. */
  locale?: string | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mobileSearch()` — `GET / POST /v2/mobile/search`. */
export interface MobileSearchParams {
  /** Search URL or make/model code (ms=). */
  query: string;
  /** Locale label for the results. The cars themselves stay the same for de, fr, and en. */
  locale?: string | undefined;
  /** Page number, starting at 1. Same effect as page or pageNumber in the Mobile.de URL. */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `moreleProduct()` — `GET / POST /v2/morele/product`. */
export interface MoreleProductParams {
  /** Morele product URL, or a numeric product id. */
  query: string;
  /** When true, return the raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `moreleSearch()` — `GET / POST /v2/morele/search`. */
export interface MoreleSearchParams {
  /** Keyword or a full Morele search URL. A product URL is rejected. */
  query: string;
  /** Page number starting at 1. Page 2 asks Morele for the next screen of the same search. */
  page?: number | undefined;
  /** When true, return the raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `mrbricolageSuggest()` — `GET / POST /v2/mrbricolage/suggest`. */
export interface MrbricolageSuggestParams {
  /** Search keyword or EAN used to query the Mr.Bricolage live suggest endpoint. Accepts product names, partial titles or numeric identifiers such as EAN barcodes. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `neweggProduct()` — `GET / POST /v2/newegg/product`. */
export interface NeweggProductParams {
  /** Item number, catalog id, or product URL. */
  query: string;
  /** When true, return the raw HTML. The string false stays false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `neweggSearch()` — `GET / POST /v2/newegg/search`. */
export interface NeweggSearchParams {
  /** Keyword or a newegg.com search URL. */
  query: string;
  /** Page number, starting at 1. Example: 2. */
  page?: number | undefined;
  /** When true, return the raw HTML. The string false stays false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `northdataCompany()` — `GET / POST /v2/northdata/company`. */
export interface NorthdataCompanyParams {
  /** Company name, North Data id, or a profile URL. */
  query: string;
  /** ISO alpha-2, used only when query is a name. Same form as search: FR or FR,DE. */
  countries?: string | undefined;
  /** fr (default), com or en, de. Ignored when query is a URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `northdataSearch()` — `GET / POST /v2/northdata/search`. */
export interface NorthdataSearchParams {
  /** Company or person name, or a North Data suggest URL. */
  query: string;
  /** ISO alpha-2 codes, separated by comma, pipe or space (FR or FR,DE). Empty searches every country. A URL that already has countries wins. */
  countries?: string | undefined;
  /** Host of a name: fr (default), com or en, de. Ignored when query is a URL. Default: `"fr"`. */
  domain?: string | undefined;
  /** Only 1. Below 1 returns 400. Above 1 returns 404. At most 15 rows. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `npiProvider()` — `GET / POST /v2/npi/provider`. */
export interface NpiProviderParams {
  /** Required. 10-digit NPI, example 1972813608, or a provider-view URL such as https://npiregistry.cms.hhs.gov/provider-view/1972813608. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `npiSearch()` — `GET / POST /v2/npi/search`. */
export interface NpiSearchParams {
  /** Optional when another criterion is set. Example: Anthony Fauci. Also a 10-digit NPI such as 1972813608, or an NPPES search URL. With enumeration_type=NPI-2 this text is the organization name, for example Mayo Clinic. A provider-view URL is rejected here. */
  query?: string | undefined;
  /** Optional. Example: Anthony. Used as the given name when you do not want query to be split. */
  first_name?: string | undefined;
  /** Optional. Example: Fauci. A single-word query such as Smith is used as the last name. */
  last_name?: string | undefined;
  /** Optional. Example: Mayo Clinic. You can also pass that name in query with enumeration_type=NPI-2. */
  organization_name?: string | undefined;
  /** Optional. Practice city. Example: Washington. */
  city?: string | undefined;
  /** Optional. Two-letter state code. Example: DC. Any other value is rejected. */
  state?: string | undefined;
  /** Optional. Postal code. Example: 20016. */
  postal_code?: string | undefined;
  /** Optional. Taxonomy description. Example: Internal Medicine. */
  taxonomy?: string | undefined;
  /** Optional. NPI-1 for a person or NPI-2 for an organization. Example: NPI-2. NPI-2 treats a text query as an organization name. */
  enumeration_type?: string | undefined;
  /** Optional. Page number, starting at 1. Example: 2. Defaults to 1. */
  page?: number | undefined;
  /** Optional. Page size. Example: 10. Defaults to 10 and cannot exceed 200. next is a URL only when the page contains this many rows. */
  limit?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `oceanioSearch()` — `GET / POST /v2/oceanio/search`. */
export interface OceanioSearchParams {
  /** Domain or company name. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `olxAd()` — `GET / POST /v2/olx/ad`. */
export interface OlxAdParams {
  /** OLX listing URL. */
  query: string;
  /** Ignored when query is a full URL. The host selects the country. */
  region?: string | undefined;
  /** When true, return raw HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `olxProduct()` — `GET / POST /v2/olx/product`. */
export interface OlxProductParams {
  /** Full URL of the OLX listing page to retrieve. Must be a valid olx.com.br listing URL. Example 1: */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `olxSearch()` — `GET / POST /v2/olx/search`. */
export interface OlxSearchParams {
  /** Search keyword or phrase, as you would type it in the OLX search bar. Supports Portuguese terms for Brazilian inventory. */
  query: string;
  /** OLX category slug to restrict results to a specific vertical. Common values: */
  category?: string | undefined;
  /** Brazilian state abbreviation to filter results geographically. */
  state?: string | undefined;
  /** City slug to narrow results to a specific municipality. Use lowercase with hyphens. */
  city?: string | undefined;
  /** Minimum listing price in BRL. */
  min_price?: number | undefined;
  /** Maximum listing price in BRL. */
  max_price?: number | undefined;
  /** Filter by seller type. */
  seller_type?: string | undefined;
  /** Sort order for results. Default: `"relevance"`. */
  sort?: string | undefined;
  /** Page number for paginated results. Default: 1. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `oscaroProduct()` — `GET / POST /v2/oscaro/product`. */
export interface OscaroProductParams {
  /** Oscaro product page URL (*-{sku}-p suffix). */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `oscaroSearch()` — `GET / POST /v2/oscaro/search`. */
export interface OscaroSearchParams {
  /** Search keyword, search URL, or category listing URL (*-{id}-g). */
  query: string;
  /** Target shop when query is a keyword (default: com). */
  region?: string | undefined;
  /** 1-based page number override for category listing URLs (default: read from URL or 1). Uses ?page=2 on *-g pages. */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ovokoAd()` — `GET / POST /v2/ovoko/ad`. */
export interface OvokoAdParams {
  /** Full Ovoko listing URL. The last path segment must be a SKU slug (example: qbb17557-95c827460c-porsche-macan-...) or a known product prefix. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ovokoSearch()` — `GET / POST /v2/ovoko/search`. */
export interface OvokoSearchParams {
  /** Full Ovoko search URL. Only search pages are accepted (not category, catalog, or offer pages). */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `owlerCompanyInfo()` — `GET / POST /v2/owler/company/info`. */
export interface OwlerCompanyInfoParams {
  /** The company to look up on Owler. Multiple formats are accepted: */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `owlerSearch()` — `GET / POST /v2/owler/search`. */
export interface OwlerSearchParams {
  /** The company name or keyword to search for on Owler. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pagesjaunesPageInfo()` — `GET / POST /v2/pagesjaunes/page/info`. */
export interface PagesjaunesPageInfoParams {
  /** A PagesJaunes business page URL or business ID. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pagesjaunesSearch()` — `GET / POST /v2/pagesjaunes/search`. */
export interface PagesjaunesSearchParams {
  /** A valid PagesJaunes search URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `patreonProfileInfo()` — `GET / POST /v2/patreon/profile/info`. */
export interface PatreonProfileInfoParams {
  /** Patreon profile URL or creator vanity name. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `patreonSearch()` — `GET / POST /v2/patreon/search`. */
export interface PatreonSearchParams {
  /** Search keyword to find Patreon creators. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `petsmartProduct()` — `GET / POST /v2/petsmart/product`. */
export interface PetsmartProductParams {
  /** A PetSmart product link. */
  query: string;
  /** Set to true to get the raw HTML in result instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `petsmartSearch()` — `GET / POST /v2/petsmart/search`. */
export interface PetsmartSearchParams {
  /** What to look for. A word, or a PetSmart search link. */
  query: string;
  /** Which page of results, starting at 1. Page 2 returns a different set of products. */
  page?: number | undefined;
  /** Set to true to get the raw HTML in result instead of the parsed JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `picardProduct()` — `GET / POST /v2/picard/product`. */
export interface PicardProductParams {
  /** Picard product URL or numeric reference. */
  query: string;
  /** When true, return the raw HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `picardSearch()` — `GET / POST /v2/picard/search`. */
export interface PicardSearchParams {
  /** Search keyword or full Picard search URL. */
  query: string;
  /** 1-based page number (24 results per page via SFCC Search-UpdateGrid). Default: 1. */
  page?: number | undefined;
  /** When true, return the raw HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pinterestUserInfo()` — `GET / POST /v2/pinterest/user/info`. */
export interface PinterestUserInfoParams {
  /** The Pinterest profile to retrieve. Accepts a full profile URL or a username. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pitchbookCompanyInfo()` — `GET / POST /v2/pitchbook/company/info`. */
export interface PitchbookCompanyInfoParams {
  /** PitchBook company id or company profile URL. */
  query: string;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pitchbookSearch()` — `GET / POST /v2/pitchbook/search`. */
export interface PitchbookSearchParams {
  /** Keyword or PitchBook search URL. */
  query: string;
  /** Page number for content search (/search?q=...). */
  page?: string | undefined;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pointpProduct()` — `GET / POST /v2/pointp/product`. */
export interface PointpProductParams {
  /** Full Point.P product page URL (/p/...-A{id}). */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of parsed JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `pointpSearch()` — `GET / POST /v2/pointp/search`. */
export interface PointpSearchParams {
  /** Search keyword or full Point.P search results URL. */
  query: string;
  /** 1-based page number for pagination. Overrides the page inferred from the URL. Defaults to 1 when omitted. */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `prnewswireArticle()` — `GET / POST /v2/prnewswire/article`. */
export interface PrnewswireArticleParams {
  /** Required. PR Newswire release URL, for example https://www.prnewswire.com/news-releases/pumpkin-awarded-11-000-in-donations-to-veterinary-clinics-for-cost-of-care-education-302924942.html. A keyword is rejected. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `prnewswireSearch()` — `GET / POST /v2/prnewswire/search`. */
export interface PrnewswireSearchParams {
  /** Required. Keyword, for example apple, or a PR Newswire news-search URL such as https://www.prnewswire.com/search/news/?keyword=apple. A release URL is rejected. */
  query: string;
  /** Optional. Page number starting at 1. Example: 2. Omitted means page 1. A page already present in a search URL is kept when this is omitted or 1. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `producthuntProductInfo()` — `GET / POST /v2/producthunt/product/info`. */
export interface ProducthuntProductInfoParams {
  /** A ProductHunt product URL or product slug. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `proshopProduct()` — `GET / POST /v2/proshop/product`. */
export interface ProshopProductParams {
  /** Proshop product id, or a product URL. The id is the last path segment. */
  query: string;
  /** When true, return the raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `proshopSearch()` — `GET / POST /v2/proshop/search`. */
export interface ProshopSearchParams {
  /** Keyword or a full Proshop search URL with s=. A product URL is rejected. */
  query: string;
  /** Page number starting at 1. Proshop sends this as pn. */
  page?: number | undefined;
  /** When true, return the raw HTML as {"result": "..."}. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rappiProduct()` — `GET / POST /v2/rappi/product`. */
export interface RappiProductParams {
  /** Required. Product URL on rappi.com.mx, example https://www.rappi.com.mx/p/santa-clara-leche-deslactosada-semidescremada-1-l-14069, or a numeric master id such as 14069. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rappiSearch()` — `GET / POST /v2/rappi/search`. */
export interface RappiSearchParams {
  /** Required. Keyword, example leche, or a rappi.com.mx search URL such as https://www.rappi.com.mx/search?query=leche. A product URL or another country host is rejected. */
  query: string;
  /** Optional. Only page 1 returns rows. Example: 1. Defaults to 1. Page 2 is rejected because the payload has no next page. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ratemyprofessorsProfessor()` — `GET / POST /v2/ratemyprofessors/professor`. */
export interface RatemyprofessorsProfessorParams {
  /** Required. The numeric professor id from search, or a /professor/{id} URL. A name is not accepted. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ratemyprofessorsSearch()` — `GET / POST /v2/ratemyprofessors/search`. */
export interface RatemyprofessorsSearchParams {
  /** Required. A professor name, or a Rate My Professors search URL whose path contains /search/professors or whose query contains q=. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `realestatecomauSearch()` — `GET / POST /v2/realestatecomau/search`. */
export interface RealestatecomauSearchParams {
  /** Place or a realestate.com.au results URL. */
  query: string;
  /** buy, rent, or sold. Used when query is a place. */
  channel?: string | undefined;
  /** Page from 1. Default: `1`. */
  page?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `realtorProperty()` — `GET / POST /v2/realtor/property`. */
export interface RealtorPropertyParams {
  /** Full Realtor.com property detail URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `realtorSearch()` — `GET / POST /v2/realtor/search`. */
export interface RealtorSearchParams {
  /** Full Realtor.com search results URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `redfinProperty()` — `GET / POST /v2/redfin/property`. */
export interface RedfinPropertyParams {
  /** Redfin home link. Use the url returned by search. */
  query: string;
  /** Market id. Required only when the home link does not already include region_id. */
  region_id?: number | undefined;
  /** Required with region_id when the home link has no region_type. */
  region_type?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `redfinSearch()` — `GET / POST /v2/redfin/search`. */
export interface RedfinSearchParams {
  /** Redfin for-sale link for a city, neighborhood, or county. */
  query: string;
  /** Page of the for-sale feed, from 1. */
  page?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `reicheltProduct()` — `GET / POST /v2/reichelt/product`. */
export interface ReicheltProductParams {
  /** A reichelt.de or reichelt.com product link. A search link returns 400. */
  query: string;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `reicheltSearch()` — `GET / POST /v2/reichelt/search`. */
export interface ReicheltSearchParams {
  /** What to look for. A word such as 1n4148, or a reichelt.de search or category link. A product link returns 400. */
  query: string;
  /** Page number, starting at 1. Page 2 is PAGE=1 on the shop. */
  page?: number | undefined;
  /** Set to true to get the raw HTML in result. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `reverbProduct()` — `GET / POST /v2/reverb/product`. */
export interface ReverbProductParams {
  /** Reverb listing URL or numeric listing id. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `reverbSearch()` — `GET / POST /v2/reverb/search`. */
export interface ReverbSearchParams {
  /** Search keyword, query string, or full Reverb marketplace URL. */
  query: string;
  /** 1-based page number override (default: read from URL or 1). */
  page?: number | undefined;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rexelProduct()` — `GET / POST /v2/rexel/product`. */
export interface RexelProductParams {
  /** Rexel France product URL containing /p/{id}. */
  query: string;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rexelSearch()` — `GET / POST /v2/rexel/search`. */
export interface RexelSearchParams {
  /** Keyword, EAN, or Rexel France search URL. */
  query: string;
  /** Page number (1-based). Page 1 omits page in the URL. */
  page?: string | undefined;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rightmoveProperty()` — `GET / POST /v2/rightmove/property`. */
export interface RightmovePropertyParams {
  /** Rightmove property URL or the numeric id. */
  query: string;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rightmoveSearch()` — `GET / POST /v2/rightmove/search`. */
export interface RightmoveSearchParams {
  /** UK place name or a Rightmove search URL. */
  query: string;
  /** Results page, from 1. */
  page?: number | undefined;
  /** Optional. Default false. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rsonlineProduct()` — `GET / POST /v2/rsonline/product`. */
export interface RsonlineProductParams {
  /** A uk.rs-online.com product link. The response is one flat product. price is the numeric pound amount and price_display is the printed string. A search link, a bare stock number, or another host returns 400. */
  query: string;
  /** Default false. true replaces the product object with result, the rendered HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `rsonlineSearch()` — `GET / POST /v2/rsonline/search`. */
export interface RsonlineSearchParams {
  /** A keyword, or a uk.rs-online.com search or category link. Empty, another host, or a product link returns 400. A keyword builds /web/c/?searchTerm=... and page 1 omits pn. Each card has price as a number and price_display as the pound string. */
  query: string;
  /** Page number starting at 1. Omit it for page 1. Page 2 sets pn=2, changes pagination.page, and returns the next cards. pagination.next is that next URL, or null on the last page. A value below 1 returns 400. */
  page?: number | undefined;
  /** Default false. true replaces results and pagination with result, the rendered HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `seekJob()` — `GET / POST /v2/seek/job`. */
export interface SeekJobParams {
  /** Required. SEEK job URL or numeric id, for example 95568355 or https://www.seek.com.au/job/95568355. A keyword is rejected. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `seekSearch()` — `GET / POST /v2/seek/search`. */
export interface SeekSearchParams {
  /** Required. Job keyword, for example nurse, or a SEEK results URL such as https://www.seek.com.au/nurse-jobs. A /job/<id> URL is rejected. */
  query: string;
  /** Optional. Page number starting at 1. Example: 2. Omitted means page 1. A page already present in a results URL is kept when this is omitted or 1. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `selogerAgency()` — `GET / POST /v2/seloger/agency`. */
export interface SelogerAgencyParams {
  /** A valid SeLoger agency profile URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `selogerAgencyRent()` — `GET / POST /v2/seloger/agency/rent`. */
export interface SelogerAgencyRentParams {
  /** A valid SeLoger agency ID. */
  query: string;
  /** Page number for paginating through the agency's rental listings. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `selogerAgencySale()` — `GET / POST /v2/seloger/agency/sale`. */
export interface SelogerAgencySaleParams {
  /** A valid SeLoger agency ID. */
  query: string;
  /** Page number for paginating through the agency's sale listings. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `selogerProperty()` — `GET / POST /v2/seloger/property`. */
export interface SelogerPropertyParams {
  /** A valid SeLoger property listing URL. */
  query: string;
  /** Whether to return the raw HTML source of the property page instead of parsed JSON data. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `selogerSearch()` — `GET / POST /v2/seloger/search`. */
export interface SelogerSearchParams {
  /** A valid SeLoger search results URL. Any SeLoger search page URL with filters is supported: location, property type, price range, surface, and number of rooms can all be embedded in the URL. */
  query: string;
  /** Whether to return the raw HTML source of the search results page instead of parsed JSON data. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `sephoraProduct()` — `GET / POST /v2/sephora/product`. */
export interface SephoraProductParams {
  /** A Sephora product URL. A product id such as 831955 also works.  https://www.sephora.fr/p/midnight-espresso---eau-de-parfum-au-cafe-831955.html */
  query: string;
  /** Shop when query is only an id. Use fr for France or de for Germany. Leave empty for France. */
  region?: string | undefined;
  /** Return the rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `sephoraSearch()` — `GET / POST /v2/sephora/search`. */
export interface SephoraSearchParams {
  /** A product word, for example mascara. Or paste a full Sephora search URL. */
  query: string;
  /** Shop code. Use fr for France or de for Germany. Leave empty for France. A full URL picks the shop. */
  region?: string | undefined;
  /** Page number, starting at 1. Use 2 for the next page of products. */
  page?: number | undefined;
  /** Return the rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `shophouzzProduct()` — `GET / POST /v2/shophouzz/product`. */
export interface ShophouzzProductParams {
  /** Full URL of the Shophouzz product page to retrieve details for. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `shopifyApps()` — `GET / POST /v2/shopify/apps`. */
export interface ShopifyAppsParams {
  /** URL of the Shopify App Store listing to scrape. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `shopifyCatalog()` — `GET / POST /v2/shopify/catalog`. */
export interface ShopifyCatalogParams {
  /** Shop domain or a URL on that shop. */
  query: string;
  /** Page number, starting at 1. */
  page?: number | undefined;
  /** How many items to return on this page. */
  limit?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `shopifyCollections()` — `GET / POST /v2/shopify/collections`. */
export interface ShopifyCollectionsParams {
  /** Shop domain or a URL on that shop. */
  query: string;
  /** Page number, starting at 1. */
  page?: number | undefined;
  /** How many items to return on this page. */
  limit?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `shopifyProduct()` — `GET / POST /v2/shopify/product`. */
export interface ShopifyProductParams {
  /** URL of a Shopify product page to scrape. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `similarwebDomain()` — `GET / POST /v2/similarweb/domain`. */
export interface SimilarwebDomainParams {
  /** A domain name to retrieve traffic and engagement metrics for. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `similarwebSearch()` — `GET / POST /v2/similarweb/search`. */
export interface SimilarwebSearchParams {
  /** Domain name or keyword to search for in the Similarweb database. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `snapedaProduct()` — `GET / POST /v2/snapeda/product`. */
export interface SnapedaProductParams {
  /** SnapEDA part page URL or MPN/manufacturer slug. */
  query: string;
  /** When true, return the raw rendered HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `snapedaSearch()` — `GET / POST /v2/snapeda/search`. */
export interface SnapedaSearchParams {
  /** Search keyword or full SnapEDA / SnapMagic search URL. */
  query: string;
  /** 1-based page number override (default: read from URL or 1). SnapEDA returns 20 results per page. */
  page?: number | undefined;
  /** When true, return the raw rendered HTML as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `starbucksMenu()` — `GET / POST /v2/starbucks/menu`. */
export interface StarbucksMenuParams {
  /** Café number from Search, short (9230) or full (9230-154245). */
  store_number?: string | undefined;
  /** Same café number, or a menu URL that contains storeNumber. Used when store_number is empty. */
  query?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `starbucksProduct()` — `GET / POST /v2/starbucks/product`. */
export interface StarbucksProductParams {
  /** Product and form, or a Starbucks product URL. */
  query: string;
  /** Café number from Search, short (9230) or full (9230-154245). Required when the product URL has no storeNumber. */
  store_number?: string | undefined;
  /** Form when query is only a product number. Usually hot or iced. */
  form_code?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `starbucksSearch()` — `GET / POST /v2/starbucks/search`. */
export interface StarbucksSearchParams {
  /** Store-locator URL, or a lat,lng pair. Required when lat and lng are empty. */
  query?: string | undefined;
  /** Latitude. Send it with lng. If both are set, they replace any coordinates found in query. */
  lat?: number | undefined;
  /** Longitude. Send it with lat. */
  lng?: number | undefined;
  /** Optional place label sent with the coordinates, for example New York, NY. Coordinates are still required. */
  place?: string | undefined;
  /** Optional amenity filter. Separate codes with commas. ON keeps cafés that offer mobile order. */
  features?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `stats()` — `GET /v2/stats`. */
export interface StatsParams {
  /** API family to check, for example website. Provide at least engine or path. */
  engine?: string | undefined;
  /** Specific endpoint to check, for example /v2/website/crawler. If you also pass engine, use an endpoint from that API. */
  path?: string | undefined;
}

/** Parameters for `stockxProduct()` — `GET / POST /v2/stockx/product`. */
export interface StockxProductParams {
  /** A StockX product slug. */
  query: string;
  /** Country code for localized pricing and availability. Default: `"US"`. */
  country?: string | undefined;
  /** Currency code for price display. Default: `"USD"`. */
  currency?: string | undefined;
  /** Language code for localized content. Default: `"en-US"`. */
  language?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `stockxSearch()` — `GET / POST /v2/stockx/search`. */
export interface StockxSearchParams {
  /** Search query for StockX products. Can be a product name, brand, SKU, or slug. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `stockxTrends()` — `GET / POST /v2/stockx/trends`. */
export interface StockxTrendsParams {
  /** StockX product category to retrieve trending items for. */
  query: string;
  /** Sort order for trending results. Default: `"featured"`. */
  sort_by?: string | undefined;
  /** Country code for localized trending data. Default: `"US"`. */
  country?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `stubhubEvent()` — `GET / POST /v2/stubhub/event`. */
export interface StubhubEventParams {
  /** Required. StubHub event URL or numeric id, for example 162387399 or https://www.stubhub.com/harlem-globetrotters-marseille-tickets-3-31-2027/event/162387399/. A keyword is rejected. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `stubhubSearch()` — `GET / POST /v2/stubhub/search`. */
export interface StubhubSearchParams {
  /** Required. Keyword, for example nba, or a StubHub search URL such as https://www.stubhub.com/secure/search/?q=nba. An event URL is rejected. */
  query: string;
  /** Optional. Only page 1 returns events. Example: 1. Page 2 and above return 404 because the search document has no further page. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `targetProduct()` — `GET / POST /v2/target/product`. */
export interface TargetProductParams {
  /** Target product URL or bare TCIN. */
  query: string;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `targetSearch()` — `GET / POST /v2/target/search`. */
export interface TargetSearchParams {
  /** Keyword or Target search URL. */
  query: string;
  /** Page number (1-based). */
  page?: string | undefined;
  /** When true, return rendered HTML instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tdlrLicense()` — `GET / POST /v2/tdlr/license`. */
export interface TdlrLicenseParams {
  /** Required. Detail id, example AIRREF00000564, or the SearchResultDetail URL from search. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tdlrSearch()` — `GET / POST /v2/tdlr/search`. */
export interface TdlrSearchParams {
  /** Optional when city, county, or postal_code is set. Person or business name, example SMITH. A detail URL is rejected. */
  query?: string | undefined;
  /** Optional on the request, required for a useful search. License type code, example AIRREF for air conditioning contractors. ALL or blank searches every type. */
  license_type?: string | undefined;
  /** Optional. Business city. Example: Austin. One of query, city, county, or postal_code is required. */
  city?: string | undefined;
  /** Optional. Business county. Example: TRAVIS. */
  county?: string | undefined;
  /** Optional. Business ZIP. Example: 78701. */
  postal_code?: string | undefined;
  /** Optional. Page number starting at 1. Example: 2. Defaults to 1. Each page has 25 rows. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tedNotice()` — `GET / POST /v2/ted/notice`. */
export interface TedNoticeParams {
  /** Publication number, or a TED notice URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tedSearch()` — `GET / POST /v2/ted/search`. */
export interface TedSearchParams {
  /** Keyword, publication number, or a TED search URL. */
  query?: string | undefined;
  /** Notice code such as cn-standard or can-standard. Combined with AND. */
  notice_type?: string | undefined;
  /** Buyer country, ISO alpha-2 or alpha-3. FR becomes FRA. A country name returns 400. */
  country?: string | undefined;
  /** Place of performance: country code or NUTS code such as FRK24. */
  place?: string | undefined;
  /** CPV code or prefix. Digits and an optional star, for example 72000000 or 30*. */
  cpv?: string | undefined;
  /** Buyer name, matched as a phrase. */
  buyer?: string | undefined;
  /** Page from 1. next is always null: pass page + 1. A page past the last one returns 404. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `thaliaProduct()` — `GET / POST /v2/thalia/product`. */
export interface ThaliaProductParams {
  /** Product URL or Thalia article id. */
  query: string;
  /** When true, returns {"result": "<html>..."} instead of the parsed JSON. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `thaliaSearch()` — `GET / POST /v2/thalia/search`. */
export interface ThaliaSearchParams {
  /** Keyword or a thalia.de search URL (/suche or a category URL). A product URL returns 400. */
  query: string;
  /** Page number, from 1. Sent to Thalia as the query parameter p. Default 1. */
  page?: number | undefined;
  /** When true, returns {"result": "<html>..."} instead of the parsed JSON. Default false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `theforkRestaurant()` — `GET / POST /v2/thefork/restaurant`. */
export interface TheforkRestaurantParams {
  /** Full TheFork restaurant page URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `theforkSearch()` — `GET / POST /v2/thefork/search`. */
export interface TheforkSearchParams {
  /** Full TheFork search or city listing URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `thomasnetCompany()` — `GET / POST /v2/thomasnet/company`. */
export interface ThomasnetCompanyParams {
  /** Full Thomasnet company profile URL from your browser. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `thomasnetSearch()` — `GET / POST /v2/thomasnet/search`. */
export interface ThomasnetSearchParams {
  /** Full Thomasnet search URL from your browser. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ticketmasterEvent()` — `GET / POST /v2/ticketmaster/event`. */
export interface TicketmasterEventParams {
  /** Required. Slugged event URL, example https://www.ticketmaster.com/suns-vs-jazz-kids-day-phoenix-arizona-01-24-2027/event/19006507A7257EEA. A short /event/{discoveryId} link has no slug and cannot be resolved. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `ticketmasterSearch()` — `GET / POST /v2/ticketmaster/search`. */
export interface TicketmasterSearchParams {
  /** Required. Keyword, example jazz, or a ticketmaster.com search URL such as https://www.ticketmaster.com/search?q=jazz. An event URL is rejected. */
  query: string;
  /** Optional. Page number starting at 1. Example: 2. Defaults to 1. On ticketmaster.com the page query is zero-based, so API page 2 is page=1 on the site. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tiktoktopadsAd()` — `GET / POST /v2/tiktoktopads/ad`. */
export interface TiktoktopadsAdParams {
  /** Ad id or detail URL from search. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tiktoktopadsSearch()` — `GET / POST /v2/tiktoktopads/search`. */
export interface TiktoktopadsSearchParams {
  /** Full TikTok Top Ads search URL, or a keyword. */
  query?: string | undefined;
  /** Brand or product keyword. */
  keyword?: string | undefined;
  /** ISO country code (country_code). */
  region?: string | undefined;
  /** Campaign objective id (URL param object). */
  objective?: string | undefined;
  /** Lookback window: 7, 30, or 180. Default: `"30"`. */
  period?: string | undefined;
  /** Sort: for_you, reach/impression, ctr/like. */
  order_by?: string | undefined;
  /** Industry key filter. */
  industry?: string | undefined;
  /** Page number. */
  page?: number | undefined;
  /** Page size (max 20). */
  per_page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tradeaplaneListing()` — `GET / POST /v2/tradeaplane/listing`. */
export interface TradeaplaneListingParams {
  /** Listing URL that includes listing_id. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `tradeaplaneSearch()` — `GET / POST /v2/tradeaplane/search`. */
export interface TradeaplaneSearchParams {
  /** Keyword, or a Trade-A-Plane search URL without listing_id. */
  query: string;
  /** aircraft or engine when query is a keyword. Ignored when query is a URL. */
  listing_type?: string | undefined;
  /** Page from 1. Sent as s-page. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `trustpilotCompanyInfo()` — `GET / POST /v2/trustpilot/company/info`. */
export interface TrustpilotCompanyInfoParams {
  /** A Trustpilot company URL or domain name. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `untappdBeer()` — `GET / POST /v2/untappd/beer`. */
export interface UntappdBeerParams {
  /** Required. The numeric Untappd beer id from search, or a beer URL under /b/ or /beer/. A keyword is not accepted. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `untappdSearch()` — `GET / POST /v2/untappd/search`. */
export interface UntappdSearchParams {
  /** Required. A beer keyword, or an Untappd search URL whose path is /search. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `upworkFreelancer()` — `GET / POST /v2/upwork/freelancer`. */
export interface UpworkFreelancerParams {
  /** Upwork freelancer profile ID, username, or full profile URL. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `upworkJobs()` — `GET / POST /v2/upwork/jobs`. */
export interface UpworkJobsParams {
  /** Upwork skill slug or full freelance-jobs URL. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `upworkServices()` — `GET / POST /v2/upwork/services`. */
export interface UpworkServicesParams {
  /** Upwork Project Catalog category slug or full services URL. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `upworkServicesInfo()` — `GET / POST /v2/upwork/services/info`. */
export interface UpworkServicesInfoParams {
  /** Full Upwork Project Catalog product URL. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `usaspendingAward()` — `GET / POST /v2/usaspending/award`. */
export interface UsaspendingAwardParams {
  /** Required. Generated award id or a usaspending.gov/award URL. Example: CONT_AWD_GSFC0198106DNAS526555_8000_-NONE-_-NONE-. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `usaspendingSearch()` — `GET / POST /v2/usaspending/search`. */
export interface UsaspendingSearchParams {
  /** Required. Keyword or a usaspending.gov search URL. Example: software. An award URL returns 400. */
  query: string;
  /** Optional. One group: contract (default when omitted), grant, idv, or loan. Example: grant. */
  award_type?: string | undefined;
  /** Optional. Page number from 1. Example: 2. Defaults to 1. Each page has 10 awards. total_results stays null. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vestiairecollectiveProduct()` — `GET / POST /v2/vestiairecollective/product`. */
export interface VestiairecollectiveProductParams {
  /** A vestiairecollective.com product URL ending in the item id and .shtml. The response is one flat listing. price is the number on the page and price_display is that amount as written. A keyword or a search URL returns 400. */
  query: string;
  /** Default false. true replaces the listing with result, the rendered HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vestiairecollectiveSearch()` — `GET / POST /v2/vestiairecollective/search`. */
export interface VestiairecollectiveSearchParams {
  /** A keyword or a vestiairecollective.com search or category URL. Empty, another host, or a product URL returns 400. A keyword searches www.vestiairecollective.com. A full URL keeps its host. Each card has price as a number and price_display as the label on the card. */
  query: string;
  /** Page number starting at 1. Omit it for page 1, which has no /p-N/ segment. Page 2 requests /p-2/ and sets pagination.page to 2. pagination.next is the next catalog URL, or null on the last page. A value below 1 returns 400. */
  page?: number | undefined;
  /** Default false. true replaces results and pagination with result, the rendered HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vintedItem()` — `GET / POST /v2/vinted/item`. */
export interface VintedItemParams {
  /** Vinted item URL or numeric item ID. */
  query: string;
  /** Force the Vinted domain when query is a bare item ID only. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vintedSearch()` — `GET / POST /v2/vinted/search`. */
export interface VintedSearchParams {
  /** Search keyword or full Vinted catalog URL. Filters from the URL query string are forwarded to the internal Vinted API. */
  query: string;
  /** Page number. Default 1. */
  page?: number | undefined;
  /** Results per page. Default 24. */
  per_page?: number | undefined;
  /** Optional sort order. */
  order?: string | undefined;
  /** Force the Vinted domain when query is a keyword only. */
  region?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vintedUserInfo()` — `GET / POST /v2/vinted/user/info`. */
export interface VintedUserInfoParams {
  /** Vinted member profile URL, direct API URL, or numeric user ID. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vivarealProperty()` — `GET / POST /v2/vivareal/property`. */
export interface VivarealPropertyParams {
  /** Viva Real listing URL under /imovel/ with an id- number. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `vivarealSearch()` — `GET / POST /v2/vivareal/search`. */
export interface VivarealSearchParams {
  /** City, City plus UF, or a Viva Real search URL. */
  query: string;
  /** Sale or rent when query is a city. Default: `"sale"`. */
  operation?: string | undefined;
  /** Optional type when query is a city. */
  property_type?: string | undefined;
  /** Page from 1. Placeholder 2. Viva Real receives this as pagina=2. Page 1 and page 2 return different listings. A few featured ids can repeat. Most ids on page 2 are new. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `walmartProduct()` — `GET / POST /v2/walmart/product`. */
export interface WalmartProductParams {
  /** Full Walmart product page URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `walmartSearch()` — `GET / POST /v2/walmart/search`. */
export interface WalmartSearchParams {
  /** Full Walmart search results URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `walmartSuggest()` — `GET / POST /v2/walmart/suggest`. */
export interface WalmartSuggestParams {
  /** Search keyword for Walmart autocomplete suggestions. */
  query: string;
  /** Optional US ZIP code to localize Walmart store and inventory context for suggestions. */
  zipcode?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteAntibot()` — `GET /v2/website/antibot`. */
export interface WebsiteAntibotParams {
  /** Full URL or domain name to analyze for anti-bot protection. Must be a valid hostname. */
  query: string;
  /** Maximum request timeout in seconds. Defaults to 15. */
  timeout?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteCrawler()` — `GET / POST /v2/website/crawler`. */
export interface WebsiteCrawlerParams {
  /** A public website URL to fetch with the Crawler engine (HTTP only, no JavaScript). Must include http:// or https://. */
  query: string;
  /** Controls whether the crawler should follow HTTP redirects. Default: `true`. */
  allow_redirects?: boolean | undefined;
  /** Controls whether the response returns the raw, unprocessed HTML source of the page. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteEmailPhoneExtractor()` — `GET / POST /v2/website/email_phone_extractor`. */
export interface WebsiteEmailPhoneExtractorParams {
  /** A website URL to crawl for contact information. Must include the http:// or https:// protocol. The crawler will follow internal links ("a" anchors) to find contact details across the site. */
  query: string;
  /** An ISO 3166-1 alpha-2 country code used to improve the accuracy of phone number validation and parsing. */
  country_code?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteRendering()` — `GET / POST /v2/website/rendering`. */
export interface WebsiteRenderingParams {
  /** A public website URL to render in a headless browser. Must include http:// or https://. */
  query: string;
  /** Number of seconds to wait after page load before returning the rendered HTML. Useful for pages with delayed rendering or animations. Default: `0`. */
  wait_in_seconds?: number | undefined;
  /** A CSS or XPath selector to wait for before returning the rendered HTML. The headless browser will hold the response until the specified element appears in the DOM. */
  wait_for?: string | undefined;
  /** Controls whether the headless browser should block ad requests during rendering. Default: `false`. */
  block_ads?: boolean | undefined;
  /** Maximum number of seconds to wait for the page to fully load before returning whatever has been rendered so far. Default: `30`. */
  timeout?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteScreenshot()` — `GET / POST /v2/website/screenshot`. */
export interface WebsiteScreenshotParams {
  /** The URL of the webpage to capture. Examples:  https://www.amazon.com/s?k=pokemon */
  url: string;
  /** The output format of the screenshot. Default: `"png"`. */
  format?: OpenString<"jpeg" | "jpg" | "pdf" | "png" | "webp"> | undefined;
  /** The device type to emulate for the screenshot. */
  device?:
    | OpenString<
        | "galaxy_fold4"
        | "galaxy_s23"
        | "galaxy_s23_ultra"
        | "galaxy_s8"
        | "huawei_mate_50_pro"
        | "huawei_p60_pro"
        | "ipad"
        | "iphone_12"
        | "iphone_13_mini"
        | "iphone_13_pro_max"
        | "iphone_14_pro"
        | "iphone_14_pro_max"
        | "iphone_x"
        | "pixel_5"
        | "pixel_6a"
        | "pixel_7_pro"
        | "redmi_note_11"
        | "redmi_note_12_pro"
      >
    | undefined;
  /** Capture the entire page instead of just the visible viewport. Default: `false`. */
  full_page?: boolean | undefined;
  /** Scroll the page to fully load lazy-loaded elements before capturing a full-page screenshot. Default: `false`. */
  full_page_scroll?: boolean | undefined;
  /** Time in milliseconds for scrolling before capturing the full page. Default: `400`. */
  full_page_scroll_duration?: number | undefined;
  /** The width of the browser viewport in pixels. Default: `1280`. */
  viewport_width?: number | undefined;
  /** The height of the browser viewport in pixels. Default: `1024`. */
  viewport_height?: number | undefined;
  /** The scale factor for high-resolution screenshots. Default: `1`. */
  scale_factor?: number | undefined;
  /** Generate images with custom quality settings. Default: `"80"`. */
  image_quality?: string | undefined;
  /** Capture a specific element on the page instead of the full viewport. */
  selector?: string | undefined;
  /** Cache the response. Default: `false`. */
  cache?: boolean | undefined;
  /** Cache the response for a custom TTL (in seconds). Default: `2592000`. */
  cache_ttl?: number | undefined;
  /** A comma-separated list of elements to hide before capturing (e.g., ads, popups). */
  remove_selectors?: string | undefined;
  /** Automatically remove cookie banners before capturing. Default: `false`. */
  remove_cookie_banners?: boolean | undefined;
  /** Automatically remove ads before capturing. Default: `false`. */
  remove_ads?: boolean | undefined;
  /** Comma-separated list of resource types to block (e.g., “image,stylesheet,font”). */
  block_resources?:
    | OpenString<
        | "document"
        | "eventsource"
        | "fetch"
        | "font"
        | "image"
        | "manifest"
        | "media"
        | "other"
        | "script"
        | "stylesheet"
        | "texttrack"
        | "websocket"
        | "xhr"
      >
    | undefined;
  /** Comma-separated list of URL patterns to block (e.g., “analytics,tracking,advertisement”). */
  block_urls?: string | undefined;
  /** Delay in seconds before capturing the screenshot. Default: `0`. */
  delay?: number | undefined;
  /** Define when to capture. */
  wait_until?:
    | readonly OpenString<
        "domcontentloaded" | "load" | "networkidle0" | "networkidle2"
      >[]
    | undefined;
  /** Wait for a specific element to appear before taking the screenshot. */
  wait_for_selector?: string | undefined;
  /** Specify a proxy server to route your request through. */
  proxy?: string | undefined;
  /** AWS S3 secret access key. */
  s3_secret_key?: string | undefined;
  /** AWS S3 access key ID. */
  s3_access_key_id?: string | undefined;
  /** The S3 bucket name where the screenshot will be uploaded. */
  s3_bucket?: string | undefined;
  /** The filename for the S3 object (auto-generated if not provided). */
  s3_object_key?: string | undefined;
  /** AWS S3 region for storage. */
  s3_region?: string | undefined;
  /** Leave this field empty for AWS S3. Only specify a value if required. S3-compatible storage services are supported, for example, use https://<accountId>.r2.cloudflarestorage.com for Cloudflare R2. */
  storage_endpoint?: string | undefined;
  /** Use S3 storage for screenshots. The S3 URL will be returned in the response. Default: `false`. */
  s3_url?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteTechnology()` — `GET / POST /v2/website/technology`. */
export interface WebsiteTechnologyParams {
  /** A website URL to analyze for technology stack detection. Must include the http:// or https:// protocol. */
  query: string;
  /** Controls the level of detail returned in the technology detection response. Default: `"expert"`. */
  mode?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `websiteWebunlocker()` — `GET / POST /v2/website/webunlocker`. */
export interface WebsiteWebunlockerParams {
  /** A public website URL to unlock with the WebUnlocker engine. Must include http:// or https://. The target domain must be on Piloterr's approved whitelist. */
  query: string;
  /** Controls whether the WebUnlocker engine should follow HTTP redirects. Default: `true`. */
  allow_redirects?: boolean | undefined;
  /** Controls whether the response returns the raw, unprocessed HTML source of the page. Default: `false`. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `weiboPostInfo()` — `GET / POST /v2/weibo/post/info`. */
export interface WeiboPostInfoParams {
  /** Weibo post id. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `weiboSearch()` — `GET / POST /v2/weibo/search`. */
export interface WeiboSearchParams {
  /** Keywords to search, such as AI. */
  query: string;
  /** Page number, starting at 1. Default 1. Page 2 is the next slice of the same keywords. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `welcometothejungleCompany()` — `GET / POST /v2/welcometothejungle/company`. */
export interface WelcometothejungleCompanyParams {
  /** Slug, company name, or a Welcome to the Jungle company URL. */
  query: string;
  /** fr (default) or en. en-gb and en-us count as en. Chooses the language of the profile text and URL. Default: `"fr"`. */
  language?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `welcometothejungleSearch()` — `GET / POST /v2/welcometothejungle/search`. */
export interface WelcometothejungleSearchParams {
  /** Job keyword or a Welcome to the Jungle jobs-search URL. */
  query: string;
  /** fr (default) or en. en-gb and en-us count as en. A /fr/ or /en/ path in the URL overrides this. Default: `"fr"`. */
  language?: string | undefined;
  /** Page from 1, 30 offers. A page value already in the URL overrides this. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `wellfoundCompanyInfo()` — `GET / POST /v2/wellfound/company/info`. */
export interface WellfoundCompanyInfoParams {
  /** A Wellfound company URL or company slug. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `xPostInfo()` — `GET / POST /v2/x/post/info`. */
export interface XPostInfoParams {
  /** X tweet to retrieve. Accepts a full status URL or numeric tweet ID. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `xProfileInfo()` — `GET / POST /v2/x/profile/info`. */
export interface XProfileInfoParams {
  /** X profile to look up. Accepts a username, @handle, or profile URL. */
  query: string;
  /** When true, return the raw HTML page source as {"result": "..."} instead of structured JSON. Defaults to false. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `yahooSearch()` — `GET / POST /v2/yahoo/search`. */
export interface YahooSearchParams {
  /** Search query sent to Yahoo Search. */
  query: string;
  /** Page number. Page 1 is the first page of results. Default: `1`. */
  page?: number | undefined;
  /** Country code, for example us, fr, gb, de, jp. */
  gl?: string | undefined;
  /** Language code, for example en, fr, de, ja, zh. */
  hl?: string | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `yellowpagesBusiness()` — `GET / POST /v2/yellowpages/business`. */
export interface YellowpagesBusinessParams {
  /** Full Yellow Pages business listing URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `yellowpagesSearch()` — `GET / POST /v2/yellowpages/search`. */
export interface YellowpagesSearchParams {
  /** Full Yellow Pages search URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `yelpBusiness()` — `GET / POST /v2/yelp/business`. */
export interface YelpBusinessParams {
  /** Full Yelp business URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `yelpReviews()` — `GET / POST /v2/yelp/reviews`. */
export interface YelpReviewsParams {
  /** Yelp business ID / encid. */
  query: string;
  /** Page number. Each page returns up to 10 reviews. Default: 1. Default: `1`. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `yelpSearch()` — `GET / POST /v2/yelp/search`. */
export interface YelpSearchParams {
  /** Full Yelp search URL with find_desc and find_loc query parameters. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zapimoveisAd()` — `GET / POST /v2/zapimoveis/ad`. */
export interface ZapimoveisAdParams {
  /** Full Zap Imóveis listing URL. Accepts /imovel/ and /lancamentos/. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zapimoveisSearch()` — `GET / POST /v2/zapimoveis/search`. */
export interface ZapimoveisSearchParams {
  /** City, City, UF, neighborhood, or full Zap Imóveis search URL. */
  query: string;
  /** Transaction type. Used when query is a city. Ignored as a path builder when query is a full URL. Default: `"sale"`. */
  operation?: string | undefined;
  /** Property type. Used when query is a city. */
  property_type?: string | undefined;
  /** Page number (1-based). Default: 1. Values above 1 set pagina on the URL. Default: `1`. */
  page?: number | undefined;
  /** Minimum asking price in BRL. */
  min_price?: number | undefined;
  /** Maximum asking price in BRL. */
  max_price?: number | undefined;
  /** Minimum area in m². */
  min_area?: number | undefined;
  /** Maximum area in m². */
  max_area?: number | undefined;
  /** Minimum bedroom count. */
  min_bedrooms?: number | undefined;
  /** Minimum bathroom count. */
  min_bathrooms?: number | undefined;
  /** Minimum parking spaces. */
  min_parking?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zazzleProduct()` — `GET / POST /v2/zazzle/product`. */
export interface ZazzleProductParams {
  /** Required. Product URL or slug ending in the numeric product id. Example: https://www.zazzle.com/branded_logo_two_tone_coffee_mug-256528848440338952. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zazzleSearch()` — `GET / POST /v2/zazzle/search`. */
export interface ZazzleSearchParams {
  /** Required. Keyword or a zazzle.com/s search URL. Example: coffee mug. A product URL returns 400. */
  query: string;
  /** Optional. Page number from 1. Example: 2. Maps to the Zazzle pg parameter. Defaults to 1. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zillowProperty()` — `GET / POST /v2/zillow/property`. */
export interface ZillowPropertyParams {
  /** Full Zillow homedetails URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zillowSearch()` — `GET / POST /v2/zillow/search`. */
export interface ZillowSearchParams {
  /** Full Zillow search or map results URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zonapropProperty()` — `GET / POST /v2/zonaprop/property`. */
export interface ZonapropPropertyParams {
  /** ZonaProp listing URL under /propiedades/clasificado/. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zonapropSearch()` — `GET / POST /v2/zonaprop/search`. */
export interface ZonapropSearchParams {
  /** Place or a ZonaProp search URL. */
  query: string;
  /** Sale or rent when query is a place. */
  operation?: string | undefined;
  /** Kind of property. Default departamentos. */
  property_type?: string | undefined;
  /** Page from 1. ZonaProp writes this into the path as -pagina-N.html. */
  page?: number | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zooplaProperty()` — `GET / POST /v2/zoopla/property`. */
export interface ZooplaPropertyParams {
  /** Full Zoopla property detail URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zooplaSearch()` — `GET / POST /v2/zoopla/search`. */
export interface ZooplaSearchParams {
  /** Full Zoopla search results URL. */
  query: string;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zooplusProduct()` — `GET / POST /v2/zooplus/product`. */
export interface ZooplusProductParams {
  /** A product link, a /shop/.../{id} path, or the product number. */
  query: string;
  /** Which country shop when query is a number or a path. fr is France (default). de is Germany. uk is the United Kingdom. Default: `"fr"`. */
  region?: string | undefined;
  /** Set to true to get the raw HTML in result instead of the product. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zooplusSearch()` — `GET / POST /v2/zooplus/search`. */
export interface ZooplusSearchParams {
  /** What to look for. A word, or a Zooplus search link. */
  query: string;
  /** Which country shop. fr is France (default, www.zooplus.fr). de is Germany (www.zooplus.de). uk is the United Kingdom (www.zooplus.co.uk). Default: `"fr"`. */
  region?: string | undefined;
  /** Which page of results, starting at 1. Page 2 uses p=2 and returns different products. */
  page?: number | undefined;
  /** Set to true to get the raw HTML in result instead of the product list. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zoroProduct()` — `GET / POST /v2/zoro/product`. */
export interface ZoroProductParams {
  /** Zoro product URL, or a path that contains /i/G.... */
  query: string;
  /** When true, return the rendered HTML as {"result": "..."} instead of JSON. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}

/** Parameters for `zoroSearch()` — `GET / POST /v2/zoro/search`. */
export interface ZoroSearchParams {
  /** Keyword, or a Zoro search or category URL. Empty, another host, or a product URL returns 400. A keyword builds /search?q=.... Each card has price as a USD number and price_display as the dollar string. */
  query: string;
  /** Page number starting at 1. Omit it for page 1. Page 2 adds page=2, sets pagination.page to 2, and returns the next cards. pagination.next is the next page URL, or null on the last page. A value below 1 returns 400. */
  page?: number | undefined;
  /** Default false. true replaces results and pagination with result, the rendered HTML. */
  return_page_source?: boolean | undefined;
  /** Comma-separated list of fields to keep in the response, with dot notation for nested fields (e.g. name,location.city). Does not change the credit cost. */
  fields?: string | undefined;
  /** Process the request asynchronously: the response is a job_id to poll on /v1/jobs/{id} (see waitForJob). Default: `false`. */
  is_async?: boolean | undefined;
  /** Return HTTP 200 even when an error occurs; the error is then in the response body. Default: `false`. */
  soft_fail?: boolean | undefined;
}
