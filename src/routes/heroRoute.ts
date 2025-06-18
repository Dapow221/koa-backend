import Router from 'koa-router'
import * as heroControllers from '../controllers/heroControllers'

const router = new Router()

router.post('/create-hero', heroControllers.createHero)
router.put('/edit-hero/:id', heroControllers.updateHero)
router.get('/hero', heroControllers.getHero)

export default router
