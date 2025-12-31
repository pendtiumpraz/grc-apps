package models

import (
	"time"

	"gorm.io/gorm"
)

// Base model with common fields
type BaseModel struct {
	ID        string         `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	DeletedBy *string        `json:"deleted_by"`
	IsDeleted bool           `gorm:"default:false" json:"is_deleted"`
}

// Public Schema Models

type Tenant struct {
	BaseModel
	Name        string `gorm:"unique;not null" json:"name"`
	Domain      string `gorm:"unique;not null" json:"domain"`
	Description string `json:"description"`
	Status      string `gorm:"default:'active'" json:"status"`
	Config      string `gorm:"type:jsonb;default:'{}'" json:"config"`
}

type User struct {
	BaseModel
	TenantID     string     `gorm:"not null" json:"tenant_id"`
	Email        string     `gorm:"unique;not null" json:"email"`
	PasswordHash string     `gorm:"not null" json:"password_hash"`
	FirstName    string     `json:"first_name"`
	LastName     string     `json:"last_name"`
	Role         string     `gorm:"not null;default:'regular_user'" json:"role"`
	Status       string     `gorm:"default:'active'" json:"status"`
	Preferences  string     `gorm:"type:jsonb" json:"preferences"`
	LastLogin    *time.Time `json:"last_login"`
	IsSuperAdmin bool       `gorm:"default:false" json:"is_super_admin"`
}

type License struct {
	BaseModel
	TenantID  string    `gorm:"not null" json:"tenant_id"`
	Type      string    `gorm:"not null" json:"type"`
	StartDate time.Time `gorm:"not null" json:"start_date"`
	EndDate   time.Time `gorm:"not null" json:"end_date"`
	Status    string    `gorm:"default:'active'" json:"status"`
	Features  string    `gorm:"type:jsonb" json:"features"`
	Limits    string    `gorm:"type:jsonb" json:"limits"`
}

type GlobalConfig struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Key   string `gorm:"unique;not null" json:"key"`
	Value string `gorm:"type:jsonb" json:"value"`
}

// Private Schema Models

type AuditLog struct {
	BaseModel
	UserID       string `gorm:"not null" json:"user_id"`
	Action       string `gorm:"not null" json:"action"`
	ResourceType string `gorm:"not null" json:"resource_type"`
	ResourceID   string `json:"resource_id"`
	OldValues    string `gorm:"type:jsonb" json:"old_values"`
	NewValues    string `gorm:"type:jsonb" json:"new_values"`
	IPAddress    string `json:"ip_address"`
	UserAgent    string `json:"user_agent"`
}

type SystemMetric struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	MetricName string    `gorm:"not null" json:"metric_name"`
	Value      float64   `gorm:"not null" json:"value"`
	Timestamp  time.Time `gorm:"not null" json:"timestamp"`
	TenantID   string    `gorm:"not null" json:"tenant_id"`
}

type APIUsage struct {
	BaseModel
	TenantID     string `gorm:"not null" json:"tenant_id"`
	Endpoint     string `gorm:"not null" json:"endpoint"`
	Method       string `gorm:"not null" json:"method"`
	StatusCode   int    `gorm:"not null" json:"status_code"`
	ResponseTime int    `gorm:"not null" json:"response_time_ms"`
}

type MigrationHistory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Version     string    `gorm:"not null" json:"version"`
	Description string    `gorm:"not null" json:"description"`
	ExecutedAt  time.Time `gorm:"not null" json:"executed_at"`
	Status      string    `gorm:"not null" json:"status"`
}

// Tenant Schema Models - RegOps

type Regulation struct {
	BaseModel
	TenantID      string `gorm:"not null" json:"tenant_id"`
	Name          string `gorm:"not null" json:"name"`
	Description   string `json:"description"`
	Jurisdiction  string `json:"jurisdiction"`
	Type          string `json:"type"`
	Status        string `gorm:"default:'active'" json:"status"`
	Version       string `json:"version"`
	DocumentURL   string `json:"document_url"`
	ParsedContent string `gorm:"type:jsonb" json:"parsed_content"`
}

type ComplianceAssessment struct {
	BaseModel
	TenantID        string    `gorm:"not null" json:"tenant_id"`
	RegulationID    string    `gorm:"not null" json:"regulation_id"`
	AssessmentDate  time.Time `gorm:"not null" json:"assessment_date"`
	Status          string    `gorm:"default:'in_progress'" json:"status"`
	Score           int       `json:"score"`
	Findings        string    `gorm:"type:jsonb" json:"findings"`
	Recommendations string    `gorm:"type:jsonb" json:"recommendations"`
	Evidence        string    `gorm:"type:jsonb" json:"evidence"`
	CreatedBy       string    `gorm:"not null" json:"created_by"`
}

type Policy struct {
	BaseModel
	TenantID    string `gorm:"not null" json:"tenant_id"`
	Name        string `gorm:"not null" json:"name"`
	Description string `json:"description"`
	Type        string `json:"type"`
	Status      string `gorm:"default:'active'" json:"status"`
	Version     string `json:"version"`
	Content     string `gorm:"type:jsonb" json:"content"`
	CreatedBy   string `gorm:"not null" json:"created_by"`
}

type Control struct {
	BaseModel
	TenantID           string `gorm:"not null" json:"tenant_id"`
	Name               string `gorm:"not null" json:"name"`
	Description        string `json:"description"`
	Type               string `json:"type"`
	Status             string `gorm:"default:'active'" json:"status"`
	PolicyID           string `json:"policy_id"`
	ControlSetID       string `json:"control_set_id"`
	ValidationCriteria string `gorm:"type:jsonb" json:"validation_criteria"`
	CreatedBy          string `gorm:"not null" json:"created_by"`
}

// Tenant Schema Models - PrivacyOps

type DataInventory struct {
	BaseModel
	TenantID          string `gorm:"not null" json:"tenant_id"`
	DataType          string `gorm:"not null" json:"data_type"`
	DataSource        string `gorm:"not null" json:"data_source"`
	DataCategory      string `json:"data_category"`
	SensitivityLevel  string `json:"sensitivity_level"`
	ProcessingPurpose string `gorm:"not null" json:"processing_purpose"`
	DataSubjects      string `gorm:"type:jsonb" json:"data_subjects"`
	StorageLocation   string `gorm:"not null" json:"storage_location"`
	RetentionPeriod   int    `gorm:"not null" json:"retention_period"`
	CreatedBy         string `gorm:"not null" json:"created_by"`
}

type DSRRequest struct {
	BaseModel
	TenantID          string     `gorm:"not null" json:"tenant_id"`
	RequestType       string     `gorm:"not null" json:"request_type"`
	Status            string     `gorm:"default:'pending'" json:"status"`
	DataSubjectID     string     `gorm:"not null" json:"data_subject_id"`
	RequestDetails    string     `gorm:"type:jsonb" json:"request_details"`
	FulfillmentStatus string     `json:"fulfillment_status"`
	CreatedAt         time.Time  `gorm:"not null" json:"created_at"`
	UpdatedAt         time.Time  `gorm:"not null" json:"updated_at"`
	CompletedAt       *time.Time `json:"completed_at"`
}

type DPIA struct {
	BaseModel
	TenantID        string `gorm:"not null" json:"tenant_id"`
	ProjectName     string `gorm:"not null" json:"project_name"`
	AssessmentType  string `json:"assessment_type"`
	Status          string `gorm:"default:'in_progress'" json:"status"`
	RiskLevel       string `json:"risk_level"`
	Findings        string `gorm:"type:jsonb" json:"findings"`
	Recommendations string `gorm:"type:jsonb" json:"recommendations"`
	CreatedBy       string `gorm:"not null" json:"created_by"`
}

type PrivacyControl struct {
	BaseModel
	TenantID             string    `gorm:"not null" json:"tenant_id"`
	ControlType          string    `gorm:"not null" json:"control_type"`
	Description          string    `json:"description"`
	ImplementationStatus string    `gorm:"default:'not_implemented'" json:"implementation_status"`
	EffectivenessScore   int       `json:"effectiveness_score"`
	LastTested           time.Time `json:"last_tested"`
	CreatedBy            string    `gorm:"not null" json:"created_by"`
}

// Tenant Schema Models - RiskOps

type RiskRegister struct {
	BaseModel
	TenantID           string `gorm:"not null" json:"tenant_id"`
	RiskName           string `gorm:"not null" json:"risk_name"`
	RiskCategory       string `json:"risk_category"`
	RiskType           string `json:"risk_type"`
	Likelihood         string `json:"likelihood"`
	Impact             string `json:"impact"`
	RiskScore          int    `json:"risk_score"`
	MitigationStrategy string `gorm:"type:jsonb" json:"mitigation_strategy"`
	OwnerID            string `gorm:"not null" json:"owner_id"`
	Status             string `gorm:"default:'active'" json:"status"`
	CreatedBy          string `gorm:"not null" json:"created_by"`
}

type Vulnerability struct {
	BaseModel
	TenantID        string  `gorm:"not null" json:"tenant_id"`
	VulnerabilityID string  `gorm:"not null" json:"vulnerability_id"`
	Title           string  `gorm:"not null" json:"title"`
	Severity        string  `json:"severity"`
	CVSSScore       float64 `json:"cvss_score"`
	Description     string  `json:"description"`
	Remediation     string  `json:"remediation"`
	Status          string  `gorm:"default:'open'" json:"status"`
	CreatedBy       string  `gorm:"not null" json:"created_by"`
}

type VendorAssessment struct {
	BaseModel
	TenantID        string    `gorm:"not null" json:"tenant_id"`
	VendorName      string    `gorm:"not null" json:"vendor_name"`
	AssessmentDate  time.Time `gorm:"not null" json:"assessment_date"`
	RiskScore       int       `json:"risk_score"`
	Findings        string    `gorm:"type:jsonb" json:"findings"`
	Recommendations string    `gorm:"type:jsonb" json:"recommendations"`
	CreatedBy       string    `gorm:"not null" json:"created_by"`
}

type BusinessContinuity struct {
	BaseModel
	TenantID    string `gorm:"not null" json:"tenant_id"`
	PlanName    string `gorm:"not null" json:"plan_name"`
	PlanType    string `json:"plan_type"`
	Status      string `gorm:"default:'active'" json:"status"`
	RTO         int    `json:"rto"`
	RPO         int    `json:"rpo"`
	TestResults string `gorm:"type:jsonb" json:"test_results"`
	CreatedBy   string `gorm:"not null" json:"created_by"`
}

// Tenant Schema Models - AuditOps

type AuditPlan struct {
	BaseModel
	TenantID  string    `gorm:"not null" json:"tenant_id"`
	AuditName string    `gorm:"not null" json:"audit_name"`
	AuditType string    `json:"audit_type"`
	Scope     string    `gorm:"type:jsonb" json:"scope"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Status    string    `gorm:"default:'planned'" json:"status"`
	CreatedBy string    `gorm:"not null" json:"created_by"`
}

