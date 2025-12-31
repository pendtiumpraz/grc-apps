package storage

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

// StorageService handles file storage operations
type StorageService struct {
	storageType string // "local" or "s3"
	basePath    string // Local storage path
	s3Config    *S3Config
}

// S3Config holds S3 configuration
type S3Config struct {
	Bucket    string
	Region    string
	AccessKey string
	SecretKey string
	Endpoint  string // For custom S3-compatible services
}

// NewStorageService creates a new storage service
func NewStorageService(storageType, basePath string, s3Config *S3Config) *StorageService {
	return &StorageService{
		storageType: storageType,
		basePath:    basePath,
		s3Config:    s3Config,
	}
}

// StoreFile stores a file and returns the storage URL and path
func (s *StorageService) StoreFile(file *multipart.FileHeader, tenantID, folder string) (string, string, error) {
	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := s.generateUniqueFilename(tenantID, folder, ext)

	switch s.storageType {
	case "local":
		return s.storeLocal(file, filename)
	case "s3":
		return s.storeS3(file, filename)
	default:
		return "", "", fmt.Errorf("unsupported storage type: %s", s.storageType)
	}
}

// StoreContent stores content directly and returns the storage URL and path
func (s *StorageService) StoreContent(content []byte, tenantID, folder, filename string) (string, string, error) {
	// Generate unique filename if not provided
	if filename == "" {
		ext := ".html"
		filename = s.generateUniqueFilename(tenantID, folder, ext)
	}

	switch s.storageType {
	case "local":
		return s.storeContentLocal(content, filename)
	case "s3":
		return s.storeContentS3(content, filename)
	default:
		return "", "", fmt.Errorf("unsupported storage type: %s", s.storageType)
	}
}

// GetFile retrieves a file from storage
func (s *StorageService) GetFile(path string) (io.ReadCloser, error) {
	switch s.storageType {
	case "local":
		return s.getLocalFile(path)
	case "s3":
		return s.getS3File(path)
	default:
		return nil, fmt.Errorf("unsupported storage type: %s", s.storageType)
	}
}

// DeleteFile deletes a file from storage
func (s *StorageService) DeleteFile(path string) error {
	switch s.storageType {
	case "local":
		return s.deleteLocalFile(path)
	case "s3":
		return s.deleteS3File(path)
	default:
		return fmt.Errorf("unsupported storage type: %s", s.storageType)
	}
}

// GetStorageURL returns the public URL for a stored file
func (s *StorageService) GetStorageURL(path string) string {
	switch s.storageType {
	case "local":
		return fmt.Sprintf("/storage/%s", path)
	case "s3":
		if s.s3Config.Endpoint != "" {
			return fmt.Sprintf("%s/%s/%s", s.s3Config.Endpoint, s.s3Config.Bucket, path)
		}
		return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.s3Config.Bucket, s.s3Config.Region, path)
	default:
		return ""
	}
}

// generateUniqueFilename generates a unique filename
func (s *StorageService) generateUniqueFilename(tenantID, folder, ext string) string {
	timestamp := time.Now().Unix()
	randomBytes := make([]byte, 4)
	rand.Read(randomBytes)
	random := hex.EncodeToString(randomBytes)
	
	if folder != "" {
		return fmt.Sprintf("%s/%s/%d_%s%s", tenantID, folder, timestamp, random, ext)
	}
	return fmt.Sprintf("%s/%d_%s%s", tenantID, timestamp, random, ext)
}

// Local storage methods

func (s *StorageService) storeLocal(file *multipart.FileHeader, filename string) (string, string, error) {
	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return "", "", err
	}
	defer src.Close()

	// Create the directory if it doesn't exist
	fullPath := filepath.Join(s.basePath, filename)
	dir := filepath.Dir(fullPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", "", err
	}

	// Create the file
	dst, err := os.Create(fullPath)
	if err != nil {
		return "", "", err
	}
	defer dst.Close()

	// Copy the file content
	if _, err := io.Copy(dst, src); err != nil {
		return "", "", err
	}

	return s.GetStorageURL(filename), filename, nil
}

func (s *StorageService) storeContentLocal(content []byte, filename string) (string, string, error) {
	// Create the directory if it doesn't exist
	fullPath := filepath.Join(s.basePath, filename)
	dir := filepath.Dir(fullPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", "", err
	}

	// Write the content
	if err := os.WriteFile(fullPath, content, 0644); err != nil {
		return "", "", err
	}

	return s.GetStorageURL(filename), filename, nil
}

func (s *StorageService) getLocalFile(path string) (io.ReadCloser, error) {
	fullPath := filepath.Join(s.basePath, path)
	return os.Open(fullPath)
}

func (s *StorageService) deleteLocalFile(path string) error {
	fullPath := filepath.Join(s.basePath, path)
	return os.Remove(fullPath)
}

// S3 storage methods (placeholder - would use AWS SDK)

