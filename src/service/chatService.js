import Message from "../models/Message.js";

export default {
    async saveMessage(groupId, senderId, message) {
        return await Message.create({ groupId, senderId, message });
    },

    async getMessages(groupId) {
        return await Message.find({ groupId })
            .sort({ timestamp: 1 })
            .populate("senderId", "username"); // 🔹 Връща username вместо ID
    }
};
