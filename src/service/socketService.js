import Message from '../models/Message.js';

export default {
    async saveMessage(groupId, senderId, message) {
        return Message.create({ groupId, senderId, message });
    },

    async getMessages(groupId) {
        return Message.find({ groupId }).sort({ timestamp: 1 }).populate('senderId', 'email');
    }
};
