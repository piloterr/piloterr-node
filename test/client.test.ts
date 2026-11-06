import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ENDPOINTS,
  PiloterrApiError,
  PiloterrClient,
  PiloterrConfigurationError,
  PiloterrResponseDecodingError,
  PiloterrSerializationError,
  PiloterrTransportError,
  type PiloterrFetch,
} from "../src/index.js";

type Recorded = { url: URL; init: RequestInit };

function mockFetch(
  responder: (request: Recorded) => Response | Promise<Response> = () =>
    jsonResponse({ ok: true }),
): { fetch: PiloterrFetch; calls: Recorded[] } {
  const calls: Recorded[] = [];
  const fetch: PiloterrFetch = async (input, init) => {
    const recorded = { url: new URL(String(input)), init };
    calls.push(recorded);
    return responder(recorded);
  };
  return { fetch, calls };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function header(call: Recorded, name: string): string | null {
  return new Headers(call.init.headers).get(name);
}

describe("PiloterrClient configuration", () => {
  it("requires an API key", () => {
    const previous = process.env.PILOTERR_API_KEY;
    delete process.env.PILOTERR_API_KEY;
    try {
      assert.throws(() => new PiloterrClient(), PiloterrConfigurationError);
      assert.throws(
        () => new PiloterrClient({ apiKey: "   " }),
        PiloterrConfigurationError,
      );
    } finally {
      if (previous !== undefined) process.env.PILOTERR_API_KEY = previous;
    }
  });

  it("reads the API key from PILOTERR_API_KEY", async () => {
    const previous = process.env.PILOTERR_API_KEY;
    process.env.PILOTERR_API_KEY = "env-key";
    try {
      const { fetch, calls } = mockFetch();
      const client = new PiloterrClient({ fetch });
      await client.request("GET", "/v1/usage");
      assert.equal(header(calls[0]!, "x-api-key"), "env-key");
    } finally {
      if (previous === undefined) delete process.env.PILOTERR_API_KEY;
      else process.env.PILOTERR_API_KEY = previous;
    }
  });

  it("rejects an invalid base URL and timeout", () => {
    assert.throws(
      () => new PiloterrClient({ apiKey: "k", baseUrl: "not a url" }),
      PiloterrConfigurationError,
    );
    assert.throws(
      () => new PiloterrClient({ apiKey: "k", timeout: -1 }),
      PiloterrConfigurationError,
    );
  });
});

describe("requests", () => {
  it("sends the featured operation as a GET with the API key header", async () => {
    const { fetch, calls } = mockFetch(() => jsonResponse({ hello: "world" }));
    const client = new PiloterrClient({ apiKey: "test-key", fetch });
    const response = await client.amazonProduct({ query: "B09DFCB66S" });

    assert.equal(response.kind, "json");
    assert.deepEqual(response.data, { hello: "world" });
    const call = calls[0]!;
    assert.equal(call.init.method, "GET");
    assert.equal(
      call.url.origin + call.url.pathname,
      "https://api.piloterr.com/v2/amazon/product",
    );
    assert.equal(header(call, "x-api-key"), "test-key");
    assert.match(header(call, "user-agent") ?? "", /^piloterr-node\//);
    assert.equal(call.init.redirect, "manual");
  });

  it("serializes booleans, numbers and arrays in the query string", async () => {
    const { fetch, calls } = mockFetch();
    const client = new PiloterrClient({
      apiKey: "k",
      fetch,
      baseUrl: "https://example.test/",
    });
    await client.request("GET", "/v1/anything", {
      text: "a b&c",
      flag: false,
      count: 0,
      ratio: 1.5,
      list: ["x", "y"],
      skipped: undefined,
      nothing: null,
    });
    const url = calls[0]!.url;
    assert.equal(url.origin, "https://example.test");
    assert.deepEqual(
      [...url.searchParams],
      [
        ["text", "a b&c"],
        ["flag", "false"],
        ["count", "0"],
        ["ratio", "1.5"],
        ["list", "x"],
        ["list", "y"],
      ],
    );
  });

  it("sends POST parameters as a JSON body", async () => {
    const { fetch, calls } = mockFetch();
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await client.request("POST", "/v1/anything", {
      query: "x",
      page: 2,
      gone: undefined,
    });
    const call = calls[0]!;
    assert.equal(call.init.method, "POST");
    assert.equal(header(call, "content-type"), "application/json");
    assert.deepEqual(JSON.parse(String(call.init.body)), {
      query: "x",
      page: 2,
    });
    assert.equal(call.url.search, "");
  });

  it("fills path parameters", async () => {
    const { fetch, calls } = mockFetch();
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await client.request("GET", "/v1/items/{id}", { id: "a/b c", other: 1 });
    assert.equal(calls[0]!.url.pathname, "/v1/items/a%2Fb%20c");
    assert.equal(calls[0]!.url.search, "?other=1");
    await assert.rejects(
      client.request("GET", "/v1/items/{id}", {}),
      PiloterrSerializationError,
    );
  });

  it("keeps the global parameters in the query string on POST", async () => {
    const { fetch, calls } = mockFetch();
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await client.request("POST", "/v1/anything", {
      query: "x",
      is_async: true,
      fields: "a",
    });
    const call = calls[0]!;
    assert.deepEqual(JSON.parse(String(call.init.body)), { query: "x" });
    assert.equal(call.url.search, "?fields=a&is_async=true");
  });

  it("validates required parameters before sending", async () => {
    const { fetch, calls } = mockFetch();
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await assert.rejects(
      // @ts-expect-error -- missing required parameter on purpose
      client.amazonProduct({}),
      PiloterrSerializationError,
    );
    assert.equal(calls.length, 0);
  });

  it("lets dual GET/POST operations use POST", async () => {
    const { fetch, calls } = mockFetch(() => jsonResponse({}));
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await client.aboutyouProduct({ query: "test" }, { method: "POST" });
    assert.equal(calls[0]!.init.method, "POST");
    assert.deepEqual(JSON.parse(String(calls[0]!.init.body)), {
      query: "test",
    });
  });

  it("rejects an unsupported method for an operation", async () => {
    const client = new PiloterrClient({
      apiKey: "k",
      fetch: mockFetch().fetch,
    });
    await assert.rejects(
      client.jobs({ id: "test" }, { method: "POST" }),
      PiloterrConfigurationError,
    );
  });

  it("accepts the global parameters on every endpoint", async () => {
    const { fetch, calls } = mockFetch(() => jsonResponse({ job_id: "j1" }));
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await client.amazonProduct({
      ...{ query: "B09DFCB66S" },
      fields: "a,b.c",
      is_async: true,
      soft_fail: false,
    });
    const query = calls[0]!.url.searchParams;
    assert.equal(query.get("fields"), "a,b.c");
    assert.equal(query.get("is_async"), "true");
    assert.equal(query.get("soft_fail"), "false");
  });

  it("calls every documented endpoint on its path", async () => {
    const { fetch, calls } = mockFetch(() => jsonResponse({}));
    const client = new PiloterrClient({
      apiKey: "k",
      fetch,
    }) as unknown as Record<string, (params: unknown) => Promise<unknown>>;
    const required: Record<string, Record<string, unknown>> = {
      aboutyou_product: { query: "test" },
      aboutyou_search: { query: "suede bloom" },
      action_product: { query: "3216159" },
      action_search: { query: "meuble" },
      aldi_product: {
        query: "fiches-produits/filets-danchois-marines-6806.html",
      },
      aldi_search: { query: "produits/viande-poisson/poisson-crustace.html" },
      alibaba_product: {
        query:
          "https://www.alibaba.com/product-detail/Custom-Neon-Light-Acrylic-Neon-Sign_1601175379813.html",
      },
      alibaba_search: {
        query: "https://www.alibaba.com/trade/search?SearchText=neon",
      },
      aliexpress_product: {
        query: "https://www.aliexpress.com/item/1005009517624640.html",
      },
      aliexpress_product_reviews: { query: "1005001388303149" },
      aliexpress_search: { query: "meta" },
      aliexpress_store_product: {
        query: "https://www.aliexpress.com/store/1101705614",
      },
      allegro_product: {
        query: "https://allegro.pl/produkt/slug-uuid?offerId=123",
      },
      allegro_search: { query: "mufowa" },
      amazon_product: { query: "B09DFCB66S" },
      amazon_product_offer: { query: "B093C9B1HK" },
      amazon_search: { query: "playstation 5" },
      apartments_property: {
        query:
          "https://www.apartments.com/141-e-33rd-st-new-york-ny-unit-si-fl16-id43/p6b4mes/",
      },
      apartments_search: { query: "https://www.apartments.com/new-york-ny/3" },
      argenprop_property: {
        query:
          "https://www.argenprop.com/departamento-en-venta-en-palermo-chico-5-ambientes--20724993",
      },
      argenprop_search: { query: "palermo" },
      argos_product: { query: "test" },
      argos_search: { query: "laptop" },
      arxiv_paper: {
        query: "2201.00978 or https://arxiv.org/abs/cond-mat/0011267v1.",
      },
      arxiv_search: {
        query:
          "electron. A paper URL such as https://arxiv.org/abs/2201.00978 returns 400.",
      },
      auchan_product: {
        query:
          "https://www.auchan.fr/charles-alice-specialite-pommes-mangues-sans-sucres-ajoutes/pr-C1177497",
      },
      auchan_search: { query: "pomme" },
      autodoc_product: { query: "https://www.auto-doc.fr/ridex/7999541" },
      autodoc_product_related: {
        query: "https://www.auto-doc.fr/ridex/7999541",
        maker_id: 93,
        vehicle_type: "pkw",
        maker_name: "RENAULT",
        product_id: 7999541,
      },
      autodoc_search: { query: "https://www.auto-doc.fr/search?keyword=frein" },
      autoeurope_result: {
        offer_id: "3CD30DE2D9BE4CE8FC28E20D2702FCC7",
        pickup: "CDG",
        pickup_date: "2026-11-06",
        dropoff_date: "2026-11-09",
      },
      autoeurope_search: {
        pickup: "CDG",
        pickup_date: "2026-11-06",
        dropoff_date: "2026-11-09",
      },
      autoscout24_ad: {
        query:
          "https://www.autoscout24.fr/offres/porsche-macan-s-diesel-pano-1-hand-diesel-or-cat_ma57mo20311-547632b2-e4fc-47f3-8143-1a2d7b276366",
      },
      autoscout24_search: {
        query: "https://www.autoscout24.fr/lst/volkswagen/golf?atype=C",
      },
      autotrader_ad: {
        query: "https://www.autotrader.co.uk/car-details/202606053030491",
      },
      autotrader_search: {
        query:
          "https://www.autotrader.co.uk/car-search?channel=cars&postcode=W1F%208EB&price_search_type=total&sort=relevance&page=1",
      },
      bestbuy_product: {
        query:
          "https://www.bestbuy.com/product/gigabyte-aero-x16-copilot-pc-165hz-wqxga-rtx-5070-ryzen-ai-7-350-1tb-ssd-16gb-ddr5-windows-11-lunar-white/J3GWPQC2RQ",
      },
      bestbuy_product_reviews: { query: "test" },
      bestbuy_search: { query: "machine" },
      bhphotovideo_product: { query: "1948568-REG" },
      bhphotovideo_search: { query: "sandisk extreme pro" },
      bing_search: { query: "openai" },
      bitiba_product: { query: "75036. A search link returns 400." },
      bitiba_search: { query: "test" },
      bol_product: { query: "9300000240171676" },
      bol_search: { query: "lego" },
      boulanger_product: { query: "https://www.boulanger.com/ref/1193303" },
      boulanger_search: { query: "aspirateur" },
      brave_search: { query: "anthropic" },
      bricodepot_product: {
        query:
          "https://www.bricodepot.fr/p/3373270014082/compresseur-coaxial-50l-vertical-10-bars-accessoires-1",
      },
      bricodepot_search: {
        query:
          "https://www.bricodepot.fr/produits/outillage/outillage-electroportatif-a-main-et-accessoire/perceuse-visseuse-et-outillage-de-percage/perceuse-visseuse-et-perceuse-a-percussion-sans-fil",
      },
      bricorama_product: {
        query:
          "https://www.bricorama.fr/p/perceuse-visseuse-sans-fil-18v/3999991691267",
      },
      bricorama_search: { query: "perceuse" },
      carrefour_product: {
        query:
          "https://www.carrefour.fr/p/oeufs-de-caille-le-gaulois-3266980075934",
      },
      carrefour_search: { query: "pomme" },
      carrefour_suggest: { query: "coca" },
      castorama_product: {
        query:
          "https://www.castorama.fr/mastic-bain-et-cuisine-rubson-blanc-280ml/5410091628840_CAFR.prd",
      },
      castorama_search: { query: "joint-silicone" },
      cdiscount_product: {
        query:
          "https://www.cdiscount.com/informatique/ordinateurs-pc-portables/acemagic-pc-portables-gaming/f-1070992-aaaph06865.html",
      },
      cdiscount_product_offer: {
        query: "https://www.cdiscount.com/mp-352880-auc3283981039048.html",
      },
      cdiscount_search: {
        query: "https://www.cdiscount.com/search/10/laptop.html",
      },
      centris_property: {
        query:
          "https://www.centris.ca/en/condos~for-sale~montreal-le-sud-ouest/17796540",
      },
      centris_search: { query: "montreal" },
      chewy_product: { query: "test" },
      chewy_search: { query: "test" },
      clearedjobs_job: {
        query: "analyst-washington-district-of-columbia-1902823.",
      },
      clearedjobs_search: { query: "analyst. A job URL returns 400." },
      company: { query: "gucci.com" },
      coolblue_product: {
        query:
          "https://www.coolblue.be/nl/product/905648/sony-wh-1000xm5-zwart.html",
      },
      coolblue_search: { query: "sony wh-1000xm5" },
      copart_lot: { query: "55295666" },
      copart_search: { query: "chevrolet" },
      costco_product: { query: "4000266385" },
      costco_search: { query: "home" },
      crunchbase_event: { query: "london-tech-week-2025" },
      crunchbase_funding_round: { query: "openai-secondary-market--3bab6e98" },
      crunchbase_people_info: { query: "alex-martin" },
      crunchbase_search: { query: "openai" },
      cultura_product: {
        query:
          "https://www.cultura.com/p-harry-potter-et-le-prisonnier-d-azkaban-illustre-par-minalima-9782075193993.html",
      },
      cultura_search: { query: "harry potter" },
      darty_product: {
        query:
          "https://www.darty.com/nav/achat/petit_electromenager/aspirateur-balai_main/aspirateur_balai/dyson_piston_animal.html",
      },
      darty_search: { query: "aspirateur" },
      decathlon_product: {
        query:
          "https://www.decathlon.fr/p/gourde-alu-1l-avec-bouchon-instantane-composee-a-100percent-dalu-recycle-bleu/330041/c98m8612536",
      },
      decathlon_search: { query: "gourde" },
      digikey_product: {
        query:
          "https://www.digikey.fr/fr/products/detail/phoenix-contact/2981965/3604293",
      },
      digikey_search: { query: "phoenix contact" },
      doaj_article: { query: "000004687a3a411cb466625281f2ceb0." },
      doaj_journal: { query: "2747-173X." },
      doaj_search: { query: "climate. An article or journal URL returns 400." },
      domain_dnsbl: { query: "185.122.10.10" },
      domain_malicious: { query: "197.33.189.70" },
      domain_whois: { query: "piloterr.com" },
      domaincomau_property: {
        query:
          "https://www.domain.com.au/7d-27-31-ocean-street-n-bondi-nsw-2026-2021178032",
      },
      domaincomau_search: { query: "Bondi NSW 2026" },
      duckduckgo_search: { query: "test" },
      ebay_product: { query: "257758922911" },
      ebay_search: { query: "laptop" },
      elcorteingles_product: { query: "A200910175" },
      elcorteingles_search: { query: "marino" },
      eleclerc_product: { query: "3564700201442" },
      eleclerc_search: { query: "pomme" },
      eleclerc_suggest: { query: "pomme" },
      email_analyzes: { query: "airbus.com" },
      email_finder: { query: "Jane Doe" },
      email_verify: { query: "jane.doe@example.com" },
      europages_company: {
        query: "https://www.europages.fr/fr/company/synyco-sas-22106635",
      },
      europages_search: { query: "emballage" },
      eventbrite_event: { query: "2002625586037" },
      expedia_ad: {
        query:
          "https://www.expedia.com/New-York-Hotels-Hilton-New-York-Fashion-District.h3117215.Hotel-Information",
      },
      expedia_flight: { query: "JFK-LAX" },
      expedia_search: {
        query:
          "https://euro.expedia.net/Hotel-Search?currency=EUR&siteid=4400&destination=Toulouse",
      },
      fashionphile_product: {
        query: "celine-supple-shiny-lambskin-little-new-luggage-black-1978804",
      },
      fashionphile_search: { query: "celine" },
      finder_eleclerc_stores: { query: "paris" },
      finder_google_countries: { query: "fr" },
      finder_google_languages: { query: "french" },
      finder_google_locations: { query: "Paris" },
      finder_leroymerlin_stores: { query: "balma" },
      finder_linkedin_industries: { query: "software development" },
      finder_mrbricolage_stores: { query: "matignon" },
      fiverr_profile_info: { query: "https://www.fiverr.com/username" },
      fiverr_search: {
        query: "https://www.fiverr.com/search/gigs?query=website+development",
      },
      fnac_product: { query: "23428278" },
      fnac_search: { query: "iphone" },
      fotocasa_ad: {
        query:
          "https://www.fotocasa.es/es/comprar/vivienda/madrid-capital/aire-acondicionado-calefaccion-terraza-ascensor-amueblado/190589697/d",
      },
      fotocasa_search: { query: "madrid" },
      franchisedirect_franchise: {
        query: "https://www.franchisedirect.com/coffee-franchises/coffeenow",
      },
      franchisedirect_search: { query: "coffee" },
      fressnapf_product: {
        query:
          "https://www.fressnapf.de/p/royal-canin-maxi-adult-15-kg-1003112004/",
      },
      fressnapf_search: { query: "halsband" },
      funda_property: {
        query:
          "https://www.funda.nl/detail/koop/amsterdam/appartement-hillegomstraat-57-1/44654106/",
      },
      funda_search: { query: "amsterdam" },
      g2_product_info: { query: "postman" },
      github_user_info: { query: "https://github.com/example-user" },
      glassdoor_company_info: { query: "1692882" },
      glassdoor_company_search: { query: "airbus" },
      glassdoor_job_info: { query: "1010283388161" },
      glassdoor_job_search: { query: "security" },
      goodreads_book: { query: "44767458" },
      goodreads_search: { query: "dune" },
      google_images: { query: "mountain landscape" },
      google_jobs: { query: "software engineer" },
      google_maps: { query: "coffee shop paris" },
      google_news: { query: "artificial intelligence news" },
      google_search: { query: "best electric cars 2024" },
      google_search_ai: { query: "what is mozilla firefox" },
      google_search_autocomplete: { query: "coffee" },
      google_shopping: { query: "playstation 5" },
      google_videos: { query: "paris travel guide" },
      googleadstransparency_ad: {
        query:
          "https://adstransparency.google.com/advertiser/AR10904289436120383489/creative/CR10927354991047868417?region=FR",
      },
      googleadstransparency_search: { query: "webapi.group" },
      grainger_product: { query: "3FRU1" },
      grainger_search: { query: "carolina" },
      greenhouse_job: {
        query:
          "discord/8806482002 or https://job-boards.greenhouse.io/discord/jobs/8806482002.",
      },
      greenhouse_search: { query: "discord. A job URL returns 400." },
      gsaelibrary_contract: {
        query:
          "https://www.gsaelibrary.gsa.gov/ElibMain/contractorInfo.do?contractNumber=GS-07F-0239T&contractorName=US+RADAR+INC&executeQuery=YES",
      },
      gsaelibrary_search: { query: "radar" },
      homestra_ad: {
        query:
          "https://homestra.com/property/charming-4-bedroom-stone-house-with-historic-towers-in-idyllic-french-village/",
      },
      homestra_search: {
        query:
          "https://homestra.com/list/houses-for-sale/?maximum-price=900000&minimum-price=75000&page=1",
      },
      huggingface_model: { query: "google-bert/bert-base-uncased" },
      huggingface_search: { query: "bert" },
      idealista_property: {
        query: "https://www.idealista.com/fr/inmueble/111463799/",
      },
      idealista_search: {
        query:
          "https://www.idealista.com/venta-viviendas/barcelona/ciutat-vella/la-barceloneta/",
      },
      idealo_product: {
        query:
          "https://www.idealo.es/precios/205227870/asics-novablast-5-1011b974.html",
      },
      idealo_search: { query: "maison" },
      ikea_product: {
        query:
          "https://www.ikea.com/fr/fr/p/gladhoejden-bureau-assis-debout-blanc-30493939/",
      },
      ikea_search: { query: "https://www.ikea.com/fr/fr/search/?q=meuble" },
      immobilienscout24_property: { query: "168052908" },
      immobilienscout24_search: { query: "berlin/berlin" },
      immoscout24ch_search: { query: "zurich" },
      immowelt_property: {
        query:
          "https://www.immowelt.de/expose/65de0309-bf41-48ce-86fd-6a3441fd0487",
      },
      immowelt_search: {
        query:
          "https://www.immowelt.de/suche/mieten/wohnung/deutschland/ad02de1",
      },
      imoveisweb_property: {
        query: "https://www.imoveisweb.com.br/imoveis/casas/3151/",
      },
      imoveisweb_search: { query: "casas" },
      indeed_company_info: { query: "Proman-1" },
      indeed_company_search: { query: "airbus" },
      indeed_job_info: { query: "585181841cb618e0" },
      indeed_job_salary: { query: "ingénieur-etudes-et-développement" },
      indeed_job_search: { query: "developpeur python" },
      inet_product: { query: "4306287. A search link returns 400." },
      inet_search: { query: "test" },
      instagram_post_info: { query: "https://www.instagram.com/p/CshTQQlMGMl" },
      instagram_user_info: { query: "https://www.instagram.com/example-user/" },
      intermarche_product: {
        query:
          "https://www.intermarche.com/produit/flan-patissier-cuit-&-dore-au-four/3250391522828",
        shop_id: "11301",
      },
      intermarche_search: { query: "lait", shop_id: "11301" },
      intersport_product: {
        query:
          "https://www.intersport.fr/blancetvert-chaussures_de_running_homme_pegasus_plus2-nike-p-IM2541~VZE/",
      },
      intersport_search: { query: "nike" },
      jamesedition_property: { query: "test" },
      jamesedition_search: { query: "villa" },
      jobs: { id: "test" },
      kick_user_info: { query: "https://kick.com/example-user" },
      kijiji_ad: {
        query:
          "https://www.kijiji.ca/v-cell-phone-accessories/city-of-toronto/nateroso-iphone-16-case-cute-bear-honey-design/1745477275",
      },
      kijiji_search: {
        query: "https://www.kijiji.ca/b-bikes/city-of-toronto/c644l1700273",
      },
      kroger_product: { query: "0001111040101" },
      kroger_search: { query: "milk" },
      lamudi_ad: {
        query:
          "https://www.lamudi.com.ph/property/41032-73-626c638217d1-1d2a-1985488-907f-7802",
      },
      leboncoin_ad: { query: "3012186547" },
      leboncoin_search: {
        query:
          "https://www.leboncoin.fr/c/offres_d_emploi?locations=Paris_75015__48.84105_2.29926_2747",
      },
      lenovo_product: {
        query:
          "https://www.lenovo.com/fr/fr/p/workstations/thinkstationp/thinkstation-p5-gen-2-intel-tower-workstation/len102s0024",
      },
      lenovo_search: { query: "thinkpad" },
      leroymerlin_product: {
        query:
          "https://www.leroymerlin.fr/produits/bobine-soudure-63378273.html",
      },
      leroymerlin_search: { query: "perceuse" },
      lidl_product: { query: "100397447" },
      lidl_search: { query: "perceuse" },
      linkedin_job_info: {
        query: "https://www.linkedin.com/jobs/view/4390885746",
      },
      linkedin_job_suggest: { query: "Air" },
      linkedin_post_info: {
        query:
          "https://www.linkedin.com/posts/tanyalindsay_we-have-been-building-a-web3-gaming-platform-activity-7027826235833520128-m0GW",
      },
      linkedin_product_info: {
        query: "https://www.linkedin.com/products/15five",
      },
      linkedin_profile_info: {
        query: "https://www.linkedin.com/in/example-user",
      },
      linkedinadlibrary_ad: {
        query: "https://www.linkedin.com/ad-library/detail/1585536544",
      },
      loopnet_property: { query: "test" },
      loopnet_search: { query: "New York, NY" },
      maersk_tracking: { query: "MMAU1155207" },
      manomano_product: {
        query:
          "https://www.manomano.fr/p/perceuse-visseuse-lxt-makita-18-v-3-ah-84523637?product_id=158588345",
      },
      manomano_product_offer: { query: "158588345" },
      manomano_search: { query: "https://www.manomano.fr/perceuse-1146" },
      mascus_ad: {
        query:
          "https://www.mascus.fr/travaux-publics/broyeur-dechets/doppstadt-ak-435-profi/hocmgmfi.html",
      },
      mascus_search: {
        query: "https://www.mascus.be/bouw/graafmachines/be,country.html",
      },
      mediamarkt_product: {
        query:
          "https://www.mediamarkt.ch/fr/product/_apple-iphone-15-2203371.html",
      },
      mediamarkt_search: { query: "iphone" },
      micromania_product: { query: "162114" },
      micromania_search: { query: "zelda" },
      mobile_ad: { query: "455111824" },
      mobile_search: { query: "20100" },
      morele_product: {
        query:
          "https://www.morele.net/laptop-lenovo-thinkbook-15-iil-20sm000fpb-6721152/",
      },
      morele_search: { query: "laptop" },
      mrbricolage_suggest: { query: "marteau" },
      newegg_product: { query: "N82E16823126188" },
      newegg_search: { query: "logitech keyboard" },
      northdata_company: { query: "Maison Boinaud" },
      northdata_search: { query: "BMW" },
      npi_provider: { query: "test" },
      oceanio_search: { query: "google.com" },
      olx_ad: {
        query:
          "https://www.olx.pl/d/oferta/apple-iphone-17-pro-256-gb-nowy-szczecin-zaplombowany-karta-sim-ul-baluki-4-szczecin-CID99-ID18Acsd.html",
      },
      olx_product: {
        query:
          "https://www.olx.com.br/eletronicos-e-celulares/celulares-e-smartphones/iphone-14-128gb-como-novo-IDJ4mBb.html",
      },
      olx_search: { query: "iphone 14" },
      oscaro_product: {
        query:
          "https://www.oscaro.com/huile-moteur-motul-102208-15213891-1862-p",
      },
      oscaro_search: { query: "moteur ai" },
      ovoko_ad: {
        query:
          "https://ovoko.fr/les-pieces/lgn634714-1780a036-mitsubishi-asx-filtre-d-habitacle",
      },
      ovoko_search: {
        query:
          "https://ovoko.pl/szukaj?q=Porsche+Macan+uszczelka+klapy+bagaznika&exact=1",
      },
      owler_company_info: { query: "https://owler.com/company/tesla" },
      owler_search: { query: "tesla" },
      pagesjaunes_page_info: {
        query: "https://www.pagesjaunes.fr/pros/56824689",
      },
      pagesjaunes_search: {
        query:
          "https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=Dentiste&ou=Toulouse+(31000)&univers=pagesjaunes&idOu=",
      },
      patreon_profile_info: { query: "https://www.patreon.com/example-user" },
      patreon_search: { query: "creator" },
      petsmart_product: {
        query:
          "https://www.petsmart.com/dog/food/dry-food/purina-pro-plan-sensitive-skin-and-stomach-dry-dog-food-adult-salmon-and-rice-formula-digestive-health-36648.html",
      },
      petsmart_search: { query: "dog food" },
      picard_product: { query: "050314" },
      picard_search: { query: "patate douce" },
      pinterest_user_info: { query: "https://www.pinterest.com/username" },
      pitchbook_company_info: { query: "11062-99" },
      pitchbook_search: { query: "airbus" },
      pointp_product: {
        query:
          "https://www.pointp.fr/p/platre-isolation-ite/laine-de-verre-a-souffler-thermo-loft-knauf-insulation-sac-16-A3334230",
      },
      pointp_search: { query: "colle" },
      prnewswire_article: { query: "test" },
      prnewswire_search: { query: "apple" },
      producthunt_product_info: {
        query: "https://www.producthunt.com/products/miro",
      },
      proshop_product: { query: "3071602" },
      proshop_search: { query: "ssd" },
      rappi_product: { query: "test" },
      rappi_search: { query: "leche" },
      ratemyprofessors_professor: { query: "1064107" },
      ratemyprofessors_search: { query: "smith" },
      realestatecomau_search: { query: "Sydney, NSW" },
      realtor_property: {
        query:
          "https://www.realtor.com/realestateandhomes-detail/1492-E-57th-St_Brooklyn_NY_11234_M46117-61190",
      },
      realtor_search: {
        query: "https://www.realtor.com/realestateandhomes-search/New-York_NY",
      },
      redfin_property: {
        query:
          "https://www.redfin.com/WA/Seattle/1120-8th-Ave-98101/unit-1603/home/14602?region_id=16163&region_type=6",
      },
      redfin_search: { query: "https://www.redfin.com/city/16163/WA/Seattle" },
      reichelt_product: { query: "test" },
      reichelt_search: { query: "test" },
      reverb_product: { query: "96933467" },
      reverb_search: { query: "guitar" },
      rexel_product: { query: "https://www.rexel.fr/frx/HAGWXF122/p/71742449" },
      rexel_search: { query: "prise" },
      rightmove_property: {
        query: "https://www.rightmove.co.uk/properties/172438235",
      },
      rightmove_search: { query: "Bristol" },
      rsonline_product: {
        query: "https://uk.rs-online.com/web/p/splice-connectors/0303327",
      },
      rsonline_search: { query: "connector" },
      seek_job: { query: "test" },
      seek_search: { query: "nurse" },
      seloger_agency: {
        query:
          "https://www.seloger.com/professionnels/agences-immobilieres/castanet-tolosan-31320/agence-21719",
      },
      seloger_agency_rent: { query: "18317" },
      seloger_agency_sale: { query: "18317" },
      seloger_property: {
        query:
          "https://www.seloger.com/annonces/achat/appartement/bordeaux-33/capucins-saint-michel-nansouty-saint-genes/234462129.htm",
      },
      seloger_search: {
        query:
          "https://www.seloger.com/annonces/achat/appartement/bordeaux-33/",
      },
      sephora_product: {
        query:
          "https://www.sephora.fr/p/midnight-espresso---eau-de-parfum-au-cafe-831955.html",
      },
      sephora_search: { query: "mascara" },
      shophouzz_product: {
        query:
          "https://shophouzz.com/products/burke-counter-stool-cognac-vegan-leather-white-oak-veneer-metal-dowel-prvw-vr-186041078",
      },
      shopify_apps: { query: "https://apps.shopify.com/judgeme" },
      shopify_catalog: { query: "https://www.decathlon.com" },
      shopify_collections: { query: "https://www.decathlon.com" },
      shopify_product: {
        query:
          "https://www.decathlon.com/products/simond-backpacking-sleeping-bag-mt500-41-f-synthetic-346446",
      },
      similarweb_domain: { query: "google.com" },
      similarweb_search: { query: "google.com" },
      snapeda_product: { query: "CYPD3175-24LQXQ/Cypress Semiconductor" },
      snapeda_search: { query: "USB Type C" },
      starbucks_product: { query: "418/hot" },
      stockx_product: { query: "nike-air-max-1-travis-scott-wheat" },
      stockx_search: { query: "Air Jordan Retro" },
      stockx_trends: { query: "sneakers" },
      stubhub_event: { query: "test" },
      stubhub_search: { query: "nba" },
      target_product: { query: "17457624" },
      target_search: { query: "shampoo" },
      tdlr_license: { query: "test" },
      ted_notice: { query: "30-2026" },
      thalia_product: { query: "A1074644377" },
      thalia_search: { query: "Harry Potter" },
      thefork_restaurant: {
        query:
          "https://www.thefork.fr/restaurant/salamboo-amilkar-r10892#date=2026-06-13&rankedBy=SEARCH_ENGINE",
      },
      thefork_search: {
        query:
          "https://www.thefork.fr/search?cityId=529135&date=2026-06-13&hour=660&partySize=8&timezone=Europe%2FParis",
      },
      thomasnet_company: {
        query:
          "https://www.thomasnet.com/company/zepole-supply-co-20088400/profile",
      },
      thomasnet_search: {
        query:
          "https://www.thomasnet.com/suppliers/search?searchterm=Table+Forks",
      },
      ticketmaster_event: { query: "test" },
      ticketmaster_search: { query: "jazz" },
      tiktoktopads_ad: {
        query:
          "https://ads.tiktok.com/business/creativecenter/topads/7686267188656750612/pc/en?period=30",
      },
      tradeaplane_listing: {
        query:
          "https://www.trade-a-plane.com/search?category_level1=Piston+Engine&make=ROLLS+ROYCE&model=PACKARD+V-1650&listing_id=2419556&s-type=engine",
      },
      tradeaplane_search: { query: "rol" },
      trustpilot_company_info: {
        query: "https://www.trustpilot.com/review/nordvpn.com",
      },
      untappd_beer: { query: "4509" },
      untappd_search: { query: "ipa" },
      upwork_freelancer: { query: "~0123456789abcdef01" },
      upwork_jobs: { query: "api-development" },
      upwork_services: { query: "mobile-apps" },
      upwork_services_info: {
        query:
          "https://www.upwork.com/services/product/development-it-mobile-app-developer-android-ios-flutter-application-hybrid-apps-1403673770703212544",
      },
      usaspending_award: {
        query: "CONT_AWD_GSFC0198106DNAS526555_8000_-NONE-_-NONE-.",
      },
      usaspending_search: { query: "software. An award URL returns 400." },
      vestiairecollective_product: {
        query:
          "https://www.vestiairecollective.com/vetements-femme/vestes/chanel/vesteblouson-chanel-la-petite-veste-noire-en-tweed-rose-73024488.shtml",
      },
      vestiairecollective_search: { query: "chanel" },
      vinted_item: {
        query: "https://www.vinted.com/items/9437210920-purple-prom-dress",
      },
      vinted_search: { query: "nike" },
      vinted_user_info: {
        query: "https://www.vinted.fr/member/123456789-username",
      },
      vivareal_property: {
        query:
          "https://www.vivareal.com.br/imovel/apartamento-3-quartos-brooklin-zona-sul-sao-paulo-com-garagem-186m2-venda-RS3710000-id-2776423622/",
      },
      vivareal_search: { query: "São Paulo" },
      walmart_product: {
        query:
          "https://www.walmart.com/ip/Fresh-Rockit-Crisp-Sweet-Miniature-Apples-3lb-Tub/309762096",
      },
      walmart_search: { query: "https://www.walmart.com/search?q=apples" },
      walmart_suggest: { query: "apples" },
      website_antibot: { query: "https://www.example.com" },
      website_crawler: { query: "https://example.com" },
      website_email_phone_extractor: { query: "https://www.hexa.cc" },
      website_rendering: { query: "https://example.com" },
      website_screenshot: { url: "https://www.amazon.com/s?k=pokemon" },
      website_technology: { query: "https://example.com" },
      website_webunlocker: {
        query:
          "https://www.norauto.fr/t/pneu/w-185-h-55-r-14/ete-s/80-l-h-q.html",
      },
      weibo_post_info: { query: "test" },
      weibo_search: { query: "test" },
      welcometothejungle_company: { query: "alan" },
      welcometothejungle_search: { query: "python" },
      wellfound_company_info: {
        query: "https://wellfound.com/company/dataiku",
      },
      x_post_info: {
        query: "https://x.com/example-user/status/0000000000000000001",
      },
      x_profile_info: { query: "elonmusk" },
      yahoo_search: { query: "test" },
      yellowpages_business: {
        query:
          "https://www.yellowpages.com/los-angeles-ca/mip/anawalt-lumber-13945594?lid=1002108313121",
      },
      yellowpages_search: {
        query: "https://www.yellowpages.com/los-angeles-ca/plumbers",
      },
      yelp_business: {
        query: "https://www.yelp.com/biz/novela-san-francisco-2",
      },
      yelp_reviews: { query: "cX5dOMkwZ5rqWbeIJpw_Ig" },
      yelp_search: {
        query:
          "https://www.yelp.com/search?find_desc=Cocktail+Bars&find_loc=San+Francisco%2C+CA",
      },
      zapimoveis_ad: {
        query:
          "https://www.zapimoveis.com.br/imovel/venda-apartamento-3-quartos-mobiliado-jardim-paulista-zona-sul-sao-paulo-sp-170m2-id-2912096343/",
      },
      zapimoveis_search: { query: "São Paulo" },
      zazzle_product: {
        query:
          "https://www.zazzle.com/branded_logo_two_tone_coffee_mug-256528848440338952.",
      },
      zazzle_search: { query: "coffee mug. A product URL returns 400." },
      zillow_property: {
        query:
          "https://www.zillow.com/homedetails/20-Kyle-Ct-Staten-Island-NY-10312/32361983_zpid/",
      },
      zillow_search: { query: "https://www.zillow.com/staten-island-ny/" },
      zonaprop_property: {
        query:
          "https://www.zonaprop.com.ar/propiedades/clasificado/veclapin-venta-departamento-2-ambientes-villa-crespo-59096735.html",
      },
      zonaprop_search: { query: "capital federal" },
      zoopla_property: {
        query: "https://www.zoopla.co.uk/to-rent/details/73119609/",
      },
      zoopla_search: {
        query: "https://www.zoopla.co.uk/for-sale/property/manchester/",
      },
      zooplus_product: { query: "705321" },
      zooplus_search: { query: "croquettes" },
      zoro_product: {
        query:
          "https://www.zoro.com/3m-safety-glasses-securefit-200-series-scotchgard-anti-fog-frameless-blue-temples-clear-lens-sf201sgaf-blu/i/G1937045/",
      },
      zoro_search: { query: "safety glasses" },
    };
    for (const [name, endpoint] of Object.entries(ENDPOINTS)) {
      const method = name.replace(/_([a-z0-9])/g, (_m, c: string) =>
        c.toUpperCase(),
      );
      assert.equal(
        typeof client[method],
        "function",
        `missing method ${method}`,
      );
      await client[method]!.call(client, required[name] ?? {});
      const call = calls.at(-1)!;
      const expectedPath = endpoint.path.replace(/\{[^}]+\}/g, "test");
      assert.equal(call.url.pathname, expectedPath, name);
      assert.equal(call.init.method, endpoint.methods[0], name);
    }
    assert.equal(calls.length, Object.keys(ENDPOINTS).length);
  });
});

describe("responses", () => {
  it("returns binary bodies with their content type", async () => {
    const bytes = new Uint8Array([137, 80, 78, 71]);
    const { fetch } = mockFetch(
      () => new Response(bytes, { headers: { "content-type": "image/png" } }),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch });
    const response = await client.request("GET", "/v1/anything");
    assert.equal(response.kind, "binary");
    if (response.kind === "binary") {
      assert.deepEqual([...response.bytes], [...bytes]);
      assert.equal(response.contentType, "image/png");
    }
  });

  it("rejects a non-JSON success for a JSON operation", async () => {
    const { fetch } = mockFetch(
      () =>
        new Response("<html>", { headers: { "content-type": "text/html" } }),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await assert.rejects(
      client.amazonProduct({ query: "B09DFCB66S" }),
      PiloterrResponseDecodingError,
    );
  });

  it("maps API errors", async () => {
    const { fetch } = mockFetch(() =>
      jsonResponse({ error: "Invalid API Key" }, 401),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch });
    const error = await client
      .request("GET", "/v1/usage")
      .catch((e: unknown) => e);
    assert.ok(error instanceof PiloterrApiError);
    assert.equal(error.status, 401);
    assert.equal(error.message, "Invalid API Key");
    assert.deepEqual(error.responseBody, { error: "Invalid API Key" });
  });

  it("keeps non-JSON error bodies", async () => {
    const { fetch } = mockFetch(
      () => new Response("Bad gateway", { status: 502 }),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch, maxRetries: 0 });
    const error = await client
      .request("GET", "/v1/usage")
      .catch((e: unknown) => e);
    assert.ok(error instanceof PiloterrApiError);
    assert.equal(error.status, 502);
    assert.equal(
      new TextDecoder().decode(error.rawResponse.body),
      "Bad gateway",
    );
  });

  it("wraps transport failures", async () => {
    const client = new PiloterrClient({
      apiKey: "k",
      maxRetries: 0,
      fetch: async () => {
        throw new TypeError("network down");
      },
    });
    await assert.rejects(
      client.request("GET", "/v1/usage"),
      PiloterrTransportError,
    );
  });

  it("propagates caller cancellation", async () => {
    const controller = new AbortController();
    controller.abort(new Error("stop"));
    const client = new PiloterrClient({
      apiKey: "k",
      fetch: mockFetch().fetch,
    });
    await assert.rejects(
      client.request("GET", "/v1/usage", null, { signal: controller.signal }),
      /stop/,
    );
  });
});

