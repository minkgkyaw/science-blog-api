import { v2 as cloudinary } from 'cloudinary';
import { config } from '../configs/general.config';

cloudinary.config({ 
  cloud_name: config.cloudinaryCloudName, 
  api_key: config.cloudinaryApiKey, 
  api_secret: config.cloudinaryApiSecret 
});

export const uploadToCloud = (img) => cloudinary.uploader.upload(img, {}, (err, result) => {
  if(err) return err;
  return result
})