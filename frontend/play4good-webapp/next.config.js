/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bootdey.com',
                pathname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
