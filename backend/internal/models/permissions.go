package models

// Permission represents a single permission
type Permission struct {
	ID          string `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Name        string `gorm:"unique;not null" json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"` // regops, privacyops, riskops, auditops, tenant, system
	CreatedAt   string `json:"created_at"`
}

// RolePermission represents the mapping between roles and permissions
type RolePermission struct {
	ID          string `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	RoleID      string `gorm:"not null" json:"role_id"`
	PermissionID string `gorm:"not null" json:"permission_id"`
	CreatedAt    string `json:"created_at"`
}

// Predefined roles in the system
const (
	RoleSuperAdmin      = "super_admin"
	RolePlatformOwner  = "platform_owner"
	RoleTenantAdmin    = "tenant_admin"
	RoleComplianceOfficer = "compliance_officer"
	RoleComplianceAnalyst = "compliance_analyst"
	RolePrivacyOfficer    = "privacy_officer"
	RoleDPO              = "data_protection_officer"
	RoleRiskManager      = "risk_manager"
	RoleRiskAnalyst      = "risk_analyst"
	RoleAuditor          = "auditor"
	RoleAuditAnalyst     = "audit_analyst"
	RoleSecurityOfficer  = "security_officer"
	RoleSystemAdmin     = "system_administrator"
	RoleRegularUser      = "regular_user"
)

// Permission constants
const (
	// RegOps Permissions
	PermissionRegOpsView   = "regops.view"
	PermissionRegOpsCreate = "regops.create"
	PermissionRegOpsUpdate = "regops.update"
	PermissionRegOpsDelete = "regops.delete"
	PermissionRegOpsRestore = "regops.restore"
	PermissionRegOpsPermanentDelete = "regops.permanent_delete"
	
	// PrivacyOps Permissions
	PermissionPrivacyOpsView   = "privacyops.view"
	PermissionPrivacyOpsCreate = "privacyops.create"
	PermissionPrivacyOpsUpdate = "privacyops.update"
	PermissionPrivacyOpsDelete = "privacyops.delete"
	
	// RiskOps Permissions
	PermissionRiskOpsView   = "riskops.view"
	PermissionRiskOpsCreate = "riskops.create"
	PermissionRiskOpsUpdate = "riskops.update"
	PermissionRiskOpsDelete = "riskops.delete"
	
	// AuditOps Permissions
	PermissionAuditOpsView   = "auditops.view"
	PermissionAuditOpsCreate = "auditops.create"
	PermissionAuditOpsUpdate = "auditops.update"
	PermissionAuditOpsDelete = "auditops.delete"
	
	// AI Permissions
	PermissionAIView   = "ai.view"
	PermissionAIUpdate = "ai.update"
	PermissionAIUse    = "ai.chat"
	PermissionAIGenerate = "ai.generate"
	PermissionAIAnalyze   = "ai.analyze"
	PermissionAIAutofill  = "ai.autofill"
	
	// Document Permissions
	PermissionDocumentView   = "document.view"
	PermissionDocumentCreate = "document.create"
	PermissionDocumentUpdate = "document.update"
	PermissionDocumentDelete = "document.delete"
	PermissionDocumentAnalyze = "document.analyze"
	PermissionDocumentAutofill = "document.autofill"
)

// Role descriptions
var RoleDescriptions = map[string]string{
	RoleSuperAdmin:      "Full system access across all tenants and domains",
	RolePlatformOwner:  "Manage platform-level configuration, tenants, and licensing",
	RoleTenantAdmin:    "Full administrative access within tenant",
	RoleComplianceOfficer: "Manage compliance workflows and assessments",
	RoleComplianceAnalyst: "View and analyze compliance data",
	RolePrivacyOfficer:    "Manage privacy governance and DSR workflows",
	RoleDPO:              "Oversight of privacy compliance and regulatory reporting",
	RoleRiskManager:      "Manage risk register and mitigation strategies",
	RoleRiskAnalyst:      "View and analyze risk data",
	RoleAuditor:          "Conduct audits and manage audit plans",
	RoleAuditAnalyst:     "Execute audits and collect evidence",
	RoleSecurityOfficer:  "Manage security operations and vulnerabilities",
	RoleSystemAdmin:     "Technical operations and system maintenance",
	RoleRegularUser:      "Standard user access to assigned domains",
}

// All permissions defined in the system
var AllPermissions = []Permission{
	// Tenant Management
	{ID: "tenant.view", Name: "tenant.view", Description: "View tenant information", Category: "tenant"},
	{ID: "tenant.create", Name: "tenant.create", Description: "Create new tenant", Category: "tenant"},
	{ID: "tenant.update", Name: "tenant.update", Description: "Update tenant information", Category: "tenant"},
	{ID: "tenant.delete", Name: "tenant.delete", Description: "Delete tenant (soft delete)", Category: "tenant"},
	
	// User Management
	{ID: "user.view", Name: "user.view", Description: "View user information", Category: "system"},
	{ID: "user.create", Name: "user.create", Description: "Create new user", Category: "system"},
	{ID: "user.update", Name: "user.update", Description: "Update user information", Category: "system"},
	{ID: "user.delete", Name: "user.delete", Description: "Delete user (soft delete)", Category: "system"},
	{ID: "user.assign_role", Name: "user.assign_role", Description: "Assign roles to users", Category: "system"},
	
	// RegOps Permissions
	{ID: "regops.view", Name: "regops.view", Description: "View RegOps data", Category: "regops"},
	{ID: "regops.create", Name: "regops.create", Description: "Create RegOps entities", Category: "regops"},
	{ID: "regops.update", Name: "regops.update", Description: "Update RegOps entities", Category: "regops"},
	{ID: "regops.delete", Name: "regops.delete", Description: "Delete RegOps entities", Category: "regops"},
	{ID: "regops.restore", Name: "regops.restore", Description: "Restore deleted RegOps entities", Category: "regops"},
	{ID: "regops.permanent_delete", Name: "regops.permanent_delete", Description: "Permanently delete RegOps entities", Category: "regops"},
	
	// PrivacyOps Permissions
	{ID: "privacyops.view", Name: "privacyops.view", Description: "View PrivacyOps data", Category: "privacyops"},
	{ID: "privacyops.create", Name: "privacyops.create", Description: "Create PrivacyOps entities", Category: "privacyops"},
	{ID: "privacyops.update", Name: "privacyops.update", Description: "Update PrivacyOps entities", Category: "privacyops"},
	{ID: "privacyops.delete", Name: "privacyops.delete", Description: "Delete PrivacyOps entities", Category: "privacyops"},
	
	// RiskOps Permissions
	{ID: "riskops.view", Name: "riskops.view", Description: "View RiskOps data", Category: "riskops"},
	{ID: "riskops.create", Name: "riskops.create", Description: "Create RiskOps entities", Category: "riskops"},
	{ID: "riskops.update", Name: "riskops.update", Description: "Update RiskOps entities", Category: "riskops"},
	{ID: "riskops.delete", Name: "riskops.delete", Description: "Delete RiskOps entities", Category: "riskops"},
	
	// AuditOps Permissions
	{ID: "auditops.view", Name: "auditops.view", Description: "View AuditOps data", Category: "auditops"},
	{ID: "auditops.create", Name: "auditops.create", Description: "Create AuditOps entities", Category: "auditops"},
	{ID: "auditops.update", Name: "auditops.update", Description: "Update AuditOps entities", Category: "auditops"},
	{ID: "auditops.delete", Name: "auditops.delete", Description: "Delete AuditOps entities", Category: "auditops"},
	
	// AI Permissions
	{ID: "ai.view", Name: "ai.view", Description: "View AI settings", Category: "system"},
	{ID: "ai.update", Name: "ai.update", Description: "Update AI settings", Category: "system"},
	{ID: "ai.chat", Name: "ai.chat", Description: "Use AI chat assistant", Category: "system"},
	{ID: "ai.generate", Name: "ai.generate", Description: "Generate documents with AI", Category: "system"},
	{ID: "ai.analyze", Name: "ai.analyze", Description: "Analyze documents with AI", Category: "system"},
	{ID: "ai.autofill", Name: "ai.autofill", Description: "Auto-fill forms with AI", Category: "system"},
	
	// Document Permissions
	{ID: "document.view", Name: "document.view", Description: "View documents", Category: "system"},
	{ID: "document.create", Name: "document.create", Description: "Create documents", Category: "system"},
	{ID: "document.update", Name: "document.update", Description: "Update documents", Category: "system"},
	{ID: "document.delete", Name: "document.delete", Description: "Delete documents", Category: "system"},
	
	// Dashboard Permissions
	{ID: "dashboard.view", Name: "dashboard.view", Description: "View dashboard", Category: "system"},
	{ID: "dashboard.customize", Name: "dashboard.customize", Description: "Customize dashboard widgets", Category: "system"},
}

// Default permissions for each role
var RolePermissions = map[string][]string{
	RoleSuperAdmin: {
		// All permissions
		"tenant.view", "tenant.create", "tenant.update", "tenant.delete",
		"user.view", "user.create", "user.update", "user.delete", "user.assign_role",
		"regops.view", "regops.create", "regops.update", "regops.delete", "regops.restore", "regops.permanent_delete",
		"privacyops.view", "privacyops.create", "privacyops.update", "privacyops.delete",
		"riskops.view", "riskops.create", "riskops.update", "riskops.delete",
		"auditops.view", "auditops.create", "auditops.update", "auditops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view", "dashboard.customize",
	},
	RolePlatformOwner: {
		"tenant.view", "tenant.create", "tenant.update",
		"user.view", "user.create", "user.update", "user.delete",
		"regops.view", "regops.create", "regops.update", "regops.delete",
		"privacyops.view", "privacyops.create", "privacyops.update", "privacyops.delete",
		"riskops.view", "riskops.create", "riskops.update", "riskops.delete",
		"auditops.view", "auditops.create", "auditops.update", "auditops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view", "dashboard.customize",
	},
	RoleTenantAdmin: {
		"user.view", "user.create", "user.update", "user.delete", "user.assign_role",
		"regops.view", "regops.create", "regops.update", "regops.delete", "regops.restore",
		"privacyops.view", "privacyops.create", "privacyops.update", "privacyops.delete",
		"riskops.view", "riskops.create", "riskops.update", "riskops.delete",
		"auditops.view", "auditops.create", "auditops.update", "auditops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view", "dashboard.customize",
	},
	RoleComplianceOfficer: {
		"regops.view", "regops.create", "regops.update", "regops.delete",
		"privacyops.view", "privacyops.create", "privacyops.update", "privacyops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view",
	},
	RoleComplianceAnalyst: {
		"regops.view",
		"privacyops.view",
		"riskops.view",
		"auditops.view",
		"ai.view", "ai.chat", "ai.analyze",
		"document.view",
		"dashboard.view",
	},
	RolePrivacyOfficer: {
		"privacyops.view", "privacyops.create", "privacyops.update", "privacyops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view",
	},
	RoleDPO: {
		"privacyops.view", "privacyops.create", "privacyops.update", "privacyops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view",
	},
	RoleRiskManager: {
		"riskops.view", "riskops.create", "riskops.update", "riskops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view", "dashboard.customize",
	},
	RoleRiskAnalyst: {
		"riskops.view",
		"ai.view", "ai.chat", "ai.analyze",
		"document.view",
		"dashboard.view",
	},
	RoleAuditor: {
		"auditops.view", "auditops.create", "auditops.update", "auditops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view",
	},
	RoleAuditAnalyst: {
		"auditops.view",
		"ai.view", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view",
	},
	RoleSecurityOfficer: {
		"riskops.view", "riskops.create", "riskops.update", "riskops.delete",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view",
	},
	RoleSystemAdmin: {
		"regops.view", "privacyops.view", "riskops.view", "auditops.view",
		"ai.view", "ai.update", "ai.chat", "ai.generate", "ai.analyze", "ai.autofill",
		"document.view", "document.create", "document.update", "document.delete",
		"dashboard.view", "dashboard.customize",
	},
	RoleRegularUser: {
		"regops.view",
		"privacyops.view",
		"riskops.view",
		"auditops.view",
		"ai.view", "ai.chat",
		"document.view",
		"dashboard.view",
	},
}

// HasPermission checks if a role has a specific permission
func HasPermission(role, permission string) bool {
	permissions, exists := RolePermissions[role]
	if !exists {
		return false
	}
	for _, p := range permissions {
		if p == permission {
			return true
		}
	}
	return false
}

// GetPermissionsForRole returns all permissions for a given role
func GetPermissionsForRole(role string) []string {
	permissions, exists := RolePermissions[role]
	if !exists {
		return []string{}
	}
	return permissions
}
