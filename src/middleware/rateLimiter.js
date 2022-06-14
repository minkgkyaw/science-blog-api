import {RateLimiterRedis} from 'rate-limiter-flexible'
import redis from '../configs/redis.config'

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'middleware',
  points: 10,
  duration: 1
})

const rateLimiterMiddleware = (createHttpError) => (req, res, next) => {
  rateLimiter.consume(req.ip).then(() => next()).catch(() => next(createHttpError(429)))
}

export default rateLimiterMiddleware