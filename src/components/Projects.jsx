import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { BoxArrowUpRight, Github, Code } from 'react-bootstrap-icons';
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const projects = [
    {
      title: "DapaChecker.ai",
      description: "Domain authority checker for SEOs",
      category: "SaaS Tool",
      technologies: ["Node.js", "RapidAPI", "JavaScript", "Bootstrap"],
      details: "A comprehensive domain authority checking tool designed for SEO professionals. Built with Node.js backend and integrated with RapidAPI for real-time domain analysis.",
      url: "https://dapachecker.ai",
      github: null,
      status: "Live"
    },
    {
      title: "StarkAI Labs",
      description: "Website about AI agents and second brain",
      category: "Web Application",
      technologies: ["AI Agents", "JavaScript", "Next.js", "Node.js"],
      details: "This website is all about AI agents and work around second brain.",
      url: "http://starkailabs.tech",
      github: null,
      status: "Live"
    },
    {
      title: "LiveinDapoli.com",
      description: "Real estate & tourism portal",
      category: "Lead Generation Portal",
      technologies: ["WordPress", "PHP", "MySQL", "JavaScript"],
      details: "A comprehensive real estate and tourism portal for Maharashtra with lead generation functionality, property listings, and tourism information.",
      url: "https://liveindapoli.com",
      github: null,
      status: "Live"
    },
    {
      title: "LensHub Eyewear",
      description: "Full-stack eCommerce store",
      category: "eCommerce",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      details: "A modern eCommerce platform for eyewear with advanced product filtering, cart management, and secure payment integration.",
      url: null,
      github: "https://github.com/mayur-dhavan/lensh ub-eyewear",
      status: "Work in Progress"
    },
    {
      title: "Blog App with Django",
      description: "Blogging platform with comment moderation",
      category: "Web Application",
      technologies: ["Django", "Python", "PostgreSQL", "Bootstrap"],
      details: "A full-featured blogging platform with user authentication, comment moderation, and admin dashboard built with Django framework.",
      url: null,
      github: "https://github.com/mayur-dhavan/django-blog",
      status: "Completed"
    },
    {
      title: "Shopify Custom Functions",
      description: "Custom Shopify app development",
      category: "eCommerce Development",
      technologies: ["Shopify Functions", "Liquid", "JavaScript", "GraphQL"],
      details: "Custom Shopify functions and flow automation for enhanced store functionality and customer experience optimization.",
      url: null,
      github: null,
      status: "Multiple Projects"
    },
    {
      title: "WordPress Custom Solutions",
      description: "Bespoke WordPress development",
      category: "CMS Development",
      technologies: ["WordPress", "PHP", "MySQL", "JavaScript"],
      details: "Custom WordPress themes and plugins development with focus on performance, SEO optimization, and user experience.",
      url: null,
      github: null,
      status: "Multiple Projects"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return 'success';
      case 'Work in Progress': return 'warning';
      case 'Completed': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2 className="text-center mb-4">Featured Projects</h2>
                  <p className="text-center mb-5">
                    Building clean code, thoughtful design, and real-world solutions one project at a time.
                  </p>
                  <div className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Row>
                      {projects.map((project, index) => (
                        <Col key={index} lg={4} md={6} className="mb-4">
                          <Card className="h-100 shadow-lg project-card" style={{
                            transition: 'all 0.3s ease',
                            border: 'none',
                            borderRadius: '15px'
                          }}>
                            <Card.Body className="d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className={`badge bg-${getStatusColor(project.status)} px-3 py-2`}>
                                  {project.status}
                                </span>
                                <div>
                                  {project.url && (
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      href={project.url}
                                      target="_blank"
                                      className="me-2"
                                    >
                                      <BoxArrowUpRight size={14} />
                                    </Button>
                                  )}
                                  {project.github && (
                                    <Button
                                      variant="outline-dark"
                                      size="sm"
                                      href={project.github}
                                      target="_blank"
                                    >
                                      <Github size={14} />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="mb-3">
                                <Code size={24} className="text-primary mb-2" />
                                <Card.Title className="h5 text-dark">{project.title}</Card.Title>
                                <Card.Subtitle className="text-muted mb-2">{project.category}</Card.Subtitle>
                                <Card.Text className="text-secondary">{project.description}</Card.Text>
                              </div>

                              <div className="mt-auto">
                                <div className="mb-3">
                                  <small className="text-muted d-block mb-2">Technologies:</small>
                                  <div className="d-flex flex-wrap gap-1">
                                    {project.technologies.map((tech, techIndex) => (
                                      <span
                                        key={techIndex}
                                        className="badge bg-light text-dark border"
                                        style={{ fontSize: '0.75rem' }}
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <Card.Text className="text-muted small">
                                  {project.details}
                                </Card.Text>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div className="text-center mt-5">
                    <p className="text-muted mb-3">Want to see more of my work?</p>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      href="https://github.com/mayur-dhavan"
                      target="_blank"
                      className="px-4"
                    >
                      <Github className="me-2" />
                      View More on GitHub
                    </Button>
                  </div>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="Background" />
    </section>
  )
}
