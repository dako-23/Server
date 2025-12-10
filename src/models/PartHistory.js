import { Schema, model } from "mongoose";

const partHistorySchema = new Schema({
    phrase:
    {
        type: String,
        required: true,
        index: true
    },
    price:
    {
        type: Number,
        required: true
    },
});

const PartHistory = model("PartHistory", partHistorySchema);
export default PartHistory;
