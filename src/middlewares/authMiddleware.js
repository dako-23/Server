import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET, JWT_AUTH_NAME } from '../config.js';
import InvalidToken from '../models/InvalidToken.js';

export const auth = async (req, res, next) => {
    const token = req.cookies[JWT_AUTH_NAME]

    if (!token) {
        return next();
    }

    const invalidToken = await InvalidToken.findOne({ token });
    if (invalidToken) {
        return res.json({ error: 'Invalid token!' });
    }

    try {
        const decodedToken = jsonwebtoken.verify(token, JWT_SECRET);
        console.log(decodedToken);

        req.user = decodedToken;

    } catch (err) {
        res.clearCookie(JWT_AUTH_NAME);
        res.json({ error: 'Invalid token!' });
    }

    next();
};

export const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized: No user found.");

    }

    next();
}
