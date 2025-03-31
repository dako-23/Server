import { Router } from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Group from "../models/Group.js";
import Review from "../models/Review.js";
import Partner from "../models/Partner.js";

const adminController = Router();

adminController.get('/dashboard', isAuth, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ isAdmin: true });

        const totalPosts = await Post.countDocuments();
        const totalPartners = await Partner.countDocuments();
        const totalGroups = await Group.countDocuments();
        const lockedGroups = await Group.countDocuments({ isLocked: true });

        const totalFavorites = await User.aggregate([
            { $project: { favoritesCount: { $size: "$favorites" } } },
            { $group: { _id: null, total: { $sum: "$favoritesCount" } } }
        ]);

        const totalReviews = await Review.countDocuments();
        const avgRating = await Review.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" } } }
        ]);

        res.json({
            users: { total: totalUsers, admins: totalAdmins },
            posts: { total: totalPosts },
            partners: { total: totalPartners },
            groups: { total: totalGroups, locked: lockedGroups },
            favorites: totalFavorites[0]?.total || 0,
            reviews: { total: totalReviews, avgRating: avgRating[0]?.avg || 0 },
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to load dashboard stats" });
    }
});

export default adminController;
