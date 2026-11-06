import { PiloterrClient } from "@piloterr/sdk";

const client = new PiloterrClient({ apiKey: process.env.PILOTERR_API_KEY });

const response = await client.amazonProduct({ query: "B09DFCB66S" });
console.log(JSON.stringify(response.data, null, 2));
