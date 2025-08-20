import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Image from 'next/image';
import linkedin from '../assets/img/nav-icon1.svg';
import facebook from '../assets/img/nav-icon2.svg';
import instagram from '../assets/img/nav-icon3.svg';
import github from "../assets/img/github.svg";

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/mayur-logo.png" 
            alt="Mayur Portfolio Logo" 
            width={150}
            height={50}
            style={{ 
              width: '160px', 
              height: 'auto',
              maxHeight: '100px',
              objectFit: 'contain'
            }}
            priority
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
            <Nav.Link href="#about" className={activeLink === 'about' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('about')}>About</Nav.Link>
            <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
            <Nav.Link href="#experience" className={activeLink === 'experience' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('experience')}>Experience</Nav.Link>
            <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/mayur-dhavan-50902922b/" target="blank"><img src={linkedin} alt="LinkedIn" /></a>
              <a href="https://www.facebook.com/mayur.dhavan.127/" target="blank"><img src={facebook} alt="Facebook" /></a>
              <a href="https://www.instagram.com/mayur_dhavan_" target="blank"><img src={instagram} alt="Instagram" /></a>
              <a href="https://github.com/mayur-dhavan" target="blank"><img src={github} alt="GitHub" /></a>
            </div>
            <a href="#connect">
              <button className="vvd"><span>Let's Connect</span></button>
            </a>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};
