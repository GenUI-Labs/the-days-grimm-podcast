import { motion } from 'framer-motion'
import { Play, Youtube, Music, Smartphone } from 'lucide-react'
import { episodes } from '../data/content'

const Episodes: React.FC = () => {
  const featuredEpisode = episodes.find(ep => ep.featured)
  const recentEpisodes = episodes.filter(ep => !ep.featured).slice(0, 3)

  return (
    <section id="episodes" className="section bg-dark">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Episodes
        </motion.h2>

        {/* Latest Episode */}
        {featuredEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8 max-w-4xl mx-auto mb-16"
          >
            <h3 className="text-2xl font-bold mb-4">
              {featuredEpisode.number} {featuredEpisode.title}
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">{featuredEpisode.description}</p>
            <div className="flex flex-wrap gap-4 text-text-muted text-sm mb-6">
              <span>{featuredEpisode.date}</span>
              <span>{featuredEpisode.duration}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button className="btn btn-primary">
                <Play size={20} />
                Play Episode
              </button>
              <div className="flex gap-3">
                <a href="https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <Music size={20} />
                </a>
                <a href="https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <Smartphone size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Recent Episodes */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Recent Episodes
        </motion.h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentEpisodes.map((episode, index) => (
            <motion.div
              key={episode.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6 relative"
            >
              <div className="absolute -top-3 left-6 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                {episode.number}
              </div>
              <h3 className="text-xl font-bold mb-4 mt-4">{episode.title}</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">{episode.description}</p>
              <div className="flex justify-between text-text-muted text-sm mb-4">
                <span>{episode.date}</span>
                <span>{episode.duration}</span>
              </div>
              <div className="flex justify-end">
                <a 
                  href="https://www.youtube.com/c/TheDaysGrimm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn bg-gradient-to-r from-red-600 to-red-700 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/30"
                >
                  <Youtube size={16} />
                  Watch Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button className="btn btn-outline">View All Episodes</button>
        </motion.div>
      </div>
    </section>
  )
}

export default Episodes 