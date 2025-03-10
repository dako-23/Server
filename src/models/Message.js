import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = model("Message", messageSchema);
export default Message;
