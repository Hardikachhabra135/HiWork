import React, { useState } from 'react';
import LineSidebar from './LineSidebar';
import './Compare.css';

const FEATURES = [
  {
    name: 'Recommendations',
    starter: {
      value: '2',
      caption: 'per week',
      included: true,
      meter: 40,
    },
    growth: {
      value: 'Up to 5',
      caption: 'per week',
      included: true,
      meter: 100,
    },
  },
  {
    name: 'Tailored CV',
    starter: {
      value: 'Only Once',
      caption: '',
      included: true,
      meter: 40,
    },
    growth: {
      value: 'According to each job you will get cv tailored',
      caption: '',
      included: true,
      meter: 100,
    },
  },
  {
    name: 'Cover letter',
    starter: {
      value: 'Not included',
      caption: '',
      included: false,
      meter: 0,
    },
    growth: {
      value: '1',
      caption: 'in the first 3 months',
      included: true,
      meter: 100,
    },
  },
  {
    name: 'Resume review',
    starter: {
      value: 'Not included',
      caption: '',
      included: false,
      meter: 0,
    },
    growth: {
      value: 'Included',
      caption: '',
      included: true,
      meter: 100,
    },
  },
  {
    name: 'Skill-gap analysis',
    starter: {
      value: 'Not included',
      caption: '',
      included: false,
      meter: 0,
    },
    growth: {
      value: 'Included',
      caption: '',
      included: true,
      meter: 100,
    },
  },
  {
    name: 'Support',
    starter: {
      value: 'Email',
      caption: '',
      included: true,
      meter: 100,
    },
    growth: {
      value: 'Email + WhatsApp',
      caption: '',
      included: true,
      meter: 100,
    },
  },
  {
    name: 'Reminders',
    starter: {
      value: 'Monthly',
      caption: '',
      included: true,
      meter: 100,
    },
    growth: {
      value: 'Weekly or monthly',
      caption: '',
      included: true,
      meter: 100,
    },
  },
];

function getValueClass(val) {
  if (!val) return '';
  if (val.length > 25) return 'compare-val--sentence';
  if (val.length > 10) return 'compare-val--long';
  if (val.length > 5) return 'compare-val--medium';
  return '';
}

export default function Compare() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeFeature = FEATURES[activeIndex] || FEATURES[0];

  return (
    <section id="compare" className="compare-section" aria-labelledby="compare-heading">
      <div className="container">
        <div className="compare-panel">
          {/* Subtle Grid texture */}
          <div className="compare-grid-bg" aria-hidden="true" />

          {/* Ambient lime orb */}
          <div className="compare-orb" aria-hidden="true" />

          {/* Header */}
          <div className="compare-header">
            <span className="compare-eyebrow">COMPARE</span>
            <h2 id="compare-heading" className="compare-heading">
              Starter or Growth?
            </h2>
            <p className="compare-subtext">
              Pick a feature to see how the plans differ.
            </p>
          </div>

          {/* Body: Sidebar + Readout */}
          <div className="compare-body">
            {/* Left: LineSidebar */}
            <div className="compare-sidebar-wrap">
              <LineSidebar
                items={FEATURES.map((f) => f.name)}
                accentColor="#CFF35A"
                textColor="#B9C6BD"
                markerColor="#2A4538"
                showIndex={true}
                showMarker={true}
                proximityRadius={100}
                maxShift={30}
                falloff="smooth"
                markerLength={60}
                markerGap={0}
                tickScale={0.5}
                scaleTick={true}
                itemGap={20}
                fontSize={1.1}
                smoothing={100}
                defaultActive={0}
                onItemClick={(idx) => setActiveIndex(idx)}
              />
            </div>

            {/* Right: Readout Card */}
            <div
              className="compare-readout-card"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="compare-readout-badge">
                <span className="compare-readout-badge__dot" aria-hidden="true" />
                <span>{activeFeature.name}</span>
              </div>

              <div className="compare-columns">
                {/* Starter Column */}
                <div className="compare-col compare-col--starter">
                  <div className="compare-col-header">
                    <span className="compare-col-plan-name">Starter</span>
                  </div>

                  <div key={`starter-${activeIndex}`} className="compare-val-wrap compare-val-anim">
                    {activeFeature.starter.included ? (
                      <span className={`compare-val ${getValueClass(activeFeature.starter.value)}`}>
                        {activeFeature.starter.value}
                      </span>
                    ) : (
                      <span className="compare-val compare-val--dimmed">
                        <svg width="20" height="4" viewBox="0 0 20 4" fill="none" aria-hidden="true">
                          <line x1="1" y1="2" x2="19" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        Not included
                      </span>
                    )}
                    <span className="compare-caption">{activeFeature.starter.caption}</span>
                  </div>

                  <div
                    className={`compare-meter-track${!activeFeature.starter.included ? ' compare-meter-track--empty' : ''}`}
                    aria-hidden="true"
                  >
                    {activeFeature.starter.included && (
                      <div
                        className="compare-meter-fill"
                        style={{ width: `${activeFeature.starter.meter}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Growth Column */}
                <div className="compare-col compare-col--growth">
                  <div className="compare-col-header">
                    <span className="compare-col-plan-name">Growth</span>
                    <span className="compare-col-tag">POPULAR</span>
                  </div>

                  <div key={`growth-${activeIndex}`} className="compare-val-wrap compare-val-anim">
                    <span className={`compare-val ${getValueClass(activeFeature.growth.value)}`}>
                      {activeFeature.growth.value}
                    </span>
                    <span className="compare-caption">{activeFeature.growth.caption}</span>
                  </div>

                  <div
                    className={`compare-meter-track${!activeFeature.growth.included ? ' compare-meter-track--empty' : ''}`}
                    aria-hidden="true"
                  >
                    {activeFeature.growth.included && (
                      <div
                        className="compare-meter-fill"
                        style={{ width: `${activeFeature.growth.meter}%` }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Readout Footer */}
              <div className="compare-readout-footer">
                <div className="compare-footer-pricing">
                  Starter ₹499/month · Growth ₹999/month
                </div>
                <p className="compare-footer-note">
                  Both plans include job-search setup, email support and a 3-month minimum commitment.
                </p>
              </div>
            </div>
          </div>

          {/* At-a-glance Dots Strip */}
          <div className="compare-dots-strip" aria-label="Feature overview across plans">
            {/* Starter Dots */}
            <div className="compare-dots-group">
              <span className="compare-dots-label">Starter:</span>
              <div className="compare-dots-row" role="tablist" aria-label="Starter features">
                {FEATURES.map((feat, idx) => (
                  <button
                    key={`starter-dot-${feat.name}`}
                    type="button"
                    className={`compare-dot${feat.starter.included ? ' compare-dot--included' : ''}${activeIndex === idx ? ' compare-dot--active' : ''}`}
                    aria-label={`Select ${feat.name} (Starter: ${feat.starter.included ? 'Included' : 'Not included'})`}
                    onClick={() => setActiveIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Growth Dots */}
            <div className="compare-dots-group">
              <span className="compare-dots-label">Growth:</span>
              <div className="compare-dots-row" role="tablist" aria-label="Growth features">
                {FEATURES.map((feat, idx) => (
                  <button
                    key={`growth-dot-${feat.name}`}
                    type="button"
                    className={`compare-dot${feat.growth.included ? ' compare-dot--included' : ''}${activeIndex === idx ? ' compare-dot--active' : ''}`}
                    aria-label={`Select ${feat.name} (Growth: ${feat.growth.included ? 'Included' : 'Not included'})`}
                    onClick={() => setActiveIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