func (s *StorageService) storeS3(file *multipart.FileHeader, filename string) (string, string, error) {
	// TODO: Implement S3 storage using AWS SDK
	// For now, fall back to local storage
	return s.storeLocal(file, filename)
}

func (s *StorageService) storeContentS3(content []byte, filename string) (string, string, error) {
	// TODO: Implement S3 storage using AWS SDK
	// For now, fall back to local storage
	return s.storeContentLocal(content, filename)
}

func (s *StorageService) getS3File(path string) (io.ReadCloser, error) {
	// TODO: Implement S3 file retrieval
	return nil, fmt.Errorf("S3 storage not yet implemented")
}

func (s *StorageService) deleteS3File(path string) error {
	// TODO: Implement S3 file deletion
	return fmt.Errorf("S3 storage not yet implemented")
}

// HTMLGenerator generates styled HTML documents
type HTMLGenerator struct{}

// NewHTMLGenerator creates a new HTML generator
func NewHTMLGenerator() *HTMLGenerator {
	return &HTMLGenerator{}
}

// GenerateStyledHTML generates a fully styled HTML document
func (g *HTMLGenerator) GenerateStyledHTML(title, content, templateType string) string {
	styles := g.getDocumentStyles(templateType)
	
	return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>` + title + `</title>
    <style>
        ` + styles + `
    </style>
</head>
<body>
    <div class="document-container">
        <header class="document-header">
            <h1>` + title + `</h1>
            <div class="document-meta">
                <span class="document-date">` + time.Now().Format("02 January 2006") + `</span>
                <span class="document-version">Versi 1.0</span>
            </div>
        </header>
        <main class="document-content">
            ` + content + `
        </main>
        <footer class="document-footer">
            <p>Dokumen ini dihasilkan secara otomatis oleh KOMPL.AI - Platform GRC Terpadu</p>
        </footer>
    </div>
</body>
</html>`
}

// getDocumentStyles returns CSS styles based on document type
func (g *HTMLGenerator) getDocumentStyles(templateType string) string {
	baseStyles := `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .document-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        
        .document-header {
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .document-header h1 {
            color: #0066cc;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .document-meta {
            display: flex;
            gap: 20px;
            color: #666;
            font-size: 14px;
        }
        
        .document-content h2 {
            color: #0066cc;
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 8px;
        }
        
        .document-content h3 {
            color: #333;
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        
        .document-content p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        .document-content ul, .document-content ol {
            margin-bottom: 15px;
            margin-left: 30px;
        }
        
        .document-content li {
            margin-bottom: 8px;
        }
        
        .document-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .document-content th, .document-content td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        .document-content th {
            background-color: #0066cc;
            color: white;
            font-weight: bold;
        }
        
        .document-content tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .document-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .highlight-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        
        .info-box {
            background-color: #d1ecf1;
            border-left: 4px solid #17a2b8;
            padding: 15px;
            margin: 20px 0;
        }
        
        .warning-box {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
        }
        
        .success-box {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
        }
        
        .score-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            color: white;
        }
        
        .score-high {
            background-color: #28a745;
        }
        
        .score-medium {
            background-color: #ffc107;
            color: #333;
        }
        
        .score-low {
            background-color: #dc3545;
        }
    `

	// Add template-specific styles
	switch templateType {
	case "privacy_policy", "data_processing_agreement":
		return baseStyles + `
            .section-number {
                color: #0066cc;
                font-weight: bold;
                margin-right: 10px;
            }
            
            .data-category {
                background-color: #e3f2fd;
                padding: 10px;
                border-radius: 4px;
                margin: 10px 0;
            }
        `
	case "risk_assessment", "vulnerability_report":
		return baseStyles + `
            .risk-matrix {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 5px;
                margin: 20px 0;
            }
            
            .risk-cell {
                padding: 15px;
                text-align: center;
                border-radius: 4px;
                font-weight: bold;
            }
            
            .risk-low {
                background-color: #d4edda;
                color: #155724;
            }
            
            .risk-medium {
                background-color: #fff3cd;
                color: #856404;
            }
            
            .risk-high {
                background-color: #f8d7da;
                color: #721c24;
            }
            
            .risk-critical {
                background-color: #5a1a1a;
                color: white;
            }
        `
	case "compliance_report", "audit_report":
		return baseStyles + `
            .compliance-item {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 15px;
                margin: 15px 0;
            }
            
            .compliance-status {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .status-compliant {
                background-color: #28a745;
                color: white;
            }
            
            .status-non-compliant {
                background-color: #dc3545;
                color: white;
            }
            
            .status-partial {
                background-color: #ffc107;
                color: #333;
            }
        `
	default:
		return baseStyles
	}
}

// FormatContent formats markdown-style content to HTML
func (g *HTMLGenerator) FormatContent(content string) string {
	// Simple markdown to HTML conversion
	lines := strings.Split(content, "\n")
	var html strings.Builder
	inList := false
	inCode := false

	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		
		// Handle code blocks
		if strings.HasPrefix(trimmed, "```") {
			if inCode {
				html.WriteString("</pre></div>")
				inCode = false
			} else {
				html.WriteString(`<div class="code-block"><pre>`)
				inCode = true
			}
			continue
		}

		if inCode {
			html.WriteString(line + "\n")
			continue
		}

		// Handle headers
		if strings.HasPrefix(trimmed, "### ") {
			if inList {
				html.WriteString("</ul>")
				inList = false
			}
			html.WriteString("<h3>" + trimmed[4:] + "</h3>\n")
		} else if strings.HasPrefix(trimmed, "## ") {
			if inList {
				html.WriteString("</ul>")
				inList = false
			}
			html.WriteString("<h2>" + trimmed[3:] + "</h2>\n")
		} else if strings.HasPrefix(trimmed, "# ") {
			if inList {
				html.WriteString("</ul>")
				inList = false
			}
			html.WriteString("<h2>" + trimmed[2:] + "</h2>\n")
		} else if strings.HasPrefix(trimmed, "- ") || strings.HasPrefix(trimmed, "* ") {
			// Handle lists
			if !inList {
				html.WriteString("<ul>")
				inList = true
			}
			html.WriteString("<li>" + trimmed[2:] + "</li>\n")
		} else if matched, _ := regexp.MatchString(`^\d+\.\s`, trimmed); matched {
			// Handle numbered lists
			if !inList {
				html.WriteString("<ol>")
				inList = true
			}
			html.WriteString("<li>" + strings.SplitN(trimmed, ". ", 2)[1] + "</li>\n")
		} else if trimmed == "" {
			// Handle empty lines
			if inList {
				html.WriteString("</ul>")
				inList = false
			}
			html.WriteString("<p></p>\n")
		} else {
			// Handle paragraphs
			if inList {
				html.WriteString("</ul>")
				inList = false
			}
			html.WriteString("<p>" + trimmed + "</p>\n")
		}
	}

	if inList {
		html.WriteString("</ul>")
	}

	return html.String()
}

