import React from 'react';
import { Tab, Nav } from "react-bootstrap";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const TabSection = ({ tab, setTab }) => {
  return (
    <TrackVisibility>
      {({ isVisible }) => 
        <div className={`tab-section ${isVisible ? "animate__animated animate__fadeIn": ""}`}>
          <Tab.Container id="about-tabs" defaultActiveKey="skills">
            <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
              <Nav.Item>
                <Nav.Link eventKey="skills" onClick={() => setTab('skills')}>Skills</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="experience" onClick={() => setTab('experience')}>Experience</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
              <Tab.Pane eventKey="skills">
                <ul className="list-disc list-inside space-y-2 text-lg text-white">
                  <li>HTML, CSS, JavaScript</li>
                  <li>React, Bootstrap, Framer Motion, GSAP</li>
                  <li>WordPress (Elementor, Divi), PHP</li>
                  <li>On-page SEO Strategies</li>
                  <li>Shopify Development, Liquid Code</li>
                  <li>C/C++, Python</li>
                  <li>Blockchain Fundamentals</li>
                </ul>
              </Tab.Pane>
              <Tab.Pane eventKey="experience">
                <ul className="space-y-4 text-lg text-white">
                  <li>
                    <h4 className="font-semibold">Web Developer Associate</h4>
                    <p>Radon Media</p>
                    <p>May 2024 - Present</p>
                  </li>
                  <li>
                    <h4 className="font-semibold">Web Developer Intern</h4>
                    <p>Radon Media</p>
                    <p>Oct 2023 - April 2024</p>
                  </li>
                  <li>
                    <h4 className="font-semibold">WordPress Intern</h4>
                    <p>MyDigitalDudes</p>
                    <p>March 2023 - April 2023</p>
                  </li>
                </ul>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      }
    </TrackVisibility>
  );
}

export default TabSection;
