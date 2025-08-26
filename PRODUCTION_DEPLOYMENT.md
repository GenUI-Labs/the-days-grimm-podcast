# 🚀 Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Required Assets (You Need to Create)**
- [ ] **Favicon files**: Generate from your logo
  - `favicon.svg` (main favicon)
  - `favicon-16x16.png`
  - `favicon-32x32.png` 
  - `apple-touch-icon.png` (180x180)
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`
- [ ] **Social media image**: `og-image.jpg` (1200x630px)
- [ ] **Logo**: `logo.png` for structured data
- [ ] **Update domain**: Replace `thedaysgrimmpodcast.com` in files
- [ ] **Update sitemap**: Add actual domain in `sitemap.xml`

### ✅ **GitHub Setup**
- [ ] **Update `.github/dependabot.yml`**: Replace `your-github-username`
- [ ] **Enable Dependabot**: Go to GitHub repo → Security tab → Enable
- [ ] **Enable GitHub Actions**: Should auto-enable when files are pushed

## 🌐 DNS Configuration

### **Required DNS Records**
```
Type    Name            Value                       TTL
A       @               76.76.19.19                 300
A       www             76.76.19.19                 300
CNAME   *.yourdomain    cname.vercel-dns.com        300
```

### **Vercel Custom Domain Setup**
1. **Add domain in Vercel**:
   - Go to Project → Settings → Domains
   - Add `yourdomain.com` and `www.yourdomain.com`

2. **SSL Certificate**:
   - Vercel auto-generates Let's Encrypt certificates
   - Wait 24-48 hours for full propagation

## 🚀 Vercel Deployment

### **Environment Variables** (Add in Vercel Dashboard)
```bash
# Production Environment Variables
NODE_ENV=production
PRINTFUL_API_KEY=your_actual_api_key_here
VITE_APP_URL=https://yourdomain.com
```

### **Deployment Commands**
```bash
# Build Command (Vercel uses this automatically)
npm run build:prod

# Install Command  
npm run install:all

# Output Directory
frontend/dist
```

## 🔧 Performance Optimization

### **Image Optimization** (TODO)
You should optimize your current images:
```bash
# Install image optimization tools
npm install -g @squoosh/cli

# Optimize existing images
squoosh --webp --mozjpeg '{}' frontend/public/*.jpg
squoosh --webp --oxipng '{}' frontend/public/*.png
```

### **Video Optimization** (TODO)
Your hero videos are large. Consider:
```bash
# Compress videos
ffmpeg -i hero.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k hero-compressed.mp4
```

## 📊 Monitoring & Analytics

### **1. Lighthouse CI** (Auto-runs on PRs)
- Performance target: 85+
- Accessibility target: 90+
- SEO target: 90+

### **2. Uptime Monitoring** (Recommended)
Add these services:
- **UptimeRobot** (free): Basic uptime monitoring
- **Vercel Analytics** (built-in): Core web vitals
- **Google Search Console**: SEO monitoring

### **3. Error Monitoring** (Optional)
```bash
npm install @sentry/react @sentry/vite-plugin
```

## 🔒 Security Checklist

### ✅ **Implemented**
- [x] **Security headers** via `vercel.json`
- [x] **CSP (Content Security Policy)**
- [x] **HSTS (Strict Transport Security)**
- [x] **XSS Protection**
- [x] **Dependency scanning** via GitHub Actions

### ⚠️ **Additional Recommendations**
- [ ] **Environment secrets audit**: Never commit API keys
- [ ] **Regular dependency updates**: Monitor Dependabot PRs
- [ ] **Security audit**: Run `npm audit` monthly

## 📈 SEO Post-Deployment

### **1. Submit to Search Engines**
```bash
# Google Search Console
https://search.google.com/search-console

# Bing Webmaster Tools  
https://www.bing.com/webmasters

# Submit sitemap
https://yourdomain.com/sitemap.xml
```

### **2. Verify Structured Data**
Test at: https://search.google.com/test/rich-results

### **3. Social Media Validation**
- **Facebook**: https://developers.facebook.com/tools/debug/
- **Twitter**: https://cards-dev.twitter.com/validator
- **LinkedIn**: https://www.linkedin.com/post-inspector/

## 🚨 Common Issues & Solutions

### **Build Failures**
```bash
# Clear all caches
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json  
rm -rf backend/node_modules backend/package-lock.json
npm run install:all
```

### **Environment Variable Issues**
- Vite variables must start with `VITE_`
- Backend variables don't need `VITE_` prefix
- Restart dev server after .env changes

### **Routing Issues on Vercel**
- SPA routing handled by `vercel.json` 
- All non-API routes redirect to `index.html`

## 📱 Post-Launch Testing

### **Manual Testing Checklist**
- [ ] **Homepage loads** on desktop/mobile
- [ ] **Navigation works** between pages
- [ ] **Shop page shows** "Coming Soon"
- [ ] **Social links work** in Contact section
- [ ] **Videos play** on hero section
- [ ] **Site is responsive** on all screen sizes

### **Automated Testing**
```bash
# Run Lighthouse locally
npm run lighthouse

# Test in multiple browsers
npx playwright test
```

## 🎯 Performance Targets

### **Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1

### **Lighthouse Scores**
- **Performance**: 85+ 
- **Accessibility**: 90+
- **Best Practices**: 85+
- **SEO**: 90+

## 🔄 Maintenance Schedule

### **Weekly**
- [ ] Review Dependabot PRs
- [ ] Check Vercel deployment logs
- [ ] Monitor Core Web Vitals

### **Monthly** 
- [ ] Run security audit
- [ ] Review Google Search Console
- [ ] Check uptime statistics
- [ ] Update content/images as needed

### **Quarterly**
- [ ] Full SEO audit
- [ ] Performance optimization review
- [ ] Security penetration test (if needed)

---

## 🆘 Emergency Contacts

**Production Issues**:
1. Check Vercel dashboard first
2. Review GitHub Actions logs
3. Check DNS propagation: https://dnschecker.org

**Quick Rollback**:
```bash
# In Vercel dashboard
Deployments → Previous deployment → Promote to Production
```
