/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Static export required by Capacitor (iOS/Android).
   * `next export` produces a fully-static `out/` directory.
   * Note: this disables SSR — all data fetching must be client-side.
   */
  output: "export",

  /**
   * Disable the default image optimisation API endpoint (not available
   * in static export). Images must use `unoptimized` or a CDN loader.
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
