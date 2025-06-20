import { Context } from "koa";
import * as menusModel from '../models/menu'
import * as apiResponse from '../utils/apiResponse'
import { uploadToS3, deleteFromS3 } from '../helpers/s3'


export const getAll = async (ctx: Context): Promise<void> => {
    try {
        const menus = await menusModel.getAll();
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Menus retrieved successfully', menus);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to retrieve menus', 500);
    }
}

export const getById = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid menu ID', 400);
            return;
        }
        
        const menu = await menusModel.getById(parseInt(id));
        
        if (!menu) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Menu not found', 404);
            return;
        }
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Menu retrieved successfully', menu);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to retrieve menu', 500);
    }
}

export const create = async (ctx: Context): Promise<void> => {
    try {
        const { category } = ctx.request.body;
        
        if (!category) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Category is required', 400);
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
        
        
        const menuData = {
            image: imageUrl,
            category
        };
        
        const newMenu = await menusModel.create(menuData);
        
        ctx.status = 201;
        ctx.body = apiResponse.success('Menu created successfully', newMenu);
    } catch (error) {
        console.log(error)
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to create menu', 500);
    }
}

export const update = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        const { category } = ctx.request.body;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid menu ID', 400);
            return;
        }
        
        const existingMenu = await menusModel.getById(parseInt(id));
        if (!existingMenu) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Menu not found', 404);
            return;
        }
        
        let updateData: any = {};
        
        if (category !== undefined) updateData.category = category;
        
        if (ctx.request.files) {
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                try {
                    const newImageUrl = await uploadToS3(imageFile);
                    
                    if (existingMenu.image) {
                        await deleteFromS3(existingMenu.image);
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
        
        const updatedMenu = await menusModel.update(parseInt(id), updateData);
        
        ctx.status = 200;
        ctx.body = apiResponse.success('Menu updated successfully', updatedMenu);
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to update menu', 500);
    }
}

export const deleteMenu = async (ctx: Context): Promise<void> => {
    try {
        const { id } = ctx.params;
        
        if (!id || isNaN(parseInt(id))) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Invalid menu ID', 400);
            return;
        }
        
        const menu = await menusModel.getById(parseInt(id));
        if (!menu) {
            ctx.status = 404;
            ctx.body = apiResponse.error('Menu not found', 404);
            return;
        }
        
        if (menu.image) {
            await deleteFromS3(menu.image);
        }
        
        const deleted = await menusModel.deleteMenu(parseInt(id));
        
        if (deleted) {
            ctx.status = 200;
            ctx.body = apiResponse.success('Menu deleted successfully', null);
        } else {
            ctx.status = 500;
            ctx.body = apiResponse.error('Failed to delete menu', 500);
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = apiResponse.error('Failed to delete menu', 500);
    }
}