import { newPostSchema } from "./form.schema";

export const createPostValidator = async (req, res, next) => {
  console.log(req.body)
  try {
    await newPostSchema.validateAsync(req.body)

    return next()
  } catch (err) {
    if(err.isJoi) err.status = 422;
    return next(err)
  }
}