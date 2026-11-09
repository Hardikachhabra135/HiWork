import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Compare from './components/Compare';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

function HomePage() {
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
        <Pricing />
        <Compare />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
