import { Product } from '@/types';

const REPO_OWNER = 'lavinpattnaikoffical-gif';
const REPO_NAME = 'BOOM-Industries';
const FILE_PATH = 'src/data/products.ts';
const TOKEN_STORAGE_KEY = 'boom_github_token_v1';

export function getStoredGitHubToken(): string {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

export function setStoredGitHubToken(token: string): void {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

/**
 * Commits the updated products catalog directly to the GitHub repository.
 * Vercel will automatically detect the commit and deploy live globally within ~15 seconds.
 */
export async function publishProductsToGitHub(
  products: Product[],
  token: string
): Promise<{ success: boolean; message: string }> {
  if (!token || !token.trim()) {
    return {
      success: false,
      message: 'GitHub Personal Access Token is required to publish globally.',
    };
  }

  const cleanToken = token.trim();
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  try {
    // Step 1: Get the current file's SHA
    let sha: string | undefined;
    try {
      const getRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }
    } catch (e) {
      console.warn('Could not retrieve current file SHA:', e);
    }

    // Step 2: Format the TypeScript file content
    const fileContent = `import { Product } from '@/types';\n\n// Static product catalog\nexport const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};\n`;

    // Step 3: Base64 encode the content (UTF-8 safe)
    const base64Content = btoa(
      encodeURIComponent(fileContent).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );

    // Step 4: Commit the file to GitHub via REST API
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `feat(catalog): update products catalog (${products.length} items) via Product Manager`,
        content: base64Content,
        sha: sha, // Required if file already exists
        branch: 'main',
      }),
    });

    if (putRes.ok) {
      // Save token for convenience
      setStoredGitHubToken(cleanToken);
      return {
        success: true,
        message: 'Successfully published to GitHub! Vercel is now deploying your changes live worldwide 🚀',
      };
    } else {
      const errorData = await putRes.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `GitHub returned error code ${putRes.status}`,
      };
    }
  } catch (err: any) {
    console.error('GitHub Sync Error:', err);
    return {
      success: false,
      message: err.message || 'Network error while connecting to GitHub.',
    };
  }
}