type AuditEvidence struct {
	BaseModel
	TenantID     string    `gorm:"not null" json:"tenant_id"`
	AuditPlanID  string    `gorm:"not null" json:"audit_plan_id"`
	EvidenceType string    `gorm:"not null" json:"evidence_type"`
	Description  string    `json:"description"`
	FilePath     string    `gorm:"not null" json:"file_path"`
	UploadedBy   string    `gorm:"not null" json:"uploaded_by"`
	UploadedAt   time.Time `gorm:"not null" json:"uploaded_at"`
}

type ControlTest struct {
	BaseModel
	TenantID   string    `gorm:"not null" json:"tenant_id"`
	ControlID  string    `gorm:"not null" json:"control_id"`
	TestDate   time.Time `gorm:"not null" json:"test_date"`
	TestResult string    `gorm:"not null" json:"test_result"`
	TestNotes  string    `json:"test_notes"`
	Evidence   string    `gorm:"type:jsonb" json:"evidence"`
	TestedBy   string    `gorm:"not null" json:"tested_by"`
}

type AuditReport struct {
	BaseModel
	TenantID        string `gorm:"not null" json:"tenant_id"`
	AuditPlanID     string `gorm:"not null" json:"audit_plan_id"`
	ReportType      string `gorm:"not null" json:"report_type"`
	Findings        string `gorm:"type:jsonb" json:"findings"`
	Recommendations string `gorm:"type:jsonb" json:"recommendations"`
	OverallRating   string `json:"overall_rating"`
	CreatedBy       string `gorm:"not null" json:"created_by"`
}

