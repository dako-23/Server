import { Router } from 'express';
import groupService from '../service/groupService.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const groupController = Router();


groupController.get('/', async (req, res) => {
    // const filter = buildFilter(req.query);

    const groups = await groupService.getAll();

    return res.json(groups);
});

// Get one
// groupController.get('/:furnitureId', async (req, res) => {
//     const furniture = await groupService.getOne(req.params.furnitureId);

//     res.json(furniture);
// });

// Create
groupController.post('/', isAuth, async (req, res) => {
    const newGroup = req.body;
    const creatorId = req.user._id

    const createdGroup = await groupService.create(newGroup, creatorId);

    return res.status(201).json(createdGroup);

});


// // Update
// groupController.put('/:furnitureId', async (req, res) => {
//     const furnitureId = req.params.furnitureId;
//     const furnitureData = req.body;

//     const updatedFurniture = await groupService.update(furnitureId, furnitureData);

//     res.json(updatedFurniture);
// });

// // Delete
// groupController.delete('/:furnitureId', async (req, res) => {
//     const furnitureId = req.params.furnitureId;

//     await groupService.delete(furnitureId);

//     res.json({ ok: true });
// });

export default groupController;
