import { getPosts, savePosts } from "@/lib/db";
import { NextResponse } from 'next/server';
import { createPostSchema } from '@/lib/validation';

export async function GET() {
    try {
        const posts = await getPosts();

        const safePosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));

        return NextResponse.json(safePosts);
    } catch (error) {
        console.error('Ошибка при получении постов:', error);

        return NextResponse.json(
            {
                error: 'Не удалось загрузить посты',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const validationResult = createPostSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Неверные данные',
                    details: validationResult.error.issues
                },
                { status: 400 }
            )
        }

        const { title, content } = validationResult.data;

        const posts = await getPosts()
        const newPost = {
            id: Date.now().toString(),
            title,
            content,
            authorId: '1', // заглушка
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        posts.push(newPost)
        await savePosts(posts)

        return NextResponse.json(
            {
                success: true,
                postId: newPost.id,
                message: 'Пост успешно создан'
            },
            { status: 200 }
        )


    } catch {
        return NextResponse.json(
            { error: 'Не удалось создать пост' },
            { status: 500 }
        );
    }
}