import React from 'react';
import LegalPage from '../components/LegalPage';

export const PRIVACY_SECTIONS = [
  {
    id: 'introduction',
    number: '1',
    title: 'Introduction',
    paragraphs: [
      'Hiwork respects your privacy. This policy explains what information we collect when you visit our website or contact us, how we use it, and the choices available to you.',
    ],
  },
  {
    id: 'information-we-collect',
    number: '2',
    title: 'Information We Collect',
    paragraphs: [
      'When you use our enquiry form or contact us by email or WhatsApp, you may provide information such as your name, email address, phone number, location, target role, education, work experience, CV, job preferences and the details in your message.',
      'We may also receive information you choose to share when asking for job-search support. Please provide only information relevant to your request. Do not send passwords, one-time passcodes, payment card details or other account login credentials.',
    ],
  },
  {
    id: 'how-we-use-your-information',
    number: '3',
    title: 'How We Use Your Information',
    leadingParagraph: 'We use the information you provide to:',
    list: [
      'Respond to enquiries and communicate with you about our services.',
      'Understand your job-search goals and recommend a suitable support plan.',
      'Prepare or review CVs, cover letters, job recommendations and other materials you request.',
      'Deliver the services included in your selected plan.',
      'Manage payments, customer support, service updates and records related to our services.',
      'Improve our website and services, where permitted by applicable law.',
    ],
    trailingParagraph:
      'We do not use your information to promise or guarantee a job, interview or other employment outcome.',
  },
  {
    id: 'how-we-share-information',
    number: '4',
    title: 'How We Share Information',
    paragraphs: [
      'We do not sell your personal information. We may share relevant information with service providers who help us operate our website, communicate with customers, process payments or deliver our services. They should use the information only for the services they provide to us.',
      'We may also disclose information when required by law or when reasonably necessary to protect our rights, customers or services.',
      'If you ask us to send a recommendation or other material to you by email or WhatsApp, we will use the contact details you provide for that purpose. Email and messaging services may process information under their own privacy policies.',
    ],
  },
  {
    id: 'how-long-we-keep-information',
    number: '5',
    title: 'How Long We Keep Information',
    paragraphs: [
      'We keep information for as long as reasonably needed to respond to your enquiry, provide the service, maintain relevant business records, resolve disputes or meet legal obligations. When information is no longer needed, we will take reasonable steps to delete it or remove identifying details.',
    ],
  },
  {
    id: 'keeping-your-information-secure',
    number: '6',
    title: 'Keeping Your Information Secure',
    paragraphs: [
      'We use reasonable measures intended to protect the information we hold. No website, email, messaging service or method of electronic storage can be guaranteed to be completely secure.',
    ],
  },
  {
    id: 'your-choices-and-requests',
    number: '7',
    title: 'Your Choices and Requests',
    content: (
      <>
        <p>
          You may contact us to ask what personal information you have provided, request a correction, or request deletion, subject to any legal or record-keeping requirements that apply.
        </p>
        <p>
          To make a privacy request, contact us at{' '}
          <a href="mailto:hiwork.harsh@gmail.com" className="legal-inline-link">
            hiwork.harsh@gmail.com
          </a>
          . Please do not send passwords or sensitive account credentials with your request.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    number: '8',
    title: 'Children',
    content: (
      <p>
        Our services are intended for people who are legally able to use them under applicable law. If you believe a child has provided personal information to us without appropriate permission, contact us at{' '}
        <a href="mailto:hiwork.harsh@gmail.com" className="legal-inline-link">
          hiwork.harsh@gmail.com
        </a>
        .
      </p>
    ),
  },
  {
    id: 'changes-to-this-policy',
    number: '9',
    title: 'Changes to This Policy',
    paragraphs: [
      'We may update this policy from time to time. We will post the updated version on this page and change the "Last updated" date. The updated policy applies from the date it is posted.',
    ],
  },
  {
    id: 'contact',
    number: '10',
    title: 'Contact',
    content: (
      <>
        <p>For questions about this policy or a privacy request, contact:</p>
        <p className="legal-contact-info">
          Hiwork<br />
          Email:{' '}
          <a href="mailto:hiwork.harsh@gmail.com" className="legal-inline-link">
            hiwork.harsh@gmail.com
          </a><br />
          WhatsApp:{' '}
          <a
            href="https://wa.me/917428311662"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-inline-link"
          >
            7428311662
          </a>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="Last updated: 6 November 2026"
      sections={PRIVACY_SECTIONS}
      documentTitle="Privacy Policy | Hiwork"
    />
  );
}
