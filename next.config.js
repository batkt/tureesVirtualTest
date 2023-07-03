module.exports = {
  output: "standalone",
  serverRuntimeConfig: {
    HTTP_URL: process.env.HTTP_URL || "http://103.143.40.43:8081", // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    URL: process.env.URL || "https://turees.zevtabs.mn/api",
    SOCKET: process.env.SOCKET || "https://turees.zevtabs.mn",
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/hicarapi/:path*",
          destination: "http://hicar.zevtabs.mn:8080/:path*",
        },
      ],
    };
  },
};
