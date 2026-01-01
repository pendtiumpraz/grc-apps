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

type GapAnalysis struct {
	BaseModel
	TenantID          string     `gorm:"not null" json:"tenant_id"`
	RegulationID      string     `json:"regulation_id"`
	Name              string     `gorm:"not null" json:"name"`
	Description       string     `json:"description"`
	Framework         string     `json:"framework"`
	Status            string     `gorm:"default:'pending'" json:"status"`
	GapScore          int        `json:"gap_score"`
	Findings          string     `json:"findings"`
	Recommendations   string     `json:"recommendations"`
	RemediationPlan   string     `json:"remediation_plan"`
	Owner             string     `json:"owner"`
	DueDate           *time.Time `json:"due_date"`
}

type ObligationMapping struct {
	BaseModel
	TenantID          string     `gorm:"not null" json:"tenant_id"`
	RegulationID      string     `json:"regulation_id"`
	Name              string     `gorm:"not null" json:"name"`
	Description       string     `json:"description"`
	ObligationType    string     `json:"obligation_type"`
	ControlID         string     `json:"control_id"`
	ControlName       string     `json:"control_name"`
	MappingStatus     string     `gorm:"default:'mapped'" json:"mapping_status"`
	ComplianceStatus  string     `gorm:"default:'compliant'" json:"compliance_status"`
	Evidence          string     `json:"evidence"`
	LastReviewed      *time.Time `json:"last_reviewed"`
	NextReview        *time.Time `json:"next_review"`
}

type Policy struct {
	BaseModel
	TenantID    string     `gorm:"not null" json:"tenant_id"`
	RegulationID string    `json:"regulation_id"`
	Name        string     `gorm:"not null" json:"name"`
	Description string     `json:"description"`
	PolicyType  string     `json:"policy_type"`
	Version     string     `json:"version"`
	Status      string     `gorm:"default:'draft'" json:"status"`
	ApprovalDate *time.Time `json:"approval_date"`
	ReviewDate   *time.Time `json:"review_date"`
	Owner       string     `json:"owner"`
	Content     string     `json:"content"`
}

type RegOpsControl struct {
	BaseModel
	TenantID             string     `gorm:"not null" json:"tenant_id"`
	RegulationID         string     `json:"regulation_id"`
	Name                 string     `gorm:"not null" json:"name"`
	Description          string     `json:"description"`
	ControlType          string     `json:"control_type"`
	ControlFamily        string     `json:"control_family"`
	Framework            string     `json:"framework"`
	ImplementationStatus string     `gorm:"default:'not_implemented'" json:"implementation_status"`
	Effectiveness        string     `json:"effectiveness"`
	TestingFrequency     string     `json:"testing_frequency"`
	Owner                string     `json:"owner"`
	LastTested           *time.Time `json:"last_tested"`
	NextTest             *time.Time `json:"next_test"`
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
	DataSubjectName   string     `gorm:"not null" json:"data_subject_name"`
	DataSubjectEmail  string     `json:"data_subject_email"`
	DataSubjectType   string     `json:"data_subject_type"`
	RequestDate       time.Time  `gorm:"not null" json:"request_date"`
	DueDate           *time.Time `json:"due_date"`
	Status            string     `gorm:"default:'pending'" json:"status"`
	Priority          string     `gorm:"default:'medium'" json:"priority"`
	Description       string     `json:"description"`
	DataCategories    string     `json:"data_categories"`
	ProcessingActivities string   `json:"processing_activities"`
	Response          string     `json:"response"`
	CompletedDate     *time.Time `json:"completed_date"`
	Handler           string     `json:"handler"`
}

type DPIA struct {
	BaseModel
	TenantID           string     `gorm:"not null" json:"tenant_id"`
	Name               string     `gorm:"not null" json:"name"`
	Description        string     `json:"description"`
	ProcessingActivity  string     `json:"processing_activity"`
	DataCategories     string     `json:"data_categories"`
	DataSubjects       string     `json:"data_subjects"`
	Necessity          string     `json:"necessity"`
	Proportionality    string     `json:"proportionality"`
	RiskLevel          string     `gorm:"default:'low'" json:"risk_level"`
	RiskAssessment     string     `json:"risk_assessment"`
	MitigationMeasures string     `json:"mitigation_measures"`
	Status             string     `gorm:"default:'draft'" json:"status"`
	ApprovalDate       *time.Time `json:"approval_date"`
	Reviewer           string     `json:"reviewer"`
}

