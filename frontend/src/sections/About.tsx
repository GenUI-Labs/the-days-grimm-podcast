import { motion } from 'framer-motion'
import { stats } from '../data/content'

const About: React.FC = () => {
  return (
    <section id="about" className="section bg-dark-medium">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-12 items-center text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <h2 className="text-4xl font-bold mb-6">About The Days Grimm</h2>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border-l-4 border-primary mb-6">
              <p className="text-lg italic text-primary font-medium text-center">
                "Brought to you by Sadness & ADHD (non-medicated)"
              </p>
            </div>
            <p className="text-text-secondary mb-4 leading-relaxed">
              The Days Grimm is arguably Indiana's most comical, thrilling, and controversial podcast. This three-pronged mandate acts as a primary filter for our guest selection.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">
              The <strong className="text-primary">"comical"</strong> aspect is reflected in our official genre of "COMEDY INTERVIEWS" and our history of hosting local stand-up comedians. The <strong className="text-primary">"thrilling"</strong> component is evident in interviews with individuals who have extraordinary life stories, such as people who survived shootings, rare medical conditions, and combat.
            </p>
            <p className="text-text-secondary mb-4 leading-relaxed">
              Finally, the <strong className="text-primary">"controversial"</strong> element is demonstrated by Brian & Thomas' willingness to engage in difficult or unfiltered conversations, touching on topics like homelessness, artificial intelligence, and religious hypotheticals.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Our brand is not built on polished narratives but on the authentic, often messy, intersection of hardship and humor. The most compelling guests are those who have navigated a "Grimm" reality and emerged with a story to tell, and ideally, a sense of humor about it. This dynamic is the core of our appeal and the primary filter for identifying a story worth telling.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-6"
          >
            {stats.map((stat) => (
               <motion.div
                  key={stat.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="card p-6 text-center"
                >
                <h3 className="text-3xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-text-secondary font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About 