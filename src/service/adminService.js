import User from "../models/User.js";

export default {

    getAllUsers() {
        return User.find({}, 'imageUrl username firstName lastName isAdmin isBlocked');
    },


}