'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-gray-800 border-gray-700 text-white placeholder-gray-500 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
      />
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface FormTextAreaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function FormTextArea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
}: FormTextAreaProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
      />
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  error,
  options,
  required = false,
  disabled = false,
  className = '',
}: FormSelectProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
