import { Router } from 'express';
import cloudinary from '../config/cloudinary.js';

const galleryController = Router();

const fetchGallery = async () => {
    const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'gallery/',
        max_results: 100,
    });

    return result.resources
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
        .map(img => img.secure_url);
};

galleryController.get('/', async (req, res) => {
    try {
        const images = await fetchGallery();
        res.json(images);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load images' });
    }
});

galleryController.get('/home-slider', async (req, res) => {
    try {
        const images = await fetchGallery();
        const first15 = images.slice(0, 15);
        res.json(first15);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load home slider' });
    }
});

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




export default galleryController
