import { Context } from "koa";
import * as promotionsModel from '../models/promotion'
import * as apiResponse from '../utils/apiResponse'
import * as fs from 'fs';
import * as path from 'path';

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
        
        let imagePath = '';
        
        if (ctx.request.files) {
            const customDir = 'promotions/';
            const storagePath = path.join(__dirname, '..', 'storage', customDir);
            
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                const fileExtension = path.extname(imageFile.originalFilename);
                const fileName = `promotion_${Date.now()}${fileExtension}`;
                const filePath = path.join(storagePath, fileName);
                
                const reader = fs.createReadStream(imageFile.filepath);
                const writer = fs.createWriteStream(filePath);
                reader.pipe(writer);
                
                reader.on('end', () => {
                    fs.unlinkSync(imageFile.filepath);
                });
                
                imagePath = `promotions/${fileName}`
            }
        }
        
        const promotionData = {
            title,
            subtitle,
            description,
            validity,
            image: imagePath
        };
        
        const newPromotion = await promotionsModel.create(promotionData);
        
        ctx.status = 201;
        ctx.body = apiResponse.success('Promotion created successfully', newPromotion);
    } catch (error) {
        console.log(error)
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
            const customDir = 'promotions/';
            const storagePath = path.join(__dirname, '..', 'storage', customDir);
            
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                if (existingPromotion.image) {
                    const oldImagePath = path.join(__dirname, '..', 'storage', existingPromotion.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                
                const fileExtension = path.extname(imageFile.originalFilename);
                const fileName = `promotion_${Date.now()}${fileExtension}`;
                const filePath = path.join(storagePath, fileName);
                
                const reader = fs.createReadStream(imageFile.filepath);
                const writer = fs.createWriteStream(filePath);
                reader.pipe(writer);
                
                reader.on('end', () => {
                    fs.unlinkSync(imageFile.filepath);
                });
                
                updateData.image = `${customDir}${fileName}`;
            }
        }
        
        const updatedPromotion = await promotionsModel.update(parseInt(id), updateData);
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Promotion updated successfully', updatedPromotion);
    } catch (error) {
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
        
        if (promotion.image) {
            const imagePath = path.join(__dirname, '..', 'storage', promotion.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to delete promotion', 500);
    }
}