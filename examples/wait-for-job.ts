import { PiloterrClient } from "@piloterr/sdk";

const client = new PiloterrClient({ apiKey: process.env.PILOTERR_API_KEY });

const submitted = await client.amazonProduct({
  query: "B09DFCB66S",
  is_async: true,
});
const job = await client.waitForJob(submitted.data.job_id, {
  onProgress: (j) => console.log(`${j.status} ${j.progress ?? 0}%`),
});
console.log(JSON.stringify(job.data, null, 2));
