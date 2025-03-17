import { Router } from 'express';

import userController from './controllers/userController.js';
import groupController from './controllers/groupController.js';
import chatController from './controllers/chatController.js';
import reviewsController from './controllers/reviewsController.js';

const routes = Router();

routes.use('/users', userController);
routes.use('/groups', groupController);
routes.use('/chat', chatController);
routes.use('/reviews', reviewsController);

export default routes;
