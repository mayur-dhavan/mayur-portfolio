import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
// Server-rendered components
import { NavBar } from '../src/components/NavBar'
import { Banner } from '../src/components/Banner'
import { Skills } from '../src/components/Skills'
import { Projects } from '../src/components/Projects'
import { AboutSection } from '../src/components/AboutSection'
import { Contact } from '../src/components/Contact'
import { Footer } from '../src/components/Footer'

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
