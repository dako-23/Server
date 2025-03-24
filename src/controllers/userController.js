import { Router } from 'express';
import { JWT_AUTH_NAME } from '../config.js';

import userService from '../service/userService.js';

const userController = Router();

userController.post('/register', async (req, res) => {
    const userData = req.body;
    try {
        const { user, token } = await userService.register(userData);

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
            username: user.username,
            imageUrl: user.imageUrl,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to register" });
    }

});

userController.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
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
            username: user.username,
            imageUrl: user.imageUrl,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to login" });
    }
});

userController.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, address, imageUrl } = req.body;

    try {
        const updatedUser = await userService.updateUser(id, { firstName, lastName, address, imageUrl });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

userController.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userService.getUser(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user data" });
    }
})

// userController.get('/logout', async (req, res) => {
//     const token = req.headers['x-authorization'];
//     res.clearCookie(JWT_AUTH_NAME);

//     await userService.invalidateToken(token);

//     res.json({});
// });

export default userController;
