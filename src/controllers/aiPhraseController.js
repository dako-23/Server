import { Router } from "express";
import aiPhraseService from "../service/aiPhraseService.js";

const aiPhraseController = Router();

aiPhraseController.post("/megaparts-phrases", async (req, res) => {

    try {
        const { items } = req.body;

        const phrases = await aiPhraseService.getPhrases(items)
        res.json({ phrases })
        
    } catch (err) {
        console.error("AI phrases error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default aiPhraseController;