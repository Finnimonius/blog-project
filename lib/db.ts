import { promises as fs } from 'fs';
import path from 'path';
import { User, BlogPost } from '@/types';

const dbDir = path.join(process.cwd(), 'data');
const usersPath = path.join(dbDir, 'users.json');
const postsPath = path.join(dbDir, 'posts.json');

async function initDb() {
    try {
        await fs.access(dbDir)
    } catch {
        await fs.mkdir(dbDir, { recursive: true })
    }
}

export async function getUser(): Promise<User[]> {
    await initDb();
    try {
        const data = await fs.readFile(usersPath, 'utf-8')
        return JSON.parse(data)
    } catch {
        return [];
    }
}

export async function saveUsers(users: User[]): Promise<void> {
    await initDb()

    const jsonData = JSON.stringify(users, null, 2);

    await fs.writeFile(usersPath, jsonData, 'utf-8');
    console.log('Пользователи сохранены в users.json');
}

export async function getPosts(): Promise<BlogPost[]> {
    await initDb()
    try {
        const data = await fs.readFile(postsPath, 'utf-8')
        return JSON.parse(data)
    } catch {
        return []
    }
}

export async function savePosts(posts: BlogPost[]): Promise<void> {
    await initDb();
    const jsonData = JSON.stringify(posts, null, 2);
    await fs.writeFile(postsPath, jsonData, 'utf-8');
}