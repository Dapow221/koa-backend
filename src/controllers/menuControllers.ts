import { Context } from "koa";
import * as menusModel from '../models/menu'
import * as apiResponse from '../utils/apiResponse'
import * as fs from 'fs';
import * as path from 'path';

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
        
        let imagePath = '';
        
        if (ctx.request.files) {
            const customDir = 'menus/';
            const storagePath = path.join(__dirname, '..', 'storage', customDir);
            
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                const fileExtension = path.extname(imageFile.originalFilename);
                const fileName = `menu_${Date.now()}${fileExtension}`;
                const filePath = path.join(storagePath, fileName);
                
                const reader = fs.createReadStream(imageFile.filepath);
                const writer = fs.createWriteStream(filePath);
                reader.pipe(writer);
                
                reader.on('end', () => {
                    fs.unlinkSync(imageFile.filepath);
                });
                
                imagePath = `menus/${fileName}`
            }
        }
        
        if (!imagePath) {
            ctx.status = 400;
            ctx.body = apiResponse.error('Image is required', 400);
            return;
        }
        
        const menuData = {
            image: imagePath,
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
            const customDir = 'menus/';
            const storagePath = path.join(__dirname, '..', 'storage', customDir);
            
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            
            const imageFile = ctx.request.files.image as any;
            if (imageFile) {
                if (existingMenu.image) {
                    const oldImagePath = path.join(__dirname, '..', 'storage', existingMenu.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                
                const fileExtension = path.extname(imageFile.originalFilename);
                const fileName = `menu_${Date.now()}${fileExtension}`;
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
            const imagePath = path.join(__dirname, '..', 'storage', menu.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
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