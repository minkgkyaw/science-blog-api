import multer from 'multer'
import { nanoid } from 'nanoid'
import path from 'path'

const cwd = process.cwd()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(cwd, 'public'))
  },
  filename: function (req, file, cb) {
    const id = nanoid(10)
    const fileName = file.originalname.toLowerCase().split(' ').join('-')
    cb(null, id + '_' + fileName)
  },
})

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  },
})
