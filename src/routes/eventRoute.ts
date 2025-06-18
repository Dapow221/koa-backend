import Router from 'koa-router';
import * as eventController from '../controllers/eventControllers';

const router = new Router();

router.get('/events', eventController.getAll);
router.get('/events/:id', eventController.getById);
router.post('/events', eventController.create);
router.put('/events/:id', eventController.update);
router.delete('/events/:id', eventController.deleteEvents);

export default router;