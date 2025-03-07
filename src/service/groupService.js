import Group from '../models/Group.js'

export default {
    getAll(filter = {}) {
        return Group.find({})
    },
    getOne(groupId) {
        return Group.findById(groupId);
    },
    create(newGroupData, creatorId) {
        const result = Group.create({
            ...newGroupData,
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

        return group.save();
    }
    // update(furnitureId, furnitureData) {
    //     return Group.findByIdAndUpdate(furnitureId, furnitureData);
    // },
    // delete(furnitureId) {
    //     return Group.findByIdAndDelete(furnitureId);
    // }
}
