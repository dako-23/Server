import jsonwebtoken from 'jsonwebtoken';

import { JWT_SECRET } from '../config.js';

export const generateToken = (user) => {
        const payload = {
            _id: user._id,
            email: user.email,
        };
        const token = jsonwebtoken.sign(payload, JWT_SECRET, {expiresIn: '2h'});

        return token;
}
