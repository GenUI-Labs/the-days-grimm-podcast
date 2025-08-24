import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { stats } from '../data/content'

const About: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="section bg-dark-medium" ref={ref}>
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-12 items-center text-center lg:text-left">
          <div className="lg:col-span-2">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              About The Days Grimm
            </motion.h2>
            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border-l-4 border-primary mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg italic text-primary font-medium text-center">
                "Brought to you by Sadness & ADHD (non-medicated)"
              </p>
            </motion.div>
            <motion.p 
              className="text-text-secondary mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              The Days Grimm is arguably Indiana's most comical, thrilling, and controversial podcast. This three-pronged mandate acts as a primary filter for our guest selection.
            </motion.p>
            <motion.p 
              className="text-text-secondary mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The <strong className="text-primary">"comical"</strong> aspect is reflected in our official genre of "COMEDY INTERVIEWS" and our history of hosting local stand-up comedians. The <strong className="text-primary">"thrilling"</strong> component is evident in interviews with individuals who have extraordinary life stories, such as people who survived shootings, rare medical conditions, and combat.
            </motion.p>
            <motion.p 
              className="text-text-secondary mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Finally, the <strong className="text-primary">"controversial"</strong> element is demonstrated by Brian & Thomas' willingness to engage in difficult or unfiltered conversations, touching on topics like homelessness, artificial intelligence, and religious hypotheticals.
            </motion.p>
            <motion.p 
              className="text-text-secondary leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Our brand is not built on polished narratives but on the authentic, often messy, intersection of hardship and humor. The most compelling guests are those who have navigated a "Grimm" reality and emerged with a story to tell, and ideally, a sense of humor about it. This dynamic is the core of our appeal and the primary filter for identifying a story worth telling.
            </motion.p>
          </div>
          
          <div className="space-y-6">
            {stats.map((stat, index) => (
               <motion.div
                  key={stat.label}
                  className="card p-6 text-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                <h3 className="text-3xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-text-secondary font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About 