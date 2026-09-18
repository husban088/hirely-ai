import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  /** Uploads a buffer (resume PDF/DOCX, avatar image, or video) to Cloudinary. */
  async uploadBuffer(
    buffer: Buffer,
    options: { folder: string; resourceType?: 'image' | 'video' | 'raw' | 'auto' },
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          resource_type: options.resourceType || 'auto',
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw') {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
}
