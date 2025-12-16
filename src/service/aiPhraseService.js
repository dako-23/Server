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
                        max_num_results: 50,
                    },
                ],
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: `
                                "Имаш каталог от авто-части във vector store. " +
                                "ЗАДЪЛЖИТЕЛНО използвай file_search и избери ТОЧНО ЕДНА фраза, " +
                                "която съществува в каталога. Нямаш право да измисляш нови фрази. " +
                                "Върни САМО JSON: {\"phrase\":\"...\"}. " +
                                "Ако не си сигурен, избери най-близката фраза от намерените кандидати."
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