import Group from "../models/Group.js";

export default {
    getAll(filter = {}) {
        return Group.find(filter);
    },
    // getOne(furnitureId) {
    //     return Group.findById(furnitureId);
    // },
    create(groupData, userId) {
        return Group.create({ ...groupData, _ownerId: userId });
    },
    // update(furnitureId, furnitureData) {
    //     return Group.findByIdAndUpdate(furnitureId, furnitureData);
    // },
    // delete(furnitureId) {
    //     return Group.findByIdAndDelete(furnitureId);
    // }
}
