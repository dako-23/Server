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
    try {
        const invalidToken = await InvalidToken.findOne({ token });
        if (invalidToken) {
            req.user = null;
            return next();
        }

        const decodedToken = jsonwebtoken.verify(token, JWT_SECRET);

        req.user = decodedToken;
    } catch (err) {
        req.user = null;
    }

    next();
};

export const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send("Unauthorized: No user found.");
    }

    next();
};

export const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: Admins only.' });
    }

    next();
};
