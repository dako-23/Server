import { Router } from 'express';
import groupService from '../service/groupService.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const groupController = Router();

groupController.get('/', async (req, res) => {
    // const filter = buildFilter(req.query);
    try {
        const groups = await groupService.getAll();
        return res.json(groups);
    } catch (err) {

        return res.status(500).json({ error: "An error occurred while getting the groups" });
    }

});

groupController.get('/:userId/my-groups', isAuth, async (req, res) => {
    const { userId } = req.params;

    try {
        const myGroups = await groupService.getByOwner(userId);
        res.json(myGroups);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your groups." });
    }
});

groupController.get('/latest', async (req, res) => {

    try {
        const latestGroups = await groupService.getLatest()

        return res.json(latestGroups);

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while getting the last groups" });
    }

})

groupController.get('/:id', async (req, res) => {
    const groupId = req.params.id
    try {
        const group = await groupService.getOne(groupId);

        return res.status(201).json(group);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while get the group" });
    }

});

groupController.post('/create', isAuth, async (req, res) => {
    const newGroup = req.body;
    const creatorId = req.user._id
    try {
        const createdGroup = await groupService.create(newGroup, creatorId);
        return res.status(201).json(createdGroup);

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while create the group" });
    }


});

groupController.post('/:id/join', isAuth, async (req, res) => {
    const groupId = req.params.id
    const userId = req.user?._id

    try {
        await groupService.joinGroup(groupId, userId);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while join the group" });

    }
    return res.status(201).json({ groupId, userId });
});

groupController.post('/:id/leave', isAuth, async (req, res) => {
    const groupId = req.params.id
    const userId = req.user?._id

    try {
        await groupService.leaveGroup(groupId, userId);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while leave the group" });

    }
    return res.status(201).json({ groupId, userId });
});
groupController.put('/:id/edit', isAuth, async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user?._id
    const groupData = req.body;


    try {
        const group = await groupService.getOne(groupId)

        if (!group._ownerId?.equals(userId)) {
            return res.status(403).json({ error: "You are not authorized to edit this group" });
        }

        const updatedGroup = await groupService.update(groupId, groupData);

        return res.status(201).json(updatedGroup);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred while edit the group" });
    }

});

groupController.delete('/:id/delete', isAuth, async (req, res) => {
    const groupId = req.params.id;
    const userId = req.user?._id
    const isAdmin = req.user?.isAdmin;

    try {
        const group = await groupService.getOne(groupId)

        if (!group._ownerId?.equals(userId) && !isAdmin) {
            return res.status(403).json({ error: "You are not authorized to delete this group" });
        }

        await groupService.delete(groupId);
        return res.status(200).json({ message: "Group deleted successfully" });

    } catch (err) {
        return res.status(500).json({ error: "An error occurred while deleting the group" });
    }
});

groupController.patch('/:id/lock', isAdmin, async (req, res) => {

    const groupId = req.params.id;

    try {
        const updatedGroup = await groupService.lockGroup(groupId);
        res.status(200).json(updatedGroup);
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle lock' });
    }
});

export default groupController;
