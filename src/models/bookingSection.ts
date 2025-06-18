import { query } from '../config/db';

interface Booking {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    sub_description: string;
}

export interface BookingInput {
    title: string;
    subtitle: string;
    description: string;
    sub_description: string;

}

export interface UpdateBookingInput {
    title: string;
    subtitle: string;
    description: string;
    sub_description: string;

}

export const create = async (booking: BookingInput): Promise<Booking> => {
    const { title, subtitle, description, sub_description } = booking

    const result = await query(
        'INSERT INTO booking (title, subtitle, description, sub_description) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, subtitle, description, sub_description]
    );

    const bookingData = result.rows[0]

    return {
        id: bookingData.id,
        title: bookingData.title,
        subtitle: bookingData.subtitle,
        description: bookingData.description,
        sub_description: bookingData.sub_description
    }
}

export const update = async (id: number, booking: UpdateBookingInput): Promise<Booking> => {
    const { title, subtitle, description, sub_description } = booking

    const result = await query(
        'UPDATE booking SET title = $1, subtitle = $2, description = $3, sub_description = $4 WHERE id = $5 RETURNING *',
        [title, subtitle, description, sub_description, id]
    );

    const bookingData = result.rows[0]

    return {
        id: bookingData.id,
        title: bookingData.title,
        subtitle: bookingData.subtitle,
        description: bookingData.description,
        sub_description: bookingData.sub_description
    }
}

export const findAll = async (): Promise<Booking> => {
    const result = await query('SELECT * FROM booking ORDER BY id ASC LIMIT 1')

    const booking = result.rows[0];
    
    return {
        id: booking.id,
        title: booking.title,
        subtitle: booking.subtitle,
        description: booking.description,
        sub_description: booking.sub_description
    };
}

export const findById = async (id: number): Promise<Booking | null> => {
    const result = await query('SELECT * FROM about WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return null
    }

    const bookingData = result.rows[0]

    return {
        id: bookingData.id,
        title: bookingData.title,
        subtitle: bookingData.subtitle,
        description: bookingData.description,
        sub_description: bookingData.sub_description
    }
}