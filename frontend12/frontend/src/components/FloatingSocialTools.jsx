import { Facebook, Instagram, MessageCircle, Share2, Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState } from "react";

const socialLinks = [
  { label: "Unified Council on Facebook", icon: Facebook, className: "floating-social-facebook", href: "https://www.facebook.com/UnifiedCouncil", profile: true },
  { label: "Share on WhatsApp", icon: MessageCircle, className: "floating-social-whatsapp", href: "https://api.whatsapp.com/send?text=" },
  { label: "Unified Council on Instagram", icon: Instagram, className: "floating-social-instagram", href: "https://www.instagram.com/unified_olympiads/", profile: true },
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
  const pageUrl = typeof window === "undefined" ? "" : encodeURIComponent(window.location.href);

  return (
    <>
      <nav className="floating-social-bar" aria-label="Share this page">
        <div className="floating-share-label"><Share2 aria-hidden="true" /> <span>Share</span></div>
        {socialLinks.map(({ label, icon: Icon, className, href, profile }) => (
          <a
            key={label}
            className={`floating-social-button ${className}`}
            href={profile ? href : `${href}${pageUrl}`}
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
          <a className="floating-review-collection-link" href="/#testimonials"><span aria-hidden="true">●</span> How do we collect reviews?</a>
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
