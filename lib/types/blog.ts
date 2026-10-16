export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  author?: string;
  author_url?: string;
  author_role?: string;
  source_url?: string;
};
