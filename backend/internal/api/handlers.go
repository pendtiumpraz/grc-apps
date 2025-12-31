package api

import (
	"github.com/cyber/backend/internal/cache"
	"github.com/cyber/backend/internal/db"
)

var (
	authHandler       *AuthHandler
	tenantHandler     *TenantHandler
	regopsHandler     *RegOpsHandler
	privacyopsHandler *PrivacyOpsHandler
	riskopsHandler    *RiskOpsHandler
	auditopsHandler   *AuditOpsHandler
	aiHandler         *AIHandler
	documentHandler   *DocumentHandler
	rbacHandler       *RBACHandler
	cacheHandler      *cache.RedisClient
)

func InitHandlers(db *db.Database) {
	authHandler = NewAuthHandler(db)
	tenantHandler = NewTenantHandler(db)
	regopsHandler = NewRegOpsHandler(db)
	privacyopsHandler = NewPrivacyOpsHandler(db)
	riskopsHandler = NewRiskOpsHandler(db)
	auditopsHandler = NewAuditOpsHandler(db)
	aiHandler = NewAIHandler(db)
	documentHandler = NewDocumentHandler(db)
	rbacHandler = NewRBACHandler(db)
}

func InitCache(redisClient *cache.RedisClient) {
	cacheHandler = redisClient
}

func GetCacheHandler() *cache.RedisClient {
	return cacheHandler
}

func GetAuthHandler() *AuthHandler {
	return authHandler
}

func GetTenantHandler() *TenantHandler {
	return tenantHandler
}

func GetRegOpsHandler() *RegOpsHandler {
	return regopsHandler
}

func GetPrivacyOpsHandler() *PrivacyOpsHandler {
	return privacyopsHandler
}

func GetRiskOpsHandler() *RiskOpsHandler {
	return riskopsHandler
}

func GetAuditOpsHandler() *AuditOpsHandler {
	return auditopsHandler
}

func GetAIHandler() *AIHandler {
	return aiHandler
}

func GetDocumentHandler() *DocumentHandler {
	return documentHandler
}

func GetRBACHandler() *RBACHandler {
	return rbacHandler
}
