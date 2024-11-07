/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
    experimental:{
        serverActions: true,
    }
}

// next.config.js
module.exports = {
    webpack: (config) => {
      config.resolve.fallback = { fs: false };
      return config;
    },
  };
  