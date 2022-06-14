import Redis from 'ioredis'
import consola from 'consola'

const redis = new Redis({
  enableOfflineQueue: false,
  enableReadyCheck: true
})

export default redis;