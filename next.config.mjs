/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent duplicate API calls in development
  experimental: {
    serverComponentsExternalPackages: ['@huggingface/inference'],
  },
};

export default nextConfig;