describe("retries", () => {
  it("retries retryable statuses, then succeeds", async () => {
    const statuses = [503, 429, 200];
    const { fetch, calls } = mockFetch(() =>
      jsonResponse({ ok: true }, statuses.shift()!),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch, retryDelay: 1 });
    const response = await client.request("GET", "/v1/usage");
    assert.equal(response.kind, "json");
    assert.equal(calls.length, 3);
  });

  it("gives up after maxRetries", async () => {
    const { fetch, calls } = mockFetch(() =>
      jsonResponse({ error: "busy" }, 503),
    );
    const client = new PiloterrClient({
      apiKey: "k",
      fetch,
      retryDelay: 1,
      maxRetries: 2,
    });
    await assert.rejects(client.request("GET", "/v1/usage"), PiloterrApiError);
    assert.equal(calls.length, 3);
  });

  it("never retries client errors", async () => {
    const { fetch, calls } = mockFetch(() =>
      jsonResponse({ error: "Payment required" }, 402),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch, retryDelay: 1 });
    await assert.rejects(client.request("GET", "/v1/usage"), PiloterrApiError);
    assert.equal(calls.length, 1);
  });

  it("retries network errors and honours Retry-After", async () => {
    let n = 0;
    const client = new PiloterrClient({
      apiKey: "k",
      retryDelay: 1,
      fetch: async () => {
        n++;
        if (n === 1) throw new TypeError("socket hang up");
        if (n === 2)
          return new Response("{}", {
            status: 429,
            headers: { "retry-after": "0", "content-type": "application/json" },
          });
        return jsonResponse({ ok: true });
      },
    });
    await client.request("GET", "/v1/usage");
    assert.equal(n, 3);
  });

  it("retries 401 rate limits but not per-key quotas or invalid keys", async () => {
    const cases: [string, number][] = [
      [
        "Rate limit exceeded: You've exceeded the rate limit on your subscription",
        2,
      ],
      ["Rate limit exceeded for the API key: quota daily", 1],
      ["Invalid API Key", 1],
    ];
    for (const [message, expectedCalls] of cases) {
      let n = 0;
      const { fetch, calls } = mockFetch(() =>
        n++ === 0
          ? jsonResponse({ error: message }, 401)
          : jsonResponse({ ok: true }),
      );
      const client = new PiloterrClient({ apiKey: "k", fetch, retryDelay: 1 });
      await client.request("GET", "/v1/usage").catch(() => undefined);
      assert.equal(calls.length, expectedCalls, message);
    }
  });

  it("lets one request override the retry count", async () => {
    const { fetch, calls } = mockFetch(() => jsonResponse({}, 500));
    const client = new PiloterrClient({ apiKey: "k", fetch, retryDelay: 1 });
    await assert.rejects(
      client.request("GET", "/v1/usage", null, { maxRetries: 0 }),
      PiloterrApiError,
    );
    assert.equal(calls.length, 1);
  });
});