// Vector Store Models

type Document struct {
	BaseModel
	TenantID         string  `gorm:"not null" json:"tenant_id"`
	Title            string  `gorm:"not null" json:"title"`
	Content          string  `gorm:"type:text" json:"content"`
	StyledHTML       string  `gorm:"type:text" json:"styled_html"` // Fully styled HTML version
	DocumentType     string  `json:"document_type"`
	TemplateType     string  `json:"template_type"` // privacy_policy, risk_assessment, etc.
	SourceURL        string  `json:"source_url"`
	StorageURL       string  `json:"storage_url"` // S3/Cloud storage URL
	StoragePath      string  `json:"storage_path"` // Internal storage path
	FileSize         int64   `json:"file_size"`
	FileFormat       string  `json:"file_format"` // pdf, html, docx
	IsGenerated      bool    `gorm:"default:false" json:"is_generated"`
	GenerationPrompt string  `gorm:"type:text" json:"generation_prompt"`
	AIModel         string  `json:"ai_model"` // Model used for generation
	CreatedBy        string  `gorm:"not null" json:"created_by"`
}

// DocumentAnalysis - stores AI analysis results with JSON for infographics
type DocumentAnalysis struct {
	BaseModel
	TenantID      string  `gorm:"not null" json:"tenant_id"`
	DocumentID    string  `gorm:"not null" json:"document_id"`
	AnalysisType  string  `gorm:"not null" json:"analysis_type"` // compliance, risk, privacy, security
	Summary       string  `gorm:"type:text" json:"summary"`
	AnalysisData  string  `gorm:"type:jsonb" json:"analysis_data"` // JSON for infographics
	Score         int     `json:"score"` // Overall score 0-100
	Findings      string  `gorm:"type:jsonb" json:"findings"` // Array of findings
	Recommendations string `gorm:"type:jsonb" json:"recommendations"` // Array of recommendations
	Charts        string  `gorm:"type:jsonb" json:"charts"` // Chart data for visualization
	InfographicData string `gorm:"type:jsonb" json:"infographic_data"` // Structured data for infographics
	AIModel       string  `json:"ai_model"`
	CreatedBy     string  `gorm:"not null" json:"created_by"`
}

