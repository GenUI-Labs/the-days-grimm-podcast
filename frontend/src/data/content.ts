import React from 'react'
import { 
  Play, 
  Youtube, 
  Instagram, 
  Facebook, 
  Music, 
  Smartphone,
  Mic,
  User,
  Camera,
  Ghost,
  Brain
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'

export interface Episode {
  number: string
  title: string
  description: string
  date: string
  duration: string
  featured: boolean
}

export interface BlogPost {
  icon: React.ComponentType<LucideProps>
  title: string
  description: string
  date: string
  readTime: string
}

export interface Host {
  name: string
  title: string
  icon: React.ComponentType<LucideProps>
  description: string
  bio: string
  traits: string[]
}

export interface Stat {
  number: string
  label: string
}

export interface SocialLink {
  icon: React.ComponentType<LucideProps>
  label: string
  href: string
}

export interface PodcastLink {
  label: string
  href: string
}

export const episodes: Episode[] = [
  {
    number: '#224',
    title: 'Shahzaib Raza - Versatility in Acting',
    description: 'Tune in for TDG sitting down and chatting with Local Actor, Shahzaib Raza! We talk about how he got into the performative arts, how he applies for roles for films across the nation and how he juggles the difficulty of memorizing lines while running a successful business and attending Medical School!',
    date: 'July 29, 2025',
    duration: '88 min',
    featured: true
  },
  {
    number: '#223',
    title: 'Mike Farley - Back From Filming in Cali',
    description: 'Join TDG as they sit down with long time fan and friend MIKE FARLEY! We take time to talk about his journey to Cali and all the filming he did out there. Also, we talk about the building hype of behind Mike\'s full-length horror film, THE SLAB!',
    date: 'July 26, 2025',
    duration: '96 min',
    featured: false
  },
  {
    number: '#222',
    title: 'Jeremiah Galey - Bad Randy\'s News!',
    description: 'They boys got the scoop on some Bad Randy\'s tea and decided to have JEREMIAH GALEY stop in and tell everyone first hand. Word on the streets is, you ain\'t going to want to miss this pod.',
    date: 'July 15, 2025',
    duration: '87 min',
    featured: false
  },
  {
    number: '#221',
    title: 'Brian & Thom - The 4th & AI',
    description: 'If you\'re patriotic and love the future, you won\'t want to miss Brian & Thom recapping the holiday and talking about AI. We also talk about how fireworks, especially mortars are not meant to be lit on your head.',
    date: 'July 8, 2025',
    duration: '62 min',
    featured: false
  }
]

export const blogPosts: BlogPost[] = [
  {
    icon: Ghost,
    title: 'The Evolution of Horror in Media',
    description: 'How horror has evolved from simple jump scares to psychological terror that lingers long after the credits roll.',
    date: 'Dec 10, 2024',
    readTime: '5 min read'
  },
  {
    icon: Brain,
    title: 'Why We\'re Obsessed with True Crime',
    description: 'The psychological reasons behind our fascination with true crime stories and what they reveal about society.',
    date: 'Dec 5, 2024',
    readTime: '7 min read'
  }
]

export const hosts: Host[] = [
  {
    name: 'Thomas',
    title: 'Creative Director & Jewelry Artist',
    icon: Camera,
    description: 'Thomas is the creative force behind The Anomalist Company and Anomalist Studios, where he dives into photography, video production, and storytelling. By day, he\'s also a skilled jeweler.',
    bio: 'Thomas brings a laid-back, introspective energy to the show—always curious, always evolving. A student of self-development, he\'s recently jumped into the world of fitness with the goal of completing a triathlon next year. He\'s all about digging deep, learning lessons, and pushing limits.',
    traits: ['Creative Director', 'Jewelry Artist', 'Introspective']
  },
  {
    name: 'Brian',
    title: 'Army Infantry Veteran & Quality/Lean Manager',
    icon: User,
    description: 'Brian is an Army Infantry veteran who served a tour in Afghanistan, bringing a no-nonsense attitude and disciplined mindset to the mic. With a degree in Exercise and Sport Science from the University of Evansville, he lives and breathes physical activity.',
    bio: 'Loud, lovable, and never afraid to speak his mind, Brian also works as a Quality/Lean Manager—constantly focused on growth, precision, and improvement. Whether it\'s fitness, failure, or the fire that drives someone forward, Brian\'s energy fuels every episode.',
    traits: ['Army Veteran', 'Fitness Expert', 'No-Nonsense']
  }
]

export const stats: Stat[] = [
  { number: '224+', label: 'Episodes' },
  { number: '50K+', label: 'Listeners' },
  { number: '4.8★', label: 'Rating' }
]

export const socialLinks: SocialLink[] = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/thedaysgrimmpodcast/' },
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/thedaysgrimm/' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/c/TheDaysGrimm' },
  { icon: Music, label: 'Spotify', href: 'https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18' },
  { icon: Smartphone, label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797' }
]

export const podcastLinks: PodcastLink[] = [
  { label: 'Spotify', href: 'https://open.spotify.com/show/3JLH1IVdjohOrAOoXTsk18' },
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/the-days-grimm-podcast/id1545803797' },
  { label: 'YouTube', href: 'https://www.youtube.com/c/TheDaysGrimm' }
] 