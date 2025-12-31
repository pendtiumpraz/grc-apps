// Simple form validation utilities
// Not too strict, just basic checks

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string | null;
}

export const validateField = (name: string, value: string, rules: ValidationRules): string | null => {
  const rule = rules[name];
  if (!rule) return null;

  // Required check
  if (rule.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }

  // Skip other validations if empty (unless required)
  if (!value || value.trim() === '') {
    return null;
  }

  // Min length
  if (rule.minLength && value.length < rule.minLength) {
    return `Minimum ${rule.minLength} characters`;
  }

  // Max length
  if (rule.maxLength && value.length > rule.maxLength) {
    return `Maximum ${rule.maxLength} characters`;
  }

  // Pattern
  if (rule.pattern && !rule.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
};

export const validateForm = (data: Record<string, string>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  Object.keys(rules).forEach(key => {
    errors[key] = validateField(key, data[key] || '', rules);
  });
  
  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some(error => error !== null);
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^https?:\/\/.+/,
  number: /^\d+$/,
  decimal: /^\d+\.?\d*$/,
};

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: patterns.email,
  },
  password: {
    required: true,
    minLength: 8,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  description: {
    required: false,
    maxLength: 500,
  },
  url: {
    required: false,
    pattern: patterns.url,
  },
  phone: {
    required: false,
    pattern: patterns.phone,
  },
};
