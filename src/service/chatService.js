import Message from "../models/Message.js";
import User from "../models/User.js";

export default {
    async saveMessage(groupId, senderId, message) {
        const user = await User.findById(senderId)

        const saved = await Message.create({ groupId, senderId, username: user.username, message, imageUrl: user.imageUrl });

        return {
            ...saved._doc,        // разпакетиран обект от Mongo
            imageUrl: user.imageUrl // добавяш imageUrl РЪЧНО в отговора
        };
    },

    async getMessages(groupId) {
        return await Message.find({ groupId })
            .sort({ timestamp: 1 })
            .populate("senderId", "username imageUrl"); // 🔹 Връща username вместо ID
    }
};
