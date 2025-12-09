/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  turbopack: {},

  env: {
    NEXT_PUBLIC_URL:
      process.env.NEXT_PUBLIC_URL || "https://turees.zevtabs.mn/api",
    NEXT_PUBLIC_SOCKET:
      process.env.NEXT_PUBLIC_SOCKET || "https://turees.zevtabs.mn",
    HTTP_URL: process.env.HTTP_URL || "http://103.143.40.230:8081",
  },

  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "suneditor/src/lang": false,
    };
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
