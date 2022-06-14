import expressAsyncHandler from 'express-async-handler'
import redis from '../configs/redis.config'
import otpGenerator from 'otp-generator'
import { registerSchema, verifyUserSchema } from '../utilities/form.schema'
import createHttpError from 'http-errors'
import User from '../models/User.model'
import path from 'path'
import { sendMail } from '../utilities/sendMail'
import ejs from 'ejs'
import { config } from '../configs/general.config'
import passport from 'passport'

const cwd = process.cwd()
export const register = expressAsyncHandler(async (req, res, next) => {
  try {
    const data = await registerSchema.validateAsync(req.body)
    console.log(data)
    if (data.email === config.founderMail) {
      const newUser = new User(data)
      const saveAdmin = await newUser.save()

      if (!saveAdmin) return next(createHttpError(409))

      return res.status(201).json({ status: 201, message: 'Register Succeed.' })
    } else {
      const key = otpGenerator.generate(7, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      })

      // save user to redis
      await redis.set(key, JSON.stringify(data))

      // set expired time to 5 min
      await redis.expire(key, 300)

      // getting template
      const template = await ejs.renderFile(
        path.join(cwd, 'src', 'template', 'verification_email.ejs'),
        { first_name: data.first_name, verification_code: key }
      )

      // send verification email
      await sendMail(data.email, 'Please verify your email', 'Please verify your email', template)
      return res.status(201).json({
        status: 201,
        message: 'Successfully created account and please verify your email',
      })
    }
  } catch (err) {
    if (err.isJoi) err.status = 422
    return next(err)
  }
})

export const verifyUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const data = await verifyUserSchema.validateAsync(req.body)

    const verifyUser = await redis.get(data.verification_code)

    if (!verifyUser) return next(createHttpError(404))

    const newUser = new User(JSON.parse(verifyUser))

    const saveUser = await newUser.save()

    if (!saveUser) return next(createHttpError(409, "Can't created new user"))

    // get token
    const token = await saveUser.generateToken()

    if (!token) return next(createHttpError(500, "Can't created token"))

    return res.status(200).json({
      status: 200,
      message: 'Verification succeed',
      token,
    })
  } catch (err) {
    if (err.isJoi) err.status = 422
    return next(err)
  }
})

export const loginUser = expressAsyncHandler(async (req, res, next) => {
  try {
    passport.authenticate('local', async (err, user) => {
      if (err) return next(createHttpError(500, err.message))
      if (!user) return next(createHttpError(401, 'Invalid email or password'))

      const token = await user.generateToken()

      if (!token) return next(createHttpError(500, "Can't create token"))

      return res.status(200).json({
        status: 200,
        message: 'Login successful',
        token,
      })
    })(req, res, next)
  } catch (err) {
    return next(err)
  }
})

export const authorizeUser = expressAsyncHandler(async (req, res, next) => {
  try {
    passport.authorize('jwt', (err, user, info) => {
      if (err) return next(createHttpError(err.status, err.message))
      if (!user && info.message === 'Not found!') return next(createHttpError(404))
      else if (!user && info.message) return next(createHttpError(401))
      return next()
    })(req, res, next)
  } catch (err) {
    return next(err)
  }
})

export const authorizeAdmin = expressAsyncHandler(async (req, res, next) => {
  try {
    passport.authorize('jwt', (err, user, info) => {
      console.log(user.role)
      if (err) return next(createHttpError(err.status, err.message))
      if (!user && info.message === 'Not found!') return next(createHttpError(404))
      else if (!user && info.message) return next(createHttpError(401))
      if(user.role === 'Admin' || user.role === 'Founder') return next();
      else return next(createHttpError(403))
    })(req, res, next)
  } catch (err) {
    return next(err)
  }
})
