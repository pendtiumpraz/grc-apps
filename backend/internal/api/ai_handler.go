package api

import (
	"encoding/json"
	"net/http"

	"github.com/cyber/backend/internal/ai"
	"github.com/cyber/backend/internal/crypto"
	"github.com/cyber/backend/internal/db"
	"github.com/cyber/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type AIHandler struct {
	db *db.Database
}

func NewAIHandler(database *db.Database) *AIHandler {
	return &AIHandler{db: database}
}

// GetAISettings returns the AI settings for current tenant
func (h *AIHandler) GetAISettings(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tenant ID required"})
		return
	}

	var settings models.AISettings
	result := h.db.Where("tenant_id = ?", tenantID).First(&settings)

	if result.Error != nil {
		// Return default settings if not found
		settings = models.AISettings{
		    TenantID:         tenantID,
		    Provider:         "gemini",
		    ModelName:        "gemini-2.5-flash",
		    IsEnabled:        true,
		    MaxTokens:        4096,
		    Temperature:      0.7,
		    WebSearchEnabled: true,
		    AutoFillEnabled:  true,
		}
	}

	// Hide API keys in response
	settings.GeminiAPIKey = maskAPIKey(settings.GeminiAPIKey)
	settings.OpenRouterKey = maskAPIKey(settings.OpenRouterKey)

	c.JSON(http.StatusOK, settings)
}

