import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
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
}, { timestamps: true });

const Review = model("Review", reviewSchema);
export default Review;