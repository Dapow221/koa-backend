import { query } from '../config/db'

export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    created_at: Date;
    updated_at: Date;
}

export interface createEvent {
    title: string;
    description: string;
    image: string;
}

export interface updateEvent {
    title: string;
    description: string;
    image: string;
}

export const create = async (data: createEvent): Promise<Event> => {
    const { title, description, image } = data

    const result = await query(
        'INSERT INTO events (title, description, image) VALUES ($1, $2, $3) RETURNING *',
        [title, description, image]
    );

    const promotions = result.rows[0]

    return {
        id: promotions.id,
        title: promotions.title,
        description: promotions.description,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    };
}

export const getAll = async (): Promise<Event[]> => {
    const result = await query(
        'SELECT * FROM events ORDER BY id DESC'
    );

    return result.rows.map((promotions: any) => ({
        id: promotions.id,
        title: promotions.title,
        description: promotions.description,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    }));
}

export const getById = async (id: number): Promise<Event | null> => {
    const result = await query(
        'SELECT * FROM events WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const promotions = result.rows[0];

    return {
        id: promotions.id,
        title: promotions.title,
        description: promotions.description,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    };
}

export const update = async (id: number, data: Partial<updateEvent>): Promise<Event | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
        fields.push(`title = $${paramCount++}`);
        values.push(data.title);
    }
    if (data.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(data.description);
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
        `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        return null;
    }

    const promotions = result.rows[0];

    return {
        id: promotions.id,
        title: promotions.title,
        description: promotions.description,
        image: promotions.image,
        created_at: promotions.created_at,
        updated_at: promotions.updated_at
    };
}

export const deleteEvent = async (id: number): Promise<boolean> => {
    const result = await query(
        'DELETE FROM events WHERE id = $1',
        [id]
    );

    return (result.rowCount || 0) > 0;
}

export const getPaginated = async (page: number = 1, limit: number = 10): Promise<{
    data: Event[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}> => {
    const offset = (page - 1) * limit;
    
    const countResult = await query('SELECT COUNT(*) as total FROM promotions');
    const total = parseInt(countResult.rows[0].total);
    
    const dataResult = await query(
        'SELECT * FROM events ORDER BY id DESC LIMIT $1 OFFSET $2',
        [limit, offset]
    );
    
    const data = dataResult.rows.map((promotions: any) => ({
        id: promotions.id,
        title: promotions.title,
        description: promotions.description,
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