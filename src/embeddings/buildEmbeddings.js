import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INPUT = "./phrases.json";
const OUTPUT = "./phrases.embedded.json";
const MODEL = "text-embedding-3-small";
const BATCH_SIZE = 200;

const raw = JSON.parse(fs.readFileSync(INPUT, "utf8"));

const items = raw
  .map(x => ({
    phrase: (x.phrase || "").trim(),
    description: (x.description || "").trim(),
  }))
  .filter(x => x.phrase);

console.log(`Total phrases: ${items.length}`);

const embedded = [];

for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const chunk = items.slice(i, i + BATCH_SIZE);

  const inputTexts = chunk.map(
    x => `${x.phrase}. ${x.description}`.trim()
  );

  const resp = await client.embeddings.create({
    model: MODEL,
    input: inputTexts,
  });

  for (let j = 0; j < chunk.length; j++) {
    embedded.push({
      phrase: chunk[j].phrase,
      description: chunk[j].description,
      embedding: resp.data[j].embedding,
    });
  }

  console.log(`Embedded ${Math.min(i + BATCH_SIZE, items.length)} / ${items.length}`);
}

fs.writeFileSync(OUTPUT, JSON.stringify(embedded, null, 2), "utf8");
console.log(`Saved: ${OUTPUT}`);
