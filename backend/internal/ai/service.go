package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// AIService handles AI API calls
type AIService struct {
	httpClient *http.Client
}

func NewAIService() *AIService {
	return &AIService{
		httpClient: &http.Client{Timeout: 60 * time.Second},
	}
}

// ChatRequest represents a chat request
type ChatRequest struct {
	Message     string      `json:"message"`
	Context     interface{} `json:"context,omitempty"`
	Feature     string      `json:"feature"` // chat, websearch, autofill, analyze
	Provider    string      `json:"provider"`
	Model       string      `json:"model"`
	APIKey      string      `json:"api_key"`
	MaxTokens   int         `json:"max_tokens"`
	Temperature float64     `json:"temperature"`
}

// ChatResponse represents AI response
type ChatResponse struct {
	Success      bool        `json:"success"`
	Message      string      `json:"message"`
	FormData     interface{} `json:"form_data,omitempty"`
	PromptTokens int         `json:"prompt_tokens"`
	OutputTokens int         `json:"output_tokens"`
	TotalTokens  int         `json:"total_tokens"`
}

// Chat sends a message to AI and returns response
func (s *AIService) Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error) {
	switch req.Provider {
	case "gemini":
		return s.chatGemini(ctx, req)
	case "openrouter":
		return s.chatOpenRouter(ctx, req)
	default:
		return nil, fmt.Errorf("unsupported provider: %s", req.Provider)
	}
}

// Gemini API integration
func (s *AIService) chatGemini(ctx context.Context, req ChatRequest) (*ChatResponse, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", req.Model, req.APIKey)

	// Build system prompt based on feature
	systemPrompt := s.buildSystemPrompt(req.Feature, req.Context)

	// Gemini request format
	geminiReq := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{"text": systemPrompt + "\n\nUser: " + req.Message},
				},
			},
		},
		"generationConfig": map[string]interface{}{
			"temperature":     req.Temperature,
			"maxOutputTokens": req.MaxTokens,
		},
	}

	// Add web search tool if enabled
	if req.Feature == "websearch" {
		geminiReq["tools"] = []map[string]interface{}{
			{
				"googleSearch": map[string]interface{}{},
			},
		}
	}

	body, _ := json.Marshal(geminiReq)
	httpReq, _ := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("gemini API error: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("gemini API returned %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse Gemini response
	var geminiResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
		UsageMetadata struct {
			PromptTokenCount     int `json:"promptTokenCount"`
			CandidatesTokenCount int `json:"candidatesTokenCount"`
			TotalTokenCount      int `json:"totalTokenCount"`
		} `json:"usageMetadata"`
	}

	if err := json.Unmarshal(respBody, &geminiResp); err != nil {
		return nil, fmt.Errorf("failed to parse gemini response: %w", err)
	}

	message := ""
	if len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		message = geminiResp.Candidates[0].Content.Parts[0].Text
	}

	result := &ChatResponse{
		Success:      true,
		Message:      message,
		PromptTokens: geminiResp.UsageMetadata.PromptTokenCount,
		OutputTokens: geminiResp.UsageMetadata.CandidatesTokenCount,
		TotalTokens:  geminiResp.UsageMetadata.TotalTokenCount,
	}

	// Parse form data if autofill
	if req.Feature == "autofill" {
		result.FormData = s.parseFormData(message)
	}

	return result, nil
}

// OpenRouter API integration
func (s *AIService) chatOpenRouter(ctx context.Context, req ChatRequest) (*ChatResponse, error) {
	url := "https://openrouter.ai/api/v1/chat/completions"

	systemPrompt := s.buildSystemPrompt(req.Feature, req.Context)

	openRouterReq := map[string]interface{}{
		"model": req.Model,
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": req.Message},
		},
		"max_tokens":  req.MaxTokens,
		"temperature": req.Temperature,
	}

	body, _ := json.Marshal(openRouterReq)
	httpReq, _ := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(body))
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+req.APIKey)
	httpReq.Header.Set("HTTP-Referer", "https://komplai.app")

	resp, err := s.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("openrouter API error: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("openrouter API returned %d: %s", resp.StatusCode, string(respBody))
	}

	var openRouterResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
		Usage struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
			TotalTokens      int `json:"total_tokens"`
		} `json:"usage"`
	}

	if err := json.Unmarshal(respBody, &openRouterResp); err != nil {
		return nil, fmt.Errorf("failed to parse openrouter response: %w", err)
	}

	message := ""
	if len(openRouterResp.Choices) > 0 {
		message = openRouterResp.Choices[0].Message.Content
	}

	result := &ChatResponse{
		Success:      true,
		Message:      message,
		PromptTokens: openRouterResp.Usage.PromptTokens,
		OutputTokens: openRouterResp.Usage.CompletionTokens,
		TotalTokens:  openRouterResp.Usage.TotalTokens,
	}

	if req.Feature == "autofill" {
		result.FormData = s.parseFormData(message)
	}

	return result, nil
}

// Build system prompt based on feature
func (s *AIService) buildSystemPrompt(feature string, context interface{}) string {
	basePrompt := "You are KOMPL.AI, an expert AI assistant for Governance, Risk, and Compliance (GRC). You help users manage regulations, risks, privacy, and audits."

	switch feature {
	case "websearch":
		return basePrompt + `
You have access to web search. When answering:
1. Search for the latest regulatory updates and compliance news
2. Cite your sources with URLs
3. Provide accurate, up-to-date information
4. Focus on GRC-related topics`

	case "autofill":
		return basePrompt + `
You are helping fill out a GRC form automatically. Based on the context provided:
1. Generate appropriate values for form fields
2. Return your response as a JSON object with field names and values
3. Use realistic, professional data
4. Follow regulatory best practices

Return ONLY a valid JSON object like: {"field_name": "value", ...}`

	case "analyze":
		return basePrompt + `
You are analyzing GRC data. Based on the context:
1. Identify key risks and compliance gaps
2. Provide actionable recommendations
3. Prioritize findings by severity
4. Use bullet points for clarity`

	default:
		return basePrompt + `
Help users with:
- Regulatory compliance questions
- Risk assessment guidance
- Privacy and data protection advice
- Audit preparation tips
Be concise, professional, and helpful.`
	}
}

// Parse form data from AI response
func (s *AIService) parseFormData(message string) map[string]interface{} {
	// Try to extract JSON from message
	var formData map[string]interface{}

	// Find JSON in message
	start := -1
	end := -1
	braceCount := 0

	for i, c := range message {
		if c == '{' {
			if start == -1 {
				start = i
			}
			braceCount++
		} else if c == '}' {
			braceCount--
			if braceCount == 0 && start != -1 {
				end = i + 1
				break
			}
		}
	}

	if start != -1 && end != -1 {
		jsonStr := message[start:end]
		if err := json.Unmarshal([]byte(jsonStr), &formData); err == nil {
			return formData
		}
	}

	return nil
}

// TestConnection tests if API key is valid
func (s *AIService) TestConnection(ctx context.Context, provider, apiKey, model string) error {
	req := ChatRequest{
		Message:     "Hello, respond with 'OK' only.",
		Provider:    provider,
		Model:       model,
		APIKey:      apiKey,
		MaxTokens:   10,
		Temperature: 0,
	}

	_, err := s.Chat(ctx, req)
	return err
}
