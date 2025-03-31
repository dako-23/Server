import User from "../models/User.js";

export default {

    getAllUsers() {
        return User.find({}, 'imageUrl username firstName lastName isAdmin isBlocked');
    },
    async makeAdmin(userId) {
        const user = await User.findById(userId);
        user.isAdmin = !user.isAdmin;
        await user.save();
        return user;
    },
    async blockUser(userId) {
        const user = await User.findById(userId);
        user.isBlocked = !user.isBlocked;
        await user.save();
        return user;
    },



}