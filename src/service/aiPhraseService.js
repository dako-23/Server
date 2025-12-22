import { classifyItems } from "../utils/phraseUtils.js";

export default {
    async getPhrases(items) {

        const batchSize = 6;
        const batches = [];

        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }

        const results = [];

        for (const batch of batches) {
            const tasks = classifyItems(batch);
            const batchResults = await Promise.all(tasks);
            results.push(...batchResults);

            await new Promise((r) => setTimeout(r, 500));
        }

        return results;
    },
};


// import fs from "node:fs";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import { cleanLabel, cosine } from "../utils/phraseUtils.js";
// import OpenAI from "openai";

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const CATALOG_PATH = path.join(__dirname, "../embeddings/phrases.embedded.json");
// const CATALOG = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));

// export default {
//     async getPhrases(items) {

//         const results = [];
//         const THRESHOLD = 0.75;

//         for (const { id, imageUrl, detailsUrl } of items) {
//             const r1 = await client.responses.create({
//                 model: "gpt-4.1",
//                 temperature: 0,
//                 input: [{
//                     role: "user",
//                     content: [
//                         {
//                             type: "input_text",
//                             text: `Определи авто частта на снимката.
//                            Правила:
//                            - Ако ясно се вижда ЕДНА основна част, и има конкретни белези на нещо специфично (форма, рисунка, детайл) върни възможно най-конкретно име за нея.
//                            - Ако се вижда комплект/сглобка (кабели, лентов кабел, букси, крепежи, пластмаси около нея),избери името на ОСНОВНАТА част, а не на аксесоарите.
                           
//                            Пример:
//                            - "Лостчета за светлини и чистачки" + "лентов кабел" → label трябва да е "Лостчета за светлини и чистачки", НЕ "Лентов кабел".
//                            Формат:
//                            Върни САМО валиден JSON: {"label":"..."}.
//                            label да е 2–6 думи на български, без обяснения.`
//                         },
//                         { type: "input_image", image_url: imageUrl }
//                     ]
//                 }]
//             });

//             const raw1 = r1.output_text || r1.output?.[0]?.content?.[0]?.text || "";
//             let label = "";
//             try {
//                 label = (JSON.parse(raw1).label || "").trim();
//             } catch {
//                 label = "";
//             }

//             const cleanedLabel = cleanLabel(label);

//             const r2 = await client.embeddings.create({
//                 model: "text-embedding-3-small",
//                 input: cleanedLabel || "авточаст"
//             });
//             const q = r2.data[0].embedding;

//             let bestPhrase = "";
//             let bestScore = -1;
//             let bestDescription = ''

//             for (const p of CATALOG) {
//                 const score = cosine(q, p.embedding);
//                 if (score > bestScore) {
//                     bestScore = score;
//                     bestPhrase = p.phrase;
//                     bestDescription = p.description
//                 }
//             }

//             results.push({
//                 id,
//                 detailsUrl,
//                 phrase: bestScore >= THRESHOLD ? bestPhrase : "",
//                 debug: { label, cleanedLabel, score: bestScore, description: bestDescription }
//             });
//         }

//         return results;
//     }
// };
