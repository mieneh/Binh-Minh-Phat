import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private isBase64Image(image?: string) {
    return typeof image === 'string' && image.startsWith('data:image/');
  }

  async uploadImage(
    image: string,
    folder: string,
  ): Promise<{ url: string; publicId: string }> {
    if (!this.isBase64Image(image)) {
      throw new BadRequestException('Invalid image format');
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(image, {
      folder,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async deleteImage(publicId?: string) {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  }
}
