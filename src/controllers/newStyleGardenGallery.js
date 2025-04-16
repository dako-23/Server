import { Router } from "express";
import cloudinary from '../config/cloudinary.js';

const galleryController = Router();

galleryController.get('/', async (req, res) => {

    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'gallery/',
            max_results: 100,
        });

        const images = result.resources.map(img => img.secure_url);

        res.json(images);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load images' });
    }

})


export default galleryController
