import { motion } from 'framer-motion'
import { hosts } from '../data/content'

const Hosts: React.FC = () => {
  return (
    <section id="hosts" className="section bg-dark-medium">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Meet Your Hosts
        </motion.h2>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {hosts.map((host, index) => (
                          <motion.div
                key={host.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-8 flex flex-col"
              >
                              <div className="w-32 h-32 rounded-xl overflow-hidden mb-6">
                  <img 
                    src={host.name === 'Brian' ? '/Brian_Day.jpg' : '/Thomas_Grimm.jpg'} 
                    alt={`${host.name} profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              <h3 className="text-2xl font-bold mb-2">{host.name}</h3>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-4">{host.title}</p>
              <p className="text-text-secondary mb-4 leading-relaxed">{host.description}</p>
              <p className="text-text-secondary mb-6 leading-relaxed">{host.bio}</p>
                              <div className="flex flex-wrap gap-2 mt-auto">
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-8 max-w-4xl mx-auto text-center"
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