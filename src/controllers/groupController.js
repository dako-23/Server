import { Router } from "express";
import groupService from "../service/groupService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const groupController = Router();

// function buildFilter(query) {
//     const filterResult = Object.keys(query).reduce((filter, filterParam) => {
//         const filterParamValue = query[filterParam].replaceAll('"', '');

//         const searchParams = new URLSearchParams(filterParamValue);

//         return { ...filter, ...Object.fromEntries(searchParams.entries()) };
//     }, {})

//     return filterResult
// };

// Get all
groupController.get('/groups', async (req, res) => {
    // buildFilter({ where: '_ownerId="67ace2aed1eaa48b16b4b2eb"&email="ivo@abv.bg"', sortBy: 'createdAt="desc"' });
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
// groupController.post('/groups', async (req, res) => {
//     const newGroup = req.body;
//     const creatorId = req.user?.id

//     const createdGroup = await groupService.create(newGroup, creatorId);

//     return res.status(201).json(createdGroup);

// });

groupController.post('/groups', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user data found" });
    }

    const newGroup = req.body;
    const creatorId = req.user.id; // 🔹 Очакваме тук да има ID

    try {
        // 🔹 ВРЕМЕННО ВРЪЩАМЕ req.user, за да видиш в Postman/React дали съдържа ID
        return res.json({ message: "Checking req.user", user: req.user });
    } catch (err) {
        return res.status(500).json({ error: "Failed to fetch user data" });
    }
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
