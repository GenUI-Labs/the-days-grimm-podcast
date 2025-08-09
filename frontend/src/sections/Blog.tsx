import { motion } from 'framer-motion'

const Blog: React.FC = () => {
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

        {/*
          Blog feed disabled for now. When ready, fetch and render posts here
          (e.g., from a subreddit or external source), replacing the message below.

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="card overflow-hidden flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-dark-lighter to-dark-light flex items-center justify-center">
                  <post.icon size={48} className="text-primary" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-text-secondary mb-4 leading-relaxed flex-1">{post.description}</p>
                  <div className="flex justify-between text-text-muted text-sm mt-auto">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        */}

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
      </div>
    </section>
  )
}

export default Blog 