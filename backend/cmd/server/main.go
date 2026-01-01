package main

import (
	"fmt"
	"log"
	"os"

	"github.com/cyber/backend/internal/api"
	"github.com/cyber/backend/internal/cache"
	"github.com/cyber/backend/internal/config"
	"github.com/cyber/backend/internal/crypto"
	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/middleware"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize encryption key from environment
	encryptionKey := os.Getenv("ENCRYPTION_KEY")
	if encryptionKey != "" {
		crypto.SetEncryptionKey(encryptionKey)
		log.Println("Encryption key initialized from environment")
	} else {
		log.Println("Warning: ENCRYPTION_KEY not set, using default key")
	}

	// Initialize Redis cache
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}
	redisPassword := os.Getenv("REDIS_PASSWORD")
	var redisClient *cache.RedisClient
	var redisErr error
	if redisPassword != "" {
		redisClient, redisErr = cache.NewRedisClient(redisAddr, redisPassword)
		if redisErr == nil {
			log.Printf("Redis cache initialized at %s", redisAddr)
		} else {
			log.Printf("Warning: Failed to initialize Redis cache: %v", redisErr)
		}
	} else {
		log.Println("Warning: REDIS_PASSWORD not set, caching disabled")
	}

	// Initialize database
	dbConn, err := db.Init(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	sqlDB, err := dbConn.DB.DB()
	if err != nil {
		log.Fatalf("Failed to get DB: %v", err)
	}
	defer sqlDB.Close()

	// Initialize API handlers
	api.InitHandlers(dbConn)

	// Initialize new sub-module handlers
	regopsGapAnalysisHandler := api.NewRegOpsGapAnalysisHandler(dbConn.DB)
	regopsObligationMappingHandler := api.NewRegOpsObligationMappingHandler(dbConn.DB)
	regopsPoliciesHandler := api.NewRegOpsPoliciesHandler(dbConn.DB)
	regopsControlsHandler := api.NewRegOpsControlsHandler(dbConn.DB)
	privacyopsDataInventoryHandler := api.NewPrivacyOpsDataInventoryHandler(dbConn.DB)
	privacyopsRoPAHandler := api.NewPrivacyOpsRoPAHandler(dbConn.DB)
	privacyopsDSRHandler := api.NewPrivacyOpsDSRHandler(dbConn.DB)
	privacyopsDPIAHandler := api.NewPrivacyOpsDPIAHandler(dbConn.DB)
	privacyopsControlsHandler := api.NewPrivacyOpsControlsHandler(dbConn.DB)
	privacyopsIncidentHandler := api.NewPrivacyOpsIncidentHandler(dbConn.DB)
	riskopsERMHandler := api.NewRiskOpsERMHandler(dbConn.DB)
	riskopsSecurityHandler := api.NewRiskOpsSecurityHandler(dbConn.DB)
	riskopsVendorHandler := api.NewRiskOpsVendorHandler(dbConn.DB)
	riskopsContinuityHandler := api.NewRiskOpsContinuityHandler(dbConn.DB)
	auditopsInternalAuditHandler := api.NewAuditOpsInternalAuditHandler(dbConn.DB)
	auditopsGovernanceHandler := api.NewAuditOpsGovernanceHandler(dbConn.DB)
	auditopsContinuousAuditHandler := api.NewAuditOpsContinuousAuditHandler(dbConn.DB)
	auditopsEvidenceHandler := api.NewAuditOpsEvidenceHandler(dbConn.DB)
	auditopsReportingHandler := api.NewAuditOpsReportingHandler(dbConn.DB)
	aiDocumentHandler := api.NewAIDocumentHandler(dbConn.DB)
	platformHandler := api.NewPlatformHandler(dbConn)

	// Initialize Redis cache
	if redisClient != nil {
		api.InitCache(redisClient)
		defer redisClient.Close()
	}

	// Create Gin router
	r := gin.Default()

	// Apply middleware
	r.Use(middleware.Logger())
	r.Use(middleware.Cors())
	r.Use(middleware.TenantMiddleware())

	// Setup routes
	setupRoutes(r, regopsGapAnalysisHandler, regopsObligationMappingHandler, regopsPoliciesHandler, regopsControlsHandler, privacyopsDataInventoryHandler, privacyopsRoPAHandler, privacyopsDSRHandler, privacyopsDPIAHandler, privacyopsControlsHandler, privacyopsIncidentHandler, riskopsERMHandler, riskopsSecurityHandler, riskopsVendorHandler, riskopsContinuityHandler, auditopsInternalAuditHandler, auditopsGovernanceHandler, auditopsContinuousAuditHandler, auditopsEvidenceHandler, auditopsReportingHandler, aiDocumentHandler, platformHandler)

	// Start server
	port := fmt.Sprintf(":%s", cfg.Server.Port)
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(r *gin.Engine, regopsGapAnalysisHandler *api.RegOpsGapAnalysisHandler, regopsObligationMappingHandler *api.RegOpsObligationMappingHandler, regopsPoliciesHandler *api.RegOpsPoliciesHandler, regopsControlsHandler *api.RegOpsControlsHandler, privacyopsDataInventoryHandler *api.PrivacyOpsDataInventoryHandler, privacyopsRoPAHandler *api.PrivacyOpsRoPAHandler, privacyopsDSRHandler *api.PrivacyOpsDSRHandler, privacyopsDPIAHandler *api.PrivacyOpsDPIAHandler, privacyopsControlsHandler *api.PrivacyOpsControlsHandler, privacyopsIncidentHandler *api.PrivacyOpsIncidentHandler, riskopsERMHandler *api.RiskOpsERMHandler, riskopsSecurityHandler *api.RiskOpsSecurityHandler, riskopsVendorHandler *api.RiskOpsVendorHandler, riskopsContinuityHandler *api.RiskOpsContinuityHandler, auditopsInternalAuditHandler *api.AuditOpsInternalAuditHandler, auditopsGovernanceHandler *api.AuditOpsGovernanceHandler, auditopsContinuousAuditHandler *api.AuditOpsContinuousAuditHandler, auditopsEvidenceHandler *api.AuditOpsEvidenceHandler, auditopsReportingHandler *api.AuditOpsReportingHandler, aiDocumentHandler *api.AIDocumentHandler, platformHandler *api.PlatformHandler) {
	// Public routes
	public := r.Group("/api")
	{
		public.POST("/auth/login", api.GetAuthHandler().Login)
		public.POST("/auth/register", api.GetAuthHandler().Register)
	}

	// Protected routes
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// Tenant management
		tenants := protected.Group("/tenants")
		{
			tenants.GET("/", api.GetTenantHandler().GetAll)
			tenants.GET("/:id", api.GetTenantHandler().GetByID)
			tenants.POST("/", api.GetTenantHandler().Create)
			tenants.PUT("/:id", api.GetTenantHandler().Update)
			tenants.DELETE("/:id", api.GetTenantHandler().Delete) // Soft delete
		}

		// Domain-specific routes - RegOps with RBAC
		regops := protected.Group("/regops")
		{
			// Regulations
			regops.GET("/regulations", middleware.RBACMiddleware(models.PermissionRegOpsView), api.GetRegOpsHandler().GetRegulations)
			regops.POST("/regulations", middleware.RBACMiddleware(models.PermissionRegOpsCreate), api.GetRegOpsHandler().CreateRegulation)
			regops.PUT("/regulations/:id", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), api.GetRegOpsHandler().UpdateRegulation)
			regops.DELETE("/regulations/:id", middleware.RBACMiddleware(models.PermissionRegOpsDelete), api.GetRegOpsHandler().DeleteRegulation)
			// Recovery endpoints
			regops.GET("/regulations/deleted", middleware.RBACMiddleware(models.PermissionRegOpsView), api.GetRegOpsHandler().GetDeletedRegulations)
			regops.POST("/regulations/:id/restore", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), api.GetRegOpsHandler().RestoreRegulation)
			regops.DELETE("/regulations/:id/permanent", middleware.RBACMiddleware(models.PermissionRegOpsDelete), api.GetRegOpsHandler().PermanentDeleteRegulation)
			// Compliance Assessments
			regops.GET("/compliance-assessments", middleware.RBACMiddleware(models.PermissionRegOpsView), api.GetRegOpsHandler().GetComplianceAssessments)
			regops.POST("/compliance-assessments", middleware.RBACMiddleware(models.PermissionRegOpsCreate), api.GetRegOpsHandler().CreateComplianceAssessment)
			regops.PUT("/compliance-assessments/:id", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), api.GetRegOpsHandler().UpdateComplianceAssessment)
			regops.DELETE("/compliance-assessments/:id", middleware.RBACMiddleware(models.PermissionRegOpsDelete), api.GetRegOpsHandler().DeleteComplianceAssessment)
			// Compliance Gap Analysis
			regops.GET("/compliance-gaps", middleware.RBACMiddleware(models.PermissionRegOpsView), regopsGapAnalysisHandler.GetComplianceGaps)
			regops.POST("/compliance-gaps", middleware.RBACMiddleware(models.PermissionRegOpsCreate), regopsGapAnalysisHandler.CreateComplianceGap)
			regops.PUT("/compliance-gaps/:id", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), regopsGapAnalysisHandler.UpdateComplianceGap)
			regops.DELETE("/compliance-gaps/:id", middleware.RBACMiddleware(models.PermissionRegOpsDelete), regopsGapAnalysisHandler.DeleteComplianceGap)
			regops.GET("/compliance-gaps/stats", middleware.RBACMiddleware(models.PermissionRegOpsView), regopsGapAnalysisHandler.GetGapStats)
			// Obligation Mapping
			regops.GET("/obligations", middleware.RBACMiddleware(models.PermissionRegOpsView), regopsObligationMappingHandler.GetObligations)
			regops.POST("/obligations", middleware.RBACMiddleware(models.PermissionRegOpsCreate), regopsObligationMappingHandler.CreateObligation)
			regops.PUT("/obligations/:id", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), regopsObligationMappingHandler.UpdateObligation)
			regops.DELETE("/obligations/:id", middleware.RBACMiddleware(models.PermissionRegOpsDelete), regopsObligationMappingHandler.DeleteObligation)
			regops.GET("/obligations/stats", middleware.RBACMiddleware(models.PermissionRegOpsView), regopsObligationMappingHandler.GetObligationStats)
			// Policies
			regops.GET("/policies", middleware.RBACMiddleware(models.PermissionRegOpsView), api.GetRegOpsHandler().GetPolicies)
			regops.POST("/policies", middleware.RBACMiddleware(models.PermissionRegOpsCreate), api.GetRegOpsHandler().CreatePolicy)
			regops.PUT("/policies/:id", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), api.GetRegOpsHandler().UpdatePolicy)
			regops.DELETE("/policies/:id", middleware.RBACMiddleware(models.PermissionRegOpsDelete), api.GetRegOpsHandler().DeletePolicy)
			// Controls
			regops.GET("/controls", middleware.RBACMiddleware(models.PermissionRegOpsView), regopsControlsHandler.GetControls)
			regops.POST("/controls", middleware.RBACMiddleware(models.PermissionRegOpsCreate), regopsControlsHandler.CreateControl)
			regops.PUT("/controls/:id", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), regopsControlsHandler.UpdateControl)
			regops.DELETE("/controls/:id", middleware.RBACMiddleware(models.PermissionRegOpsDelete), regopsControlsHandler.DeleteControl)
			regops.GET("/controls/stats", middleware.RBACMiddleware(models.PermissionRegOpsView), regopsControlsHandler.GetControlStats)
			// Recovery endpoints for all RegOps entities
			regops.GET("/compliance-assessments/deleted", middleware.RBACMiddleware(models.PermissionRegOpsView), api.GetRegOpsHandler().GetDeletedComplianceAssessments)
			regops.POST("/compliance-assessments/:id/restore", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), api.GetRegOpsHandler().RestoreComplianceAssessment)
			regops.DELETE("/compliance-assessments/:id/permanent", middleware.RBACMiddleware(models.PermissionRegOpsDelete), api.GetRegOpsHandler().PermanentDeleteComplianceAssessment)
			regops.GET("/policies/deleted", middleware.RBACMiddleware(models.PermissionRegOpsView), api.GetRegOpsHandler().GetDeletedPolicies)
			regops.POST("/policies/:id/restore", middleware.RBACMiddleware(models.PermissionRegOpsUpdate), api.GetRegOpsHandler().RestorePolicy)
			regops.DELETE("/policies/:id/permanent", middleware.RBACMiddleware(models.PermissionRegOpsDelete), api.GetRegOpsHandler().PermanentDeletePolicy)
		}

		// Domain-specific routes - PrivacyOps with RBAC
		privacyops := protected.Group("/privacyops")
		{
			// Data Inventory
			privacyops.GET("/data-inventory", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsDataInventoryHandler.GetDataInventory)
			privacyops.POST("/data-inventory", middleware.RBACMiddleware(models.PermissionPrivacyOpsCreate), privacyopsDataInventoryHandler.CreateDataItem)
			privacyops.PUT("/data-inventory/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsDataInventoryHandler.UpdateDataItem)
			privacyops.DELETE("/data-inventory/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsDelete), privacyopsDataInventoryHandler.DeleteDataItem)
			privacyops.GET("/data-inventory/stats", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsDataInventoryHandler.GetDataInventoryStats)
			// RoPA
			privacyops.GET("/ropa", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsRoPAHandler.GetProcessingActivities)
			privacyops.POST("/ropa", middleware.RBACMiddleware(models.PermissionPrivacyOpsCreate), privacyopsRoPAHandler.CreateProcessingActivity)
			privacyops.PUT("/ropa/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsRoPAHandler.UpdateProcessingActivity)
			privacyops.DELETE("/ropa/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsDelete), privacyopsRoPAHandler.DeleteProcessingActivity)
			privacyops.GET("/ropa/stats", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsRoPAHandler.GetRoPAStats)
			// DSR Requests
			privacyops.GET("/dsr", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsDSRHandler.GetDSRs)
			privacyops.POST("/dsr", middleware.RBACMiddleware(models.PermissionPrivacyOpsCreate), privacyopsDSRHandler.CreateDSR)
			privacyops.PUT("/dsr/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsDSRHandler.UpdateDSR)
			privacyops.DELETE("/dsr/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsDelete), privacyopsDSRHandler.DeleteDSR)
			privacyops.POST("/dsr/:id/approve", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsDSRHandler.ApproveDSR)
			privacyops.POST("/dsr/:id/reject", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsDSRHandler.RejectDSR)
			privacyops.GET("/dsr/stats", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsDSRHandler.GetDSRStats)
			// DPIAs
			privacyops.GET("/dpias", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsDPIAHandler.GetDPIAs)
			privacyops.POST("/dpias", middleware.RBACMiddleware(models.PermissionPrivacyOpsCreate), privacyopsDPIAHandler.CreateDPIA)
			privacyops.PUT("/dpias/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsDPIAHandler.UpdateDPIA)
			privacyops.DELETE("/dpias/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsDelete), privacyopsDPIAHandler.DeleteDPIA)
			privacyops.POST("/dpias/:id/approve", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsDPIAHandler.ApproveDPIA)
			privacyops.GET("/dpias/stats", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsDPIAHandler.GetDPIAStats)
			// Privacy Controls
			privacyops.GET("/privacy-controls", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsControlsHandler.GetPrivacyControls)
			privacyops.POST("/privacy-controls", middleware.RBACMiddleware(models.PermissionPrivacyOpsCreate), privacyopsControlsHandler.CreatePrivacyControl)
			privacyops.PUT("/privacy-controls/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsControlsHandler.UpdatePrivacyControl)
			privacyops.DELETE("/privacy-controls/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsDelete), privacyopsControlsHandler.DeletePrivacyControl)
			privacyops.GET("/privacy-controls/stats", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsControlsHandler.GetPrivacyControlsStats)
			// Incident & Breach Response
			privacyops.GET("/incidents", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsIncidentHandler.GetIncidents)
			privacyops.POST("/incidents", middleware.RBACMiddleware(models.PermissionPrivacyOpsCreate), privacyopsIncidentHandler.CreateIncident)
			privacyops.PUT("/incidents/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsIncidentHandler.UpdateIncident)
			privacyops.DELETE("/incidents/:id", middleware.RBACMiddleware(models.PermissionPrivacyOpsDelete), privacyopsIncidentHandler.DeleteIncident)
			privacyops.POST("/incidents/:id/resolve", middleware.RBACMiddleware(models.PermissionPrivacyOpsUpdate), privacyopsIncidentHandler.ResolveIncident)
			privacyops.GET("/incidents/stats", middleware.RBACMiddleware(models.PermissionPrivacyOpsView), privacyopsIncidentHandler.GetIncidentStats)
		}

		// Domain-specific routes - RiskOps with RBAC
		riskops := protected.Group("/riskops")
		{
			// Risk Register (ERM)
			riskops.GET("/risk-register", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsERMHandler.GetRiskRegister)
			riskops.POST("/risk-register", middleware.RBACMiddleware(models.PermissionRiskOpsCreate), riskopsERMHandler.CreateRisk)
			riskops.PUT("/risk-register/:id", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsERMHandler.UpdateRisk)
			riskops.DELETE("/risk-register/:id", middleware.RBACMiddleware(models.PermissionRiskOpsDelete), riskopsERMHandler.CloseRisk)
			riskops.POST("/risk-register/:id/close", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsERMHandler.CloseRisk)
			riskops.GET("/risk-register/stats", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsERMHandler.GetRiskStats)
			// Security Risk & Vulnerability Management
			riskops.GET("/vulnerabilities", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsSecurityHandler.GetVulnerabilities)
			riskops.POST("/vulnerabilities", middleware.RBACMiddleware(models.PermissionRiskOpsCreate), riskopsSecurityHandler.CreateVulnerability)
			riskops.PUT("/vulnerabilities/:id", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsSecurityHandler.UpdateVulnerability)
			riskops.DELETE("/vulnerabilities/:id", middleware.RBACMiddleware(models.PermissionRiskOpsDelete), riskopsSecurityHandler.DeleteVulnerability)
			riskops.POST("/vulnerabilities/:id/resolve", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsSecurityHandler.ResolveVulnerability)
			riskops.GET("/vulnerabilities/stats", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsSecurityHandler.GetVulnerabilityStats)
			// Vendor & Third-Party Risk
			riskops.GET("/vendors", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsVendorHandler.GetVendors)
			riskops.POST("/vendors", middleware.RBACMiddleware(models.PermissionRiskOpsCreate), riskopsVendorHandler.CreateVendor)
			riskops.PUT("/vendors/:id", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsVendorHandler.UpdateVendor)
			riskops.DELETE("/vendors/:id", middleware.RBACMiddleware(models.PermissionRiskOpsDelete), riskopsVendorHandler.DeleteVendor)
			riskops.GET("/vendors/stats", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsVendorHandler.GetVendorStats)
			// Business Continuity & Resilience
			riskops.GET("/continuity", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsContinuityHandler.GetContinuityPlans)
			riskops.POST("/continuity", middleware.RBACMiddleware(models.PermissionRiskOpsCreate), riskopsContinuityHandler.CreateContinuityPlan)
			riskops.PUT("/continuity/:id", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsContinuityHandler.UpdateContinuityPlan)
			riskops.DELETE("/continuity/:id", middleware.RBACMiddleware(models.PermissionRiskOpsDelete), riskopsContinuityHandler.DeleteContinuityPlan)
			riskops.POST("/continuity/:id/test", middleware.RBACMiddleware(models.PermissionRiskOpsUpdate), riskopsContinuityHandler.TestContinuityPlan)
			riskops.GET("/continuity/stats", middleware.RBACMiddleware(models.PermissionRiskOpsView), riskopsContinuityHandler.GetContinuityStats)
		}

		// Domain-specific routes - AuditOps with RBAC
		auditops := protected.Group("/auditops")
		{
			// Internal Audit Management
			auditops.GET("/internal-audits", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsInternalAuditHandler.GetInternalAudits)
			auditops.POST("/internal-audits", middleware.RBACMiddleware(models.PermissionAuditOpsCreate), auditopsInternalAuditHandler.CreateInternalAudit)
			auditops.PUT("/internal-audits/:id", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsInternalAuditHandler.UpdateInternalAudit)
			auditops.DELETE("/internal-audits/:id", middleware.RBACMiddleware(models.PermissionAuditOpsDelete), auditopsInternalAuditHandler.DeleteInternalAudit)
			auditops.GET("/internal-audits/stats", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsInternalAuditHandler.GetInternalAuditStats)
			// Governance & Accountability (KRI)
			auditops.GET("/kris", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsGovernanceHandler.GetKRIs)
			auditops.POST("/kris", middleware.RBACMiddleware(models.PermissionAuditOpsCreate), auditopsGovernanceHandler.CreateKRI)
			auditops.PUT("/kris/:id", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsGovernanceHandler.UpdateKRI)
			auditops.DELETE("/kris/:id", middleware.RBACMiddleware(models.PermissionAuditOpsDelete), auditopsGovernanceHandler.DeleteKRI)
			auditops.GET("/kris/stats", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsGovernanceHandler.GetKRIStats)
			// Continuous Audit & Control Testing
			auditops.GET("/control-tests", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsContinuousAuditHandler.GetControlTests)
			auditops.POST("/control-tests", middleware.RBACMiddleware(models.PermissionAuditOpsCreate), auditopsContinuousAuditHandler.CreateControlTest)
			auditops.PUT("/control-tests/:id", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsContinuousAuditHandler.UpdateControlTest)
			auditops.DELETE("/control-tests/:id", middleware.RBACMiddleware(models.PermissionAuditOpsDelete), auditopsContinuousAuditHandler.DeleteControlTest)
			auditops.POST("/control-tests/:id/run", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsContinuousAuditHandler.RunControlTest)
			auditops.GET("/control-tests/stats", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsContinuousAuditHandler.GetControlTestStats)
			// Audit Evidence
			auditops.GET("/evidence", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsEvidenceHandler.GetEvidence)
			auditops.POST("/evidence", middleware.RBACMiddleware(models.PermissionAuditOpsCreate), auditopsEvidenceHandler.CreateEvidence)
			auditops.PUT("/evidence/:id", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsEvidenceHandler.UpdateEvidence)
			auditops.DELETE("/evidence/:id", middleware.RBACMiddleware(models.PermissionAuditOpsDelete), auditopsEvidenceHandler.DeleteEvidence)
			auditops.POST("/evidence/:id/approve", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsEvidenceHandler.ApproveEvidence)
			auditops.POST("/evidence/:id/reject", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsEvidenceHandler.RejectEvidence)
			auditops.GET("/evidence/stats", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsEvidenceHandler.GetEvidenceStats)
			// Reporting & Assurance
			auditops.GET("/reports", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsReportingHandler.GetReports)
			auditops.POST("/reports", middleware.RBACMiddleware(models.PermissionAuditOpsCreate), auditopsReportingHandler.CreateReport)
			auditops.PUT("/reports/:id", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsReportingHandler.UpdateReport)
			auditops.DELETE("/reports/:id", middleware.RBACMiddleware(models.PermissionAuditOpsDelete), auditopsReportingHandler.DeleteReport)
			auditops.POST("/reports/:id/generate", middleware.RBACMiddleware(models.PermissionAuditOpsUpdate), auditopsReportingHandler.GenerateReport)
			auditops.GET("/reports/stats", middleware.RBACMiddleware(models.PermissionAuditOpsView), auditopsReportingHandler.GetReportStats)
		}

		// AI routes - with RBAC
		ai := protected.Group("/ai")
		{
			ai.GET("/settings", middleware.RBACMiddleware(models.PermissionAIView), api.GetAIHandler().GetAISettings)
			ai.PUT("/settings", middleware.RBACMiddleware(models.PermissionAIUpdate), api.GetAIHandler().UpdateAISettings)
			ai.GET("/models", middleware.RBACMiddleware(models.PermissionAIView), api.GetAIHandler().GetAvailableModels)
			ai.POST("/test", middleware.RBACMiddleware(models.PermissionAIUpdate), api.GetAIHandler().TestAIConnection)
			ai.POST("/chat", middleware.RBACMiddleware(models.PermissionAIUse), api.GetAIHandler().AIChat)
		}

		// RBAC routes - with RBAC
		rbac := protected.Group("/rbac")
		{
			rbac.GET("/permissions", middleware.RequireSuperAdmin(), api.GetRBACHandler().GetAllPermissions)
			rbac.GET("/roles", middleware.RequireSuperAdmin(), api.GetRBACHandler().GetAllRoles)
			rbac.GET("/permissions/:role", middleware.RequireSuperAdmin(), api.GetRBACHandler().GetPermissionsForRole)
			rbac.POST("/users/:userId/role", middleware.RequireTenantAdmin(), api.GetRBACHandler().AssignRoleToUser)
			rbac.DELETE("/users/:userId/role", middleware.RequireTenantAdmin(), api.GetRBACHandler().RevokeRoleFromUser)
			rbac.POST("/seed-permissions", middleware.RequireSuperAdmin(), api.GetRBACHandler().SeedPermissions)
		}

		// Document routes - with RBAC
		documents := protected.Group("/documents")
		{
			documents.POST("/analyze", middleware.RBACMiddleware(models.PermissionDocumentAnalyze), api.GetDocumentHandler().AnalyzeDocument)
			documents.POST("/generate", middleware.RBACMiddleware(models.PermissionDocumentCreate), api.GetDocumentHandler().GenerateDocument)
			documents.POST("/save", middleware.RBACMiddleware(models.PermissionDocumentCreate), api.GetDocumentHandler().SaveDocument)
			documents.GET("/templates", middleware.RBACMiddleware(models.PermissionDocumentView), api.GetDocumentHandler().GetDocumentTemplates)
			documents.GET("/", middleware.RBACMiddleware(models.PermissionDocumentView), api.GetDocumentHandler().GetDocuments)
			documents.GET("/:id", middleware.RBACMiddleware(models.PermissionDocumentView), api.GetDocumentHandler().GetDocumentByID)
			documents.GET("/:id/analyses", middleware.RBACMiddleware(models.PermissionDocumentView), api.GetDocumentHandler().GetDocumentAnalyses)
			documents.GET("/analyses/:id/infographic", middleware.RBACMiddleware(models.PermissionDocumentView), api.GetDocumentHandler().GetInfographicHTML)
			documents.POST("/autofill", middleware.RBACMiddleware(models.PermissionDocumentUpdate), api.GetDocumentHandler().AutoFillDocument)
		}

		// AI Document Generator & Analyzer routes - with RBAC
		aiDocuments := protected.Group("/ai-documents")
		{
			// Document Templates
			aiDocuments.GET("/templates", middleware.RBACMiddleware(models.PermissionDocumentView), aiDocumentHandler.GetDocumentTemplates)
			aiDocuments.GET("/templates/:id", middleware.RBACMiddleware(models.PermissionDocumentView), aiDocumentHandler.GetDocumentTemplate)
			aiDocuments.POST("/templates", middleware.RBACMiddleware(models.PermissionDocumentCreate), aiDocumentHandler.CreateDocumentTemplate)
			aiDocuments.PUT("/templates/:id", middleware.RBACMiddleware(models.PermissionDocumentUpdate), aiDocumentHandler.UpdateDocumentTemplate)
			aiDocuments.DELETE("/templates/:id", middleware.RBACMiddleware(models.PermissionDocumentDelete), aiDocumentHandler.DeleteDocumentTemplate)
			// Generated Documents
			aiDocuments.GET("/generated", middleware.RBACMiddleware(models.PermissionDocumentView), aiDocumentHandler.GetGeneratedDocuments)
			aiDocuments.GET("/generated/:id", middleware.RBACMiddleware(models.PermissionDocumentView), aiDocumentHandler.GetGeneratedDocument)
			aiDocuments.POST("/generated", middleware.RBACMiddleware(models.PermissionDocumentCreate), aiDocumentHandler.GenerateDocument)
			aiDocuments.PUT("/generated/:id", middleware.RBACMiddleware(models.PermissionDocumentUpdate), aiDocumentHandler.UpdateGeneratedDocument)
			aiDocuments.DELETE("/generated/:id", middleware.RBACMiddleware(models.PermissionDocumentDelete), aiDocumentHandler.DeleteGeneratedDocument)
			// Document Analysis
			aiDocuments.GET("/analyses", middleware.RBACMiddleware(models.PermissionDocumentView), aiDocumentHandler.GetDocumentAnalyses)
			aiDocuments.GET("/analyses/:id", middleware.RBACMiddleware(models.PermissionDocumentView), aiDocumentHandler.GetDocumentAnalysis)
			aiDocuments.POST("/analyses", middleware.RBACMiddleware(models.PermissionDocumentAnalyze), aiDocumentHandler.AnalyzeDocument)
			aiDocuments.DELETE("/analyses/:id", middleware.RBACMiddleware(models.PermissionDocumentDelete), aiDocumentHandler.DeleteDocumentAnalysis)
		}

		// Platform routes - Super Admin only
		platform := protected.Group("/platform")
		platform.Use(middleware.RequireSuperAdmin())
		{
			// Dashboard stats
			platform.GET("/stats", platformHandler.GetPlatformStats)
			platform.GET("/top-tenants", platformHandler.GetTopTenants)
			platform.GET("/recent-activity", platformHandler.GetRecentActivity)
			platform.GET("/alerts", platformHandler.GetSystemAlerts)

			// Tenants management
			platform.GET("/tenants", platformHandler.GetAllTenants)
			platform.GET("/tenants/:id", platformHandler.GetTenantByID)
			platform.POST("/tenants", platformHandler.CreateTenant)
			platform.PUT("/tenants/:id", platformHandler.UpdateTenant)
			platform.DELETE("/tenants/:id", platformHandler.DeleteTenant)
			platform.POST("/tenants/:id/activate", platformHandler.ActivateTenant)

			// User management (separate path to avoid conflict with tenants/:id)
			platform.GET("/users/tenant/:tenantId", platformHandler.GetTenantUsers)
			platform.POST("/users/tenant/:tenantId", platformHandler.CreateUser)
			platform.PUT("/users/:userId", platformHandler.UpdateUser)
			platform.DELETE("/users/:userId", platformHandler.DeleteUser)
			platform.POST("/users/:userId/reset-password", platformHandler.ResetUserPassword)
			platform.POST("/users/:userId/restore", platformHandler.RestoreUser)
			platform.GET("/users/deleted/:tenantId", platformHandler.GetDeletedUsers)

			// Tenant restore
			platform.POST("/tenants/:id/restore", platformHandler.RestoreTenant)
			platform.GET("/tenants-deleted", platformHandler.GetDeletedTenants)

			// Analytics
			platform.GET("/analytics", platformHandler.GetAnalytics)

			// Billing
			platform.GET("/billing", platformHandler.GetBillingOverview)
			platform.GET("/billing/invoices", platformHandler.GetInvoices)
			platform.GET("/billing/subscriptions", platformHandler.GetSubscriptions)

			// Logs
			platform.GET("/logs", platformHandler.GetSystemLogs)
			platform.GET("/logs/stats", platformHandler.GetLogStats)
		}
	}
}
