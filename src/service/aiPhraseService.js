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
                model: "gpt-4.1-mini",
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
                                text: `Избери ТОЧНО ЕДНА фраза от каталога (vector store),
                                        която най-точно описва частта на изображението.
                                        Нямаш право да измисляш нови фрази НИКОГА НЕ СИ ГО ПОЗВОЛЯВАЙ.
                                        Правила за избор:
                                        - Ако на изображението ясно се вижда ЕДНА основна авточаст,
                                        избери най-конкретната фраза за тази част.
                                        - Ако на изображението се вижда КОМПЛЕКТ или сглобка
                                        от няколко части, които обичайно се продават заедно,
                                        (кабели, лентов кабел, букси, крепежи),
                                        избери фразата за ОСНОВНАТА част, а не за аксесоарите.
                                        ВИНАГИ ИЗБИРАЙ САМО ОТ VECTOR STORE

                                        Пример:
                                        - Лостчета за светлини и чистачки + лентов кабел → избери
                                        "Лостчета за светлини и чистачки", а НЕ "Лентов кабел".
                                        Върни САМО валиден JSON: {"phrase":"<фраза от каталога>"}`
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