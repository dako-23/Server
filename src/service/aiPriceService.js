import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default {
    async getPrices(items) {

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('Няма избрани авто части.')
        }

        const prompt = `
Ти си асистент за оценка на цени на употребявани авточасти в България.
За всяко описание на част ВЪРНИ ориентировъчна продажна цена в ЛЕВА.

Внимавай:
- Частите са втора употреба, не нови от дилър.
- Опирай се основно на пазара в България (Megaparts, Europartsbg, Carco, Krik, OLX, Bazar, Alo.bg и други авто морги и разкомплектовки).
- Цената трябва да бъде базирана на СРЕДНАТА пазарна стойност от наличните обяви за тази или аналогична част.
- Ако диапазонът е твърде широк, използвай усреднена стойност (не твърде ниска, не твърде висока).
- Дай цена, на която частта реалистично може да се продаде онлайн.
- НИКОГА не връщай 0. Ако няма точна информация, върни най-близката разумна пазарна стойност.
- Ако няма директни резултати, използвай аналогични модели / поколения / версии на частта.

Върни САМО валиден JSON със структура:
{"prices":[число,число,...]}

Брой елементи в 'prices' трябва да е точно колкото описанията.

Описания:
${items.map((t, i) => `${i + 1}. ${t}`).join("\n")}
`;

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            tools: [
                {
                    type: "web_search_preview",
                },
            ],
            input: prompt,
        });
        const rawText = response.output_text;

        let cleaned = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let json;
        try {
            json = JSON.parse(cleaned);
        } catch (e) {
            throw new Error(`Неуспешен JSON от модела:${rawText}`);
        }

        if (!json || !Array.isArray(json.prices)) {
            throw new Error('Missing prices[] in model output');
        }

        const prices = json.prices.map((p) => Number(p));

        return prices
    }
}