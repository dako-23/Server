import { Router } from "express";

import userController from "./controllers/userController.js";
import groupController from "./controllers/groupController.js";

const routes = Router();

routes.use('/users', userController);
routes.use('/groups', groupController);

export default routes;
