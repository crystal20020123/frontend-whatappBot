/** @type {import('next').NextConfig} */
module.exports = { webpack5: true,
    webpack: (config) => {
      config.resolve.fallback = {net:false, tls: false , fs:false};
  
      return config;
    },
  };
