import Group from "../models/Group.js"

export default {
    getAll(filter = {}) {
        return Group.find({})
    },
    // getOne(furnitureId) {
    //     return Group.findById(furnitureId);
    // },
    create(newGroupData, creatorId) {
        const result = Group.create({
            ...newGroupData,
            _ownerId: creatorId
        })
        return result
    }
    // update(furnitureId, furnitureData) {
    //     return Group.findByIdAndUpdate(furnitureId, furnitureData);
    // },
    // delete(furnitureId) {
    //     return Group.findByIdAndDelete(furnitureId);
    // }
}
