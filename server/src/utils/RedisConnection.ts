import { SESSION_COOKIE_NAME } from "../constants/CookieConstants";
import { COOKIE_SECURE } from "../constants/RedisConstants";

const redis = require("redis");
const connectRedis = require("connect-redis");
const session = require("express-session");

const maxAge = 1000 * 60 * 10;

export const redisSession = async () => {
  try {
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    const rs = await session({
      store: new RedisStore({ client: redisClient }),
      name: SESSION_COOKIE_NAME,
      secret: process.env.REDIS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: COOKIE_SECURE, // if true only transmit cookie over https
        httpOnly: true, // if true prevent client side JS from reading the cookie
        maxAge: maxAge, // session max age in miliseconds
        sameSite: "lax", // if true cookie will be sent only over https
      },
    });

    return rs;
  } catch (error) {
    console.log(error);
    return null;
  }
};
