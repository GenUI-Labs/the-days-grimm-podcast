import { motion } from 'framer-motion'
import { blogPosts } from '../data/content'

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
          Latest Blog Posts
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
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
      </div>
    </section>
  )
}

export default Blog 