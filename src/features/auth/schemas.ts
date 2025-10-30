import { z } from 'zod';

export const emailSchema = z.string().email({ message: 'Invalid email address.' });

export const passwordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters long.' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number.' });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const signUpSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: emailSchema,
  password: passwordSchema,
});
