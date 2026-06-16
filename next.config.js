/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'www.geonixa.com',
            },
            {
                protocol: 'https',
                hostname: 'wallup.net',
            },
            {
                protocol: 'https',
                hostname: 'cdn.pixabay.com',
            },
        ],
    },
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.join(__dirname),
        };
        return config;
    },
    experimental: {
        serverComponentsExternalPackages: ['pdf-parse'],
    },
};

module.exports = nextConfig;