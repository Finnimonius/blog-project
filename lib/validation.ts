import { z } from 'zod';

export const registerSсhema = z.object({
    email: z.email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
    name: z.string().min(2, 'Имя должно быть минимум 2 символа').optional(),
});

export const loginSсhema = z.object({
    email: z.email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
})

export const createPostSchema = z.object({
  title: z.string().min(3, 'Заголовок слишком короткий').max(200, 'Заголовок слишком длинный'),
  content: z.string().min(10, 'Содержание слишком короткое'),
});


export type RegisterInput = z.infer<typeof registerSсhema>;
export type LoginInput = z.infer<typeof loginSсhema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;