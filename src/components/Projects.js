import React, { useState } from 'react';
import { Container, Row, Col, Tab, Modal, Button } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import healthyDart from "../assets/img/HealthyDart.png";
import DA from "../assets/img/DA.png";
import LSB from "../assets/img/lsb2.png";
import Hardr from "../assets/img/Hardr.png";
import projImg1 from "../assets/img/project-img1.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "Less Sucky Business",
      description: "Shopify Store Development",
      imgUrl: LSB,
      technologies: ["Shopify", "Liquid", "HTML", "CSS"],
      details: "Developed a custom Shopify store for Less Sucky Business with advanced product filtering and a custom checkout experience.",
      url: "https://www.lesssuckybusiness.com/",
    },
    {
      title: "Hardr Shilajit",
      description: "Shopify Store Development",
      imgUrl: Hardr,
      technologies: ["Shopify", "JavaScript", "HTML", "CSS"],
      details: "Created a Shopify store for Hardr Shilajit with focus on conversion rate optimization and mobile responsiveness.",
      url: "https://www.hardrshilajit.com/",
    },
    {
      title: "DA Analyzer",
      description: "Web Development",
      imgUrl: DA,
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      details: "Developed a DA Analyzer tool with a custom backend and real-time data analysis.",
      url: "https://daanalyzer.com/",
    },
    {
      title: "The Healthy Dart",
      description: "WordPress Development",
      imgUrl: healthyDart,
      technologies: ["WordPress", "PHP", "JavaScript"],
      details: "Built a WordPress site for The Healthy Dart with custom themes and plugins to enhance user experience.",
      url: "https://thehealthydart.com/",
    },
    {
      title: "Business Startup",
      description: "Design & Development",
      imgUrl: projImg1,
      technologies: ["HTML", "CSS", "JavaScript"],
      details: "Designed and developed a startup business website with a focus on modern UI/UX principles.",
      url: "#", // Placeholder URL
    },
  ];

  const handleShowModal = (project) => {
    console.log('Project clicked:', project); // Debugging log
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Modal closed'); // Debugging log
    setShowModal(false);
    setSelectedProject(null); // Ensure selectedProject is cleared
  };

  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <h2 className="text-center mb-4">Projects</h2>
                <p className="text-center mb-5">Explore the projects I've worked on, ranging from Shopify stores to custom web applications.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <Row>
                        {projects.map((project, index) => (
                          <Col key={index} size={12} sm={6} md={4}>
                            <div className="proj-imgbx border rounded p-3 mb-4 shadow-lg" onClick={() => handleShowModal(project)} style={{ cursor: 'pointer', transition: 'transform 0.3s' }}>
                              <img src={project.imgUrl} alt={project.title} className="img-fluid rounded" />
                              <div className="proj-txtx mt-3">
                                <h4>{project.title}</h4>
                                <span>{project.description}</span>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="Background"/>

      {/* Modal for Project Details */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className={`animate__animated ${showModal ? 'animate__fadeIn' : 'animate__fadeOut'}`}
        backdrop="static" // Prevents closing when clicking outside the modal
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{selectedProject?.title || ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-left bg-light p-4">
          {selectedProject ? (
            <div>
              <img src={selectedProject.imgUrl} alt={selectedProject.title} className="img-fluid mb-3 rounded shadow-sm" />
              <p className='text-dark'><strong>Description:</strong> {selectedProject.description}</p>
              <p className='text-dark'><strong>Technologies Used:</strong> {selectedProject.technologies.join(', ')}</p>
              <p className='text-dark'><strong>Details:</strong> {selectedProject.details}</p>
              <p className='text-dark'><strong>Project URL:</strong> <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="btn btn-info">View Project</a></p>
            </div>
          ) : (
            <p className='text-dark'>No project selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}
