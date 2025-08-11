import { motion } from 'framer-motion'
import { hosts } from '../data/content'

const Hosts: React.FC = () => {
  return (
    <section id="hosts" className="section bg-dark-medium">
      <div className="container">
        <h2
          className="text-4xl font-bold text-center mb-12"
        >
          Meet Your Hosts
        </h2>
        
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {hosts.map((host, index) => (
              <div
                key={host.name}
                className="card p-8 flex flex-col items-center text-center"
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden mb-6 mx-auto">
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
                              <div className="flex flex-wrap gap-2 mt-auto justify-center">
                  {host.traits.map((trait) => (
                    <span key={trait} className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full border border-primary/30">
                      {trait}
                    </span>
                  ))}
                </div>
            </div>
          ))}
        </div>
        
          <div className="card p-8 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Together</h3>
          <p className="text-text-secondary leading-relaxed text-lg">
            Brian and Thomas are passionate about "the come-up story"—how people start, how they fight through adversity, and what keeps them going. Their interviews highlight the raw, the real, and the inspiring—always ending with takeaways that listeners can apply to their own grind.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hosts 