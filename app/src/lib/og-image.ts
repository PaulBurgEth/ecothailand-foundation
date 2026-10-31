import { readFile } from 'node:fs/promises';
import path from 'node:path';

// OG images are rendered at build time (static export), so read assets from disk
// instead of fetching them from the live domain.
export async function publicImageDataUri(publicPath: string): Promise<string> {
    const file = await readFile(path.join(process.cwd(), 'public', publicPath));
    const mime = publicPath.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg';
    return `data:${mime};base64,${file.toString('base64')}`;
}
