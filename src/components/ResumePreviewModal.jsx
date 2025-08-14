import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import resume from '../assets/MayurResumeNew.pdf';

const ResumePreviewModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Resume Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '80vh' }}>
        <iframe src={resume} title="Resume" width="100%" height="100%" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" href={resume} download="MayurDhavan-Resume.pdf">
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResumePreviewModal;
