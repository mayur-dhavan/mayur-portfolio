import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Education } from "./components/Education";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { AboutSection } from "./components/AboutSection";
import FluidWebGLBackground from "./components/FluidWebGLBackground.tsx";
import SimpleFluidBackground from "./components/SimpleFluidBackground.jsx";
import SimpleWebGLTest from "./components/SimpleWebGLTest.jsx";
import GalaxyBackground from "./components/GalaxyBackground.jsx";

function App() {
  return (
    <div className="App">
      <GalaxyBackground />
      <FluidWebGLBackground />
      <div className="app-content">
        <NavBar />
        <Banner />
        <AboutSection />
        <Skills />
        <Education />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
