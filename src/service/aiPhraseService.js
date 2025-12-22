import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default {
    async getPhrases(items) {
        const vectorStoreId = process.env.VECTOR_STORE_ID

        const results = [];

        for (const item of items) {
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
                                text: 
                                `
                                Каталогът (vector store) съдържа записи в JSON формат, по един на ред, със структура:
                                {"phrase": "<фраза>", "description": "<кратко описание на частта>"}

                                Твоята задача е:
                                - Да избереш ТОЧНО ЕДНА фраза от каталога,
                                - която НАЙ-ТОЧНО описва основната част на изображението.

                                МНОГО ВАЖНО:
                                - НЯМАШ право да измисляш нови фрази.
                                - НЕ МОЖЕШ да променяш фразите (не сменяй число, не добавяй думи, не поправяй правопис).
                                - Върни фразата ТОЧНО така, както е записана в полето "phrase" в каталога.
                                
                                Правила за избор:
                                - Ако на изображението ясно се вижда ЕДНА основна авточаст,
                                  избери най-конкретната фраза за тази част.
                                - Ако на изображението се вижда КОМПЛЕКТ или сглобка от няколко части,
                                  които обичайно се продават заедно (кабели, лентов кабел, букси, крепежи),
                                  избери фразата за ОСНОВНАТА част, а не за аксесоарите.
                                - Ако няколко фрази са много близки, избери тази,
                                  чиято "description" най-добре съвпада с изображението.
                                - Ако не си сигурен между единствено и множествено число,
                                  избери тази фраза, чиято форма НАЙ-ДОБРЕ съответства на това,
                                  което реално се вижда (една част vs. няколко части),
                                  но винаги копирай фразата ТОЧНО от каталога.
                                
                                Пример:
                                - На изображението има лостчета за светлини и чистачки + лентов кабел → избираш
                                  "Лостчета за светлини и чистачки", а НЕ "Лентов кабел".
                                
                                Изход:
                                Върни САМО валиден JSON с точно копирана фраза от каталога:
                                {"phrase": "<фраза от каталога>"}
                                Без допълнителен текст преди или след JSON-а.
                                `
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

            let phrase = "";
            try {
                const parsed = JSON.parse(rawText);
                phrase = parsed.phrase || "";
            } catch {
                phrase = "";
            }

            results.push({
                id,
                phrase,
                detailsUrl,
            });
        }
        return results;
    }
}

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
