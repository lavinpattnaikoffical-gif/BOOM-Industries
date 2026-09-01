/**
 * Utility to convert Google Drive share links into direct, high-speed CDN image URLs.
 * 
 * Works with all standard Google Drive link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 */
export function formatGoogleDriveUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If it's already a data URL (Base64) or regular web URL (Unsplash, Cloudinary, etc.)
  if (!trimmed.includes('drive.google.com') && !trimmed.includes('docs.google.com') && !trimmed.includes('googleusercontent.com')) {
    return trimmed;
  }

  // Extract the Google Drive file ID
  const fileIdMatch = 
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    // Google's high-speed direct CDN endpoint for public Drive files:
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

/**
 * Validates whether a URL looks like a Google Drive link
 */
export function isGoogleDriveUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
