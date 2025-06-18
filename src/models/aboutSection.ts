import { query } from '../config/db';

interface About {
    id: number;
    title: string;
    subtitle: string;
    description: string;
}

export interface AboutCreateInput {
    title: string;
    subtitle: string;
    description: string;
}

export interface AboutUpdateInput {
    title: string;
    subtitle: string;
    description: string;
}

export const create = async (about: AboutCreateInput): Promise<About> => {
    const { title, subtitle, description } = about

    const result = await query(
        'INSERT INTO hero (title, subtitle, description) VALUES ($1, $2, $3) RETURNING *',
        [title, subtitle, description]
    );

    const aboutData = result.rows[0]

    return {
        id: aboutData.id,
        title: aboutData.title,
        subtitle: aboutData.subtitle,
        description: aboutData.description,
    }
}

export const update = async (id: number, about: AboutUpdateInput): Promise<About> => {
    const { title, subtitle, description } = about

    const result = await query(
        'UPDATE about SET title = $1, subtitle = $2, description = $3 WHERE id = $4 RETURNING *',
        [title, subtitle, description, id]
    );

    const aboutData = result.rows[0]

    return {
        id: aboutData.id,
        title: aboutData.title,
        subtitle: aboutData.subtitle,
        description: aboutData.description,
    }
}

export const findAll = async (): Promise<About> => {
    const result = await query('SELECT * FROM about ORDER BY id ASC LIMIT 1')

    const aboutData = result.rows[0];
    
    return {
        id: aboutData.id,
        title: aboutData.title,
        subtitle: aboutData.subtitle,
        description: aboutData.description,
    };
}

export const findById = async (id: number): Promise<About | null> => {
    const result = await query('SELECT * FROM about WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return null
    }

    const aboutData = result.rows[0]

    return {
        id: aboutData.id,
        title: aboutData.title,
        subtitle: aboutData.subtitle,
        description: aboutData.description,
    }
}