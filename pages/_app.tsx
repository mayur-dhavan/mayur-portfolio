import { AppProps } from 'next/app'
import Head from 'next/head'
import '../src/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css'
import '../styles/tailwind.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Mayur Dhavan's portfolio showcasing expertise in web development, including projects, skills, and professional experience at Radon Media." />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <title>Mayur Dhavan - Full Stack Web Developer Portfolio</title>
        
        {/* SEO Meta Tags */}
        <meta name="keywords" content="web developer, full stack developer, react developer, portfolio, mayur dhavan" />
        <meta name="author" content="Mayur Dhavan" />
        <meta property="og:title" content="Mayur Dhavan - Full Stack Web Developer" />
        <meta property="og:description" content="Professional web developer specializing in React, Node.js, and modern web technologies" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mayur-portfolio.vercel.app" />
        <meta property="og:image" content="/main-logo.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mayur Dhavan - Full Stack Web Developer" />
        <meta name="twitter:description" content="Professional web developer specializing in React, Node.js, and modern web technologies" />
        <meta name="twitter:image" content="/main-logo.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
