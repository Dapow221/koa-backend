import { query } from '../config/db'

export interface Menu {
    id: number;
    image: string;
    category: string;
    created_at: Date;
    updated_at: Date;
}

export interface createMenu {
    image: string;
    category: string;
}

export interface updateMenu {
    image: string;
    category: string;
}

export const create = async (data: createMenu): Promise<Menu> => {
    const { image, category } = data

    const result = await query(
        'INSERT INTO menus (image, category) VALUES ($1, $2) RETURNING *',
        [image, category]
    );

    const menu = result.rows[0]

    return {
        id: menu.id,
        image: menu.image,
        category: menu.category,
        created_at: menu.created_at,
        updated_at: menu.updated_at
    };
}

export const getAll = async (): Promise<Menu[]> => {
    const result = await query(
        'SELECT * FROM menus ORDER BY id DESC'
    );

    return result.rows.map((menu: any) => ({
        id: menu.id,
        image: menu.image,
        category: menu.category,
        created_at: menu.created_at,
        updated_at: menu.updated_at
    }));
}

export const getById = async (id: number): Promise<Menu | null> => {
    const result = await query(
        'SELECT * FROM menus WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const menu = result.rows[0];

    return {
        id: menu.id,
        image: menu.image,
        category: menu.category,
        created_at: menu.created_at,
        updated_at: menu.updated_at
    };
}

export const update = async (id: number, data: Partial<updateMenu>): Promise<Menu | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.image !== undefined) {
        fields.push(`image = $${paramCount++}`);
        values.push(data.image);
    }
    if (data.category !== undefined) {
        fields.push(`category = $${paramCount++}`);
        values.push(data.category);
    }

    if (fields.length === 0) {
        return getById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
        `UPDATE menus SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        return null;
    }

    const menu = result.rows[0];

    return {
        id: menu.id,
        image: menu.image,
        category: menu.category,
        created_at: menu.created_at,
        updated_at: menu.updated_at
    };
}

export const deleteMenu = async (id: number): Promise<boolean> => {
    const result = await query(
        'DELETE FROM menus WHERE id = $1',
        [id]
    );

    return (result.rowCount || 0) > 0;
}

export const getPaginated = async (page: number = 1, limit: number = 10): Promise<{
    data: Menu[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> => {
    const offset = (page - 1) * limit;
    
    const countResult = await query('SELECT COUNT(*) as total FROM menus');
    const total = parseInt(countResult.rows[0].total);
    
    const dataResult = await query(
        'SELECT * FROM menus ORDER BY id DESC LIMIT $1 OFFSET $2',
        [limit, offset]
    );
    
    const data = dataResult.rows.map((menu: any) => ({
        id: menu.id,
        image: menu.image,
        category: menu.category,
        created_at: menu.created_at,
        updated_at: menu.updated_at
    }));
    
    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}