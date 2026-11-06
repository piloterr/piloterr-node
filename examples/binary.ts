import { writeFile } from "node:fs/promises";
import { PiloterrClient } from "@piloterr/sdk";

const client = new PiloterrClient({ apiKey: process.env.PILOTERR_API_KEY });

const response = await client.websiteScreenshot({ url: "https://example.com" });
if (response.kind === "binary") {
  await writeFile("screenshot.png", response.bytes);
  console.log(
    `Saved screenshot.png (${response.contentType}, ${response.bytes.length} bytes)`,
  );
} else {
  console.log(JSON.stringify(response.data, null, 2));
}
