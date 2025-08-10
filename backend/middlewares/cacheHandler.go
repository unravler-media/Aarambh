package middlewares

import (
	"context"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
)

// Redis client (reuse for all funcs)
var redisClient *redis.Client
var ctx = context.Background()

func init() {
	config, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		panic("Invalid REDIS_URL: " + err.Error())
	}
	redisClient = redis.NewClient(config)
}

// CacheRequests caches GET responses for a given expiration time
func CacheRequests(expiration time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Query("noCache") == "true" {
			return c.Next()
		}

		objectKey := c.OriginalURL()

		// 1️⃣ Try reading from cache
		cacheVal, err := redisClient.Get(ctx, objectKey).Result()
		if err == nil {
			return c.SendString(cacheVal)
		}
		if err != redis.Nil {
			return c.Status(fiber.StatusInternalServerError).
				SendString("Redis error: " + err.Error())
		}

		// 2️⃣ Run handler first
		if err := c.Next(); err != nil {
			return err
		}

		// 3️⃣ Capture and store response
		body := c.Response().Body()
		if len(body) > 0 {
			redisClient.Set(ctx, objectKey, body, expiration)
		}

		return nil
	}
}

// InvalidateCache clears ALL keys in Redis
func InvalidateCache() error {
	return redisClient.FlushAll(ctx).Err()
}
