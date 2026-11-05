import React from 'react';
import './App.css';

import Header  from './components/Header';
import Hero    from './components/Hero';
import Services from './components/Services';
import Pricing  from './components/Pricing';
import About    from './components/About';
import Contact  from './components/Contact';
import Footer   from './components/Footer';

export default function App() {
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
