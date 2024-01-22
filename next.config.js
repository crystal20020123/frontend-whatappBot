/** @type {import('next').NextConfig} */
module.exports = {
  distDir: 'dist',
  output: 'export',
  webpack: (config) => {
    config.resolve.fallback = { net: false, tls: false, fs: false };

    return config;
  },
};
