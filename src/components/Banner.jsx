import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import resume from '../assets/MayurResumeNew.pdf'; 
import ResumePreviewModal from './ResumePreviewModal';

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const toRotate = ["Web Developer", "Full Stack Engineer", "eCommerce Developer"];
  const period = 900;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <button
                    className="tagline"
                    onClick={handleShowModal} 
                  >
                    Download My Resume
                  </button>
                  <h1>{`Hi! My Name Is Mayur Dhavan, I'm a`} <span className="txt-rotate" data-period="1000" data-rotate='[ "Web Developer", "Full Stack Engineer", "eCommerce Developer" ]'><span className="wrap">{text}</span></span></h1>
                  <p>As a Web Developer and Full Stack Engineer, I specialize in building clean code, thoughtful design, and real-world solutions. With a passion for scalable SaaS and eCommerce applications, I leverage my expertise in modern technologies to create impactful and user-centric digital experiences. I am always learning and open to new challenges in the ever-evolving tech landscape.</p>
                  <button onClick={() => console.log('connect')}>Let’s Connect <ArrowRightCircle size={25} /></button>
                </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={headerImg} alt="Header Img" />
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <ResumePreviewModal show={showModal} handleClose={handleCloseModal} />
    </section>
  )
}
