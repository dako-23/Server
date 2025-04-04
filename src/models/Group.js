import { model, Schema, Types } from 'mongoose';

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: [true, 'Group name is required.'],
        minlength: [3, 'Group name must be at least 3 characters long.'],
        maxlength: [50, 'Group name cannot exceed 50 characters.']
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters.']
    },
    rules: {
        type: String,
        maxlength: [1000, 'Rules cannot exceed 1000 characters.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        minlength: [5, 'Description must be at least 10 characters long.'],
        maxlength: [1000, 'Description cannot exceed 1000 characters.']
    },
    category: {
        type: String,
        required: [true, 'Category is required.'],
    },
    imageUrl: {
        type: String,
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    joinedGroup: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    _ownerId: {
        type: Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Group = model('Group', groupSchema);

export default Group
