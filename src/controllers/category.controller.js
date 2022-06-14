import Category from "../models/Category.model";
import createHttpError from "http-errors";
import expressAsyncHandler from "express-async-handler";
import { newCategorySchema } from "../utilities/form.schema";

export const createCategory = expressAsyncHandler(async (req, res, next) => {
  try {
    const data = await newCategorySchema.validateAsync(req.body)

    const newCategory = new Category(data)

    const category = await newCategory.save();

    return res.status(201).json(category)
  } catch (err) {
    if(err.isJoi) err.status = 422;
    return next(err)
  }
})