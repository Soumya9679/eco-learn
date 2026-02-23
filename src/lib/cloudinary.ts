import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  options: Record<string, unknown> = {}
): Promise<{ secure_url: string; resource_type: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      }
    );

    const { Readable } = require("stream");
    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
}
