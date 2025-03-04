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
groupController.get('/', async (req, res) => {
    // buildFilter({ where: '_ownerId="67ace2aed1eaa48b16b4b2eb"&email="ivo@abv.bg"', sortBy: 'createdAt="desc"' });
    // const filter = buildFilter(req.query);
    
    const groups = await groupService.getAll();

    res.json(groups);
});

// Get one
// groupController.get('/:furnitureId', async (req, res) => {
//     const furniture = await groupService.getOne(req.params.furnitureId);

//     res.json(furniture);
// });

// Create
groupController.post('/', isAuth, async (req, res) => {
    const groupData = req.body;
    const userId = req.user.id;

    console.log(req.body);
    

    const newGroup = await groupService.create(groupData, userId);

    console.log(newGroup);
    

    res.json(newGroup);
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
