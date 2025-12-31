package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	client *redis.Client
}

// CacheItem represents an item stored in cache
type CacheItem struct {
	Value      interface{} `json:"value"`
	Expiration int64     `json:"expiration"`
}

// NewRedisClient creates a new Redis client
func NewRedisClient(addr, password string) (*RedisClient, error) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0,
		PoolSize: 10,
	})

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	return &RedisClient{client: rdb}, nil
}

// Set stores a value in cache with expiration
func (r *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	item := CacheItem{
		Value:      value,
		Expiration: time.Now().Add(expiration).Unix(),
	}

	data, err := json.Marshal(item)
	if err != nil {
		return fmt.Errorf("failed to marshal cache item: %w", err)
	}

	return r.client.Set(ctx, key, data, expiration).Err()
}

// Get retrieves a value from cache
func (r *RedisClient) Get(ctx context.Context, key string, dest interface{}) error {
	data, err := r.client.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			// Key doesn't exist
			return nil
		}
		return fmt.Errorf("failed to get from cache: %w", err)
	}

	var item CacheItem
	if err := json.Unmarshal([]byte(data), &item); err != nil {
		return fmt.Errorf("failed to unmarshal cache item: %w", err)
	}

	// Check if expired
	if time.Now().Unix() > item.Expiration {
		// Remove expired key
		r.client.Del(ctx, key)
		return nil
	}

	// Marshal to destination
	itemData, err := json.Marshal(item.Value)
	if err != nil {
		return fmt.Errorf("failed to marshal cached value: %w", err)
	}

	return json.Unmarshal(itemData, dest)
}

// Delete removes a value from cache
func (r *RedisClient) Delete(ctx context.Context, key string) error {
	return r.client.Del(ctx, key).Err()
}

// DeletePattern removes all keys matching a pattern
func (r *RedisClient) DeletePattern(ctx context.Context, pattern string) error {
	iter := r.client.Scan(ctx, 0, pattern, 0).Iterator()
	for iter.Next(ctx) {
		if err := r.client.Del(ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}
	return iter.Err()
}

// Exists checks if a key exists in cache
func (r *RedisClient) Exists(ctx context.Context, key string) (bool, error) {
	result, err := r.client.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return result > 0, nil
}

// SetTTL sets the time-to-live for a key
func (r *RedisClient) SetTTL(ctx context.Context, key string, expiration time.Duration) error {
	return r.client.Expire(ctx, key, expiration).Err()
}

// GetTTL gets the remaining time-to-live for a key
func (r *RedisClient) GetTTL(ctx context.Context, key string) (time.Duration, error) {
	return r.client.TTL(ctx, key).Result()
}

// Increment increments a numeric value
func (r *RedisClient) Increment(ctx context.Context, key string) (int64, error) {
	return r.client.Incr(ctx, key).Result()
}

// Decrement decrements a numeric value
func (r *RedisClient) Decrement(ctx context.Context, key string) (int64, error) {
	return r.client.Decr(ctx, key).Result()
}

// Close closes the Redis connection
func (r *RedisClient) Close() error {
	return r.client.Close()
}

// Cache helpers for common use cases

// CacheUserSession caches a user session
func (r *RedisClient) CacheUserSession(ctx context.Context, userID int, sessionData interface{}, expiration time.Duration) error {
	key := fmt.Sprintf("session:user:%d", userID)
	return r.Set(ctx, key, sessionData, expiration)
}

// GetUserSession retrieves a user session from cache
func (r *RedisClient) GetUserSession(ctx context.Context, userID int, dest interface{}) error {
	key := fmt.Sprintf("session:user:%d", userID)
	return r.Get(ctx, key, dest)
}

// CacheAPIResponse caches an API response
func (r *RedisClient) CacheAPIResponse(ctx context.Context, endpoint string, params string, response interface{}, expiration time.Duration) error {
	key := fmt.Sprintf("api:%s:%s", endpoint, params)
	return r.Set(ctx, key, response, expiration)
}

// GetAPIResponse retrieves an API response from cache
func (r *RedisClient) GetAPIResponse(ctx context.Context, endpoint string, params string, dest interface{}) error {
	key := fmt.Sprintf("api:%s:%s", endpoint, params)
	return r.Get(ctx, key, dest)
}

// CacheTenantData caches tenant-specific data
func (r *RedisClient) CacheTenantData(ctx context.Context, tenantID int, dataType string, data interface{}, expiration time.Duration) error {
	key := fmt.Sprintf("tenant:%d:%s", tenantID, dataType)
	return r.Set(ctx, key, data, expiration)
}

// GetTenantData retrieves tenant-specific data from cache
func (r *RedisClient) GetTenantData(ctx context.Context, tenantID int, dataType string, dest interface{}) error {
	key := fmt.Sprintf("tenant:%d:%s", tenantID, dataType)
	return r.Get(ctx, key, dest)
}

// InvalidateTenant invalidates all cached data for a tenant
func (r *RedisClient) InvalidateTenant(ctx context.Context, tenantID int) error {
	pattern := fmt.Sprintf("tenant:%d:*", tenantID)
	return r.DeletePattern(ctx, pattern)
}

// CacheQueryResult caches a database query result
func (r *RedisClient) CacheQueryResult(ctx context.Context, queryKey string, result interface{}, expiration time.Duration) error {
	key := fmt.Sprintf("query:%s", queryKey)
	return r.Set(ctx, key, result, expiration)
}

// GetQueryResult retrieves a database query result from cache
func (r *RedisClient) GetQueryResult(ctx context.Context, queryKey string, dest interface{}) error {
	key := fmt.Sprintf("query:%s", queryKey)
	return r.Get(ctx, key, dest)
}

// Default cache expiration times
const (
	CacheShort  = 5 * time.Minute
	CacheMedium = 15 * time.Minute
	CacheLong   = 1 * time.Hour
	CacheVeryLong = 24 * time.Hour
)
