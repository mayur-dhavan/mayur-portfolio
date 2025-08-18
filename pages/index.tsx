import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

// Dynamic imports for client-side only components
const NavBar = dynamic(() => import('../src/components/NavBar').then(mod => ({ default: mod.NavBar })), { ssr: false })
const Banner = dynamic(() => import('../src/components/Banner').then(mod => ({ default: mod.Banner })), { ssr: false })
const Skills = dynamic(() => import('../src/components/Skills').then(mod => ({ default: mod.Skills })), { ssr: false })
const Projects = dynamic(() => import('../src/components/Projects').then(mod => ({ default: mod.Projects })), { ssr: false })
const AboutSection = dynamic(() => import('../src/components/AboutSection').then(mod => ({ default: mod.AboutSection })), { ssr: false })
const Contact = dynamic(() => import('../src/components/Contact').then(mod => ({ default: mod.Contact })), { ssr: false })
const Footer = dynamic(() => import('../src/components/Footer').then(mod => ({ default: mod.Footer })), { ssr: false })
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
