interface FooterProps {
  scrollToSection: (sectionId: string) => void
}

const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  return (
    <footer className="bg-dark border-t border-dark-border py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">The Days Grimm</h3>
            <p className="text-text-secondary leading-relaxed">
              Exploring the darker side of life, one episode at a time.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['about', 'episodes', 'blog', 'contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className="text-text-secondary hover:text-primary transition-colors duration-300 capitalize"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Listen On</h4>
            <ul className="space-y-2">
              <li><a href="https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors duration-300">Spotify</a></li>
              <li><a href="https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors duration-300">Apple Podcasts</a></li>
              <li><a href="https://www.youtube.com/c/TheDaysGrimm" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors duration-300">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-dark-border text-text-muted">
          <p>&copy; 2025 The Days Grimm Podcast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 