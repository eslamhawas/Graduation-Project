import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { resolve } from 'path';

@Injectable()
export class CloudinaryService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    filePath: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        filePath,
        { folder: 'nest_mega_service' },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );
    });
  }
}
