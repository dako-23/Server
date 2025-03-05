import { model, Schema, Types } from 'mongoose';

const groupSchema = new Schema({
    groupName: {
        type: String,
    },
    location: {
        type: String,
    },
    rules: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    imageUrl: {
        type: String,
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

export default Group
