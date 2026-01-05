/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  turbopack: {},

  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental optimizations
  experimental: {
    optimizeCss: process.env.NODE_ENV === 'production',
  },

  // env: {
  //   NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || "https://turees.zevtabs.mn/api",
  //   NEXT_PUBLIC_SOCKET: process.env.NEXT_PUBLIC_SOCKET || "https://turees.zevtabs.mn",
  //   HTTP_URL: process.env.HTTP_URL || "http://103.143.40.230:8081",
  // },

  env: {
    NEXT_PUBLIC_URL: "http://103.143.40.175:8081",
    NEXT_PUBLIC_SOCKET: "http://103.143.40.175:8081",
    HTTP_URL: "http://103.143.40.175:8081",
  },

  webpack: (config, { isServer, dev }) => {
    // Optimize bundle splitting
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for node_modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Separate chunk for Ant Design
          antd: {
            name: 'antd',
            test: /[\\/]node_modules[\\/](antd|@ant-design|rc-)[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          // Separate chunk for Chart.js
          charts: {
            name: 'charts',
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            chunks: 'all',
            priority: 25,
          },
          // Separate chunk for heavy libraries
          heavy: {
            name: 'heavy',
            test: /[\\/]node_modules[\\/](suneditor|plotly\.js|react-plotly|konva|react-konva|lodash)[\\/]/,
            chunks: 'all',
            priority: 25,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Alias optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      "suneditor/src/lang": false,
    };

    // Provide a stub for react-plotly.js on the server (browser-only library)
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "react-plotly.js": require.resolve('./lib/react-plotly-stub.js'),
      };
    }

    return config;
  },

  transpilePackages: [
    "suneditor",
    "suneditor-react",
    "antd",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-table",
    "rc-tree",
    "rc-tooltip",
    "rc-menu",
    "rc-motion",
    "rc-dropdown",
    "rc-notification",
  ],
};

module.exports = nextConfig;
