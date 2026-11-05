import React from 'react';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing',  href: '#pricing' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
];

export default function Header() {
  const handleNav = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header container" role="banner">
      {/* First child: Logo link */}
      <a
        href="#home"
        className="wordmark"
        onClick={(e) => handleNav(e, '#home')}
        aria-label="Hiwork – go to top"
      >
        <span className="wordmark__dot" aria-hidden="true"></span>
        hiwork
      </a>

      {/* Second child: Nav element */}
      <nav className="site-nav" aria-label="Main navigation">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="nav-link"
            onClick={(e) => handleNav(e, link.href)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="btn btn-lime header-cta"
          onClick={(e) => handleNav(e, '#contact')}
        >
          Get help
        </a>
      </nav>
    </header>
  );
}
