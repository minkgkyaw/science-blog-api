import { authorizeAdmin } from "../controllers/auth.controller"
import { createCategory } from "../controllers/category.controller"

export const categoryRouter = app => {
  app
    .post('/api/v1/categories', authorizeAdmin, createCategory)
}
