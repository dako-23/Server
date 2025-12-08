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
- Частите са втора употреба / рециклирани, не нови от дилър.
- Опирай се основно на пазара в България (Megaparts, Krik, OLX и други авто морги).
- Дай пазарна цена, на която може да се продаде частта онлайн.

Върни САМО валиден JSON със структура:
{"prices":[число,число,...]}

Брой елементи в "prices" трябва да е точно колкото описанията.

Описания:
${items.map((t, i) => `${i + 1}. ${t}`).join("\n")}
`;

        const response = await client.responses.create({
            model: "gpt-4.1", 
            tools: [
                {
                    type: "web_search_preview",
                },
            ],
            input: prompt,
        });
        const rawText = response.output_text;

        let json;
        try {
            json = JSON.parse(rawText);
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