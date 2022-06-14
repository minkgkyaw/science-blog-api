import { loginUser, register, verifyUser } from '../controllers/auth.controller'

export const authRouter = app => {
  app
    .get('/api/v1/auth/csrf_token', (req, res) => res.json({ csrfToken: req.csrfToken() }))
    .post('/api/v1/auth/register', register)
    .post('/api/v1/auth/verify_user', verifyUser)
    .post('/api/v1/auth/login', loginUser)
}
