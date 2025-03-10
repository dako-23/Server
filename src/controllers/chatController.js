import { Router } from "express";
import chatService from "../service/chatService.js";

const chatController = Router();

// 📌 Връща историята на чата за дадена група
chatController.get("/:groupId", async (req, res) => {
    try {
        const messages = await chatService.getMessages(req.params.groupId);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to load chat history" });
    }
});

export default chatController;
