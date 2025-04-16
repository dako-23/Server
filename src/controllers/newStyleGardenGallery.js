import { Router } from 'express';
import cloudinary from '../config/cloudinary.js';

const galleryController = Router();

galleryController.get('/', async (req, res) => {

    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'gallery/',
            max_results: 100,
        });

        const sorted = result.resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const images = sorted.map(img => img.secure_url);

        res.json(images);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load images' });
    }

})

galleryController.get('/carousel', async (req, res) => {

    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'home-page/',
            max_results: 5,
        });

        const sorted = result.resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const images = sorted.map(img => img.secure_url);

        res.json(images);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load images' });
    }

})

galleryController.get('/home-slider', async (req, res) => {

    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'gallery/',
            max_results: 15,
        });

        const sorted = result.resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const images = sorted.map(img => img.secure_url);

        res.json(images);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load images' });
    }

})




export default galleryController