type PrivacyControl struct {
	BaseModel
	TenantID             string     `gorm:"not null" json:"tenant_id"`
	Name                 string     `gorm:"not null" json:"name"`
	Description          string     `json:"description"`
	ControlType          string     `gorm:"not null" json:"control_type"`
	ControlDomain        string     `json:"control_domain"`
	Framework            string     `json:"framework"`
	ImplementationStatus string     `gorm:"default:'not_implemented'" json:"implementation_status"`
	Effectiveness        string     `json:"effectiveness"`
	TestingFrequency     string     `json:"testing_frequency"`
	Owner                string     `json:"owner"`
	LastTested           *time.Time `json:"last_tested"`
	NextTest             *time.Time `json:"next_test"`
}

type Incident struct {
	BaseModel
	TenantID               string     `gorm:"not null" json:"tenant_id"`
	Name                   string     `gorm:"not null" json:"name"`
	Description            string     `json:"description"`
	IncidentType           string     `json:"incident_type"`
	Severity               string     `gorm:"default:'low'" json:"severity"`
	Status                 string     `gorm:"default:'open'" json:"status"`
	DetectionDate          *time.Time `json:"detection_date"`
	ReportedDate           *time.Time `json:"reported_date"`
	AffectedData           string     `json:"affected_data"`
	AffectedIndividuals    int        `json:"affected_individuals"`
	RootCause              string     `json:"root_cause"`
	ImpactAssessment       string     `json:"impact_assessment"`
	ResponseActions        string     `json:"response_actions"`
	NotificationRequired   bool       `gorm:"default:false" json:"notification_required"`
	NotificationDate       *time.Time `json:"notification_date"`
	NotificationAuthorities string     `json:"notification_authorities"`
	NotificationSubjects    string     `json:"notification_subjects"`
	ResolutionDate         *time.Time `json:"resolution_date"`
	LessonsLearned         string     `json:"lessons_learned"`
	Handler                string     `json:"handler"`
}

// Tenant Schema Models - RiskOps

type RiskRegister struct {
	BaseModel
	TenantID            string     `gorm:"not null" json:"tenant_id"`
	Name                string     `gorm:"not null" json:"name"`
	Description         string     `json:"description"`
	RiskCategory        string     `json:"risk_category"`
	RiskType            string     `json:"risk_type"`
	Likelihood          string     `gorm:"default:'medium'" json:"likelihood"`
	Impact              string     `gorm:"default:'medium'" json:"impact"`
	RiskScore           int        `json:"risk_score"`
	RiskLevel           string     `json:"risk_level"`
	Owner               string     `json:"owner"`
	Status              string     `gorm:"default:'open'" json:"status"`
	MitigationStrategy  string     `json:"mitigation_strategy"`
	MitigationActions   string     `json:"mitigation_actions"`
	ResidualRiskScore   int        `json:"residual_risk_score"`
	ResidualRiskLevel   string     `json:"residual_risk_level"`
	ReviewDate          *time.Time `json:"review_date"`
}

type Vulnerability struct {
	BaseModel
	TenantID           string     `gorm:"not null" json:"tenant_id"`
	Name               string     `gorm:"not null" json:"name"`
	Description        string     `json:"description"`
	CVEID              string     `json:"cve_id"`
	CVSSScore          float64    `json:"cvss_score"`
	Severity           string     `json:"severity"`
	AffectedSystems    string     `json:"affected_systems"`
	AffectedAssets     string     `json:"affected_assets"`
	DiscoveryDate      *time.Time `json:"discovery_date"`
	Status             string     `gorm:"default:'open'" json:"status"`
	PatchAvailable     bool       `gorm:"default:false" json:"patch_available"`
	PatchVersion       string     `json:"patch_version"`
	Mitigation         string     `json:"mitigation"`
	RemediationPlan    string     `json:"remediation_plan"`
	RemediationDate    *time.Time `json:"remediation_date"`
	AssignedTo         string     `json:"assigned_to"`
}

