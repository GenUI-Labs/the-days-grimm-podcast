import { motion } from 'framer-motion'
import { blogPosts } from '../data/content'

const Blog: React.FC = () => {
  return (
    <section id="blog" className="section bg-dark-medium">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Latest Blog Posts
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-dark-lighter to-dark-light flex items-center justify-center">
                <post.icon size={48} className="text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                <p className="text-text-secondary mb-4 leading-relaxed">{post.description}</p>
                <div className="flex justify-between text-text-muted text-sm">
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