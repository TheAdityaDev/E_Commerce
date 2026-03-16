const requests = new Map();

function rateLimitRoute(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  const LIMIT = 3;
  const WINDOW = 6 * 1000;

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const timestamps = requests.get(ip).filter((time) => now - time < WINDOW);

  timestamps.push(now);
  requests.set(ip, timestamps);

  if (timestamps.length > LIMIT) {
    return res.status(429).json({
      error: "Too many requests to this route",
    });
  }

  next();
}


module.exports = rateLimitRoute;