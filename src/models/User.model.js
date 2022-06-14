import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { config } from '../configs/general.config'

const pwd = process.cwd()

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
    },
    last_name: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      min: 3,
      max: 100,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ['Founder', 'Admin', 'Member', 'Author'],
      default: 'Member',
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, opt) {
    delete ret._id
    delete ret.__v
    delete ret.password
    return ret
  },
})

userSchema.virtual('fullName').get(function () {
  return this.first_name + ' ' + this.last_name
})

userSchema.pre('save', async function (next) {
  try {
    if (this.email === config.founderMail) this.role = 'Founder'
    const salt = await bcrypt.genSalt(config.saltRound)
    return (this.password = await bcrypt.hash(this.password, salt))
  } catch (err) {
    next(err)
  }
})

userSchema.methods.generateToken = async function () {
  try {
    const accessTokenPrivateKey = fs.readFileSync(
      path.join(pwd, 'src', 'cert', 'access_token', 'private.key')
    )

    const accessToken = await jwt.sign({ id: this._id, role: this.role }, accessTokenPrivateKey, {
      algorithm: 'ES256',
      expiresIn: '1y',
      issuer: 'science-blog.issuer.com',
    })

    return accessToken
  } catch (err) {
    return new Error(err)
  }
}

userSchema.methods.comparePassword = async function (data) {
  try {
    return await bcrypt.compare(data, this.password)
  } catch (err) {
    return new Error(err)
  }
}

const user = mongoose.model('user', userSchema)

export default user
