import Router from 'koa-router'
import * as aboutControllers from '../controllers/aboutControllers'

const router = new Router()

router.get('/about', aboutControllers.getAllAbout)
router.get('/about/:id', aboutControllers.getAboutById)
router.post('/create-about', aboutControllers.createAbout)
router.put('/update-about/:id', aboutControllers.updateAbout)

export default router