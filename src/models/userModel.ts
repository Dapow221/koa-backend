import { query } from '../config/db'
import bcrypt from 'bcryptjs';

interface User {
    id: number;
    role: string;
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserInput {
    role?: string;
    username: string;
    password: string;
}

export interface LoginInput {
    username: string;
    password: string;
}


export const createUser = async (user: UserInput): Promise<User> => {
    const salt = 10
    const hashPassword = await bcrypt.hash(user.password, salt)

    const result = await query(
        `INSERT INTO users (role, username, password) 
        VALUES ($1, $2, $3) 
        RETURNING *`,

        [user.role, user.username, hashPassword]
    )

    return result.rows[0]
}

export const getUserById = async (id: number): Promise<User> => {
    const result = await query(`SELECT * FROM users WHERE id = $1`, [id])
    return result.rows[0]
}

export const getUserByUsername = async (username: string): Promise<User> => {
    const result = await query(`SELECT * FROM users WHERE username = $1`, [username])
    return result.rows[0]
}

export const deleteUser = async (id: number): Promise<User> => {
    const result = await query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id])
    return result.rows[0]
}



