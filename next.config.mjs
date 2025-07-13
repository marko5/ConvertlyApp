/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static HTML export for Capacitor
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: If you need to handle i18n with static export,
  // you might need to adjust how locales are handled or use a custom server.
  // For basic static export, the current i18n setup might need adjustments
  // if you rely on Next.js's built-in i18n routing for static files.
  // However, the middleware handles the redirection for dynamic paths.
};

export default nextConfig;
