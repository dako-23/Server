import Group from '../models/Group.js'

export default {
    getAll(filter = {}) {
        return Group.find({}).sort({ createdAt: -1 })
    },
    getByOwner(userId) {
        return Group.find({ _ownerId: userId }).sort({ createdAt: -1 });
    },
    getLatest() {
        return Group.find({}).sort({ createdAt: -1 }).limit(4)
    },
    getOne(groupId) {
        return Group.findById(groupId);
    },
    create(newGroupData, creatorId) {
        const result = Group.create({
            ...newGroupData,
            joinedGroup: [creatorId],
            _ownerId: creatorId
        })
        return result
    },
    async joinGroup(groupId, userId) {
        const group = await Group.findById(groupId);

        if (group.joinedGroup.includes(userId)) {
            throw new Error('You already joined this group!')
        };

        group.joinedGroup.push(userId);

        await group.save();

        return group
    },
    async leaveGroup(groupId, userId) {

        const group = await Group.findByIdAndUpdate(groupId,
            { $pull: { joinedGroup: userId } }
        );

        return group.save();
    },
    update(groupId, groupData) {
        return Group.findByIdAndUpdate(groupId, groupData);
    },
    delete(groupId) {
        return Group.findByIdAndDelete(groupId);
    },
    async lockGroup(groupId) {
        const group = await Group.findById(groupId);
        group.isLocked = !group.isLocked;
        await group.save();
        return group;
    }
}
