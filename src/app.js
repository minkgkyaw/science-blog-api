import http from 'http'
import consola from 'consola'
import express from 'express'
import mongoose from 'mongoose'
import toobusy_js from 'toobusy-js'
import cors from 'cors'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import hpp from 'hpp'
import xssClean from 'xss-clean'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import createHttpError from 'http-errors'
import csurf from 'csurf'
import redis from './configs/redis.config'
import { toobusyServer } from './middleware/toobusy'
import { config } from './configs/general.config'
import { connectToDB } from './configs/db.config'
import rateLimiterMiddleware from './middleware/rateLimiter'
import { authRouter } from './routes/auth.routes'
import { postRouter } from './routes/post.routes'
import passport from 'passport'
import './configs/passport.config'
import path from 'path'
import { categoryRouter } from './routes/category.routes'

const port = config.port
const cwd = process.cwd()

const app = express()

/**
 * @middleware
 */
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
)
app.use(logger('dev'))
app.use(rateLimiterMiddleware(createHttpError))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(
  csurf({
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8.64e+7
    },
  })
)
app.use(hpp())
app.use(xssClean())
app.use(helmet())
app.use(ExpressMongoSanitize())
app.use(passport.initialize())
app.use(toobusyServer(createHttpError))

/**
 * @routes
 */
app.use('/public', express.static(path.join(cwd, 'public')))
authRouter(app)
categoryRouter(app)
postRouter(app)
app.use((_req, _res, next) => next(createHttpError(404)))

app.use((err, _req, res, _next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error!'

  return res.status(status).json({
    status,
    message,
  })
})

/**
 * @main function
 */
const main = () => {
  const server = http.createServer(app)

  server.listen(config.port, () => {
    consola.info('Server start listening...')

    // connect to Redis server
    redis.on('ready', () => consola.success('Successfully connected to Redis server ❤️'))

    // connect to MongoDB
    connectToDB()

    consola.success(`Server ready on ${port} 🚀`)
  })
}

/**
 * @shutdown function
 */
const shutDown = error => {
  if (error) consola.fatal(`Shutdown received due to error, ${error.message}`)
  else consola.info('Graceful shutdown received!')
  try {
    mongoose.connection.close(false, () =>
      consola.success('Successfully closed mongoose connection!')
    )

    redis.quit()
    redis.on('disconnected', () => consola.success('Successfully disconnected from Redis Server'))

    toobusy_js.shutdown()

    server.close(() => consola.success('Successfully shutdown server!'))
  } catch (err) {
    consola.error('Something went wrong', err.message)
    return process.exit(error ? 1 : err ? 1 : 0)
  }

  return process.exit(error ? 1 : 0)
}

// start main server
main()

process
  .on('SIGINT', () => shutDown)
  .on('SIGTERM', () => shutDown)
  .on('uncaughtException', err => shutDown(err))

export default app
