import { Router } from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import reviewsService from '../service/reviewsService.js';

const reviewsController = Router();


reviewsController.get('/', async (req, res) => {
    // const filter = buildFilter(req.query);
    try {
        const reviews = await reviewsService.getAll();
        return res.json(reviews);
    } catch (err) {

        return res.status(500).json({ error: "An error occurred while getting the reviews" });
    }

});

reviewsController.get('/latest', async (req, res) => {

    try {
        const latestReviews = await reviewsService.getLatest()
        
        return res.json(latestReviews);

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while getting the last reviews" });
    }

})

// Get one
reviewsController.get('/:id', async (req, res) => {
    const reviewId = req.params.id
    try {
        const review = await reviewsService.getOne(reviewId);

        return res.status(201).json(review);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while get the review" });
    }

});

reviewsController.post('/create', isAuth, async (req, res) => {
    const newReview = req.body;
    const creatorId = req.user._id
    try {
        const createdReview = await reviewsService.create(newReview, creatorId);
        return res.status(201).json(createdReview);

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while create the review" });
    }


});

reviewsController.put('/:id/edit', isAuth, async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user?._id
    const reviewData = req.body;


    try {
        const review = await reviewsService.getOne(reviewId)

        if (!review.creatorId?.equals(userId)) {
            return res.status(403).json({ error: "You are not authorized to edit this review" });
        }

        const updatedReview = await reviewsController.update(reviewId, reviewData);

        return res.status(201).json(updatedReview);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while edit the review" });
    }

});

reviewsController.delete('/:id/delete', isAuth, async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user?._id

    try {
        const review = await reviewsService.getOne(reviewId)

        if (!review.creatorId?.equals(userId)) {
            return res.status(403).json({ error: "You are not authorized to delete this review" });
        }

        await reviewsService.delete(reviewId);
        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while deleting the review" });
    }
});

export default reviewsController;
