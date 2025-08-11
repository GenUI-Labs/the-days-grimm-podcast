import { motion } from 'framer-motion'
import { Youtube, Music, Smartphone, Instagram, Facebook, Twitter } from 'lucide-react'

const Contact: React.FC = () => {
  const socialLinks = [
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/c/TheDaysGrimm' },
    { icon: Music, label: 'Spotify', href: 'https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18' },
    { icon: Smartphone, label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/thedaysgrimmpodcast/' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/thedaysgrimm/' },
    { icon: Twitter, label: 'X (Twitter)', href: 'https://twitter.com/thedaysgrimm' }
  ]

  return (
    <section id="contact" className="section bg-dark">
      <div className="container">
        <h2
          className="text-4xl font-bold text-center mb-12"
        >
          Connect With Us
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto text-center">
          {socialLinks.map((social, index) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 sm:p-6 flex items-center justify-center gap-3 sm:gap-4 h-16 sm:h-20"
            >
              <social.icon size={24} className="text-primary" />
              <span className="font-medium">{social.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact 