export interface RedditBlogPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  createdUtc: number;
  author: string;
  flair: string | null;
  thumbnail: string | null;
}

export interface RedditBlogResponse {
  posts: RedditBlogPost[];
  error?: string;
  message?: string;
}

export const fetchRedditBlogPosts = async (limit = 6): Promise<RedditBlogPost[]> => {
  const response = await fetch(`/api/blog/reddit?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: RedditBlogResponse = await response.json();
  return data.posts || [];
};


