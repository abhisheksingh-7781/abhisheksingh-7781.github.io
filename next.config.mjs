/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * Static export for GitHub Pages.
   * The whole site prerenders to HTML, so there is no Node server to run.
   * Output lands in ./out and is published by .github/workflows/deploy.yml.
   */
  output: 'export',

  /**
   * Served from https://abhisheksingh-7781.github.io (a user site), so the app
   * lives at the domain root and needs no basePath. If this ever moves to a
   * project repo, set basePath and assetPrefix to '/<repo-name>'.
   */

  images: {
    // GitHub Pages has no image optimiser, so next/image must serve as-is.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Emit /path/index.html rather than /path.html, so directory URLs resolve.
  trailingSlash: true,
};

export default nextConfig;
