export interface User {
    id: string, 
    email: string,
    password: string,
    name?: string,
    createdAt: Date
}

export interface BlogPost {
    id: string,
    title: string,
    content: string,
    authorId: string,
    createdAt: Date,
    updatedAt: Date
}

export interface Session {
    userId: string,
    expires: Date
}