import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";


export default {
    async getAll(userId) {
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate('likes', 'firstName lastName imageUrl')
            

        if (!userId) return posts;

        const user = await User.findById(userId)
        const favorites = Array.isArray(user?.favorites)
            ? user.favorites.map(id => id?.toString?.()).filter(Boolean)
            : [];

        const enrichedPosts = posts.map(post => ({
            ...post,
            isFavorited: favorites.includes(post._id.toString())
        }));

        return enrichedPosts;

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

    },
    async addToFavorite(postId, userId) {

        const user = await User.findById(userId)

        const alreadyFavorited = user.favorites.some(id => id.toString() === postId.toString());

        if (alreadyFavorited) {
            user.favorites = user.favorites.filter(id => id.toString() !== postId.toString());

        } else {
            user.favorites.push(new mongoose.Types.ObjectId(postId));
        }

        await user.save();
    }

}