type VendorAssessment struct {
	BaseModel
	TenantID          string     `gorm:"not null" json:"tenant_id"`
	VendorName        string     `gorm:"not null" json:"vendor_name"`
	VendorType        string     `json:"vendor_type"`
	Description       string     `json:"description"`
	ContactPerson     string     `json:"contact_person"`
	ContactEmail      string     `json:"contact_email"`
	RiskLevel         string     `gorm:"default:'low'" json:"risk_level"`
	AssessmentDate   *time.Time `json:"assessment_date"`
	NextAssessmentDate *time.Time `json:"next_assessment_date"`
	DataShared        string     `json:"data_shared"`
	DataProcessing    string     `json:"data_processing"`
	SecurityControls   string     `json:"security_controls"`
	ComplianceStatus  string     `gorm:"default:'pending'" json:"compliance_status"`
	SLACompliance     string     `gorm:"default:'compliant'" json:"sla_compliance"`
	Findings          string     `json:"findings"`
	Recommendations   string     `json:"recommendations"`
	Owner             string     `json:"owner"`
}

type BusinessContinuity struct {
	BaseModel
	TenantID           string     `gorm:"not null" json:"tenant_id"`
	Name               string     `gorm:"not null" json:"name"`
	Description        string     `json:"description"`
	BusinessFunction   string     `json:"business_function"`
	Criticality        string     `json:"criticality"`
	RTOHours           int        `json:"rto_hours"`
	RPOHours           int        `json:"rpo_hours"`
	RecoveryStrategy   string     `json:"recovery_strategy"`
	BackupProcedures   string     `json:"backup_procedures"`
	TestDate           *time.Time `json:"test_date"`
	TestResult         string     `json:"test_result"`
	TestFindings       string     `json:"test_findings"`
	ImprovementActions string     `json:"improvement_actions"`
	Owner              string     `json:"owner"`
	Status             string     `gorm:"default:'active'" json:"status"`
}

// Tenant Schema Models - AuditOps

type AuditPlan struct {
	BaseModel
	TenantID  string    `gorm:"not null" json:"tenant_id"`
	Name      string    `gorm:"not null" json:"name"`
	Description string   `json:"description"`
	AuditType  string    `json:"audit_type"`
	Framework  string    `json:"framework"`
	Scope      string    `gorm:"type:jsonb" json:"scope"`
	Objectives string    `json:"objectives"`
	Status     string    `gorm:"default:'planned'" json:"status"`
	Auditor    string    `json:"auditor"`
	StartDate  time.Time `json:"start_date"`
	EndDate    time.Time `json:"end_date"`
	Budget     float64   `json:"budget"`
	Resources  string    `gorm:"type:jsonb" json:"resources"`
	RiskLevel  string    `json:"risk_level"`
}

type Governance struct {
	BaseModel
	TenantID              string    `gorm:"not null" json:"tenant_id"`
	Name                  string    `gorm:"not null" json:"name"`
	Description           string    `json:"description"`
	GovernanceType        string    `json:"governance_type"`
	Framework             string    `json:"framework"`
	CommitteeName         string    `json:"committee_name"`
	MeetingFrequency      string    `json:"meeting_frequency"`
	Charter               string    `json:"charter"`
	RolesResponsibilities string    `json:"roles_responsibilities"`
	OversightAreas        string    `json:"oversight_areas"`
	ComplianceRequirements string   `json:"compliance_requirements"`
	LastMeetingDate       *time.Time `json:"last_meeting_date"`
	NextMeetingDate       *time.Time `json:"next_meeting_date"`
	Status                string    `gorm:"default:'active'" json:"status"`
}

type AuditEvidence struct {
	BaseModel
	TenantID     string    `gorm:"not null" json:"tenant_id"`
	AuditID      string    `json:"audit_id"`
	ControlID    string    `json:"control_id"`
	EvidenceType string    `gorm:"not null" json:"evidence_type"`
	Name         string    `gorm:"not null" json:"name"`
	Description  string    `json:"description"`
	FilePath     string    `json:"file_path"`
	FileSize     int64     `json:"file_size"`
	FileType     string    `json:"file_type"`
	UploadDate   time.Time `json:"upload_date"`
	CollectedBy  string    `json:"collected_by"`
	Status       string    `gorm:"default:'pending_review'" json:"status"`
	ReviewNotes  string    `json:"review_notes"`
}

type ControlTest struct {
	BaseModel
	TenantID           string     `gorm:"not null" json:"tenant_id"`
	ControlID          string     `json:"control_id"`
	ControlName        string     `gorm:"not null" json:"control_name"`
	Description        string     `json:"description"`
	TestType           string     `json:"test_type"`
	TestProcedure      string     `json:"test_procedure"`
	TestDate           time.Time  `gorm:"not null" json:"test_date"`
	Tester             string     `json:"tester"`
	TestResult         string     `gorm:"not null;default:'pass'" json:"test_result"`
	Findings           string     `json:"findings"`
	Recommendations    string     `json:"recommendations"`
	Evidence           string     `gorm:"type:jsonb" json:"evidence"`
	FollowUpRequired   bool       `gorm:"default:false" json:"follow_up_required"`
	FollowUpDate       *time.Time `json:"follow_up_date"`
}