describe("batch", () => {
  it("keeps input order, isolates failures and caps concurrency", async () => {
    const client = new PiloterrClient({
      apiKey: "k",
      fetch: mockFetch().fetch,
    });
    let running = 0;
    let peak = 0;
    const results = await client.batch(
      [1, 2, 3, 4, 5, 6],
      async (n) => {
        running++;
        peak = Math.max(peak, running);
        await new Promise((resolve) => setTimeout(resolve, 5));
        running--;
        if (n === 4) throw new Error("boom");
        return n * 10;
      },
      { concurrency: 2 },
    );
    assert.equal(peak, 2);
    assert.deepEqual(
      results.map((r) => (r.status === "fulfilled" ? r.value : "failed")),
      [10, 20, 30, "failed", 50, 60],
    );
    assert.equal(results[3]!.index, 3);
  });

  it("runs SDK calls", async () => {
    const { fetch, calls } = mockFetch(() => jsonResponse({ ok: true }));
    const client = new PiloterrClient({ apiKey: "k", fetch });
    const results = await client.batch(["a", "b", "c"], (q) =>
      client.request("GET", "/v1/usage", { q }),
    );
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 3);
    assert.equal(calls.length, 3);
  });
});

describe("waitForJob", () => {
  it("polls until the job reaches a terminal status", async () => {
    const statuses = ["Queued", "Running", "CompletedJob"];
    const { fetch, calls } = mockFetch(() =>
      jsonResponse({ status: statuses.shift(), progress: 50 }),
    );
    const client = new PiloterrClient({ apiKey: "k", fetch });
    const seen: unknown[] = [];
    const job = await client.waitForJob("abc", {
      intervalMs: 1,
      onProgress: (j) => seen.push(j),
    });
    assert.equal(job.data.status, "CompletedJob");
    assert.equal(calls.length, 3);
    assert.equal(calls[0]!.url.pathname, "/v1/jobs/abc");
    assert.equal(seen.length, 3);
  });

  it("times out", async () => {
    const { fetch } = mockFetch(() => jsonResponse({ status: "Running" }));
    const client = new PiloterrClient({ apiKey: "k", fetch });
    await assert.rejects(
      client.waitForJob("abc", { intervalMs: 5, timeoutMs: 1 }),
      /did not finish/,
    );
  });
});
