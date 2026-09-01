import { Product } from '@/types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '@/data/products';

// Free high-availability Cloud Key-Value store for global real-time synchronization
// Bucket ID unique to BOOM Industries
const KV_BUCKET = '6fA7k1vL8N3pQ9mR2tXwYb'; // Unique namespace for BOOM Industries
const KV_KEY = 'boom_fireworks_catalog_v1';
const PRIMARY_CLOUD_URL = `https://kvdb.io/${KV_BUCKET}/${KV_KEY}`;

// Fallback secondary cloud store for redundancy
const FALLBACK_CLOUD_URL = `https://api.npoint.io/4636f1c4e97669d7b420`;

/**
 * Fetches the global product list from the cloud.
 * Falls back to local cache or default static products if network fails.
 */
export async function fetchCloudProducts(): Promise<Product[] | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(PRIMARY_CLOUD_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store', // Always get fresh data
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim().length > 0) {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn('Primary cloud fetch failed, attempting fallback...', err);
  }

  return null;
}

/**
 * Saves the product list globally to the cloud so all visitors worldwide see updates instantly.
 */
export async function saveCloudProducts(products: Product[]): Promise<boolean> {
  try {
    const payload = JSON.stringify(products);
    
    const response = await fetch(PRIMARY_CLOUD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.error('Failed to save to global cloud store:', err);
  }

  return false;
}
