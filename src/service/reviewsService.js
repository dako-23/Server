import Review from "../models/Reviews.js";

export default {
    getAll(filter = {}) {
        return Review.find({}).sort({ createdAt: -1 })
    },
    getLatest() {
        const latestReviews = Review.find().sort({ createdAt: -1 }).limit(3);
        return latestReviews
    },
    getOne(groupId) {
        return Review.findById(groupId);
    },

    create(newReviewData, creatorId) {
        const result = Review.create({
            ...newReviewData,
            creatorId,

        })
        return result
    },
    update(reviewId, reviewData) {
        return Review.findByIdAndUpdate(reviewId, reviewData);
    },

    delete(reviewId) {
        return Review.findByIdAndDelete(reviewId);
    }
}
