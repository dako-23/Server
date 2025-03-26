import Post from "../models/Post.js";

export default {
    getAll(filter = {}) {
        return Post.find({}).sort({ createdAt: -1 })
    },
    create(newPost, creatorId) {
        const result = Post.create({
            ...newPost,
            _ownerId: creatorId
        })
        return result
    },
    async createComment(newComment, creatorId, postId) {

        const post = await Post.findById(postId);

        post.comments.push({
            ...newComment,
            _ownerId: creatorId
        });

        await post.save();

        return post
    }

}