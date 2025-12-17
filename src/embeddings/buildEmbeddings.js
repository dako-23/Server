import fs from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INPUT = './phrases.json';
const OUTPUT = './phrases.embedded.json';
const MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 200;

const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const phrases = raw.map(x => (x.phrase || '').trim()).filter(Boolean);
const unique = [...new Set(phrases)];

console.log(`Total phrases: ${unique.length}`);

const embedded = [];

for (let i = 0; i < unique.length; i += BATCH_SIZE) {
  const chunk = unique.slice(i, i + BATCH_SIZE);

  const resp = await client.embeddings.create({ model: MODEL, input: chunk });

  for (let j = 0; j < chunk.length; j++) {
    embedded.push({ phrase: chunk[j], embedding: resp.data[j].embedding });
  }

  console.log(`Embedded ${Math.min(i + BATCH_SIZE, unique.length)} / ${unique.length}`);
}

fs.writeFileSync(OUTPUT, JSON.stringify(embedded, null, 2), 'utf8');
console.log(`Saved: ${OUTPUT}`);
