export interface Episode {
  id: string;
  number: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  thumbnail: string;
  viewCount: string;
  featured: boolean;
  youtubeUrl: string;
  spotifyUrl: string | null;
  applePodcastUrl: string | null;
}

export interface EpisodesResponse {
  episodes: Episode[];
}

export const fetchEpisodes = async (): Promise<Episode[]> => {
  try {
    const response = await fetch('/api/episodes');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw new Error('Failed to fetch episodes');
  }
};

export const fetchEpisodesHealth = async () => {
  try {
    const response = await fetch('/api/episodes/health');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching episodes health:', error);
    throw new Error('Failed to fetch episodes health');
  }
};
