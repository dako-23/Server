// import OpenAI from "openai";

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export default {
//     async getPhrases(items) {
//         const vectorStoreId = process.env.VECTOR_STORE_ID

//         const results = [];

//         for (const item of items) {
//             const { id, imageUrl, detailsUrl } = item;

//             const response = await client.responses.create({
//                 model: "gpt-4.1-mini",
//                 temperature: 0,
//                 tool_choice: { type: "file_search" },
//                 tools: [
//                     {
//                         type: "file_search",
//                         vector_store_ids: [vectorStoreId],
//                         max_num_results: 25,
//                     },
//                 ],
//                 input: [
//                     {
//                         role: "user",
//                         content: [
//                             {
//                                 type: "input_text",
//                                 text: `Избери ТОЧНО ЕДНА фраза от каталога (vector store),
//                                         която най-точно описва частта на изображението.
//                                         Нямаш право да измисляш нови фрази НИКОГА НЕ СИ ГО ПОЗВОЛЯВАЙ.
//                                         Правила за избор:
//                                         - Ако на изображението ясно се вижда ЕДНА основна авточаст,
//                                         избери най-конкретната фраза за тази част.
//                                         - Ако на изображението се вижда КОМПЛЕКТ или сглобка
//                                         от няколко части, които обичайно се продават заедно,
//                                         (кабели, лентов кабел, букси, крепежи),
//                                         избери фразата за ОСНОВНАТА част, а не за аксесоарите.
//                                         ВИНАГИ ИЗБИРАЙ САМО ОТ VECTOR STORE

//                                         Пример:
//                                         - Лостчета за светлини и чистачки + лентов кабел → избери
//                                         "Лостчета за светлини и чистачки", а НЕ "Лентов кабел".
//                                         Върни САМО валиден JSON: {"phrase":"<фраза от каталога>"}`
//                             },
//                             {
//                                 type: "input_image",
//                                 image_url: imageUrl,
//                             },
//                         ],
//                     },
//                 ],
//             });

//             const rawText =
//                 response.output_text ||
//                 response.output?.[0]?.content?.[0]?.text ||
//                 "";

//             let phrase = "";
//             try {
//                 const parsed = JSON.parse(rawText);
//                 phrase = parsed.phrase || "";
//             } catch {
//                 phrase = "";
//             }

//             results.push({
//                 id,
//                 phrase,
//                 detailsUrl,
//             });
//         }
//         return results;
//     }
// }

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.join(__dirname, "../embeddings/phrases.embedded.json");
const CATALOG = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));

function cosine(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

export default {
    async getPhrases(items) {

        const results = [];
        const THRESHOLD = 0.75;

        for (const { id, imageUrl, detailsUrl } of items) {
            const r1 = await client.responses.create({
                model: "gpt-4.1-mini",
                temperature: 0,
                input: [{
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: `Определи ОСНОВНАТА авточаст на снимката.
                           Правила:
                           - Ако ясно се вижда ЕДНА основна част, върни възможно най-конкретно име за нея.
                           - Ако се вижда комплект/сглобка (кабели, лентов кабел, букси, крепежи, пластмаси около нея),
                           избери името на ОСНОВНАТА част, а не на аксесоарите.
                           
                           Пример:
                           - "Лостчета за светлини и чистачки" + "лентов кабел" → label трябва да е "Лостчета за светлини и чистачки", НЕ "Лентов кабел".
                           Формат:
                           Върни САМО валиден JSON: {"label":"..."}.
                           label да е 2–6 думи на български, без обяснения.`
                        },
                        { type: "input_image", image_url: imageUrl }
                    ]
                }]
            });

            const raw1 = r1.output_text || r1.output?.[0]?.content?.[0]?.text || "";
            let label = "";
            try { label = (JSON.parse(raw1).label || "").trim(); } catch { label = ""; }

            const r2 = await client.embeddings.create({
                model: "text-embedding-3-small",
                input: label || "авточаст"
            });
            const q = r2.data[0].embedding;

            let bestPhrase = "";
            let bestScore = -1;

            for (const p of CATALOG) {
                const score = cosine(q, p.embedding);
                if (score > bestScore) {
                    bestScore = score;
                    bestPhrase = p.phrase;
                }
            }

            results.push({
                id,
                detailsUrl,
                phrase: bestScore >= THRESHOLD ? bestPhrase : "",
                debug: { label, score: bestScore }
            });
        }

        return results;
    }
};
