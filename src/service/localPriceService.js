import PartHistory from '../models/PartHistory.js';

export async function getAveragePrice(phrase) {
    if (!phrase || typeof phrase !== 'string') {
        return null;
    }

    const result = await PartHistory
        .find({ phrase: { $regex: `^${phrase}$`, $options: 'i' } })
        .limit(5)
        .lean();

    if (!result.length) return null;

    const prices = result
        .map(r => Number(r.price))
        .filter(p => !Number.isNaN(p));

    if (!prices.length) return null;

    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

    return avg;
}
