import { Router } from "express";
import aiPriceService from "../service/aiPriceService.js";

const aiPriceController = Router();

aiPriceController.post("/megaparts-prices", async (req, res) => {

    try {
        const { items } = req.body;

        const prices = await aiPriceService.getPrices(items)
        res.json({ prices })
        
    } catch (err) {
        console.error("AI price error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default aiPriceController;