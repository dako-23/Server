import chatService from "./service/chatService.js";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("🔹 User connected:", socket.id);

        // 🔹 Потребителят влиза в група
        socket.on("joinGroup", ({ groupId, username }) => {
            socket.join(groupId);
            console.log(`🔹 User joined group: ${groupId}`);

            socket.emit("joinedGroup", { groupId, username });
        });

        // 🔹 Изпращане на съобщение
        socket.on("sendMessage", async ({ groupId, senderId, message, username }) => {
            try {
                // 📌 Запазване на съобщението в базата
                const newMessage = await chatService.saveMessage(groupId, senderId, message);

                newMessage.senderId = { _id: senderId, username };

                // 📌 Изпращане на съобщението на всички в групата
                io.to(groupId).emit("receiveMessage", newMessage);
            } catch (err) {
                console.error("❌ Error saving message:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("🔹 User disconnected:", socket.id);
        });
    });
}
