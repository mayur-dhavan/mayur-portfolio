import React from 'react';

export const TabSection = ({ tab, setTab }) => {
  return (
    <div className="relative">
      <div className="flex justify-center mb-4">
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-all duration-300 ${tab === 'skills' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          onClick={() => setTab('skills')}
        >
          Skills
        </button>
        <button
          className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-all duration-300 ${tab === 'experience' ? 'bg-gray-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          onClick={() => setTab('experience')}
        >
          Experience
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-b-lg shadow-lg">
        {tab === 'skills' && (
          <div>
            <ul className="list-disc list-inside space-y-2 text-lg">
              <li>HTML, CSS, JavaScript</li>
              <li>React, Bootstrap, Framer Motion</li>
              <li>WordPress (Elementor, Divi)</li>
              <li>On-page SEO Strategies</li>
              <li>Shopify Development</li>
              <li>C/C++, Python</li>
              <li>Blockchain Fundamentals</li>
            </ul>
          </div>
        )}
        {tab === 'experience' && (
          <div>
            <ul className="space-y-4 text-lg">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default TabSection;
