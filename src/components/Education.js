// src/components/Education.js
import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Education() {
  return (
    <section className="bg-gray-900 py-16 text-white" id="education">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">My Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h5 className="text-2xl font-semibold mb-2">HSC/12th Year</h5>
            <h6 className="text-xl font-medium mb-4">2020-21</h6>
            <p className="text-lg">R M Dhariwal Junior College Of Commerce</p>
          </motion.div>
          <motion.div
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h5 className="text-2xl font-semibold mb-2">BCA</h5>
            <h6 className="text-xl font-medium mb-4">2021-24</h6>
            <p className="text-lg">G H Raisoni College Of Arts Commerce And Science, Pune</p>
          </motion.div>
          <motion.div
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h5 className="text-2xl font-semibold mb-2">MCA</h5>
            <h6 className="text-xl font-medium mb-4">2024-Present</h6>
            <p className="text-lg">Dr. D Y Patil School Of MCA, Lohegoan</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
