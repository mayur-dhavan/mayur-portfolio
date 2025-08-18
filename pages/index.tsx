import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

// Server-side rendered components (main content - good for SEO)
const NavBar = dynamic(() => import('../src/components/NavBar').then(mod => ({ default: mod.NavBar })))
const Banner = dynamic(() => import('../src/components/Banner').then(mod => ({ default: mod.Banner })))
const Skills = dynamic(() => import('../src/components/Skills').then(mod => ({ default: mod.Skills })))
const Projects = dynamic(() => import('../src/components/Projects').then(mod => ({ default: mod.Projects })))
const AboutSection = dynamic(() => import('../src/components/AboutSection').then(mod => ({ default: mod.AboutSection })))
const Contact = dynamic(() => import('../src/components/Contact').then(mod => ({ default: mod.Contact })))
const Footer = dynamic(() => import('../src/components/Footer').then(mod => ({ default: mod.Footer })))

// Client-side only (for WebGL/Canvas components that need browser APIs)
const FluidWebGLBackground = dynamic(() => import('../src/components/FluidWebGLBackground'), { ssr: false })
const GalaxyBackground = dynamic(() => import('../src/components/GalaxyBackground').then(mod => ({ default: mod.default })), { ssr: false })

const Home: NextPage = () => {
  return (
    <div className="App">
      <GalaxyBackground />
      <FluidWebGLBackground />
      <div className="app-content">
        <NavBar />
        <Banner />
        <Skills />
        <AboutSection />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default Home
