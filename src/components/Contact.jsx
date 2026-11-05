import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const INITIAL = {
  name: '',
  email: '',
  role: '',
  location: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Target Role: ${form.role}`,
      `Location: ${form.location}`,
      `Message: ${form.message}`,
    ].join('%0A');

    window.location.href = `mailto:harshdabas0987@gmail.com?subject=Hiwork%20enquiry&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container">
        {/* Section header */}
        <div className="contact-header">
          <span className="eyebrow contact-eyebrow">Contact</span>
          <h2 id="contact-heading" className="section-heading contact-heading">
            Let us help you plan your next step.
          </h2>
          <p className="contact-subtext">
            Want to apply? Tell us a little about your goals and our team can guide you to a suitable support option.
          </p>
          <p className="contact-links">
            Or email{' '}
            <a href="mailto:harshdabas0987@gmail.com" className="contact-link">
              harshdabas0987@gmail.com
            </a>
            {' '}|{' '}
            WhatsApp{' '}
            <a
              href="https://wa.me/917428311662"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              7428311662
            </a>
          </p>
        </div>

        {/* Two-column layout */}
        <div className="contact-body">
          {/* Info pane (left) */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="contact-info__block">
              <h3 className="contact-info__title">Working hours</h3>
              <p className="contact-info__text">
                Monday – Saturday<br />
                10 AM – 7 PM IST
              </p>
            </div>
            <div className="contact-info__block">
              <h3 className="contact-info__title">Response time</h3>
              <p className="contact-info__text">
                We typically reply within one business day.
              </p>
            </div>
            <div className="contact-info__block">
              <h3 className="contact-info__title">What to expect</h3>
              <p className="contact-info__text">
                We will review your profile and suggest the right support plan for your situation.
              </p>
            </div>
          </motion.div>

          {/* Form card (right) */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {submitted && (
              <p className="form-success" role="status">
                ✓ Your email client should have opened. We'll be in touch soon!
              </p>
            )}

            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact enquiry form"
            >
              {/* NAME */}
              <div className="form-group">
                <label htmlFor="cf-name" className="form-label">Name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="cf-email" className="form-label">Email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              {/* TARGET ROLE */}
              <div className="form-group">
                <label htmlFor="cf-role" className="form-label">Target Role</label>
                <input
                  id="cf-role"
                  name="role"
                  type="text"
                  className="form-input"
                  placeholder="Role you are looking for"
                  value={form.role}
                  onChange={handleChange}
                />
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label htmlFor="cf-location" className="form-label">Location</label>
                <input
                  id="cf-location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder="Preferred city or remote"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              {/* HOW CAN WE HELP */}
              <div className="form-group">
                <label htmlFor="cf-message" className="form-label">How can we help?</label>
                <textarea
                  id="cf-message"
                  name="message"
                  className="form-input form-textarea"
                  placeholder="Share your goals or questions"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <button type="submit" className="btn btn-dark form-submit">
                Send enquiry
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
