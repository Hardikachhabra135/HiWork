import React from 'react';
import './HeroOrb.css';

/* Decorative concentric-circle SVG with orbiting dots */
export default function HeroOrb() {
  return (
    <svg
      className="hero-orb"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      {/* Outer ring */}
      <circle cx="160" cy="160" r="148" stroke="#2A4538" strokeWidth="1.5" />

      {/* Middle ring */}
      <circle cx="160" cy="160" r="108" stroke="#2A4538" strokeWidth="1.5" />

      {/* Inner ring */}
      <circle cx="160" cy="160" r="68" stroke="#2A4538" strokeWidth="1.5" />

      {/* Filled inner circle */}
      <circle cx="160" cy="160" r="52" fill="#162A21" />

      {/* Lime checkmark – rounded caps */}
      <path
        d="M140 162 L153 175 L180 148"
        stroke="#CFF35A"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Orbiting group – outer ring dots (slow 40s rotation) */}
      <g className="orb-rotate--outer">
        <circle cx="160" cy="12" r="6" fill="#CFF35A" />
        <circle cx="308" cy="160" r="4" fill="#CFF35A" opacity="0.6" />
        <circle cx="68" cy="290" r="5" fill="#E8F3CD" opacity="0.7" />
      </g>

      {/* Orbiting group – middle ring dots (40s, offset phase) */}
      <g className="orb-rotate--mid">
        <circle cx="160" cy="52" r="5" fill="#E8F3CD" opacity="0.8" />
        <circle cx="262" cy="228" r="4" fill="#CFF35A" opacity="0.5" />
        <circle cx="58" cy="100" r="4" fill="#CFF35A" opacity="0.5" />
      </g>
    </svg>
  );
}
