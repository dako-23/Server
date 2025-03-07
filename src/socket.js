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
                // 📌 Изпрати съобщението на всички в групата
                socket.broadcast.to(groupId).emit('receiveMessage', { groupId, senderId, message });
            } catch (err) {
                console.error('❌ Error sending message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('🔹 User disconnected:', socket.id);
        });
    });
}
