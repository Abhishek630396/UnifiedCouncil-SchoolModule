import { ChevronRight, Facebook, Instagram, Mail, Share2, Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState } from "react";

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .14 5.35.14 11.94c0 2.1.55 4.15 1.6 5.96L.03 24l6.25-1.64a11.9 11.9 0 0 0 5.79 1.48h.01c6.58 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.19-3.5-8.42ZM12.08 21.8h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.9 9.91-9.9a9.83 9.83 0 0 1 7.01 2.9 9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.9-9.94 9.9Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
  </svg>
);

const socialLinks = [
  { label: "Unified Council on Facebook", icon: Facebook, className: "floating-social-facebook", href: "https://www.facebook.com/UnifiedCouncil" },
  { label: "Message Unified Council on WhatsApp", icon: WhatsAppIcon, className: "floating-social-whatsapp", href: "https://wa.me/919603064939" },
  { label: "Unified Council on Instagram", icon: Instagram, className: "floating-social-instagram", href: "https://www.instagram.com/unified_olympiads/" },
  { label: "Email Unified Council", icon: Mail, className: "floating-social-email", href: "mailto:info@unifiedcouncil.com" },
];

const reviews = [
  { name: "Anita Sharma", role: "Parent of Class 5 student", image: "/assests/images/1.jpeg", text: "The exams are thoughtfully designed and helped my child build real confidence." },
  { name: "Rakesh Menon", role: "Parent of Class 7 student", image: "/assests/images/2.jpeg", text: "A wonderful way to make learning exciting. My son looks forward to every test." },
  { name: "Priya Nair", role: "School coordinator", image: "/assests/images/3.jpeg", text: "The question papers are clear, engaging, and very easy for schools to manage." },
  { name: "Vikram Singh", role: "Parent of Class 4 student", image: "/assests/images/4.jpeg", text: "We saw a big improvement in problem solving after just a few practice tests." },
  { name: "Meera Thomas", role: "Principal, Bright Future School", image: "/assests/images/5.jpeg", text: "Unified Council gives every child a chance to experience healthy competition." },
  { name: "Sanjay Gupta", role: "Parent of Class 6 student", image: "/assests/images/6.jpeg", text: "Excellent support team and a smooth registration experience from start to finish." },
  { name: "Lakshmi Iyer", role: "Parent of Class 3 student", image: "/assests/images/7.jpeg", text: "The online resources made preparation simple, focused, and enjoyable at home." },
  { name: "Amit Joshi", role: "Teacher, Sunrise Academy", image: "/assests/images/8.jpeg", text: "Students become more curious and confident when they see their own progress." },
  { name: "Neha Kapoor", role: "Parent of Class 8 student", image: "/assests/images/9.jpeg", text: "Fair exams, useful feedback, and a lovely experience for both parents and children." },
  { name: "Farah Khan", role: "School coordinator", image: "/assests/images/10.jpeg", text: "The content is age-appropriate and encourages students to think beyond textbooks." },
];

const FloatingSocialTools = () => {
  const [reviewOpen, setReviewOpen] = useState(false);
  return (
    <>
      <nav className="floating-social-bar" aria-label="Connect with Unified Council">
        <div className="floating-share-label"><Share2 aria-hidden="true" /> <span>Connect</span></div>
        {socialLinks.map(({ label, icon: Icon, className, href }) => (
          <a
            key={label}
            className={`floating-social-button ${className}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
          >
            <Icon aria-hidden="true" />
          </a>
        ))}
      </nav>

      <div
        className={`floating-review-dock${reviewOpen ? " is-open" : ""}`}
        onMouseEnter={() => setReviewOpen(true)}
        onMouseLeave={() => setReviewOpen(false)}
        onFocus={() => setReviewOpen(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setReviewOpen(false);
        }}
      >
        <button
          type="button"
          className="floating-review-tab"
          onClick={() => setReviewOpen((isOpen) => !isOpen)}
          aria-expanded={reviewOpen}
          aria-controls="review-panel"
        >
          <span className="floating-review-tab-label">Check Reviews</span>
          <span className="floating-review-tab-brand">TrustMate <i aria-hidden="true">✦</i></span>
          <span className="floating-review-tab-mark" aria-hidden="true" />
          <strong>4.9</strong>
        </button>
        <section id="review-panel" className="floating-review-panel" aria-label="Customer reviews">
          <button type="button" className="floating-review-close" onClick={() => setReviewOpen(false)} aria-label="Close reviews">
            <X aria-hidden="true" />
          </button>
          <a className="floating-review-collection-link" href="#testimonials"><span aria-hidden="true">●</span> How do we collect reviews?</a>
          <div className="floating-review-summary">
            <strong>4.9</strong>
            <div className="floating-review-stars" aria-label="4.9 out of 5 stars">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} aria-hidden="true" fill="currentColor" />)}
            </div>
            <p>46 customer's reviews<br />from all time</p>
            <b>collected and verified by</b>
            <div className="floating-review-brand-lockup">TrustMate <span aria-hidden="true">✦</span></div>
          </div>
          <div className="floating-review-list">
            {reviews.map((item, index) => (
              <article className="floating-review-item" key={item.name}>
                <div className="floating-review-item-header">
                  <img src={item.image} alt="" />
                  <strong>{item.name}</strong>
                  <span>verified <b aria-hidden="true">◆</b></span>
                  <button type="button" aria-label={`More options for ${item.name}`}>⋮</button>
                </div>
                <div className="floating-review-card-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>{item.text}</blockquote>
                <time dateTime={`2025-0${(index % 9) + 1}-06`}>2025-0{(index % 9) + 1}-06</time>
                <div className="floating-review-votes">
                  <button type="button"><ThumbsUp aria-hidden="true" /> {53 - index}</button>
                  <button type="button"><ThumbsDown aria-hidden="true" /> {35 - index}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default FloatingSocialTools;
