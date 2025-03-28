import Post from "../models/Post.js"
import Group from "../models/Group.js"


export default {
    async myGroups(userId) {

        return Group.find({ _ownerId: userId }).sort({ createdAt: -1 })
    },
    async myPosts(userId) {

        return Post.find({ _ownerId: userId }).sort({ createdAt: -1 })
    }
}