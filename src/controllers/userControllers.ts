import { Context } from 'koa'
import * as userModel from '../models/userModel'
import * as apiResponse from '../utils/apiResponse'

export const createUser = async (ctx: Context): Promise<void> => {
    try {
        const body = ctx.request.body
        const { role, username, password }:  userModel.UserInput = body

        if (!username || !password) {
            ctx.status = 400
            ctx.body = apiResponse.error('Username and password are required', 400)
        }

        const newUser = await userModel.createUser({
            username: username,
            role: role,
            password: password
        })

        ctx.status = 201
        ctx.body = apiResponse.success('User created successfully', newUser)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}