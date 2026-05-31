const redis = require("redis");

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
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