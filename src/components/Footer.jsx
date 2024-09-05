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
      if (window.scrollY > 300) {
        button.style.display = 'block';
      } else {
        button.style.display = 'none';
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
        <Row className="align-items-center">
          {/* <MailchimpForm /> */}
          <Col className="footer-logo" size={12} sm={6}>
           <img onClick={scrollToTop} src={logo} alt="Mayur Portfolio Logo" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/mayur-dhavan-50902922b/" target="blank"><img src={linkedin} alt="LinkedIn" /></a>
              <a href="https://www.facebook.com/mayur.dhavan.127/" target="blank"><img src={facebook} alt="Facebook" /></a>
              <a href="https://www.instagram.com/mayur_dhavan_/" target="blank"><img src={instagram} alt="Instagram" /></a>
               <a href="https://github.com/mayur-dhavan" target="blank"><img src={github} alt="GitHub" /></a>
            </div>
            <p>Mayur Portfolio | Copyright 2024. All Rights Reserved</p>
          </Col>
        </Row>
        <button className="back-to-top" onClick={scrollToTop}>
        <img src={topArrow}  alt="Back to Top" />
        </button>
      </Container>
    </footer>
  )
}
