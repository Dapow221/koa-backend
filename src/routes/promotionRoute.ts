import Router from 'koa-router';
import * as promotionsController from '../controllers/promotionsControllers';

const router = new Router();

router.get('/promotions', promotionsController.getAll);
router.get('/promotions/:id', promotionsController.getById);
router.post('/promotions', promotionsController.create);
router.put('/promotions/:id', promotionsController.update);
router.delete('/promotions/:id', promotionsController.deletePromotion);

export default router;