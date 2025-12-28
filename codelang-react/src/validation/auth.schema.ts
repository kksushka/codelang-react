import { z } from 'zod'

const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and "_" allowed')

const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password must be at most 50 characters')

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

export const registerSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
