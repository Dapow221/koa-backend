import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION_AWS
});

const BUCKET_NAME = 'rumarasanusantara';

// Helper function to upload file to S3
export const uploadToS3 = async (file: any, folder: string = 'promotions'): Promise<string> => {
    const fileExtension = path.extname(file.originalFilename);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;
    
    const fileContent = fs.readFileSync(file.filepath);
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype,
    };
    
    try {
        const result = await s3.upload(params).promise();
        // Clean up temporary file
        fs.unlinkSync(file.filepath);
        return result.Location;
    } catch (error) {
        // Clean up temporary file even if upload fails
        fs.unlinkSync(file.filepath);
        throw error;
    }
};

// Helper function to delete file from S3
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
    try {
        // Extract key from S3 URL
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1); // Remove leading slash
        
        const params = {
            Bucket: BUCKET_NAME,
            Key: key
        };
        
        await s3.deleteObject(params).promise();
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        // Don't throw error here to avoid breaking the main operation
    }
};