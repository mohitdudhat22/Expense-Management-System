// middleware/cache.js
import redis from 'redis';

// Create Redis client
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const cache = (key) => (req, res, next) => {
  client.get(key, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};

// Helper to set cache data
const setCache = (key, data, ttl = 3600) => {
  client.setex(key, ttl, JSON.stringify(data));
};

export { cache, setCache };
