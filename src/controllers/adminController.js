import { Router } from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Group from "../models/Group.js";
import Review from "../models/Review.js";
import Partner from "../models/Partner.js";
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import adminService from "../service/adminService.js";

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
            {
                $project: {
                    favoritesCount: {
                        $size: { $ifNull: ["$favorites", []] }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$favoritesCount" }
                }
            }
        ]);

        const totalReviews = await Review.countDocuments();
        const avgRatingAgg = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    avg: { $avg: "$rating" }
                }
            }
        ]);

        const avgRating = avgRatingAgg[0]?.avg || 0;

        res.json({
            users: { total: totalUsers, admins: totalAdmins },
            posts: { total: totalPosts },
            partners: { total: totalPartners },
            groups: { total: totalGroups, locked: lockedGroups },
            favorites: totalFavorites[0]?.total || 0,
            reviews: { total: totalReviews, avgRating, },
        });
    } catch (err) {
        console.error("Dashboard error:", err);

        res.status(500).json({ error: err });
    }
});

adminController.get('/all-users', isAuth, isAdmin, async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

adminController.get('/all-partners', isAuth, isAdmin, async (req, res) => {
    try {
        const users = await adminService.getAllPartners();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

adminController.post('/partner-create', isAuth, isAdmin, async (req, res) => {
    const newPartner = req.body;
    const creatorId = req.user._id
    try {
        const createdPartner = await adminService.create(newPartner, creatorId);
        return res.status(201).json(createdPartner);

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while create partner" });
    }

});

adminController.patch('/:id/make-admin', isAdmin, isAuth, async (req, res) => {

    const userId = req.params.id;

    try {
        const updatedUser = await adminService.makeAdmin(userId);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to make admin' });
    }
});

adminController.patch('/:id/block-user', isAdmin, isAuth, async (req, res) => {

    const userId = req.params.id;

    try {
        const blockedUser = await adminService.blockUser(userId);
        res.status(200).json(blockedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to make admin' });
    }
});

export default adminController;
