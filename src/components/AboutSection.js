import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from "../assets/img/MyIMG.jpg";
import TabSection from './TabSection'; // Ensure TabSection is exported correctly

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const imgContainerRef = useRef(null);

  const [tab, setTab] = useState('skills');

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power4.out' }
    );

    gsap.fromTo(
      textRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          stagger: 0.3,
        },
      }
    );

    gsap.fromTo(
      imgContainerRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
        },
      }
    );
  }, []);

  return (
    <section
      className="bg-gray-900 py-16 text-white relative overflow-hidden"
      id="about"
      ref={sectionRef}
    >
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl font-bold text-center mb-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          About Me
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
          <div
            className="md:w-1/3 text-center mb-8 md:mb-0"
            ref={imgContainerRef}
          >
            <div
              className="relative rounded-full w-48 h-48 mx-auto mb-4 shadow-lg hover:shadow-2xl transform transition-transform duration-700 hover:scale-110 hover:rotate-6 overflow-hidden"
              ref={imgRef}
            >
              <img
                src={profile}
                alt="Mayur Dhavan"
                className="w-full h-full object-cover"
                loading="eager" // Ensures the image is loaded quickly
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-0 hover:opacity-60 transition-opacity duration-500"></div>
            </div>
            <h3 className="text-2xl font-semibold">Mayur Dhavan</h3>
            <p className="text-lg text-gray-400">Web Developer Associate at Radon Media</p>
          </div>
          <div
            className="md:w-2/3"
            ref={textRef}
          >
            <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
            <p className="text-lg mb-6 text-gray-300">
              I'm a passionate web developer with experience in creating responsive and user-friendly websites using HTML, CSS, JavaScript, and popular frameworks like React and Bootstrap. With a strong foundation in C/C++ and Python, I’m committed to delivering high-quality web solutions that meet client needs and industry standards.
            </p>
            <h3 className="text-2xl font-semibold mb-4">My Skills</h3>
            <TabSection tab={tab} setTab={setTab} />
          </div>
        </div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
