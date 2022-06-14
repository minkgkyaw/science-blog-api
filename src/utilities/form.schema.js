import joi from 'joi'

export const registerSchema = joi.object().keys({
  first_name: joi.string().trim().min(3).max(100).required(),
  last_name: joi.string().trim().min(3).max(100).required(),
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().min(6).max(100).required(),
  confirm_password: joi.string().min(6).max(100).required().valid(joi.ref('password'))
})

export const verifyUserSchema = joi.object().keys({
  verification_code: joi.number().min(6).required()
})

export const newPostSchema = joi.object().keys({
  title: joi.string().min(3).max(100).required(),
  description: joi.string().min(3).max(600).required(),
  preview_image: joi.any(),
  images: joi.any(),
  posted_by: joi.string().required() 
})

export const newCategorySchema = joi.object().keys({
  name: joi.string().min(3).max(100).required(),
  created_user: joi.string().required()
})