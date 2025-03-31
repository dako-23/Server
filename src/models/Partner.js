import { Schema, model } from "mongoose";

const partnerSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    url:
    {
        type: String,
        required: true
    },
}, { timestamps: true });

const Partner = model("Partner", partnerSchema);

export default Partner;