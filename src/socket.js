import chatService from "./service/chatService.js";

const activeUsers = {};

export default function initSocket(io) {
    io.on("connection", (socket) => {
        console.log("🔹 User connected:", socket.id);

        // 🔹 Потребителят влиза в група
        socket.on("joinGroup", ({ groupId, userId, username, imageUrl }) => {
            socket.join(groupId);

            if (!activeUsers[groupId]) {
                activeUsers[groupId] = [];
            }

            if (!activeUsers[groupId].some(user => user.userId === userId)) {
                activeUsers[groupId].push({ userId, username, imageUrl });
            }

            console.log(`🔹 User joined group: ${groupId}, Active users:`, activeUsers[groupId]);

            io.to(socket.id).emit("updateActiveUsers", activeUsers[groupId]);
            io.to(groupId).emit('updateActiveUsers', activeUsers[groupId]);
        });

        // 🔹 Изпращане на съобщение
        socket.on("sendMessage", async ({ groupId, senderId, message }) => {
            try {
                // 📌 Запазване на съобщението в базата
                const newMessage = await chatService.saveMessage(groupId, senderId, message);

                // 📌 Изпращане на съобщението на всички в групата
                io.to(groupId).emit("receiveMessage", newMessage);
            } catch (err) {
                console.error("❌ Error saving message:", err);
            }
        });

        socket.on("leaveGroup", ({ groupId, userId }) => {
            socket.leave(groupId);

            if (activeUsers[groupId]) {
                activeUsers[groupId] = activeUsers[groupId].filter(user => user.userId !== userId);

                io.to(groupId).emit("updateActiveUsers", activeUsers[groupId]);
                io.to(groupId).emit("userLeft", userId);
            }

            console.log(`🔹 User left group: ${groupId}, Active users:`, activeUsers[groupId]);
        });

        socket.on("disconnect", () => {
            for (const groupId in activeUsers) {
                activeUsers[groupId] = activeUsers[groupId].filter(user => user.socketId !== socket.id);

                io.to(groupId).emit("updateActiveUsers", activeUsers[groupId]);
            }

            console.log("🔹 User disconnected:", socket.id);
        });
    });
}
