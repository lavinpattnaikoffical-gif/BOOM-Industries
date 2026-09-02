export interface CategoryMeta {
  name: string;
  icon: string;
  subtitle: string;
  color: string;
}

export const KNOWN_CATEGORY_METADATA: Record<string, { icon: string; subtitle: string; color: string }> = {
  Rockets: {
    icon: '🚀',
    subtitle: 'High-burst sky rockets & aerial shots',
    color: '#ef4444',
  },
  Sparklers: {
    icon: '✨',
    subtitle: 'Golden, silver & rainbow dazzling sparklers',
    color: '#f5b800',
  },
  Fountains: {
    icon: '⛲',
    subtitle: 'Ground flower pots & colorful shower fountains',
    color: '#10b981',
  },
  Crackers: {
    icon: '💥',
    subtitle: 'Classic sound crackers & celebration rolls',
    color: '#f97316',
  },
  'Aerial Shells': {
    icon: '🎆',
    subtitle: 'Spectacular multi-shot night sky displays',
    color: '#8b5cf6',
  },
  Chakkar: {
    icon: '🌀',
    subtitle: 'Ground spinning chakkars & zamin chakras',
    color: '#06b6d4',
  },
  'Combo Packs': {
    icon: '🌟',
    subtitle: 'All-in-one family & party celebration bundles',
    color: '#ec4899',
  },
  'Gift Boxes': {
    icon: '🎁',
    subtitle: 'Premium festive gift boxes & assortments',
    color: '#e11d48',
  },
};

export function getCategoryMeta(categoryName: string): CategoryMeta {
  if (KNOWN_CATEGORY_METADATA[categoryName]) {
    return {
      name: categoryName,
      ...KNOWN_CATEGORY_METADATA[categoryName],
    };
  }

  // Graceful fallback for custom categories added in admin
  return {
    name: categoryName,
    icon: '🎇',
    subtitle: 'Handpicked pyrotechnic variety',
    color: '#f5b800',
  };
}
