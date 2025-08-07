import { motion } from 'framer-motion'
import { Youtube, Music, Smartphone, Instagram, Facebook } from 'lucide-react'

const Contact: React.FC = () => {
  const socialLinks = [
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/c/TheDaysGrimm' },
    { icon: Music, label: 'Spotify', href: 'https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18' },
    { icon: Smartphone, label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/thedaysgrimmpodcast/' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/thedaysgrimm/' }
  ]

  return (
    <section id="contact" className="section bg-dark">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Connect With Us
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300"
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