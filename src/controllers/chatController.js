import { Router } from 'express';
import socketService from '../service/socketService.js';

const chatController = Router();

chatController.get('/:groupId', async (req, res) => {
    try {
        const messages = await socketService.getMessages(req.params.groupId);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load chat history' });
    }
});

chatController.post('/:groupId/send', async (req, res) => {
    const { senderId, message } = req.body;
    try {
        const savedMessage = await socketService.saveMessage(req.params.groupId, senderId, message);
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default chatController;