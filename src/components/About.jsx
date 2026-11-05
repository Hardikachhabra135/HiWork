import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const STEPS = [
  { num: '01', label: 'Discover', dark: false },
  { num: '02', label: 'Prepare',  dark: false },
  { num: '03', label: 'Apply',    dark: true  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-panel">
          {/* Left column */}
          <motion.div
            className="about-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <span className="eyebrow about-eyebrow">About Hiwork</span>
            <h2 id="about-heading" className="section-heading about-heading">
              A clearer way to approach your job search
            </h2>
            <p className="about-body">
              Hiwork helps job seekers find suitable jobs, spend less time searching and apply with more confidence. We bring opportunity discovery, application preparation and job-search organisation into one practical support service.
            </p>

            <hr className="about-divider" aria-hidden="true" />

            <p className="about-pledge">
              We do not invent experience, ask for passwords or submit applications without your approval.
            </p>
          </motion.div>

          {/* Right column */}
          <div className="about-right" aria-label="Process steps">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className={`about-step${step.dark ? ' about-step--dark' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                <span className={`about-step__num${step.dark ? ' about-step__num--lime' : ''}`}>
                  {step.num}
                </span>
                <span className="about-step__label">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
