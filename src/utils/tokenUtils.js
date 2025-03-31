import jsonwebtoken from 'jsonwebtoken';

import { JWT_SECRET } from '../config.js';


export const generateToken = (user) => {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    };
    const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return token;
}
