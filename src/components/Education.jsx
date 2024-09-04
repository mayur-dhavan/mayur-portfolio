// src/components/Education.js
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'animate.css';

gsap.registerPlugin(ScrollTrigger);

const cardHover = {
  rest: { scale: 1, rotate: 0, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)', transition: { duration: 0.3 } },
  hover: { scale: 1.05, rotate: 3, boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)', transition: { duration: 0.3 } },
};

export function Education() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.card'),
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        ease: 'power4.out',
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 text-white"
      id="education"
      ref={sectionRef}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 animate__animated animate__fadeInDown">
          My Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="card bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-800 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:shadow-2xl"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardHover}
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h5
              className="text-2xl font-semibold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              HSC/12th Year
            </motion.h5>
            <motion.h6
              className="text-xl font-medium mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              2020-21
            </motion.h6>
            <motion.p
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              R M Dhariwal Junior College Of Commerce
            </motion.p>
          </motion.div>
          <motion.div
            className="card bg-gradient-to-r from-green-700 via-teal-600 to-green-700 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:shadow-2xl"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardHover}
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h5
              className="text-2xl font-semibold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              BCA
            </motion.h5>
            <motion.h6
              className="text-xl font-medium mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              2021-24
            </motion.h6>
            <motion.p
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              G H Raisoni College Of Arts Commerce And Science, Pune
            </motion.p>
          </motion.div>
          <motion.div
            className="card bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:shadow-2xl"
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={cardHover}
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h5
              className="text-2xl font-semibold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              MCA
            </motion.h5>
            <motion.h6
              className="text-xl font-medium mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              2024-Present
            </motion.h6>
            <motion.p
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Dr. D Y Patil School Of MCA, Lohegaon
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
