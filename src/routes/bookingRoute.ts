import Router from 'koa-router'
import * as bookingControllers from '../controllers/bookingControllers'

const router = new Router()

router.get('/booking', bookingControllers.getAllBooking)
router.get('/booking/:id', bookingControllers.getAllBooking)
router.post('/create-booking', bookingControllers.createBooking)
router.put('/update-booking/:id', bookingControllers.updateBooking)

export default router