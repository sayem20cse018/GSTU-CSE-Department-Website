import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash (placeholder images during development)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Add your CDN/S3/Cloudinary domains here when ready:
      // { protocol: 'https', hostname: 'res.cloudinary.com' },
      // { protocol: 'https', hostname: 'your-s3-bucket.s3.amazonaws.com' },
    ],
  },
};

export default nextConfig;
