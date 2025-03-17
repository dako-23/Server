import { Schema, model } from "mongoose";

const reviewsSchema = new Schema({
    creatorId:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    review:
    {
        type: String,
        required: true
    },
    rating:
    {
        type: String,
        required: true
    },
    timestamp: true,
});

const Review = model("Review", reviewsSchema);
export default Review;