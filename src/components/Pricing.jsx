import React from 'react';
import { motion } from 'framer-motion';
import './Pricing.css';

const STARTER_FEATURES = [
  'Relevant job recommendations',
  'Up to 2 recommendations each week',
  '1 tailored CV each week, when required details are provided',
  'Job-search setup',
  'Email support and monthly reminders',
];

const GROWTH_FEATURES = [
  'Up to 5 recommendations each week',
  'Tailored CV support within agreed limits',
  '1 tailored cover letter in the initial package',
  'Resume review, skill-gap analysis, WhatsApp support and reminders',
  'Skill gap',
  'WhatsApp and reminder',
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 },
  }),
};

function BulletList({ items, dark }) {
  return (
    <ul className={`pricing-bullets${dark ? ' pricing-bullets--dark' : ''}`} aria-label="Plan features">
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`} className="pricing-bullet">
          <span className="pricing-bullet__dot" aria-hidden="true"></span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="pricing-section" aria-labelledby="pricing-heading">
      <div className="container">
        {/* Header */}
        <div className="pricing-header">
          <span className="eyebrow pricing-eyebrow">Plans &amp; Pricing</span>
          <h2 id="pricing-heading" className="section-heading pricing-heading">
            Choose the support that fits
          </h2>
          <p className="pricing-subtext">
            Introductory three-month packages. Minimum commitment: three months.
          </p>
        </div>

        {/* Cards */}
        <div className="pricing-grid">
          {/* Starter */}
          <motion.div
            className="pricing-card pricing-card--light"
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={cardVariants}
          >
            <span className="pricing-label">Starter</span>
            <div className="pricing-price">
              <span className="pricing-amount">INR 499</span>
              <span className="pricing-period">/ month</span>
            </div>
            <span className="pricing-badge">INTRO OFFER INR 1,099 / 3 MONTHS</span>

            <div className="pricing-features-wrap">
              <BulletList items={STARTER_FEATURES} />
            </div>

            <a
              href="#contact"
              className="btn btn-dark pricing-cta"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get started
            </a>
          </motion.div>

          {/* Growth */}
          <motion.div
            className="pricing-card pricing-card--dark"
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={cardVariants}
          >
            <span className="pricing-label pricing-label--lime">Growth</span>
            <div className="pricing-price">
              <span className="pricing-amount">INR 999</span>
              <span className="pricing-period pricing-period--light">/ month</span>
            </div>
            <span className="pricing-badge pricing-badge--outline">INTRO OFFER INR 2,499 / 3 MONTHS</span>

            <div className="pricing-features-wrap">
              <p className="pricing-everything">Everything in Starter, plus:</p>
              <BulletList dark items={GROWTH_FEATURES} />
            </div>

            <a
              href="#contact"
              className="btn btn-lime pricing-cta"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get started
            </a>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <p className="pricing-disclaimer">
          Recommendations depend on profile fit and available openings. No interviews or employment are guaranteed.
        </p>
      </div>
    </section>
  );
}
