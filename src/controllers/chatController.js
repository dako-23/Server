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

export default chatController;
