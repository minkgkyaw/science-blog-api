import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      min: 3,
      required: true,
    },
    description: {
      type: String,
      min: 3,
      required: true,
    },
    preview_image: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
        default: '',
      },
    ],
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

postSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, opt) {
    delete ret._id
    delete ret.__v
    return ret
  },
})

const post = mongoose.model('post', postSchema)

export default post
