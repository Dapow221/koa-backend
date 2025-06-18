import { query } from '../config/db'

export interface Promotions {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    validity: string;
    image: string;
    created_at: Date;
    updated_at: Date;
}

export interface createPromotions {
    title: string;
    subtitle: string;
    description: string;
    validity: string;
    image: string;
}

export interface updatePromotions {
    title: string;
    subtitle: string;
    description: string;
    validity: string;
    image: string;
}

export const create = async (data: createPromotions): Promise<Promotions> => {
    const { title, subtitle, description, validity, image } = data

    const result = await query(
        'INSERT INTO promotions (title, subtitle, description, validity, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, subtitle, description, validity, image]
    );

    const promotions = result.rows[0]

    return {
        id: promotions.id,
        title: promotions.title,
        subtitle: promotions.subtitle,
        description: promotions.description,
        validity: promotions.validity,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    };
}

export const getAll = async (): Promise<Promotions[]> => {
    const result = await query(
        'SELECT * FROM promotions ORDER BY id DESC'
    );

    return result.rows.map((promotions: any) => ({
        id: promotions.id,
        title: promotions.title,
        subtitle: promotions.subtitle,
        description: promotions.description,
        validity: promotions.validity,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    }));
}

export const getById = async (id: number): Promise<Promotions | null> => {
    const result = await query(
        'SELECT * FROM promotions WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const promotions = result.rows[0];

    return {
        id: promotions.id,
        title: promotions.title,
        subtitle: promotions.subtitle,
        description: promotions.description,
        validity: promotions.validity,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    };
}

export const update = async (id: number, data: Partial<updatePromotions>): Promise<Promotions | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
        fields.push(`title = $${paramCount++}`);
        values.push(data.title);
    }
    if (data.subtitle !== undefined) {
        fields.push(`subtitle = $${paramCount++}`);
        values.push(data.subtitle);
    }
    if (data.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(data.description);
    }
    if (data.validity !== undefined) {
        fields.push(`validity = $${paramCount++}`);
        values.push(data.validity);
    }
    if (data.image !== undefined) {
        fields.push(`image = $${paramCount++}`);
        values.push(data.image);
    }

    if (fields.length === 0) {
        return getById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
        `UPDATE promotions SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        return null;
    }

    const promotions = result.rows[0];

    return {
        id: promotions.id,
        title: promotions.title,
        subtitle: promotions.subtitle,
        description: promotions.description,
        validity: promotions.validity,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    };
}

export const deletePromotion = async (id: number): Promise<boolean> => {
    const result = await query(
        'DELETE FROM promotions WHERE id = $1',
        [id]
    );

    return (result.rowCount || 0) > 0;
}

export const getPaginated = async (page: number = 1, limit: number = 10): Promise<{
    data: Promotions[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> => {
    const offset = (page - 1) * limit;
    
    const countResult = await query('SELECT COUNT(*) as total FROM promotions');
    const total = parseInt(countResult.rows[0].total);
    
    const dataResult = await query(
        'SELECT * FROM promotions ORDER BY id DESC LIMIT $1 OFFSET $2',
        [limit, offset]
    );
    
    const data = dataResult.rows.map((promotions: any) => ({
        id: promotions.id,
        title: promotions.title,
        subtitle: promotions.subtitle,
        description: promotions.description,
        validity: promotions.validity,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    }));
    
    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}