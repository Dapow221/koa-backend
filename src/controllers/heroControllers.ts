import { Context } from "koa";
import * as heroModel from '../models/heroSection'
import * as apiResponse from '../utils/apiResponse'


export const createHero = async (ctx: Context): Promise<void> => {
    try {
        const { title, description, openingHours, address }: heroModel.HeroCreateInput = ctx.request.body

        if (!title || !description || !openingHours || !address) {
            ctx.status = 400
            ctx.body = apiResponse.error('All fields are required', 400);
            return
        }

        if (!Array.isArray(title)) {
            ctx.status = 400
            ctx.body = apiResponse.error('Title must be an array', 400);
            return
        }

        const hero = await heroModel.create({
            title,
            description,
            openingHours,
            address
        });

        ctx.status = 201
        ctx.body = apiResponse.success('Create Hero Success', hero)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const getHero = async (ctx: Context): Promise<void> => {
    try {
        const hero = await heroModel.findLatest();
        
        if (!hero) {
            ctx.status = 400
            ctx.body = apiResponse.error('Hero not found', 400)
        }

        ctx.status = 200
        ctx.body = apiResponse.success('Latest hero found', hero)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const updateHero = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params
        const { title, description, openingHours, address }: heroModel.HeroUpdateInput = ctx.request.body

        const existingHero = await heroModel.findById(id);

        if (!existingHero) {
            ctx.status = 400
            ctx.body = apiResponse.error('Hero Not Found', 400)
            return
        }

        const updatedHero = await heroModel.updateById(id, {
            title,
            description,
            openingHours,
            address
        });

        if (!updatedHero) {
            ctx.status = 400
            ctx.body = apiResponse.error('Error to updated fields', 400)
            return
        }

        ctx.status = 201
        ctx.body = apiResponse.success('Editing Hero Success', updatedHero)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
        console.log(error)
    }
}
