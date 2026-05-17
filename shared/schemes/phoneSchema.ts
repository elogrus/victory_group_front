import z from 'zod';

export const phoneSchema = z
  .string()
  .regex(
    /^\+[1-9]\d{1,14}$/,
    'Номер должен быть в международном формате (например: +71234567890)'
  );
