import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/science_blog",
  saltRound: +process.env.SALT_ROUND || 10,
  sgApiKey: process.env.SG_API_KEY || 'sg:api:key',
  founderMail: process.env.FOUNDER_MAIL || 'sm mail ',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'cloudinary cloud name',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || 'cloudinary api key',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'cloudinary api secret'
}


