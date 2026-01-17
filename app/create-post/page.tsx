'use client'
import { useState } from 'react'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import { createPostSchema } from '@/lib/validation'

export default function CreatePostPage() {
    const [postTitle, setPostTitle] = useState('')
    const [postText, setPostText] = useState('')
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setError('')
        setData(null)

        const validationResult = createPostSchema.safeParse({
            title: postTitle,
            content: postText
        })

        if (!validationResult.success) {
            const errorMessages = validationResult.error.issues.map(issue => {
                const fieldName = issue.path[0] === 'title' ? 'Заголовок' : 'Содержание'
                return `${fieldName}: ${issue.message}`
            })

            setError(errorMessages.join('. '))
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: postTitle,
                    content: postText
                })
            })

            if (!response.ok) {
                throw new Error('Ошибка создания поста')
            }

            const data = await response.json()
            setData(data)
            setPostTitle('')
            setPostText('')

            setTimeout(() => {
                router.push('/blog')
            }, 1000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.box}>
                    <h1 className={styles.title}>Создать пост</h1>
                    <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
                        <div className={styles['form__block']}>
                            <label className={'form__label'}>Заголовок поста</label>
                            <input value={postTitle} type="text" className={styles['form__input']} onChange={(e) => setPostTitle(e.target.value)} disabled={isLoading} />
                            <div className={styles.counter}>
                                Символов: {postTitle.length}/3 {postTitle.length < 3 ? '❌' : '✅'}
                            </div>
                        </div>
                        <div className={styles['form__block']}>
                            <label>Содержание</label>
                            <textarea value={postText} className={styles['form__textarea']} onChange={(e) => setPostText(e.target.value)} disabled={isLoading}></textarea>
                            <div className={styles.counter}>
                                Символов: {postText.length}/10 {postText.length < 10 ? '❌' : '✅'}
                            </div>
                        </div>

                        {error && (
                            <div>
                                Ошибка: {error}
                            </div>
                        )}

                        {data && (
                            <div>Пост успешно создан</div>
                        )}

                        <button type='submit' className={styles['form__button']} disabled={isLoading}>
                            {isLoading ? 'Создание поста' : 'Сохранить'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}