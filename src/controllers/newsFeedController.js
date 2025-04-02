import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import newsFeedService from "../service/newsFeedService.js";

const newsFeedController = Router();


newsFeedController.get('/', async (req, res) => {
    const userId = req.user?._id;
    try {
        const posts = await newsFeedService.getAll(userId);
        return res.json(posts);

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while getting the posts" });
    }
})

newsFeedController.post('/create', isAuth, async (req, res) => {
    const newPost = req.body;
    const creatorId = req.user._id
    try {
        const createdPost = await newsFeedService.create(newPost, creatorId);
        return res.status(201).json(createdPost);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

newsFeedController.post('/:id/comment', isAuth, async (req, res) => {
    const { postId, text, firstName, lastName, imageUrlComment } = req.body;
    const creatorId = req.user._id;
    const newComment = {
        text,
        firstName,
        lastName,
        imageUrlComment,
        _ownerId: creatorId
    }

    try {
        const createdComment = await newsFeedService.createComment(newComment, postId);
        return res.status(201).json(createdComment)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

newsFeedController.post('/:id/like', isAuth, async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;
    try {
        const createdLike = await newsFeedService.like(postId, userId)
        return res.status(201).json(createdLike)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

newsFeedController.post('/:id/favorites', isAuth, async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const addedToFavorites = await newsFeedService.addToFavorite(postId, userId)
        return res.status(200).json(addedToFavorites)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

newsFeedController.patch('/:id/delete', isAuth, async (req, res) => {
    const postId = req.params.id;

    try {
        const updatedPost = await newsFeedService.deletePost(postId);
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

newsFeedController.get('/:id/get-post', async (req, res) => {
    const postId = req.params.id
    try {
        const post = await newsFeedService.getOne(postId);

        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while get the group" });
    }

});

export default newsFeedController