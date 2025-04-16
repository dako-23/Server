import { Router } from "express";
import cloudinary from '../config/cloudinary.js';

const galleryController = Router();

galleryController.get('/', async (req, res) => {

    const shouldFix = req.query.fix === "true"; // ?fix=true

    try {
        const result = await cloudinary.api.resources({
            type: "upload",
            max_results: 100,
        });

        const images = [];

        for (const asset of result.resources) {
            const isInGallery = asset.public_id.startsWith("gallery/");

            if (shouldFix && !isInGallery) {
                const newPublicId = `gallery/${asset.public_id}`;
                try {
                    await cloudinary.uploader.rename(asset.public_id, newPublicId);

                    images.push(`https://res.cloudinary.com/${cloudinary.config().cloud_name}/image/upload/${newPublicId}.${asset.format}`);
                } catch (renameErr) {
                }
            } else {
                images.push(asset.secure_url);
            }
        }

        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "Failed to load images" });
    }

})


export default galleryController
