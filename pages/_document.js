import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="mn">
      <Head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://turees.zevtabs.mn" />
        <link rel="dns-prefetch" href="https://turees.zevtabs.mn" />
        
        {/* Meta tags for SEO and performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Resource hints - Next.js handles automatic preloading */}
      </Head>
      <body className="h-screen w-screen overflow-x-hidden bg-white text-black dark:bg-black dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
