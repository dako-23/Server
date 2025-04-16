import { Router } from 'express';

import userController from './controllers/userController.js';
import groupController from './controllers/groupController.js';
import chatController from './controllers/chatController.js';
import reviewsController from './controllers/reviewsController.js';
import newsFeedController from './controllers/newsFeedController.js';
import myProfileController from './controllers/myProfileController.js';
import adminController from './controllers/adminController.js';
import galleryController from './controllers/newStyleGardenGallery.js';

const routes = Router();

routes.use('/users', userController);
routes.use('/groups', groupController);
routes.use('/chat', chatController);
routes.use('/reviews', reviewsController);
routes.use('/news-feed', newsFeedController);
routes.use('/my-profile', myProfileController)
routes.use('/admin', adminController);
routes.use('/new-style-garden-gallery', galleryController);

export default routes;
