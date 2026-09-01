// Static gallery data — edit this file and redeploy to update gallery items

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  category: 'product' | 'event' | 'behind-scenes';
  src: string;
  thumbnail?: string;
  videoId?: string;
  videoPlatform?: 'youtube' | 'instagram';
  description?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'r1',
    type: 'video',
    title: 'Grand Night Display',
    category: 'event',
    videoPlatform: 'instagram',
    videoId: 'DFxGzH2v8XG',
    src: '',
    thumbnail: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop',
    description: 'A spectacular night show captured on Instagram.',
  },
  {
    id: 'r2',
    type: 'video',
    title: 'Wedding Celebration',
    category: 'event',
    videoPlatform: 'instagram',
    videoId: 'DJeiciQP2Ws',
    src: '',
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    description: 'Adding magic to weddings.',
  },
  {
    id: 'r3',
    type: 'video',
    title: 'Festival Burst',
    category: 'event',
    videoPlatform: 'instagram',
    videoId: 'DLPg3xoPvfq',
    src: '',
    thumbnail: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&h=600&fit=crop',
    description: 'Festivals lit up with Boom Industries.',
  },
  {
    id: 'r4',
    type: 'video',
    title: 'Aerial Spectacle',
    category: 'event',
    videoPlatform: 'instagram',
    videoId: 'DLDHg5PPSRH',
    src: '',
    thumbnail: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop',
    description: 'Stunning aerial firework displays.',
  },
  {
    id: 'r5',
    type: 'video',
    title: 'Corporate Launch',
    category: 'event',
    videoPlatform: 'instagram',
    videoId: 'DEbTU23BlPX',
    src: '',
    thumbnail: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop',
    description: 'Perfect for grand openings.',
  },
  {
    id: 'r6',
    type: 'video',
    title: 'Boom Highlights',
    category: 'event',
    videoPlatform: 'instagram',
    videoId: 'C3vVA2rC8n_',
    src: '',
    thumbnail: 'https://images.unsplash.com/photo-1496024840928-4c41702d51f7?w=800&h=600&fit=crop',
    description: 'Capturing the best moments.',
  },
  {
    id: '1',
    type: 'image',
    title: 'Grand Sky Display',
    category: 'event',
    src: 'https://images.unsplash.com/photo-1518617330791-e5e2b7f1ee3b?w=800&h=600&fit=crop',
    description: 'A spectacular sky show from one of our major events.',
  },
  {
    id: '4',
    type: 'image',
    title: 'Premium Multi-Shot',
    category: 'product',
    src: 'https://images.unsplash.com/photo-1531697897236-8a8d5b6bae38?w=800&h=600&fit=crop',
    description: 'Our high-end multi-shot aerial displays in action.',
  },
];
