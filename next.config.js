// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'abs.twimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'jespervang.dk',
        pathname: '/**'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  webpack: (config) => {
    // Enable Webpack 5
    config.resolve.fallback = { fs: false, path: false, os: false };

    return config;
  }
});
