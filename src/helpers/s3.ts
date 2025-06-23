import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_KEY!,
    },
    region: process.env.REGION_AWS!
});

const BUCKET_NAME = 'rumarasanusantara';

export const uploadToS3 = async (file: any, folder: string = 'promotions'): Promise<string> => {
    const fileExtension = path.extname(file.originalFilename);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    
    const fileContent = fs.readFileSync(file.filepath);
    
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype,
    });
    
    try {
        await s3Client.send(command);
        fs.unlinkSync(file.filepath);
        
        // Construct the URL manually since v3 doesn't return Location in the response
        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.REGION_AWS}.amazonaws.com/${fileName}`;
        return fileUrl;
    } catch (error) {
        fs.unlinkSync(file.filepath);
        throw error;
    }
};

export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
    try {
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1);
        
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        });
        
        await s3Client.send(command);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
    }
};