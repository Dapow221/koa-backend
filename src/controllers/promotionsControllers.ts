import { Context } from "koa";
import * as promotionsModel from '../models/promotion'
import * as apiResponse from '../utils/apiResponse'
import { uploadToS3, deleteFromS3 } from '../helpers/s3'


export const getAll = async (ctx: Context): Promise<void> => {
    try {
        const promotions = await promotionsModel.getAll();
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Promotions retrieved successfully', promotions);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to retrieve promotions', 500);
    }
}

export const getById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid promotion ID', 400);
            return;
        }
        
        const promotion = await promotionsModel.getById(parseInt(id));
        
        if (!promotion) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Promotion not found', 404);
            return;
        }
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Promotion retrieved successfully', promotion);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to retrieve promotion', 500);
    }
}

export const create = async (ctx: Context): Promise<void> => {
    try {
        const { title, subtitle, description, validity } = ctx.request.body;
        
        if (!title || !subtitle || !description || !validity) {
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
        
        const promotionData = {
            title,
            subtitle,
            description,
            validity,
            image: imageUrl
        };
        
        const newPromotion = await promotionsModel.create(promotionData);
        
        ctx.status = 201;
        ctx.body = apiResponse.success('Promotion created successfully', newPromotion);
    } catch (error) {
        console.log(error);
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to create promotion', 500);
    }
}

export const update = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        const { title, subtitle, description, validity } = ctx.request.body;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid promotion ID', 400);
            return;
        }
        
        const existingPromotion = await promotionsModel.getById(parseInt(id));
        if (!existingPromotion) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Promotion not found', 404);
            return;
        }
        
        let updateData: any = {};
        
        if (title !== undefined) updateData.title = title;
        if (subtitle !== undefined) updateData.subtitle = subtitle;
        if (description !== undefined) updateData.description = description;
        if (validity !== undefined) updateData.validity = validity;
        
        if (ctx.request.files) {
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                try {
                    const newImageUrl = await uploadToS3(imageFile);
                    
                    if (existingPromotion.image) {
                        await deleteFromS3(existingPromotion.image);
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
        
        const updatedPromotion = await promotionsModel.update(parseInt(id), updateData);
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Promotion updated successfully', updatedPromotion);
    } catch (error) {
        console.error('Update error:', error);
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to update promotion', 500);
    }
}

export const deletePromotion = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid promotion ID', 400);
            return;
        }
        
        const promotion = await promotionsModel.getById(parseInt(id));
        if (!promotion) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Promotion not found', 404);
            return;
        }
        
        // Delete image from S3 if it exists
        if (promotion.image) {
            await deleteFromS3(promotion.image);
        }
        
        const deleted = await promotionsModel.deletePromotion(parseInt(id));
        
        if (deleted) {
            ctx.status = 200;
            ctx.body = apiResponse.success('Promotion deleted successfully', null);
        } else {
            ctx.status = 500;
            ctx.body = apiResponse.error('Failed to delete promotion', 500);
        }
    } catch (error) {
        console.error('Delete error:', error);
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to delete promotion', 500);
    }
}