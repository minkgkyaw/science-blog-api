import passport from "passport";
import LocalStrategy from 'passport-local'
import passportJwt from 'passport-jwt'
import fs from 'fs'
import path from 'path'
import Db from '../models/User.model'
import UserModel from "../models/User.model";

const cwd = process.cwd();

passport.use(new LocalStrategy({
    usernameField: 'email',
    session: false
  }, async (email, password, done) => {
  try {
    const user = await Db.findOne({email})

    if(!user) return done(null, false, {message: 'Not found!'})

    const isMatchPwd = await user.comparePassword(password)

    if(!isMatchPwd) return done(null, false, {message: 'Unauthorized!'})

    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))

const JwtStrategy = passportJwt.Strategy
const ExtractJwtStrategy = passportJwt.ExtractJwt

const accessTokenPrivateKey = fs.readFileSync(path.join(cwd, 'src', 'cert', 'access_token', 'private.key'))

passport.use(new JwtStrategy({jwtFromRequest: ExtractJwtStrategy.fromAuthHeaderAsBearerToken(), secretOrKey: accessTokenPrivateKey, algorithms: ['ES256', 'HS256', 'RS256']}, async (jwt_payload, done) => {
  try {
    const user = await UserModel.findById(jwt_payload.id)

    if(!user) return done(null, false, {message: 'Not found!'})

    return done(false, user)
  } catch (err) {
    return done(err)
  }
}))