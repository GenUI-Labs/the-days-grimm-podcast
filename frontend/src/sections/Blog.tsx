import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { fetchRedditBlogPosts, type RedditBlogPost } from '../services/blog'

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<RedditBlogPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const data = await fetchRedditBlogPosts(6)
        if (isMounted) {
          setPosts(data)
          setLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to load blog posts')
          setLoading(false)
        }
      }
    })()
    return () => { isMounted = false }
  }, [])

  return (
    <section id="blog" className="section bg-dark-medium">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-4xl font-bold text-center mb-12"
        >
          Blog
        </motion.h2>

        {loading && (
          <div className="card p-8 max-w-2xl mx-auto text-center text-text-muted">Loading blog posts…</div>
        )}
        {error && (
          <div className="card p-8 max-w-2xl mx-auto text-center text-red-400">{error}</div>
        )}

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="card overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-dark-lighter to-dark-light flex items-center justify-center">
                  <span className="text-4xl">📰</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-text-secondary mb-4 leading-relaxed flex-1">
                    {post.selftext ? `${post.selftext.slice(0, 200)}${post.selftext.length > 200 ? '…' : ''}` : 'Read more on Reddit'}
                  </p>
                  <div className="flex justify-between items-center text-text-muted text-sm mt-auto">
                    <span>{new Date(post.createdUtc * 1000).toLocaleDateString()}</span>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Read on Reddit
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="card p-8 max-w-2xl mx-auto text-center"
            >
              <p className="text-lg text-text-secondary">
                Blog coming soon. We’ll be publishing on our community and pulling posts in here.
              </p>
            </motion.div>
          )
        )}
      </div>
    </section>
  )
}

export default Blog 