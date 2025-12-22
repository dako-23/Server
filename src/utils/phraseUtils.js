import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const cleanLabel = (ph) => {
    return (ph || "")
        .toLowerCase()
        .replace(/\b(за|на|към|от|с|и|автомобил|автомобилен|автомобилна|автомобилно)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


export const cosine = (a, b) => {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

export const classifyItems = (items) => {
    const vectorStoreId = process.env.VECTOR_STORE_ID;

    return items.map(async (item) => {
        const { id, imageUrl, detailsUrl } = item;

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            temperature: 0,
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
            max_output_tokens: 30
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

        return {
            id,
            phrase,
            detailsUrl,
        };
    });
}
