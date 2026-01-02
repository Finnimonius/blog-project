import { promises as fs } from 'fs';
import path from 'path';
import { User, BlogPost } from '@/types';

const dbDir = path.join(process.cwd(), 'data');
const userPath = path.join(dbDir, 'user.json');
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
        const data = await fs.readFile(userPath, 'utf-8')
        return JSON.parse(data)
    } catch {
        return [];
    }
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
  await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
}