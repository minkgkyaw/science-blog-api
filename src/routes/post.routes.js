import passport from 'passport'
import { authorizeUser } from '../controllers/auth.controller'
import { createNewPost, getAllPost } from '../controllers/post.controller'
import { upload } from '../utilities/fileUpload'
import { createPostValidator } from '../utilities/validator'

export const postRouter = app => {
  app
    .get('/api/v1/posts', authorizeUser, getAllPost)
    .post(
      '/api/v1/posts',
      authorizeUser,
      upload.fields([
        { name: 'preview_image', maxCount: 1 },
        { name: 'images', maxCount: 4 },
      ]),
      createNewPost
    )
    .get('/api/v1/posts/:id', authorizeUser, (req, res, next) => res.send('work'))
}
