import OpenAI from "openai";
import { getAveragePrice } from "./localPriceService.js";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default {
    async getPrices(items) {

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Няма избрани авто части.')
        }

        const enriched = await Promise.all(
            items.map(async (phrase) => {
                const avg = await getAveragePrice(phrase);
                return { phrase, localAveragePrice: avg };
            })
        );
        
        const prompt = `
Ти си асистент за оценка на цени на употребявани авточасти в България.

Получаваш списък от части, всяка със:
- phrase: пълното описание
- localAveragePrice: средна цена от нашата складова система (може да е null)

Внимавай:
- Частите са втора употреба, не нови от дилър.
- Ако localAveragePrice НЕ е null → използвай я като основна отправна точка. Може леко да я коригираш нагоре/надолу според пазара (Megaparts, Europartsbg, Carco, Krik, OLX, Bazar, Alo.bg).
- Ако localAveragePrice е null → определяй цена само по външния пазар.
- Ако диапазонът е твърде широк, използвай усреднена стойност (не твърде ниска, не твърде висока).
- Цената трябва да бъде в ЛЕВА и да е подходяща за онлайн продажба.
- НИКОГА не връщай 0. Ако няма точна информация, върни най-близката разумна пазарна стойност.
- Ако няма директни резултати, използвай аналогични модели / поколения / версии на частта.
- Ако диапазонът е широк, използвай усреднена стойност.

- Винаги връщай точен валиден JSON във формат:
{"prices":[число,число,...]}

Брой елементи в 'prices' трябва да е точно колкото описанията.

Ето данните:
${JSON.stringify(enriched, null, 2)}
`;

        const response = await client.responses.create({
            model: "gpt-4.1",
            temperature: 0.2,
            tools: [{ type: "web_search_preview" }],
            input: prompt,
        });

        const rawText = response.output_text.trim();

        const cleaned = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let json;
        try {
            json = JSON.parse(cleaned);
        } catch (err) {
            throw new Error("Моделът върна невалиден JSON: " + rawText);
        }

        if (!json || !Array.isArray(json.prices) || json.prices.length !== items.length) {
            throw new Error("Моделът не върна коректен масив prices[]");
        }

        return json.prices.map((p) => Number(p));
    }
};
