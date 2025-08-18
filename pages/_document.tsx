import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="VHAZhone4QByDd9WcwAdyE1lORGFoaS0jj7uYVHW9ik" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://mayur-dhavan.netlify.app/" />
        
        {/* Icons and Manifest */}
        <link rel="icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/webmanifest.json" />
        
        {/* Theme and SEO */}
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Mayur Dhavan's portfolio showcasing expertise in web development, including projects, skills, and professional experience at Radon Media." />
        <meta name="keywords" content="Mayur Dhavan, Web Developer, Portfolio, Radon Media, HTML, CSS, JavaScript, React, WordPress, Shopify" />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Person",
            "name": "Mayur Dhavan",
            "url": "https://mayur-dhavan.netlify.app/",
            "image": "https://mayur-dhavan.web.app/static/media/MyIMG.8cef0c8b9c83a163c17e.jpg",
            "sameAs": [
              "https://www.instagram.com/mayur_dhavan_",
              "https://www.linkedin.com/in/mayur-dhavan-50902922b/",
              "https://github.com/mayur-dhavan"
            ],
            "jobTitle": "Web Developer Associate",
            "worksFor": {
              "@type": "Organization",
              "name": "Radon Media"
            }
          })
        }} />
        
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-539JNTMP');`
        }} />
        
        {/* Microsoft Clarity */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "nyemha78nu");`
        }} />
        
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
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-539JNTMP"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
