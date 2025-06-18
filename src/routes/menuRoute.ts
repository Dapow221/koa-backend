import Router from 'koa-router';
import * as menuController from '../controllers/menuControllers';

const router = new Router();

router.get('/menu', menuController.getAll);
router.get('/menu/:id', menuController.getById);
router.post('/menu', menuController.create);
router.put('/menu/:id', menuController.update);
router.delete('/menu/:id', menuController.deleteMenu);

export default router;