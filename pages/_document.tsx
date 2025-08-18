import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/assets/font/CentraNo2-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/font/CentraNo2-Medium.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/font/CentraNo2-Book.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
  {/* SEO Meta Tags */}
  <title>Mayur Dhavan | Web Developer Portfolio & Modern Web Projects</title>
  <meta name="description" content="Showcasing Mayur Dhavan’s skills as a web developer. Explore React, Next.js, UI/UX projects, and hire for modern website solutions." />
  <meta name="keywords" content="web developer, portfolio, React, Next.js, JavaScript, UI/UX, frontend, backend, full stack, hire web developer, modern websites, Mayur Dhavan" />
        
        {/* Add any additional head elements here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
