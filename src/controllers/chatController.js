import { Router } from 'express';
import messageService from '../services/messageService.js';

const chatController = Router();

chatController.get('/:groupId', async (req, res) => {
    try {
        const messages = await messageService.getMessages(req.params.groupId);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load chat history' });
    }
});

export default chatController;
