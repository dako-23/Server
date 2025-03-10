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

chatController.post('/:groupId/send', async (req, res) => {
    try {
        const { senderId, message } = req.body;
        const newMessage = await chatService.saveMessage(req.params.groupId, senderId, message);
        
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default chatController;
