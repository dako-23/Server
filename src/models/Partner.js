import { Schema, Types, model } from "mongoose";

const partnerSchema = new Schema({
    logo: {
        type: String,
        required: true
    },
    url:
    {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    _ownerId: {
        type: Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Partner = model("Partner", partnerSchema);

export default Partner;