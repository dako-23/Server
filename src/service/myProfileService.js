import User from "../models/User.js"
import Post from "../models/Post.js"
import Group from "../models/Group.js"


export default {
    async addToFavorite(postId, userId) {

        const user = await User.findById(userId)

        const alreadyFavorited = user.favorites.some(id => id.toString() === postId);

        if (alreadyFavorited) {
            user.favorites = user.favorites.filter(id => id.toString() !== postId);
        } else {
            user.favorites.push(postId);
        }

        await user.save();
    },
    async myGroups(userId) {

        return Group.find({ _ownerId: userId }).sort({ createdAt: -1 })
    },
    async myPosts(userId) {

        return Post.find({ _ownerId: userId }).sort({ createdAt: -1 })
    }
}