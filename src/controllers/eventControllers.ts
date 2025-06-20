import { Context } from "koa";
import * as eventsModel from '../models/eventSection'
import * as apiResponse from '../utils/apiResponse'
import { uploadToS3, deleteFromS3 } from '../helpers/s3'


export const getAll = async (ctx: Context): Promise<void> => {
    try {
        const events = await eventsModel.getAll();
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Events retrieved successfully', events);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to retrieve events', 500);
    }
}

export const getById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid event ID', 400);
            return;
        }
        
        const event = await eventsModel.getById(parseInt(id));
        
        if (!event) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Event not found', 404);
            return;
        }
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Event retrieved successfully', event);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to retrieve event', 500);
    }
}

export const create = async (ctx: Context): Promise<void> => {
    try {
        const { title, description} = ctx.request.body;
        
        if (!title || !description ) {
            ctx.status = 400;
            ctx.body = apiResponse.error('All fields are required', 400);
            return;
        }
        
        let imageUrl = '';
        
        if (ctx.request.files) {
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                try {
                    imageUrl = await uploadToS3(imageFile);
                } catch (uploadError) {
                    console.error('S3 upload error:', uploadError);
                    ctx.status = 500;
                    ctx.body = apiResponse.error('Failed to upload image', 500);
                    return;
                }
            }
        }
        
        const eventData = {
            title,
            description,
            image: imageUrl
        };
        
        const newEvent = await eventsModel.create(eventData);
        
        ctx.status = 201;
        ctx.body = apiResponse.success('Event created successfully', newEvent);
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to create event', 500);
    }
}

export const update = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        const { title, description } = ctx.request.body;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid event ID', 400);
            return;
        }
        
        const existingEvent = await eventsModel.getById(parseInt(id));
        if (!existingEvent) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Event not found', 404);
            return;
        }
        
        let updateData: any = {};
        
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        
        if (ctx.request.files) {
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                try {
                    const newImageUrl = await uploadToS3(imageFile);
                    
                    if (existingEvent.image) {
                        await deleteFromS3(existingEvent.image);
                    }
                    
                    updateData.image = newImageUrl;
                } catch (uploadError) {
                    console.error('S3 upload error:', uploadError);
                    ctx.status = 500;
                    ctx.body = apiResponse.error('Failed to upload image', 500);
                    return;
                }
            }
        }
        
        const updatedEvent = await eventsModel.update(parseInt(id), updateData);
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Event updated successfully', updatedEvent);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to update event', 500);
    }
}

export const deleteEvents = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid event ID', 400);
            return;
        }
        
        const event = await eventsModel.getById(parseInt(id));
        if (!event) {
            ctx.status = 404;
            ctx.body = apiResponse.error('event not found', 404);
            return;
        }
        
        if (event.image) {
            await deleteFromS3(event.image);
        }
        
        const deleted = await eventsModel.deleteEvent(parseInt(id));
        
        if (deleted) {
            ctx.status = 200;
            ctx.body = apiResponse.success('Event deleted successfully', null);
        } else {
            ctx.status = 500;
            ctx.body = apiResponse.error('Failed to delete event', 500);
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to delete event', 500);
    }
}