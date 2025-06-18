import { Context } from "koa";
import * as aboutModel from '../models/aboutSection'
import * as apiResponse from '../utils/apiResponse'

export const createAbout = async (ctx: Context): Promise<void> => {
    try {
        const { title, subtitle, description }: aboutModel.AboutCreateInput = ctx.request.body

        if (!title || !subtitle || !description) {
            ctx.status = 400
            ctx.body = apiResponse.error('All fields are required', 400);
            return
        }

        const about = await aboutModel.create({
            title,
            subtitle,
            description
        });

        ctx.status = 201
        ctx.body = apiResponse.success('Create About Success', about)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const updateAbout = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params
        const { title, subtitle, description }: aboutModel.AboutUpdateInput = ctx.request.body

        if (!title || !subtitle || !description) {
            ctx.status = 400
            ctx.body = apiResponse.error('All fields are required', 400);
            return
        }

        const aboutId = parseInt(id)
        if (isNaN(aboutId)) {
            ctx.status = 400
            ctx.body = apiResponse.error('Invalid ID format', 400);
            return
        }

        const about = await aboutModel.update(aboutId, {
            title,
            subtitle,
            description
        });

        ctx.status = 200
        ctx.body = apiResponse.success('Update About Success', about)
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const getAllAbout = async (ctx: Context): Promise<void> => {
    try {
        const about = await aboutModel.findAll();

        if (!about) {
            ctx.status = 400
            ctx.body = apiResponse.error('Data not found', 400);
        }

        ctx.status = 200
        ctx.body = apiResponse.success('Get All About Success', about)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const getAboutById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params

        const aboutId = parseInt(id)
        if (isNaN(aboutId)) {
            ctx.status = 400
            ctx.body = apiResponse.error('Invalid ID format', 400);
            return
        }

        const about = await aboutModel.findById(aboutId);

        if (!about) {
            ctx.status = 404
            ctx.body = apiResponse.error('About not found', 404);
            return
        }

        ctx.status = 200
        ctx.body = apiResponse.success('Get About Success', about)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}