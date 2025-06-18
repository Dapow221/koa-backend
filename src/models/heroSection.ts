import { query } from '../config/db';

interface Hero {
    id: number;
    title: string[];
    description: string;
    opening_hours: string;
    address: string;
    created_at: Date;
    updated_at: Date;
}

export interface HeroCreateInput {
    title: string[];
    description: string;
    openingHours: string;
    address: string;
}

export interface HeroUpdateInput {
    title?: string[];
    description?: string;
    openingHours?: string;
    address?: string;
}

export const create = async (heroData: HeroCreateInput): Promise<Hero> => {
    const { title, description, openingHours, address } = heroData;
    const titleJson = JSON.stringify(title);
    
    const result = await query(
        'INSERT INTO hero (title, description, opening_hours, address) VALUES ($1, $2, $3, $4) RETURNING *',
        [titleJson, description, openingHours, address]
    );

    const hero = result.rows[0];

    return {
        id: hero.id,
        title: hero.title,
        description: hero.description,
        opening_hours: hero.opening_hours,
        address: hero.address,
        created_at: hero.created_at,
        updated_at: hero.updated_at
    };
};

export const findById = async (id: number): Promise<Hero | null> => {
    const result = await query('SELECT * FROM hero WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
        return null;
    }

    const hero = result.rows[0];
    
    let title = hero.title;
    if (typeof title === 'string') {
        try {
            title = JSON.parse(title);
        } catch (e) {
            title = hero.title;
        }
    }

    return {
        id: hero.id,
        title: title,
        description: hero.description,
        opening_hours: hero.opening_hours,
        address: hero.address,
        created_at: hero.created_at,
        updated_at: hero.updated_at
    };
};

export const findLatest = async (): Promise<Hero | null> => {
    const result = await query('SELECT * FROM hero ORDER BY id DESC LIMIT 1');
    
    if (result.rows.length === 0) {
        return null;
    }

    const hero = result.rows[0];
    
    let title = hero.title;
    if (typeof title === 'string') {
        try {
            title = JSON.parse(title);
        } catch (e) {
            title = hero.title;
        }
    }

    return {
        id: hero.id,
        title: title,
        description: hero.description,
        opening_hours: hero.opening_hours,
        address: hero.address,
        created_at: hero.created_at,
        updated_at: hero.updated_at
    };
};

export const updateById = async (id: number, heroData: HeroUpdateInput): Promise<Hero | null> => {
    const { title, description, openingHours, address } = heroData;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title) {
        updates.push(`title = $${paramIndex}`);
        values.push(JSON.stringify(title));
        paramIndex++;
    }

    if (description) {
        updates.push(`description = $${paramIndex}`);
        values.push(description);
        paramIndex++;
    }

    if (openingHours) {
        updates.push(`opening_hours = $${paramIndex}`);
        values.push(openingHours);
        paramIndex++;
    }

    if (address) {
        updates.push(`address = $${paramIndex}`);
        values.push(address);
        paramIndex++;
    }

    if (updates.length === 0) {
        return null;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const updateQuery = `UPDATE hero SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await query(updateQuery, values);
    
    if (result.rows.length === 0) {
        return null;
    }

    const hero = result.rows[0];

    return {
        id: hero.id,
        title: hero.title,
        description: hero.description,
        opening_hours: hero.opening_hours,
        address: hero.address,
        created_at: hero.created_at,
        updated_at: hero.updated_at
    };
};