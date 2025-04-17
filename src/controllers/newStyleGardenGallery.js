import { Router } from 'express';
import cloudinary from '../config/cloudinary.js';

const galleryController = Router();

let cachedGallery = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000;

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
    const now = Date.now();

    if (cachedGallery && (now - cacheTimestamp < CACHE_TTL)) {
        return res.json(cachedGallery);
    }

    try {
        const images = await fetchGallery();
        cachedGallery = images
        cacheTimestamp = now
        res.json(images);
    } catch (err) {
        console.error('Cloudinary error:', err.message);
        res.status(500).json({ error: 'Failed to load images' });
    }
});

galleryController.get('/home-slider', async (req, res) => {
    const now = Date.now();

    if (cachedGallery && (now - cacheTimestamp < CACHE_TTL)) {
        return res.json(cachedGallery.slice(0, 15));
    }

    try {
        const images = await fetchGallery();
        cachedGallery = images;
        cacheTimestamp = now
        res.json(images.slice(0, 15));
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
        const detailedError =
            err?.error?.message ||
            err?.response?.data?.error?.message ||
            err?.message ||
            'Unknown error from Cloudinary';
        res.status(500).json({ error: detailedError });
    }

})




export default galleryController
