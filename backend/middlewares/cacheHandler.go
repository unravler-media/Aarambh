package middlewares

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"

	"context"
)

var ctx = context.Background()
var redisClient *redis.Client

func InitialiseRedisClient(client *redis.Client) {
	redisClient = client
}

// CacheRequests caches GET responses for a given expiration time
func CacheRequests(expiration time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		if c.Query("noCache") == "true" {
			return c.Next()
		}

		if c.Method() == "POST" || c.Method() == "PUT" || c.Method() == "PATCH" ||
			c.Method() == "DELETE" {
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
func InvalidateCacheCompletely() error {
	return redisClient.FlushAll(ctx).Err()
}

// Invalidate Specific Keys in Cache
// func InvalidateCacheKeys(keys []string) error {
// 	operation, err := redisClient.Del(ctx, keys...).Result()
// 	if err != nil {
// 		return err
// 	}
// 	fmt.Println("Hooks Operation: ", operation)
// 	return nil
// }
