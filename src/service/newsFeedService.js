import Post from "../models/Post.js";

export default {
    getAll(filter = {}) {
        return Post.find({}).sort({ createdAt: -1 })
    },
    create(newPostData, creatorId) {
        const result = Post.create({
            ...newPostData,
            _ownerId: creatorId
        })
        return result
    },

}