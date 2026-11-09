import React from 'react';
import LegalPage from '../components/LegalPage';

export const TERMS_SECTIONS = [
  {
    id: 'introduction',
    number: '1',
    title: 'Introduction',
    paragraphs: [
      'These Terms of Service ("Terms") apply when you use the Hiwork website or purchase job-search support from Hiwork. By purchasing or using a service, you agree to these Terms. Please read them before making a payment.',
    ],
  },
  {
    id: 'our-services',
    number: '2',
    title: 'Our Services',
    paragraphs: [
      'Hiwork may provide services such as job recommendations, job-search setup, CV preparation or review, cover letters, skill-gap analysis, reminders, and email or WhatsApp support. The exact services and limits depend on the plan you select and the description shown at the time of purchase.',
    ],
  },
  {
    id: 'your-responsibilities',
    number: '3',
    title: 'Your Responsibilities',
    paragraphs: [
      'You are responsible for providing accurate, complete and up-to-date information needed for your service. We may ask you for additional information before preparing recommendations or application materials, and delays in receiving that information may affect when we can provide the service.',
      'You are also responsible for keeping your contact details current and for checking your email, including spam or junk folders, and your WhatsApp messages.',
    ],
  },
  {
    id: 'no-guarantee-of-outcomes',
    number: '4',
    title: 'No Guarantee of Outcomes',
    paragraphs: [
      'Hiwork does not promise or guarantee that you will receive a particular number of suitable opportunities, get a response from an employer, be shortlisted, receive an interview, or obtain employment. Recommendations depend on your profile, the information you provide, available openings, employer requirements and other factors outside our control.',
      'Any CV, cover letter or other application material we prepare is based on the information you provide. You are responsible for checking it for accuracy and approving it before you use it. We do not submit job applications on your behalf unless a service expressly says so and you separately approve the specific application.',
    ],
  },
  {
    id: 'fees-and-plan-details',
    number: '5',
    title: 'Fees and Plan Details',
    paragraphs: [
      'The price, duration, included services and service limits for each plan are shown on the website or communicated to you before purchase. Please check those details before paying. If a plan has a three-month minimum commitment or another duration requirement, that requirement will be shown with the plan.',
      'Any introductory price, renewal price, billing frequency, and whether a plan renews automatically will be stated at checkout or before payment. If any of these details are unclear, please contact us before purchasing.',
    ],
  },
  {
    id: 'refund-policy',
    number: '6',
    title: 'Refund Policy',
    content: (
      <>
        <p>
          You may request a refund within 48 hours after receiving your first job recommendation from Hiwork by email or WhatsApp.
        </p>
        <p>
          To request a refund, contact us by email at{' '}
          <a href="mailto:hiwork.harsh@gmail.com" className="legal-inline-link">
            hiwork.harsh@gmail.com
          </a>{' '}
          and include the name and contact details used for your purchase so we can identify your account. We will treat the request as received when it reaches us by email.
        </p>
        <p>
          If your request is made within the 48-hour period, we will process the refund to the original payment method, where possible, within 4–6 business days after receiving your request. Your bank, card provider or payment service may take additional time to show the refunded amount.
        </p>
        <p>
          The 48-hour period begins when the first recommendation is sent to the email address or WhatsApp number you provided. Please make sure your contact details are correct and check the relevant inbox or messages. If you cannot access the recommendation, or believe it was sent to the wrong contact details, contact us promptly.
        </p>
        <p>
          Refund requests made after the 48-hour period are not covered by this policy, except where applicable law requires otherwise. This policy does not limit any rights you may have under applicable law.
        </p>
      </>
    ),
  },
  {
    id: 'communication-and-support',
    number: '7',
    title: 'Communication and Support',
    paragraphs: [
      'We will contact you using the email address or phone number you provide. Response times may vary during holidays or periods of high demand.',
    ],
  },
  {
    id: 'acceptable-use',
    number: '8',
    title: 'Acceptable Use',
    paragraphs: [
      'You agree to provide truthful information and to use our services lawfully. You must not use the website or services to send unlawful, abusive, misleading or harmful content, or to interfere with the operation or security of the website.',
    ],
  },
  {
    id: 'privacy',
    number: '9',
    title: 'Privacy',
    content: (
      <p>
        Our handling of personal information is described in our{' '}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="legal-inline-link"
        >
          Privacy Policy
        </a>
        . By using our services, you acknowledge that we will handle information as described there.
      </p>
    ),
  },
  {
    id: 'changes-interruptions-and-availability',
    number: '10',
    title: 'Changes, Interruptions and Availability',
    content: (
      <p>
        We may update, suspend or discontinue part of the website or a service when reasonably necessary. If a change materially affects a service you have already purchased, please contact us at{' '}
        <a href="mailto:hiwork.harsh@gmail.com" className="legal-inline-link">
          hiwork.harsh@gmail.com
        </a>{' '}
        so we can review the issue.
      </p>
    ),
  },
  {
    id: 'limitation-of-liability',
    number: '11',
    title: 'Limitation of Liability',
    paragraphs: [
      'To the extent permitted by applicable law, Hiwork is not responsible for hiring decisions, employer actions, job availability or outcomes resulting from your job search. Nothing in these Terms excludes rights or remedies that cannot legally be excluded.',
    ],
  },
  {
    id: 'changes-to-these-terms',
    number: '12',
    title: 'Changes to These Terms',
    paragraphs: [
      'We may update these Terms from time to time. We will post the current version on this page and change the "Last updated" date. The updated Terms apply from the date they are posted, subject to any rights you have under applicable law.',
    ],
  },
  {
    id: 'contact',
    number: '13',
    title: 'Contact',
    content: (
      <>
        <p>For questions about these Terms, a plan or a refund request, contact:</p>
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

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="Last updated: 6 November 2026"
      sections={TERMS_SECTIONS}
      documentTitle="Terms of Service | Hiwork"
    />
  );
}
