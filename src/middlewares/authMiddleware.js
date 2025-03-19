import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET, JWT_AUTH_NAME } from '../config.js';
import InvalidToken from '../models/InvalidToken.js';

export const auth = async (req, res, next) => {

    let token = null

    if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    if (!token) {
        req.user = null;
        return next();
    }

    const invalidToken = await InvalidToken.findOne({ token });
    if (invalidToken) {
        return res.json({ error: 'Invalid token!' });
    }

    try {
        const decodedToken = jsonwebtoken.verify(token, JWT_SECRET);

        req.user = decodedToken;

    } catch (err) {
        req.user = null;
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
