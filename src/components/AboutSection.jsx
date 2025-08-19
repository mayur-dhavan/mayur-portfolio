import React, { useEffect, useRef } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);

  const stats = [
    { number: "3+", label: "Years Experience", icon: "🚀" },
    { number: "15+", label: "Clients Served", icon: "👥" },
    { number: "100%", label: "Client Satisfaction", icon: "⭐" },
    { number: "25+", label: "Projects Completed", icon: "💼" }
  ];

  const skills = [
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    {name: "GCP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"},
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invert: true, lightBg: true, noDim: true },
    { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", noDim: true },
    { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true, lightBg: true, noDim: true },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "WordPress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg", noDim: true },
    { name: "Shopify", icon: "https://www.svgrepo.com/show/303503/shopify-logo.svg", noDim: true },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true, lightBg: true, noDim: true  },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    {name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"}
  ];

  const experience = [
    {
      title: "Web Developer Associate",
      company: "Radon Media Pvt Ltd.",
      period: "May 2024 - Present",
      description: "Leading web development projects, creating custom solutions, and mentoring junior developers."
    },
    {
      title: "Web Developer Intern",
      company: "Radon Media Pvt Ltd.",
      period: "Oct 2023 - April 2024",
      description: "Developed responsive websites, worked on client projects, and learned advanced web technologies."
    },
    {
      title: "Freelance Developer",
      company: "Self-Employed",
      period: "2022 - Present",
      description: "Building custom websites, eCommerce stores, and providing web development consultancy services."
    }
  ];

  useEffect(() => {
    // Animate stats on scroll
    gsap.fromTo(
      ".stat-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate skill icons
    gsap.fromTo(
      ".skill-icon",
      { scale: 0, rotation: 180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: ".skills-container",
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2 className="about-title">About Me</h2>
                  <p className="about-description">
                    Building clean code, thoughtful design, and real-world solutions one line at a time.
                  </p>
                  
                  {/* Stats Section */}
                  <div className="stats-container" ref={statsRef}>
                    <Row className="justify-content-center">
                      {stats.map((stat, index) => (
                        <Col key={index} xs={6} md={3} className="mb-4">
                          <Card className="stat-card text-center h-100">
                            <Card.Body>
                              <div className="stat-icon">{stat.icon}</div>
                              <h3 className="stat-number">{stat.number}</h3>
                              <p className="stat-label">{stat.label}</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Skills Section */}
                  <div className="skills-section mt-5">
                    <h3 className="section-subtitle">Technical Skills</h3>
                    <div className="skills-container">
                      <Row className="justify-content-center">
                        {skills.map((skill, index) => (
                          <Col key={index} xs={4} sm={3} md={2} lg={1.5} className="mb-4">
                            <div className="skill-item text-center">
                              <div className={`skill-icon-wrapper ${skill.lightBg ? 'skill-icon-light-bg' : ''}`}>
                                <img 
                                  src={skill.icon} 
                                  alt={skill.name} 
                                  className={`skill-icon ${skill.invert ? 'skill-icon-invert' : ''} ${skill.noDim ? 'skill-icon-no-dim' : ''}`}
                                />
                              </div>
                              <p className="skill-name">{skill.name}</p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="experience-section mt-5">
                    <h3 className="section-subtitle">Professional Experience</h3>
                    <div className="experience-timeline">
                      {experience.map((exp, index) => (
                        <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                          <div className="timeline-marker"></div>
                          <div className="timeline-content">
                            <h4 className="timeline-title">{exp.title}</h4>
                            <h5 className="timeline-company">{exp.company}</h5>
                            <p className="timeline-period">{exp.period}</p>
                            <p className="timeline-description">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AboutSection;
