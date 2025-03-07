import socketService from "./service/socketService.js";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("🔹 User connected:", socket.id);

        socket.on("joinGroup", (groupId) => {
            socket.join(groupId);
            console.log(`🔹 User joined group: ${groupId}`);
        });

        socket.on("sendMessage", async ({ groupId, senderId, message }) => {
            try {
                // **🔹 Проверка дали вече е записано**
                const existingMessage = await socketService.getLastMessage(groupId, senderId, message);
                if (existingMessage) {
                    console.log("⚠️ Duplicate message detected, skipping save.");
                    return;
                }

                // **📌 Запис в базата**
                const newMessage = await socketService.saveMessage(groupId, senderId, message);

                // **📌 Изпращане на съобщението до групата**
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
