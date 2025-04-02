import User from '../models/User.js'
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/tokenUtils.js';

import InvalidToken from '../models/InvalidToken.js';

export default {
    async register(userData) {

        const emailExist = await User.findOne({ email: userData.email });
        const usernameExist = await User.findOne({ username: userData.username });

        if (emailExist) {
            throw new Error('Email is already registered.');
        }

        if (usernameExist) {
            throw new Error('Username is already registered.');
        }

        const user = await User.create(userData);

        const token = generateToken(user);

        return { user, token }
    },
    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email or password are incorrect!');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Email or password are incorrect!');
        }

        const token = generateToken(user);

        return { user, token }
    },
    async getUser(userId) {
        return await User.findById(userId)
    },
    async updateUser(userId, updateData) {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        return updatedUser
    },
    async changePassword(userId, currentPassword, newPassword) {

        const user = await User.findById(userId);

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            throw new Error("Incorrect current password");
        }

        user.password = newPassword;

        await user.save();
    },
    invalidateToken(token) {
        return InvalidToken.create({ token });
    }
}
