import z from 'zod';

export const passwordSchema = z
  .string()
  .min(6, 'Минимум 6 символов')
  .regex(/[A-Z]/, 'Минимум одна большая буква')
  .regex(/[0-9]/, 'Минимум одна цифра');
