import socketService from "./service/socketService.js";


export default function initSocket(io) {
    io.on('connection', (socket) => {
        console.log('🔹 User connected:', socket.id);

        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`🔹 User joined group: ${groupId}`);
        });

        socket.on('sendMessage', async ({ groupId, senderId, message }) => {
            try {
                // 📌 Запази съобщението в базата
                const newMessage = await socketService.saveMessage(groupId, senderId, message);

                // 📌 Изпрати съобщението на всички в групата
                // io.to(groupId).emit('receiveMessage', newMessage);
                socket.broadcast.to(groupId).emit('receiveMessage', newMessage);
            } catch (err) {
                console.error('❌ Error saving message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('🔹 User disconnected:', socket.id);
        });
    });
}
