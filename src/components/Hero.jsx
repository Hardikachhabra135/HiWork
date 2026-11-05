import React from 'react';
import { motion } from 'framer-motion';
import HeroOrb from './HeroOrb';
import './Hero.css';

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function Hero() {
  const handleExplore = (e) => {
    e.preventDefault();
    document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-inner container">
        {/* Left column */}
        <div className="hero-content">
          <motion.span
            className="eyebrow hero-eyebrow"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
          >
            Career search, made clear
          </motion.span>

          <motion.h1
            id="hero-heading"
            className="hero-heading"
            custom={0.12}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
          >
            Spend less time searching.{' '}
            <span className="hero-heading--lime">Apply with more confidence.</span>
          </motion.h1>

          <motion.p
            className="hero-subtext"
            custom={0.24}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
          >
            We help students, recent graduates and working professionals find suitable jobs, improve their CV and prepare stronger applications.
          </motion.p>

          <motion.div
            className="hero-actions"
            custom={0.36}
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
          >
            <a href="#pricing" className="btn btn-lime" onClick={handleExplore}>
              Explore support options
            </a>
            <span className="hero-disclaimer">
              No job guarantees. Clear, practical help.
            </span>
          </motion.div>
        </div>

        {/* Right column – decorative orb */}
        <div className="hero-graphic" aria-hidden="true">
          <HeroOrb />
        </div>
      </div>
    </section>
  );
}
