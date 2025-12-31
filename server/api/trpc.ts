import { initTRPC } from "@trpc/server";
import superjson from 'superjson';
import { success, ZodError } from 'zod';
import { z } from "zod";

export const createTRPCContext = async (opts: {headers: Headers}) => {
    return {
        ...opts
    }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({shape, error}) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.issues : null
            }
        }
    }
})

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const testShema = z.object({
    name: z.string().min(2, 'Имя слишком короткое'),
    age: z.number().min(18, 'Возраст должен быть от 18 лет'),
    email: z.email('Некорректный email')
})

export type TestData = z.infer<typeof testShema>

export const testRouter = createTRPCRouter({
    hello: publicProcedure.query(() => {
        return { message: 'Hello from TRPC!'}
    }),

    validateTest: publicProcedure
    .input(testShema)
    .mutation(({input}) => {
        return {
            success: true,
            data: input,
            message: `Привет, ${input.name}! Твой email: ${input.email}`
        }
    })
})

