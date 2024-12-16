/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        // hostname: "picsum.photos",
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig 