import { model, Schema, Types } from "mongoose";

const groupSchema = new Schema({
    groupName: {
        type: String,
        // minLength: 4,
    },
    location: {
        type: String,
        // minLength: 4,
    },
    rules: {
        type: String,
    },
    description: {
        type: String,
        // minLength: 10,
    },
    imageUrl: {
        type: String,
        // required: true,
    },
    joinedGroup: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    _ownerId: {
        type: Types.ObjectId,
        ref: 'User',
    }
});

const Group = model('Group', groupSchema);

export default Group;
