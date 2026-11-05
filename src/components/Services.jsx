import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

const CARDS = [
  {
    num: '01',
    title: 'Find suitable jobs',
    desc: 'Recommendations matched to your role, location, education and experience.',
  },
  {
    num: '02',
    title: 'Build stronger applications',
    desc: 'Tailored CVs and cover letters using your real skills and experience.',
  },
  {
    num: '03',
    title: 'Improve your job-search setup',
    desc: 'Role and platform planning, resume review and skill-gap analysis.',
  },
  {
    num: '04',
    title: 'Stay organised and supported',
    desc: 'Email or WhatsApp support, plus reminders for applications and follow-ups.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export default function Services() {
  return (
    <section id="services" className="services-section" aria-labelledby="services-heading">
      <div className="container">
        {/* Section header */}
        <div className="services-header">
          <span className="eyebrow services-eyebrow">Services</span>
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
