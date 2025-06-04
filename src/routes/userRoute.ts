import Router from 'koa-router'
import * as userControllers from '../controllers/userControllers'

const router = new Router()

router.post('/create-user', userControllers.createUser)
router.get('/user/:id', userControllers.findUserById)
router.delete('/delete-user/:id', userControllers.deleteUserById)


export default router