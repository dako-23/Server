import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default {
    async getPhrases(items) {
        const vectorStoreId = process.env.VECTOR_STORE_ID;

        const tasks = items.map(async (item) => {
            const { id, imageUrl, detailsUrl } = item;

            const response = await client.responses.create({
                model: "gpt-4.1",
                temperature: 0,
                tool_choice: { type: "file_search" },
                tools: [
                    {
                        type: "file_search",
                        vector_store_ids: [vectorStoreId],
                        max_num_results: 25,
                    },
                ],
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: `
                                Каталогът (vector store) съдържа JSON записи:
                                {"phrase":"...", "description":"..."}
                                
                                Задача:
                                - избери ТОЧНО ЕДНА фраза от каталога,
                                - която най-точно описва основната част на изображението.
                                
                                Забрани:
                                - не измисляй нови фрази
                                - не променяй текста (число, добавки, редакции)
                                - винаги връщай фраза (никога празен стринг)
                                
                                Правила:
                                - ако е ясно видима една авточаст → избери най-конкретната фраза
                                - ако е комплект/сглобка → избери основната част, не аксесоарите
                                - ако има близки фрази → ориентирай се по "description"
                                - ако има разлика единствено/множествено → избери тази, която съответства видимо на изображението
                                
                                Изход (само валиден JSON):
                                {"phrase":"<фраза от каталога>"}
                                `,
                            },
                            {
                                type: "input_image",
                                image_url: imageUrl,
                            },
                        ],
                    },
                ],
            });

            const rawText =
                response.output_text ||
                response.output?.[0]?.content?.[0]?.text ||
                "";

                console.log('raw text =>', rawText);

            let phrase = "";
            try {
                const parsed = JSON.parse(rawText);
                phrase = parsed.phrase || "";
            } catch {
                phrase = "";
            }

            return {
                id,
                phrase,
                detailsUrl,
            };
        });

        const results = await Promise.all(tasks);
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
