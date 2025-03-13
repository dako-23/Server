import { Router } from 'express';
import { JWT_AUTH_NAME } from '../config.js';

import userService from '../service/userService.js';

const userController = Router();

userController.post('/register', async (req, res) => {
    const userData = req.body;

    const { user, token } = await userService.register(userData);

    // res.setHeader('Set-Cookie', `jwt=${token}; Path=/; HttpOnly; Secure; SameSite=None`)

    res.cookie(JWT_AUTH_NAME, token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 2 * 60 * 60 * 1000
    });

    res.json({
        _id: user._id,
        accessToken: token,
        email: user.email,
        username: user.username
    });
});

userController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await userService.login(email, password)

    res.cookie(JWT_AUTH_NAME, token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 2 * 60 * 60 * 1000
    });

    res.json({
        _id: user._id,
        accessToken: token,
        email: user.email,
        username: user.username
    });
});

// userController.get('/logout', async (req, res) => {
//     const token = req.headers['x-authorization'];
//     res.clearCookie(JWT_AUTH_NAME);

//     await userService.invalidateToken(token);

//     res.json({});
// });

export default userController;
