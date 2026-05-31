const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("ready", () => {
  console.log("Redis Ready");
});

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });
}

module.exports = redisClient;