type AuditReport struct {
	BaseModel
	TenantID          string     `gorm:"not null" json:"tenant_id"`
	AuditID           string     `json:"audit_id"`
	ReportName        string     `gorm:"not null" json:"report_name"`
	Description       string     `json:"description"`
	ReportType        string     `gorm:"not null" json:"report_type"`
	Framework         string     `json:"framework"`
	PeriodStart       *time.Time `json:"period_start"`
	PeriodEnd         *time.Time `json:"period_end"`
	ExecutiveSummary  string     `json:"executive_summary"`
	Findings          string     `gorm:"type:jsonb" json:"findings"`
	Recommendations   string     `gorm:"type:jsonb" json:"recommendations"`
	OverallRating     string     `json:"overall_rating"`
	PreparedBy        string     `json:"prepared_by"`
	ReviewedBy        string     `json:"reviewed_by"`
	ApprovedBy        string     `json:"approved_by"`
	ReportDate        *time.Time `json:"report_date"`
	DistributionList  string     `json:"distribution_list"`
	Status            string     `gorm:"default:'draft'" json:"status"`
}

// Vector Store Models

type Document struct {
	BaseModel
	TenantID         string  `gorm:"not null" json:"tenant_id"`
	Title            string  `gorm:"not null" json:"title"`
	Description      string  `json:"description"`
	Content          string  `gorm:"type:text" json:"content"`
	StyledHTML       string  `gorm:"type:text" json:"styled_html"` // Fully styled HTML version
	DocumentType     string  `json:"document_type"`
	TemplateType     string  `json:"template_type"` // privacy_policy, risk_assessment, etc.
	SourceURL        string  `json:"source_url"`
	StorageURL       string  `json:"storage_url"` // S3/Cloud storage URL
	StoragePath      string  `json:"storage_path"` // Internal storage path
	FilePath         string  `json:"file_path"`
	FileSize         int64   `json:"file_size"`
	FileFormat       string  `json:"file_format"` // pdf, html, docx
	Status           string  `gorm:"default:'draft'" json:"status"`
	IsGenerated      bool    `gorm:"default:false" json:"is_generated"`
	GenerationPrompt string  `gorm:"type:text" json:"generation_prompt"`
	AIModel          string  `json:"ai_model"` // Model used for generation
	CreatedBy        string  `gorm:"not null" json:"created_by"`
}

// DocumentAnalysis - stores AI analysis results with JSON for infographics
type DocumentAnalysis struct {
	BaseModel
	TenantID         string  `gorm:"not null" json:"tenant_id"`
	DocumentID       string  `gorm:"not null" json:"document_id"`
	AnalysisType     string  `gorm:"not null" json:"analysis_type"` // compliance, risk, privacy, security
	AnalysisResult   string  `gorm:"type:text" json:"analysis_result"`
	Summary          string  `gorm:"type:text" json:"summary"`
	KeyPoints        string  `gorm:"type:text" json:"key_points"`
	Recommendations  string  `json:"recommendations"`
	ConfidenceScore  float64 `json:"confidence_score"`
	AnalysisMetadata string  `gorm:"type:jsonb" json:"analysis_metadata"` // JSON for infographics
	AIModel          string  `json:"ai_model"`
}

type Chunk struct {
	BaseModel
	TenantID  string `gorm:"not null" json:"tenant_id"`
	DocumentID string `gorm:"not null" json:"document_id"`
	ChunkIndex int    `gorm:"not null" json:"chunk_index"`
	Content    string `gorm:"not null" json:"content"`
	Metadata   string `gorm:"type:jsonb" json:"metadata"`
}

type Embedding struct {
	BaseModel
	TenantID  string `gorm:"not null" json:"tenant_id"`
	ChunkID   string `gorm:"not null" json:"chunk_id"`
	Vector    string `gorm:"type:bytea" json:"vector"` // Changed to bytea for PostgreSQL
	Model     string `json:"model"`
}

type SimilarityScore struct {
	BaseModel
	TenantID string `gorm:"not null" json:"tenant_id"`
	QueryID  string  `json:"query_id"`
	ChunkID  string `gorm:"not null" json:"chunk_id"`
	Score    float64 `gorm:"not null" json:"score"`
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
