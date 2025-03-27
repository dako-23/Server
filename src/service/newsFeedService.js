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
    async createComment(newComment, postId) {

        const post = await Post.findById(postId);

        post.comments.unshift(newComment);

        await post.save();

        const created = post.comments[0]

        return created
    },
    async like(postId, userId) {

        const post = await Post.findById(postId)

        const alreadyLiked = post.likes.some(id => id.toString() === userId.toString());

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();

        const populated = await Post.findById(postId)
            .populate('likes', 'firstName lastName imageUrl');

        return populated;

    }

}