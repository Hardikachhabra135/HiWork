import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './Contact.css';

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  role: '',
  location: '',
  message: '',
};

const validatePhoneNumber = (value) => {
  if (!value || !value.trim()) {
    return 'Phone number cannot be empty.';
  }

  const trimmed = value.trim();

  // Pattern: optional single leading '+', then only digits, spaces, hyphens, parentheses, and dots
  const validPattern = /^\+?[0-9\s\-().]+$/;
  if (!validPattern.test(trimmed)) {
    return 'Please enter a valid phone number.';
  }

  const digitsOnly = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+91')) {
    const after91 = digitsOnly.slice(2);
    if (after91.length !== 10) {
      return 'Indian phone numbers with +91 must have 10 digits.';
    }
    return '';
  }

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return 'Phone number must be between 7 and 15 digits.';
  }

  return '';
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value.trim()) {
      const err = validatePhoneNumber(value);
      if (err) {
        setErrors((prev) => ({ ...prev, phone: err }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const phoneError = validatePhoneNumber(form.phone);
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setSubmitError(
        'Supabase client is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect to public.contact_submissions.
      // Insert ONLY name, email, phone, role, location, and message.
      // Let the database supply id, status, notes, and created_at.
      // Do NOT call .select() on the public insert.
      const { error, status } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            role: form.role.trim() || null,
            location: form.location.trim() || null,
            message: form.message.trim() || null,
          },
        ]);

      if (error) {
        console.error('[HiWork Contact] Submission insert failed:', {
          code: error.code,
          message: error.message,
          status,
        });
        setSubmitError(
          error.message || 'Failed to submit enquiry. Please check your connection or contact us directly.'
        );
        return;
      }

      console.info('[HiWork Contact] Submission successfully recorded in public.contact_submissions (HTTP', status, ')');

      // Success: open mailto and display success message
      const body = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Target Role: ${form.role}`,
        `Location: ${form.location}`,
        `Message: ${form.message}`,
      ].join('%0A');

      window.location.href = `mailto:harshdabas0987@gmail.com?subject=Hiwork%20enquiry&body=${body}`;
      setSubmitted(true);
      setForm(INITIAL);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error('[HiWork Contact] Unexpected error submitting form:', err?.message || err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <div className="container">
        {/* Two-column layout */}
        <div className="contact-body">
          {/* Section header & intro (left column, top) */}
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

          {/* Info pane (left column, bottom) */}
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
                ✓ Your enquiry has been received! We'll be in touch soon.
              </p>
            )}

            {submitError && (
              <div className="form-error-alert" role="alert">
                ✕ {submitError}
              </div>
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

              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="cf-phone" className="form-label">Phone</label>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  className={`form-input${errors.phone ? ' form-input--error' : ''}`}
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'cf-phone-error' : undefined}
                />
                {errors.phone && (
                  <span id="cf-phone-error" className="form-error" role="alert">
                    {errors.phone}
                  </span>
                )}
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

              <button
                type="submit"
                className="btn btn-dark form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send enquiry'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
