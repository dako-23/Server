import User from "../models/User.js";
import Partner from "../models/Partner.js";

export default {

    getAllUsers() {
        return User.find({}, 'imageUrl username firstName lastName email isAdmin isBlocked');
    },
    getAllPartners() {
        return Partner.find({}).sort({ createdAt: -1 });
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
    create(newPartnerData, creatorId) {
        const result = Partner.create({
            ...newPartnerData,
            _ownerId: creatorId
        })
        return result
    },

}