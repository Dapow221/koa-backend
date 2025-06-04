import Router from 'koa-router'
import * as userControllers from '../controllers/userControllers'

const router = new Router()

router.post('/create-user', userControllers.createUser)

export default router