import { Router } from "express";
import socketService from "../service/socketService.js";

const chatController = Router();

chatController.post("/:groupId/send", async (req, res) => {
    try {
        const { senderId, message } = req.body;
        const { groupId } = req.params;

        // **🔹 Проверка дали вече е записано**
        const existingMessage = await socketService.getLastMessage(groupId, senderId, message);
        if (existingMessage) {
            return res.status(400).json({ error: "Duplicate message detected." });
        }

        // **📌 Запис в базата**
        const newMessage = await socketService.saveMessage(groupId, senderId, message);

        // **📌 Изпращане до групата**
        req.io.to(groupId).emit("receiveMessage", newMessage);

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Failed to send message." });
    }
});

export default chatController;
