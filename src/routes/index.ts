import Router from "koa-router";
import userRoute from './userRoute'

const router = new Router({ prefix: "/api/v1" });

router.use(userRoute.routes())

export default router