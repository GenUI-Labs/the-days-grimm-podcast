import { motion } from 'framer-motion'
import { Play, Mic } from 'lucide-react'

interface HeroProps {
  scrollToSection: (sectionId: string) => void
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-dark to-dark-light pt-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold mb-6 relative bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              The Days Grimm Podcast
            </motion.h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Exploring the darker side of life, one episode at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => scrollToSection('episodes')}
                className="btn btn-primary"
              >
                <Play size={20} />
                Listen Now
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="btn btn-secondary"
              >
                Learn More
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-80 h-80 bg-gradient-to-br from-dark-light to-dark-lighter rounded-3xl flex items-center justify-center shadow-2xl shadow-black/30">
              <Mic size={80} className="text-primary" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero 