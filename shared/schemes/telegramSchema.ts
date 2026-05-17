import z from 'zod';

export const telegramSchema = z
  .string()
  .min(5, 'Минимум 5 символов')
  .max(32, 'Максимум 32 символа')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Может содержать только буквы, цифры и нижнее подчеркивание'
  );
