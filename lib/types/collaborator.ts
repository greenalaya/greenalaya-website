export type Collaborator = {
  id: string;
  name: string;
  slug: string;
  position: string | null;
  bio: string | null;
  photo_url: string | null;
  website_url?: string | null;
  logo_caption?: string | null;
};
