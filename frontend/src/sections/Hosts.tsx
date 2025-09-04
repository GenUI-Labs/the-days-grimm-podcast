import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { hosts } from '../data/content'

const Hosts: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })

  return (
    <section id="hosts" className="section bg-dark-medium" ref={ref}>
      <div className="container">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Meet Your Hosts
        </motion.h2>
        
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {hosts.map((host, index) => (
              <motion.div
                key={host.name}
                className="bg-dark/50 backdrop-blur-sm rounded-2xl border border-dark-border/50 p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 hover:bg-dark/60"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.2 }}
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden mb-6 mx-auto">
                  {isInView && (
                    <picture>
                      <source 
                        srcSet={host.name === 'Brian' ? '/Brian_Day.webp' : '/Thomas_Grimm.webp'} 
                        type="image/webp" 
                      />
                      <img 
                        src={host.name === 'Brian' ? '/Brian_Day.jpg' : '/Thomas_Grimm.jpg'} 
                        alt={`${host.name} profile`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </picture>
                  )}
                </div>
              <h3 className="text-2xl font-bold mb-2">{host.name}</h3>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">{host.title}</p>
              <p className="text-text-secondary mb-4 leading-relaxed">{host.description}</p>
              <p className="text-text-secondary mb-6 leading-relaxed">{host.bio}</p>
                              <div className="flex flex-wrap gap-2 mt-auto justify-center">
                  {host.traits.map((trait) => (
                    <span key={trait} className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full border border-primary/30">
                      {trait}
                    </span>
                  ))}
                </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="bg-dark/50 backdrop-blur-sm rounded-2xl border border-dark-border/50 p-8 max-w-4xl mx-auto text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 hover:bg-dark/60"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-4">Together</h3>
          <p className="text-text-secondary leading-relaxed text-lg">
            Brian and Thomas are passionate about "the come-up story"—how people start, how they fight through adversity, and what keeps them going. Their interviews highlight the raw, the real, and the inspiring—always ending with takeaways that listeners can apply to their own grind.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hosts 