import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Youtube, Music, Smartphone } from 'lucide-react'
import { fetchEpisodes, type Episode } from '../services/episodes'

const Episodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const data = await fetchEpisodes()
        if (isMounted) {
          setEpisodes(data)
          setLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Failed to load episodes')
          setLoading(false)
        }
      }
    })()
    return () => { isMounted = false }
  }, [])

  const featuredEpisode = episodes.find(ep => ep.featured)
  const recentEpisodes = episodes.filter(ep => !ep.featured).slice(0, 3)

  return (
    <section id="episodes" className="section bg-dark">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-4xl font-bold text-center mb-12"
        >
          Upcoming
        </motion.h2>

        {/* Latest Episode */}
        {loading && (
          <div className="card p-8 max-w-4xl mx-auto mb-16 text-center text-text-muted">Loading latest episode…</div>
        )}
        {error && (
          <div className="card p-8 max-w-4xl mx-auto mb-16 text-center text-red-400">{error}</div>
        )}
        {featuredEpisode && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="card p-8 max-w-4xl mx-auto mb-16"
          >
            {/* Title moved above image with gradient styling */}
            <div className="mb-4 sm:mb-6 text-center ">
              <h4 className="text-2xl sm:text-3xl font-extrabold ">
                {featuredEpisode.number} {featuredEpisode.title}
              </h4>
            </div>

            <div
              className="w-full h-48 sm:h-64 rounded-xl mb-4 sm:mb-6 overflow-hidden bg-dark-lighter"
              style={{
                backgroundImage: featuredEpisode.thumbnail ? `url(${featuredEpisode.thumbnail})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            <div className="flex flex-wrap gap-3 sm:gap-4 text-text-muted text-sm mb-3 sm:mb-4">
              <span>{featuredEpisode.date}</span>
              <span>{(featuredEpisode as any).isUpcoming ? 'Upcoming' : featuredEpisode.duration}</span>
            </div>
            <p className="text-text-secondary mb-5 sm:mb-6 leading-relaxed">{featuredEpisode.description}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
              {(featuredEpisode as any).isUpcoming ? (
                <a href={featuredEpisode.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Notify Me
                </a>
              ) : (
                <a href={featuredEpisode.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <Play size={20} />
                  Play Episode
                </a>
              )}
              <a
                href="https://www.youtube.com/c/TheDaysGrimm?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-gradient-to-r from-red-600 to-red-700 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/30"
              >
                <Youtube size={16} />
                Subscribe
              </a>
            </div>
          </motion.div>
        )}
        
        {/* Recent Episodes */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="text-3xl font-bold text-center mb-8"
        >
          Recent Episodes
        </motion.h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {recentEpisodes.map((episode, index) => (
            <motion.div
              key={episode.id || `${episode.title}-${index}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="card p-6 relative overflow-hidden flex flex-col"
            >
              {/* Episode number badge intentionally removed per request */}
              <div
                className="w-full h-40 sm:h-48 rounded-lg mb-3 sm:mb-4 flex items-center justify-center bg-dark-lighter"
                style={{
                  backgroundImage: episode.thumbnail ? `url(${episode.thumbnail})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="flex justify-between text-text-muted text-xs sm:text-sm mb-2 sm:mb-3">
                <span>{episode.date}</span>
                <span>{episode.duration}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{episode.title}</h3>
              <p className="text-text-secondary mb-3 sm:mb-4 leading-relaxed">{episode.description}</p>
              <div className="flex items-center justify-center gap-3 mt-auto">
                <a
                  href={episode.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-gradient-to-r from-red-600 to-red-700 text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/30"
                >
                  <Youtube size={16} />
                  Watch Now
                </a>
                {episode.spotifyUrl && (
                  <a
                    href={episode.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                    aria-label="Listen on Spotify"
                  >
                    <Music size={20} />
                  </a>
                )}
                {episode.applePodcastUrl && (
                  <a
                    href={episode.applePodcastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                    aria-label="Listen on Apple Podcasts"
                  >
                    <Smartphone size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
         <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.35, ease: 'easeOut' }}
           className="text-center"
         >
           <a 
             href="https://www.youtube.com/c/TheDaysGrimm" 
             target="_blank" 
             rel="noopener noreferrer"
             className="btn btn-outline"
           >
             See More Episodes
           </a>
         </motion.div>
      </div>
    </section>
  )
}

export default Episodes 