import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    _ownerId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    imageUrlComment: {
        type: String
    },
    text: {
        type: String,
        required: true
    },
}, { timestamps: true });

const postSchema = new Schema({
    _ownerId: {
        type: Types.ObjectId,
        ref: "User", required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    imageUrlAuthor: {
        type: String
    }, 
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }, 
    likes: [{
        type: Types.ObjectId,
        ref: "User"
    }], 
    comments: [commentSchema]
}, { timestamps: true });

const Post = model("Post", postSchema);
export default Post;
