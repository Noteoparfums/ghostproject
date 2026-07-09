import { useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import { z } from 'zod';
import { ApiError } from '../api/client';

interface UseFormOptions<T extends Record<string, any>> {
  schema: z.ZodObject<any> | z.ZodEffects<any>;
  initial: T;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  schema,
  initial,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validateField = useCallback((field: keyof T, val: any) => {
    // If it's a refined effect, parse the whole object instead
    let result;
    if (schema instanceof z.ZodEffects) {
      result = schema.safeParse({ ...values, [field]: val });
    } else {
      // Pick the field schema
      const fieldSchema = schema.shape[field as string];
      if (!fieldSchema) return;
      result = fieldSchema.safeParse(val);
    }

    if (!result.success) {
      // Find the issue corresponding to this field
      const issue = result.error.issues.find((i: any) => i.path.includes(field as string));
      if (issue) {
        setErrors((prev) => ({ ...prev, [field]: issue.message }));
        return;
      }
    }
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, [schema, values]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  }, [values, validateField]);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof T, string>> = {};
      const newTouched: Partial<Record<keyof T, boolean>> = {};
      
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof T;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });

      // Mark all fields as touched
      Object.keys(values).forEach((k) => {
        newTouched[k as keyof T] = true;
      });

      setErrors(fieldErrors);
      setTouched(newTouched);
      setSubmitting(false);

      // Focus first invalid field
      const firstInvalidField = result.error.issues[0]?.path[0] as string;
      if (firstInvalidField) {
        const el = document.getElementById(firstInvalidField) || document.getElementsByName(firstInvalidField)[0];
        if (el) (el as HTMLElement).focus();
      }
      return;
    }

    try {
      setErrors({});
      await onSubmit(values);
    } catch (err: any) {
      if (err instanceof ApiError && err.code === 'VALIDATION_ERROR' && err.details) {
        // Zod flat validation errors returned from server as { [field]: message }
        const details = err.details as Record<string, string>;
        const mergedErrors: Partial<Record<keyof T, string>> = {};
        Object.entries(details).forEach(([k, v]) => {
          mergedErrors[k as keyof T] = v;
        });
        setErrors(mergedErrors);

        // Focus first field with server error
        const firstErrField = Object.keys(details)[0];
        if (firstErrField) {
          const el = document.getElementById(firstErrField) || document.getElementsByName(firstErrField)[0];
          if (el) (el as HTMLElement).focus();
        }
      } else {
        // Bubble other errors up or set generic error
        throw err;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    submitting,
    setValue,
    handleBlur,
    handleSubmit,
    setErrors,
  };
}
export default useForm;