type Embedding struct {
	BaseModel
	DocumentID  string `gorm:"not null" json:"document_id"`
	Embedding   string `gorm:"not null" json:"embedding"`
	ContentHash string `gorm:"unique;not null" json:"content_hash"`
}

type Chunk struct {
	BaseModel
	DocumentID string `gorm:"not null" json:"document_id"`
	Content    string `gorm:"not null" json:"content"`
	ChunkIndex int    `gorm:"not null" json:"chunk_index"`
}

type SimilarityScore struct {
	BaseModel
	QueryID    string  `json:"query_id"`
	DocumentID string  `gorm:"not null" json:"document_id"`
	Score      float64 `gorm:"not null" json:"score"`
}

// AI Settings Model - stores AI provider configuration per tenant
type AISettings struct {
	BaseModel
	TenantID         string  `gorm:"not null;uniqueIndex" json:"tenant_id"`
	Provider         string  `gorm:"not null;default:'gemini'" json:"provider"` // gemini, openrouter
	ModelName        string  `gorm:"not null;default:'gemini-2.5-flash'" json:"model_name"`
	GeminiAPIKey     string  `json:"gemini_api_key,omitempty"`     // encrypted
	OpenRouterKey    string  `json:"openrouter_api_key,omitempty"` // encrypted
	IsEnabled        bool    `gorm:"default:true" json:"is_enabled"`
	MaxTokens        int     `gorm:"default:4096" json:"max_tokens"`
	Temperature      float64 `gorm:"default:0.7" json:"temperature"`
	WebSearchEnabled bool    `gorm:"default:true" json:"web_search_enabled"`
	AutoFillEnabled  bool    `gorm:"default:true" json:"auto_fill_enabled"`
}

// AI Usage Log - tracks AI API usage per tenant
type AIUsageLog struct {
	BaseModel
	TenantID     string  `gorm:"not null" json:"tenant_id"`
	UserID       string  `gorm:"not null" json:"user_id"`
	Provider     string  `gorm:"not null" json:"provider"`
	ModelName    string  `gorm:"not null" json:"model_name"`
	PromptTokens int     `json:"prompt_tokens"`
	OutputTokens int     `json:"output_tokens"`
	TotalTokens  int     `json:"total_tokens"`
	Cost         float64 `json:"cost"`
	Feature      string  `json:"feature"` // web_search, auto_fill, analyze, chat
	Success      bool    `gorm:"default:true" json:"success"`
	ErrorMessage string  `json:"error_message,omitempty"`
}
