import Router from "koa-router";
import userRoute from './userRoute'
import heroRoute from './heroRoute'
import promotionRoute from './promotionRoute'
import aboutRoute from './aboutRoute'
import eventRoute from './eventRoute'
import bookingRoute from './bookingRoute'
import menuRoute from './menuRoute'

const router = new Router({ prefix: "/api/v1" });

router.use(userRoute.routes())
router.use(heroRoute.routes())
router.use(promotionRoute.routes())
router.use(aboutRoute.routes())
router.use(eventRoute.routes())
router.use(bookingRoute.routes())
router.use(menuRoute.routes())

export default router