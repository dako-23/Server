import Message from "../models/Message.js";
import User from "../models/User.js";

export default {
    async saveMessage(groupId, senderId, message) {
        const user = await User.findById(senderId).select("username imageUrl");

        return await Message.create({ groupId, senderId, username: user.username, message, imageUrl: user.imageUrl });
    },

    async getMessages(groupId) {
        return await Message.find({ groupId })
            .sort({ timestamp: 1 })
            .populate("senderId", "username imageUrl"); // 🔹 Връща username вместо ID
    }
};
