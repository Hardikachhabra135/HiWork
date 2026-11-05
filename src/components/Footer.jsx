import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        {/* Wordmark */}
        <div className="footer-brand">
          <a href="#home" className="footer-wordmark" onClick={(e) => { e.preventDefault(); document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="footer-wordmark__dot" aria-hidden="true"></span>
            hiwork
          </a>
          <p className="footer-tagline">Career search support with clarity and care.</p>
        </div>

        {/* Footer nav */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#privacy" className="footer-nav__link">Privacy</a>
          <a href="#terms"   className="footer-nav__link">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
