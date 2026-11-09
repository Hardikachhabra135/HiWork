import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import './LegalPage.css';

export default function LegalPage({
  title,
  lastUpdated,
  sections = [],
  documentTitle,
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    const originalTitle = document.title;
    document.title = documentTitle || `${title} | Hiwork`;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      let currentId = sections[0]?.id || '';

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentId = section.id;
          }
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = originalTitle;
    };
  }, [title, documentTitle, sections]);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 96;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <div className="legal-page" id="home">
      {/* ── Wordmark Header ── */}
      <header className="legal-header" role="banner">
        <div className="container legal-header__inner">
          <Link to="/" className="legal-wordmark" aria-label="Hiwork – go to home">
            <span className="legal-wordmark__dot" aria-hidden="true"></span>
            hiwork
          </Link>
          <nav className="legal-header__nav" aria-label="Legal page navigation">
            <Link to="/" className="legal-header__home-btn">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Legal Body Layout ── */}
      <main className="container legal-container" id="legal-main">
        {/* Desktop Sticky Left Column: Table of Contents */}
        <aside className="legal-sidebar" aria-label="Table of contents">
          <div className="legal-toc-sticky">
            <p className="legal-toc-title">On this page</p>
            <nav className="legal-toc-nav" aria-label="Sections">
              <ul className="legal-toc-list">
                {sections.map((sec) => {
                  const isActive = activeId === sec.id;
                  return (
                    <li key={sec.id} className="legal-toc-item">
                      <a
                        href={`#${sec.id}`}
                        className={`legal-toc-link ${isActive ? 'is-active' : ''}`}
                        onClick={(e) => handleScrollTo(e, sec.id)}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <span className="legal-toc-num">{sec.number}.</span> {sec.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Content Column (max ~760px) */}
        <article className="legal-content">
          <div className="legal-meta">
            <Link to="/" className="legal-back-link" aria-label="Back to home page">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>

            <span className="legal-eyebrow">
              <span className="legal-eyebrow__dot" aria-hidden="true"></span>
              LEGAL
            </span>

            <h1 className="legal-heading">{title}</h1>
            <p className="legal-updated">{lastUpdated}</p>
          </div>

          <div className="legal-sections">
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="legal-section">
                <h2 className="legal-section__title">
                  <span className="legal-section__number">{sec.number}.</span> {sec.title}
                </h2>
                <div className="legal-section__body">
                  {sec.content ? (
                    sec.content
                  ) : (
                    <>
                      {sec.leadingParagraph && <p>{sec.leadingParagraph}</p>}
                      {sec.list && (
                        <ul className="legal-list">
                          {sec.list.map((item, idx) => (
                            <li key={idx} className="legal-list__item">
                              <span className="legal-list__dot" aria-hidden="true"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {sec.trailingParagraph && <p>{sec.trailingParagraph}</p>}
                      {sec.paragraphs?.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </>
                  )}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      {/* ── Site Footer ── */}
      <Footer />
    </div>
  );
}
