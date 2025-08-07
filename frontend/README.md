# The Days Grimm Podcast - React Website

A modern, responsive React website for "The Days Grimm Podcast" built with Vite, React, Tailwind CSS, and Framer Motion. This project converts the original static HTML/CSS/JS website into a modern React application while preserving all animations, themes, and content.

## 🚀 Features

- **Modern React Architecture**: Built with Vite for fast development and optimized builds
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Framer Motion**: Smooth animations and transitions throughout the site
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Dark Theme**: Preserved the original dark color scheme with red accents
- **Interactive Elements**: Hover effects, smooth scrolling, and animated components
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Progress Bar**: Visual scroll progress indicator
- **SEO Optimized**: Meta tags and semantic HTML structure

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thedaysgrimm-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Design System

### Colors
- **Primary**: `#ff6b6b` (Red accent)
- **Dark Background**: `#0a0a0a` (Very dark)
- **Secondary Background**: `#111111`, `#1a1a1a`, `#2a2a2a`
- **Text**: `#ffffff` (White), `#cccccc` (Light gray), `#888888` (Muted)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Gradient backgrounds with hover effects
- **Navigation**: Fixed header with backdrop blur
- **Sections**: Alternating dark backgrounds

## 📱 Sections

1. **Hero Section**: Eye-catching introduction with podcast branding
2. **Latest Episode**: Featured episode with play button and platform links
3. **About**: Information about the podcast with statistics
4. **Hosts**: Meet Brian and Thomas with their backgrounds
5. **Episodes**: Grid of recent episodes with episode numbers
6. **Blog**: Latest blog posts with icons and metadata
7. **Contact**: Social media links and platform connections
8. **Footer**: Quick links and additional information

## 🔧 Customization

### Adding New Episodes
Edit the episodes array in `src/App.jsx`:

```jsx
{
  number: '#224',
  title: 'New Episode Title',
  description: 'Episode description...',
  date: 'August 1, 2025',
  duration: '90 min'
}
```

### Adding New Blog Posts
Edit the blog posts array in `src/App.jsx`:

```jsx
{
  icon: Brain,
  title: 'New Blog Post',
  description: 'Blog post description...',
  date: 'Dec 15, 2024',
  readTime: '6 min read'
}
```

### Updating Social Links
Edit the social links array in the Contact section:

```jsx
{
  icon: Instagram,
  label: 'Instagram',
  href: 'https://your-instagram-url'
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server

## 📈 Performance Features

- **Code Splitting**: Automatic with Vite
- **Optimized Images**: Use WebP format when possible
- **Lazy Loading**: Components load as needed
- **Minified CSS/JS**: Production builds are optimized
- **Fast Refresh**: Hot module replacement in development

## 🔮 Future Enhancements

- **Database Integration**: Add a backend for dynamic content
- **CMS Integration**: Content management system for episodes and blog posts
- **Podcast Player**: Embedded audio player
- **Search Functionality**: Episode and blog search
- **Newsletter Signup**: Email subscription system
- **Comment System**: Blog post comments
- **Analytics**: Google Analytics integration
- **PWA**: Progressive Web App features
- **API Routes**: Backend API for dynamic data

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   npm run dev -- --port 3001
   ```

2. **Build errors**
   ```bash
   npm run build -- --debug
   ```

3. **Tailwind not working**
   - Ensure `tailwind.config.js` is in the root directory
   - Check that `@tailwind` directives are in `src/index.css`

## 📄 License

This project is for The Days Grimm Podcast. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please reach out through the social media links on the website.

---

**The Days Grimm Podcast** - Exploring the darker side of life, one episode at a time.