// UpdateAISettings updates AI settings for tenant
func (h *AIHandler) UpdateAISettings(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tenant ID required"})
		return
	}

	var input struct {
		Provider         string  `json:"provider"`
		ModelName        string  `json:"model_name"`
		GeminiAPIKey     string  `json:"gemini_api_key"`
		OpenRouterKey    string  `json:"openrouter_api_key"`
		IsEnabled        bool    `json:"is_enabled"`
		MaxTokens        int     `json:"max_tokens"`
		Temperature      float64 `json:"temperature"`
		WebSearchEnabled bool    `json:"web_search_enabled"`
		AutoFillEnabled  bool    `json:"auto_fill_enabled"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var settings models.AISettings
	result := h.db.Where("tenant_id = ?", tenantID).First(&settings)

	if result.Error != nil {
		// Create new settings
		settings = models.AISettings{
			TenantID: tenantID,
		}
	}

	// Update fields
	settings.Provider = input.Provider
	settings.ModelName = input.ModelName
	settings.IsEnabled = input.IsEnabled
	settings.MaxTokens = input.MaxTokens
	settings.Temperature = input.Temperature
	settings.WebSearchEnabled = input.WebSearchEnabled
	settings.AutoFillEnabled = input.AutoFillEnabled

	// Only update API keys if provided (not masked)
	if input.GeminiAPIKey != "" && !isMasked(input.GeminiAPIKey) {
		encryptedKey, err := crypto.Encrypt(input.GeminiAPIKey)
		if err == nil {
			settings.GeminiAPIKey = encryptedKey
		} else {
			settings.GeminiAPIKey = input.GeminiAPIKey // Fallback to plain text
		}
	}
	if input.OpenRouterKey != "" && !isMasked(input.OpenRouterKey) {
		encryptedKey, err := crypto.Encrypt(input.OpenRouterKey)
		if err == nil {
			settings.OpenRouterKey = encryptedKey
		} else {
			settings.OpenRouterKey = input.OpenRouterKey // Fallback to plain text
		}
	}

	if result.Error != nil {
		h.db.Create(&settings)
	} else {
		h.db.Save(&settings)
	}

	// Hide API keys in response
	settings.GeminiAPIKey = maskAPIKey(settings.GeminiAPIKey)
	settings.OpenRouterKey = maskAPIKey(settings.OpenRouterKey)

	c.JSON(http.StatusOK, gin.H{
		"message":  "AI settings updated successfully",
		"settings": settings,
	})
}

// GetAvailableModels returns list of available AI models
func (h *AIHandler) GetAvailableModels(c *gin.Context) {
	models := map[string][]map[string]string{
		"gemini": {
			{"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", "description": "Fast and efficient"},
			{"id": "gemini-2.5-flash", "name": "Gemini 2.5 Flash", "description": "Latest flash model"},
			{"id": "gemini-2.5-flash-lite", "name": "Gemini 2.5 Flash Lite", "description": "Lightweight version"},
			{"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "description": "Most capable model"},
		},
		"openrouter": {
			{"id": "anthropic/claude-3-opus", "name": "Claude 3 Opus", "description": "Most capable Claude"},
			{"id": "anthropic/claude-3-sonnet", "name": "Claude 3 Sonnet", "description": "Balanced performance"},
			{"id": "openai/gpt-4-turbo", "name": "GPT-4 Turbo", "description": "OpenAI's best"},
			{"id": "meta-llama/llama-3-70b", "name": "Llama 3 70B", "description": "Open source large model"},
			{"id": "custom", "name": "Custom Model", "description": "Enter model ID manually"},
		},
	}

	c.JSON(http.StatusOK, models)
}

// TestAIConnection tests if the AI API key is valid
func (h *AIHandler) TestAIConnection(c *gin.Context) {
	tenantID := c.GetString("tenant_id")

	var settings models.AISettings
	result := h.db.Where("tenant_id = ?", tenantID).First(&settings)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "AI settings not configured"})
		return
	}

	// Get API key based on provider and decrypt
	var apiKey string
	if settings.Provider == "gemini" {
		decryptedKey, err := crypto.Decrypt(settings.GeminiAPIKey)
		if err == nil {
			apiKey = decryptedKey
		} else {
			apiKey = settings.GeminiAPIKey // Fallback to stored value
		}
	} else {
		decryptedKey, err := crypto.Decrypt(settings.OpenRouterKey)
		if err == nil {
			apiKey = decryptedKey
		} else {
			apiKey = settings.OpenRouterKey // Fallback to stored value
		}
	}

	if apiKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "API key not configured for " + settings.Provider,
		})
		return
	}

	// Actually test the API connection
	aiService := ai.NewAIService()
	err := aiService.TestConnection(c.Request.Context(), settings.Provider, apiKey, settings.ModelName)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Connection failed: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"message":  "Connection successful",
		"provider": settings.Provider,
		"model":    settings.ModelName,
	})
}

// AIChat handles AI chat requests
func (h *AIHandler) AIChat(c *gin.Context) {
	tenantID := c.GetString("tenant_id")
	userID := c.GetString("user_id")

	var input struct {
		Message string          `json:"message" binding:"required"`
		Context json.RawMessage `json:"context,omitempty"`
		Feature string          `json:"feature"` // chat, analyze, autofill, websearch
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get AI settings
	var settings models.AISettings
	if err := h.db.Where("tenant_id = ?", tenantID).First(&settings).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AI not configured. Please go to Settings > AI Configuration"})
		return
	}

	if !settings.IsEnabled {
		c.JSON(http.StatusForbidden, gin.H{"error": "AI features are disabled"})
		return
	}

	// Get API key based on provider and decrypt
	var apiKey string
	if settings.Provider == "gemini" {
		decryptedKey, err := crypto.Decrypt(settings.GeminiAPIKey)
		if err == nil {
			apiKey = decryptedKey
		} else {
			apiKey = settings.GeminiAPIKey // Fallback to stored value
		}
	} else {
		decryptedKey, err := crypto.Decrypt(settings.OpenRouterKey)
		if err == nil {
			apiKey = decryptedKey
		} else {
			apiKey = settings.OpenRouterKey // Fallback to stored value
		}
	}

	if apiKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "API key not configured for " + settings.Provider})
		return
	}

	// Call AI service
	aiService := ai.NewAIService()
	req := ai.ChatRequest{
		Message:     input.Message,
		Context:     input.Context,
		Feature:     input.Feature,
		Provider:    settings.Provider,
		Model:       settings.ModelName,
		APIKey:      apiKey,
		MaxTokens:   settings.MaxTokens,
		Temperature: settings.Temperature,
	}

	aiResp, err := aiService.Chat(c.Request.Context(), req)

	// Log usage
	usage := models.AIUsageLog{
		TenantID:  tenantID,
		UserID:    userID,
		Provider:  settings.Provider,
		ModelName: settings.ModelName,
		Feature:   input.Feature,
		Success:   err == nil,
	}

	if err != nil {
		usage.ErrorMessage = err.Error()
		h.db.Create(&usage)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI request failed: " + err.Error()})
		return
	}

	usage.PromptTokens = aiResp.PromptTokens
	usage.OutputTokens = aiResp.OutputTokens
	usage.TotalTokens = aiResp.TotalTokens
	h.db.Create(&usage)

	response := gin.H{
		"success":  true,
		"message":  aiResp.Message,
		"provider": settings.Provider,
		"model":    settings.ModelName,
	}

	if aiResp.FormData != nil {
		response["form_data"] = aiResp.FormData
	}

	c.JSON(http.StatusOK, response)
}

// Helper functions
func maskAPIKey(key string) string {
	if key == "" {
		return ""
	}
	if len(key) <= 8 {
		return "****"
	}
	return key[:4] + "..." + key[len(key)-4:]
}

func isMasked(key string) bool {
	return len(key) < 20 && (key == "****" || (len(key) > 4 && key[4:7] == "..."))
}
