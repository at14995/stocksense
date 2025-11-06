'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  className?: string;
};

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={cn('block text-sm text-gray-300 mb-1', error && 'text-destructive')}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn("w-full px-4 py-2.5 bg-[#191C29] border border-gray-700/60 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition", error && 'border-destructive')}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
