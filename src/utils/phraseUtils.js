import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const classifyItems = (items) => {
    const vectorStoreId = process.env.VECTOR_STORE_ID;

    return items.map(async (item) => {
        const { id, imageUrl, detailsUrl } = item;

        const response = await client.responses.create({
            model: "gpt-4.1",
            temperature: 0,
            response_format: { type: "json_object" },
            tool_choice: { type: "file_search" },
            tools: [
                {
                    type: "file_search",
                    vector_store_ids: [vectorStoreId],
                    max_num_results: 8,
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
            max_output_tokens: 50,
        });

        let rawText = "";

        if (response.output_text) {
            rawText = response.output_text;
        } else if (response.output?.[0]?.content) {
            const content = response.output[0].content;
            const textPart = content.find(
                (c) => c.type === "output_text" || c.type === "text"
            );

            if (textPart?.output_text?.text) {
                rawText = textPart.output_text.text;
            } else if (textPart?.text) {
                rawText = textPart.text;
            }
        }

        console.log("RAW TEXT:", rawText);

        let phrase = "";
        try {
            const parsed = typeof rawText === "string" ? JSON.parse(rawText) : rawText;
            phrase = parsed?.phrase || "";
        } catch (err) {
            console.error("Грешка при JSON.parse:", err, "RAW:", rawText);
            phrase = "";
        }

        return {
            id,
            phrase,
            detailsUrl,
        };
    });
};
