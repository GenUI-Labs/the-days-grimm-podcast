import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeroProps {
  scrollToSection: (sectionId: string) => void
}

const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    // Preload videos
    const video1 = document.createElement('video')
    const video2 = document.createElement('video')
    
    video1.src = '/hero.mp4'
    video2.src = '/hero-mobile.mp4'
    
    let loadedCount = 0
    const handleLoad = () => {
      loadedCount++
      if (loadedCount === 2) {
        setVideoLoaded(true)
      }
    }
    
    video1.addEventListener('loadeddata', handleLoad)
    video2.addEventListener('loadeddata', handleLoad)
    
    video1.load()
    video2.load()
    
    return () => {
      video1.removeEventListener('loadeddata', handleLoad)
      video2.removeEventListener('loadeddata', handleLoad)
    }
  }, [])

  return (
    <section id="home" className="relative min-h-[80vh] sm:min-h-screen flex items-center bg-dark pt-16 sm:pt-20 overflow-hidden">
      {/* Background video - only show when loaded */}
      {videoLoaded && (
        <>
          {/* Desktop/Tablet background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover hidden sm:block"
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/og-image.jpg"
          />

          {/* Mobile background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover sm:hidden pointer-events-none"
            src="/hero-mobile.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/og-image.jpg"
          />
        </>
      )}
      
      {/* Loading background while video loads */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-dark" />
      )}
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 relative bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              The Days Grimm Podcast
            </motion.h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-6 sm:mb-8 leading-relaxed">
              Exploring the darker side of life, one episode at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => scrollToSection('episodes')}
                className="btn btn-primary w-full sm:w-auto justify-center"
              >
                <Play size={18} className="sm:hidden" />
                <Play size={20} className="hidden sm:inline" />
                Listen Now
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="btn btn-secondary w-full sm:w-auto justify-center"
              >
                Learn More
              </button>
            </div>
          </motion.div>
          
          {/* Right column intentionally removed to allow full-bleed video background */}
        </div>
      </div>
    </section>
  )
}

export default Hero 