// GenerateInfographicHTML generates HTML for infographic display
func (g *HTMLGenerator) GenerateInfographicHTML(data string) string {
	return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analisis Infografis</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        
        .infographic-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        
        .infographic-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .infographic-header h1 {
            color: #667eea;
            font-size: 36px;
            margin-bottom: 10px;
        }
        
        .score-circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 48px;
            font-weight: bold;
            color: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .score-high {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }
        
        .score-medium {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
        }
        
        .score-low {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }
        
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 20px;
        }
        
        .chart-container {
            position: relative;
            height: 300px;
            margin: 20px 0;
        }
        
        .finding-item {
            background: white;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        
        .finding-critical {
            border-left-color: #dc3545;
        }
        
        .finding-high {
            border-left-color: #fd7e14;
        }
        
        .finding-medium {
            border-left-color: #ffc107;
        }
        
        .finding-low {
            border-left-color: #28a745;
        }
    </style>
</head>
<body>
    <div class="infographic-container">
        <div class="infographic-header">
            <h1>Analisis Kepatuhan & Risiko</h1>
            <p>Hasil Analisis AI - ` + time.Now().Format("02 January 2006") + `</p>
        </div>
        <div id="infographic-content">
            <!-- Content will be injected here -->
        </div>
    </div>
    <script>
        const analysisData = ` + data + `;
        renderInfographic(analysisData);
        
        function renderInfographic(data) {
            const container = document.getElementById('infographic-content');
            
            // Render score
            let scoreClass = 'score-low';
            if (data.score >= 80) scoreClass = 'score-high';
            else if (data.score >= 50) scoreClass = 'score-medium';
            
            container.innerHTML += '<div class="score-circle ' + scoreClass + '">' + data.score + '%</div>';
            
            // Render summary
            container.innerHTML += '<div class="card"><h3>Ringkasan</h3><p>' + data.summary + '</p></div>';
            
            // Render findings
            if (data.findings && data.findings.length > 0) {
                let findingsHtml = '<div class="card"><h3>Temuan (' + data.findings.length + ')</h3>';
                data.findings.forEach(function(f) {
                    var severity = f.severity || 'medium';
                    var title = f.title || f.category || 'Temuan';
                    var content = f.description || f.content;
                    findingsHtml += '<div class="finding-item finding-' + severity + '"><strong>' + title + '</strong><p>' + content + '</p></div>';
                });
                findingsHtml += '</div>';
                container.innerHTML += findingsHtml;
            }
            
            // Render charts
            if (data.charts) {
                data.charts.forEach(function(chart, index) {
                    container.innerHTML += '<div class="card"><h3>' + chart.title + '</h3><div class="chart-container"><canvas id="chart-' + index + '"></canvas></div></div>';
                    
                    setTimeout(function() {
                        new Chart(document.getElementById('chart-' + index), {
                            type: chart.type || 'bar',
                            data: chart.data,
                            options: {
                                responsive: true,
                                maintainAspectRatio: false
                            }
                        });
                    }, 100);
                });
            }
        }
    </script>
</body>
</html>`
}
