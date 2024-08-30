// src/components/Education.js
import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export function Education() {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 text-white" id="education">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 animate__animated animate__fadeInDown">
          My Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-800 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h5 className="text-2xl font-semibold mb-2">HSC/12th Year</h5>
            <h6 className="text-xl font-medium mb-4">2020-21</h6>
            <p className="text-lg">R M Dhariwal Junior College Of Commerce</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-r from-green-700 via-teal-600 to-green-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h5 className="text-2xl font-semibold mb-2">BCA</h5>
            <h6 className="text-xl font-medium mb-4">2021-24</h6>
            <p className="text-lg">G H Raisoni College Of Arts Commerce And Science, Pune</p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h5 className="text-2xl font-semibold mb-2">MCA</h5>
            <h6 className="text-xl font-medium mb-4">2024-Present</h6>
            <p className="text-lg">Dr. D Y Patil School Of MCA, Lohegaon</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
