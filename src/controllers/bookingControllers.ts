import { Context } from "koa";
import * as bookingModel from '../models/bookingSection'
import * as apiResponse from '../utils/apiResponse'

export const createBooking = async (ctx: Context): Promise<void> => {
    try {
        const { title, subtitle, description, sub_description }: bookingModel.BookingInput = ctx.request.body

        if (!title || !subtitle || !description || !sub_description) {
            ctx.status = 400
            ctx.body = apiResponse.error('All fields are required', 400);
            return
        }

        const booking = await bookingModel.create({
            title,
            subtitle,
            description,
            sub_description
        });

        ctx.status = 201
        ctx.body = apiResponse.success('Create Booking Success', booking)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const updateBooking = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params
        const { title, subtitle, description, sub_description }: bookingModel.UpdateBookingInput = ctx.request.body

        if (!title || !subtitle || !description || !sub_description) {
            ctx.status = 400
            ctx.body = apiResponse.error('All fields are required', 400);
            return
        }

        const bookingId = parseInt(id)
        if (isNaN(bookingId)) {
            ctx.status = 400
            ctx.body = apiResponse.error('Invalid ID format', 400);
            return
        }

        const booking = await bookingModel.update(bookingId, {
            title,
            subtitle,
            description,
            sub_description
        });

        ctx.status = 200
        ctx.body = apiResponse.success('Update Booking Success', booking)
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const getAllBooking = async (ctx: Context): Promise<void> => {
    try {
        const booking = await bookingModel.findAll();

        if (!booking) {
            ctx.status = 400
            ctx.body = apiResponse.error('Data not found', 400);
            return
        }

        ctx.status = 200
        ctx.body = apiResponse.success('Get All Booking Success', booking)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const getBookingById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params

        const bookingId = parseInt(id)
        if (isNaN(bookingId)) {
            ctx.status = 400
            ctx.body = apiResponse.error('Invalid ID format', 400);
            return
        }

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            ctx.status = 404
            ctx.body = apiResponse.error('Booking not found', 404);
            return
        }

        ctx.status = 200
        ctx.body = apiResponse.success('Get Booking Success', booking)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}