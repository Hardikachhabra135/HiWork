import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

const CARDS = [
  {
    num: '01',
    title: 'Job recommendations',
    desc: 'Opportunities matched to preferred role, location, education, experience and other preferences.',
  },
  {
    num: '02',
    title: 'Tailored CVs',
    desc: 'Role-focused CVs built from your genuine skills, education, projects and experience.',
  },
  {
    num: '03',
    title: 'Cover letters',
    desc: 'Opportunity-specific letters that reflect your real background and strengths.',
  },
  {
    num: '04',
    title: 'Job-search setup',
    desc: 'Help defining target roles, locations, platforms, search terms and application preferences.',
  },
  {
    num: '05',
    title: 'Resume review',
    desc: 'Feedback on structure, clarity, grammar, relevance and formatting.',
  },
  {
    num: '06',
    title: 'Skill-gap analysis',
    desc: 'A comparison of your profile with target-role requirements, plus practical areas to build.',
  },
  {
    num: '07',
    title: 'Email & WhatsApp support',
    desc: 'Access to the communication channels included in your plan, with clear response expectations.',
  },
  {
    num: '08',
    title: 'Reminders',
    desc: 'Weekly or monthly prompts to support applications, skill development and follow-ups.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.08 },
  }),
};

export default function Services() {
  return (
    <section id="services" className="services-section" aria-labelledby="services-heading">
      <div className="container">
        {/* Section header */}
        <div className="services-header">
          <span className="eyebrow services-eyebrow">SERVICES</span>
          <h2 id="services-heading" className="section-heading services-heading">
            Practical help at every step
          </h2>
          <p className="services-subtext">
            Focused support, shaped around your goals and profile.
          </p>
        </div>

        {/* Cards grid */}
        <div className="services-grid" role="list">
          {CARDS.map((card, i) => (
            <motion.article
              key={card.num}
              className="service-card"
              role="listitem"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(13,26,20,0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <span className="service-card__num" aria-hidden="true">{card.num}</span>
              <h3 className="service-card__title">{card.title}</h3>
              <p className="service-card__desc">{card.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
