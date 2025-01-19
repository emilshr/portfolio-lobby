package db

import (
	"context"
	"portfolio/lobby/constants"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var RedisContext context.Context

func InitializeRedisClient() {
	RedisContext = context.Background()
	redisConfig := redis.Options{
		Addr:     constants.REDIS_HOST + ":" + constants.REDIS_PORT,
		Username: constants.REDIS_USER,
		Password: constants.REDIS_PASSWORD,
	}
	RedisClient = redis.NewClient(&redisConfig)
}
