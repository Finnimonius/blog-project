type BlogPost = {
    id: string,
    title: string,
    content: string,
    createdAt: string,
    updatedAt: string
}


export default async function BlogPage() {
    const response = await fetch('http://localhost:3000/api/posts', {
        next: { revalidate: 60 }
    })

    if (!response.ok) {
        return <div>Не удалось загрузить посты</div>
    }

    const posts: BlogPost[] = await response.json()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Блог</h1>

            {posts.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                    Пока нет постов. Будь первым!
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                            <p className="text-gray-600 mb-4">
                                {post.content.length > 150
                                    ? `${post.content.substring(0, 150)}...`
                                    : post.content}
                            </p>
                            <div className="text-sm text-gray-400">
                                Создано: {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
