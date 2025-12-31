import { useState, useCallback } from 'react';
import { ValidationRules, ValidationErrors, validateField, validateForm, hasErrors } from '@/lib/validation';

interface UseFormValidationProps<T> {
  initialValues: T;
  validationRules: ValidationRules;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormValidationProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name as string]) {
      const error = validateField(name as string, value, validationRules);
      setErrors((prev) => ({ ...prev, [name as string]: error }));
    }
  }, [validationRules, touched]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validateField(name as string, values[name as string], validationRules);
    setErrors((prev) => ({ ...prev, [name as string]: error }));
  }, [values, validationRules]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Validate all fields
    const newErrors = validateForm(values as Record<string, string>, validationRules);
    setErrors(newErrors);
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    Object.keys(validationRules).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Check if there are errors
    if (hasErrors(newErrors)) {
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = !hasErrors(errors);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
