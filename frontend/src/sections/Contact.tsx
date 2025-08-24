import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Youtube, Music, Smartphone, Instagram, Facebook, Twitter } from 'lucide-react'

const Contact: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const socialLinks = [
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/c/TheDaysGrimm' },
    { icon: Music, label: 'Spotify', href: 'https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18' },
    { icon: Smartphone, label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/thedaysgrimmpodcast/' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/thedaysgrimm/' },
    { icon: Twitter, label: 'X (Twitter)', href: 'https://twitter.com/thedaysgrimm' }
  ]

  return (
    <section id="contact" className="section bg-dark" ref={ref}>
      <div className="container">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Connect With Us
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto text-center">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 sm:p-6 flex items-center justify-center gap-3 sm:gap-4 h-16 sm:h-20 hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <social.icon size={24} className="text-primary" />
              <span className="font-medium">{social.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact 