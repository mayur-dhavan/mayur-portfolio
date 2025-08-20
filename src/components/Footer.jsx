import { Container, Row, Col } from "react-bootstrap";
// import { MailchimpForm } from "./MailchimpForm";
import logo from "../assets/img/logo.svg";
import linkedin from "../assets/img/nav-icon1.svg";
import facebook from "../assets/img/nav-icon2.svg";
import instagram from "../assets/img/nav-icon3.svg";
import github from "../assets/img/github.svg";
import topArrow from "../assets/img/top-arrow.svg";

import { useEffect } from 'react';

export const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector('.back-to-top');
      if (!button) return;
      if (window.scrollY > 300) {
        button.classList.add('is-visible');
        // Ensure no inline display overrides CSS
        button.style.removeProperty('display');
      } else {
        button.classList.remove('is-visible');
        button.style.removeProperty('display');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top align-items-start gy-4">
          <Col size={12} md={4} className="footer-logo text-center text-md-start">
            <img onClick={scrollToTop} src={logo} alt="Mayur Portfolio Logo" />
            <p className="mt-3">Building clean code, thoughtful design, and real-world solutions.</p>
          </Col>
          <Col size={12} md={4} className="text-center">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#connect">Contact</a></li>
            </ul>
          </Col>
          <Col size={12} md={4} className="text-center text-md-end">
            <h6 className="footer-heading">Contact</h6>
            <ul className="footer-links">
              <li><a href="mailto:mayurdhavan2244@gmail.com">mayurdhavan2244@gmail.com</a></li>
              <li><a href="tel:+917822005892">+91 7822005892</a></li>
              <li><a href="#connect">Let’s Connect</a></li>
              <li><a href="/MayurResumeNew.pdf" target="_blank" rel="noreferrer">Resume</a></li>
            </ul>
          </Col>
        </Row>
        <Row className="footer-bottom align-items-center mt-3 pt-3">
          <Col size={12} md={6} className="text-center text-md-start">
            <p className="m-0 footer-copy">&copy; 2025 Mayur Portfolio. All rights reserved.</p>
            <p className="m-0 footer-made">Made with ❤ by Mayur D(test)</p>
          </Col>
          <Col size={12} md={6} className="text-center text-md-end">
            <div className="social-icon footer-social">
              <a href="https://www.linkedin.com/in/mayur-dhavan-50902922b/" target="blank"><img src={linkedin} alt="LinkedIn" /></a>
              <a href="https://www.facebook.com/mayur.dhavan.127/" target="blank"><img src={facebook} alt="Facebook" /></a>
              <a href="https://www.instagram.com/mayur_dhavan_/" target="blank"><img src={instagram} alt="Instagram" /></a>
              <a href="https://github.com/mayur-dhavan" target="blank"><img src={github} alt="GitHub" /></a>
            </div>
          </Col>
        </Row>
        <button className="back-to-top" onClick={scrollToTop}>
        <img src={topArrow}  alt="Back to Top" />
        </button>
      </Container>
    </footer>
  )
}
