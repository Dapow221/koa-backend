import { Context } from 'koa'
import * as userModel from '../models/userModel'
import * as apiResponse from '../utils/apiResponse'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


export const createUser = async (ctx: Context): Promise<void> => {
    try {
        const body = ctx.request.body
        const { role, username, password }:  userModel.UserInput = body

        if (!username || !password) {
            ctx.status = 400
            ctx.body = apiResponse.error('Username and password are required', 400)
            return
        }

        const newUser = await userModel.createUser({
            username: username,
            role: role,
            password: password
        })

        const { password: _, ...user } = newUser

        ctx.status = 201
        ctx.body = apiResponse.success('User created successfully', user)
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const findUserById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params
        const result = await userModel.getUserById(id)
        console.log(result)

        if (!result) {
            ctx.status = 404
            ctx.body = apiResponse.error('User not found', 404)
            return 
        }

        const { password: _, ...user} = result

        ctx.status = 200
        ctx.body = apiResponse.success('User found successfully', user)
    } catch (error) {
        console.log(error)
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const deleteUserById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params
        const result = await userModel.deleteUser(id)

        if (!result) {
            ctx.status = 404
            ctx.body = apiResponse.error('User not found', 404)
            return
        }

        ctx.status = 200
        ctx.body = apiResponse.success('User delete successfully', { id })
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

export const login = async (ctx: Context): Promise<void> => {
    try {
        const body = ctx.request.body
        const { username, password }: userModel.LoginInput = body

        if (!username || !password) {
            ctx.status = 400
            ctx.body = apiResponse.error('Username and password are required', 400)
            return
        }

        const user = await userModel.getUserByUsername(username)

        if (!user) {
            ctx.status = 401
            ctx.body = apiResponse.error('Invalid credentials', 401)
            return
        }

        if (!bcrypt.compareSync(password, user.password)) {
            ctx.status = 401;
            ctx.body = apiResponse.error("Unauthorized.", 401);
            return;
        }
        
        const privateKey = '_'

        const token = jwt.sign({ sub: user.id }, privateKey, {
            expiresIn: "1d",
            algorithm: "HS256",
        });

        const success = {
            access_level: user.role,
            token: token,
          };
        
        ctx.body = apiResponse.success("Login successful", success);
    } catch (error) {
        ctx.status = 500
        ctx.body = apiResponse.error('Internal server error', 500)
    }
}

