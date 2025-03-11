import Message from "../models/Message.js";
import User from "../models/User.js";

export default {
    async saveMessage(groupId, senderId, message, username) {

        return await Message.create({ groupId, senderId, message, username });
    },

    async getMessages(groupId) {
        return await Message.find({ groupId })
            .sort({ timestamp: 1 })
            .populate("senderId", "username"); // 🔹 Връща username вместо ID
    }
};
