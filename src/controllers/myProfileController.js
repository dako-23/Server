import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import myProfileService from "../service/myProfileService.js";

const myProfileController = Router();

myProfileController.post('/:id/favorites', isAuth, async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const addedToFavorites = await myProfileService.addToFavorite(postId, userId)
        return res.status(201).json(addedToFavorites)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

myProfileController.get('/:id/my-groups', isAuth, async (req, res) => {
    const userId = req.params.id

    try {
        const myGroups = await myProfileService.myGroups(userId);
        return res.status(200).json(myGroups)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

myProfileController.get('/:id/my-posts', isAuth, async (req, res) => {
    const userId = req.params.id

    try {
        const myPosts = await myProfileService.myPosts(userId);
        return res.status(200).json(myPosts)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
})

export default myProfileController;