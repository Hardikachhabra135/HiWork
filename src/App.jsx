import React, { useState, useEffect } from 'react';
import './App.css';

import Header  from './components/Header';
import Hero    from './components/Hero';
import Services from './components/Services';
import Pricing  from './components/Pricing';
import About    from './components/About';
import Contact  from './components/Contact';
import Footer   from './components/Footer';
import AdminPanel from '../admin panel';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdminView) {
    return (
      <AdminPanel
        onBack={() => {
          window.location.hash = '#home';
          setIsAdminView(false);
        }}
      />
    );
  }

  return (
    <>
      {/* ── Dark Hero Block (header + hero, rounded bottom) ── */}
      <div className="hero-block" id="home">
        <Header />
        <Hero />
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <main id="main-content">
        <Services />
        <Pricing  />
        <About    />
        <Contact  />
      </main>

      <Footer />
    </>
  );
}
