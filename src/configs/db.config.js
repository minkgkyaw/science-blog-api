import mongoose from 'mongoose'
import consola from 'consola';
import { config } from './general.config';

export const connectToDB = async () => {
  try {
    await mongoose.connect(config.dbUrl)

    return consola.success('Successfully connected to MongoDB ❤️')
  } catch (error) {
    return consola.error(`Can't connected to MongoDB! error may be ${err.message}`)
  }
}
