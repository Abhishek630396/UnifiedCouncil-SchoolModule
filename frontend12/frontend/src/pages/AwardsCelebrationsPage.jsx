import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Calendar, MapPin, Trophy, Sparkles,
  Users, Tv, Camera, ExternalLink, ChevronRight, ChevronLeft, X
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { AWARDS_EVENTS, AWARDS_YEARS, yearUrl } from "../data/awardsEventsData";

const buildEventShareUrl = (event) => {
  const text =
    `${event.intro}\n\n` +
    `Unified Council is India's premier Olympiad organization since 1998, conducting NSTSE, UIMO, UCO & UIEO exams for classes 1-12 to nurture young talent across the country.\n\n` +
    `🌐 Know more: www.unifiedcouncil.com`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

const HERO_ILLUSTRATION = "https://static.prod-images.emergentagent.com/jobs/59766506-a437-42cb-8066-a80f06e8a75b/images/174c0a0a75f13d6c196744204e63ac3094fc1d49cd1405163cbba16977bd67ba.jpeg";

const YearNav = ({ year, position }) => {
  const navigate = useNavigate();
  const idx = AWARDS_YEARS.indexOf(year);
  const prevYear = idx > 0 ? AWARDS_YEARS[idx - 1] : null;
  const nextYear = idx < AWARDS_YEARS.length - 1 ? AWARDS_YEARS[idx + 1] : null;

  return (
    <div className="flex items-center justify-between gap-4" data-testid={`year-nav-${position}`}>
      {prevYear ? (
        <Button
          variant="outline"
          onClick={() => navigate(yearUrl(prevYear))}
          className="rounded-full font-bold border-2"
          data-testid={`year-nav-${position}-prev`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {prevYear} Celebrations
        </Button>
      ) : <span />}
      <Button
        variant="ghost"
        onClick={() => navigate('/events')}
        className="rounded-full font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        data-testid={`year-nav-${position}-all`}
      >
        All Celebrations
      </Button>
      {nextYear ? (
        <Button
          variant="outline"
          onClick={() => navigate(yearUrl(nextYear))}
          className="rounded-full font-bold border-2"
          data-testid={`year-nav-${position}-next`}
        >
          {nextYear} Celebrations
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      ) : <span />}
    </div>
  );
};

const AwardsCelebrationsPage = ({ year: yearProp }) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  let year = yearProp;
  if (!year && slug) {
    const m = slug.match(/^awards_celebrations_(\d{4})\.html$/);
    if (m) year = Number(m[1]);
  }
  const event = AWARDS_EVENTS[year];
  const gallery = event ? event.gallery : [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex((i) => (i - 1 + gallery.length) % gallery.length), [gallery.length]);
  const nextImage = useCallback(() => setLightboxIndex((i) => (i + 1) % gallery.length), [gallery.length]);

  useEffect(() => {
    if (!event) return;
    document.title = `Awards Celebrations ${year} | Unified Council`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = event.intro;
    window.scrollTo(0, 0);
    setLightboxIndex(null);
  }, [year, event]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, prevImage, nextImage]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Event not found</h1>
          <p className="text-slate-500 mb-6">No Awards Celebrations page exists for this year.</p>
          <Button onClick={() => navigate('/awards-celebrations-2025')} className="rounded-full" data-testid="event-not-found-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Latest Celebrations
          </Button>
        </div>
      </div>
    );
  }

  const featured = event.dignitaries[0];
  const others = event.dignitaries.slice(1);

  return (
    <div className="min-h-screen bg-slate-50" data-testid={`awards-celebrations-page-${year}`}>
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-[#FFFBF3] overflow-hidden">
        {/* Playful decorations */}
        <div className="absolute top-12 left-8 w-6 h-6 bg-amber-300 rounded-full opacity-60" />
        <div className="absolute top-32 right-16 w-4 h-4 bg-sky-400 rounded-full opacity-50" />
        <div className="absolute bottom-20 left-1/4 w-5 h-5 bg-rose-400 rounded-full opacity-40" />
        <div className="absolute top-1/2 left-12 w-10 h-10 border-4 border-dashed border-amber-300 rounded-full opacity-50" />
        <div className="absolute bottom-16 right-10 w-14 h-14 border-4 border-dotted border-sky-300 rounded-full opacity-50" />
        <div className="absolute top-16 right-1/3 text-amber-400 opacity-60"><Sparkles className="w-8 h-8" /></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6 justify-center lg:justify-start">
                <a href="/" className="hover:text-slate-600">Home</a>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-700 font-semibold">Awards Celebrations {year}</span>
              </div>

              <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-black uppercase tracking-wider text-amber-700">Annual Awards Function</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
                Awards{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
                  Celebrations
                </span>{" "}
                {year}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 max-w-xl mx-auto lg:mx-0">
                {event.intro}
              </p>

              {/* Infographic cards */}
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto lg:mx-0">
                <div className="bg-white border-2 border-amber-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm" data-testid="hero-info-date">
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase">Event Day</p>
                    <p className="text-sm font-black text-slate-800">{event.dateText}</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-sky-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm" data-testid="hero-info-venue">
                  <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase">Venue</p>
                    <p className="text-sm font-black text-slate-800">{event.venueShort}</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-rose-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm" data-testid="hero-info-exams">
                  <div className="w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase">Olympiads</p>
                    <p className="text-sm font-black text-slate-800">{event.exams}</p>
                  </div>
                </div>
                <div className="bg-white border-2 border-emerald-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm" data-testid="hero-info-prizes">
                  <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase">Prizes</p>
                    <p className="text-sm font-black text-slate-800">Cash, Medals & Trophies</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="rounded-full font-bold px-8 py-6 text-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90"
                  data-testid="awards-hero-register-btn"
                >
                  Be the Next Achiever
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <a
                  href={buildEventShareUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full px-6 py-3.5 text-base transition-colors"
                  data-testid="awards-share-whatsapp-btn"
                >
                  <WhatsAppIcon className="w-5 h-5" /> Share on WhatsApp
                </a>
              </div>
            </div>

            {/* Kids illustration */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-amber-200/60 via-orange-100/60 to-rose-200/60 rounded-full blur-2xl" />
              </div>
              <img
                src={HERO_ILLUSTRATION}
                alt="Kids celebrating on winners podium with trophy, medal and certificate"
                className="relative w-full max-w-md object-contain rounded-[2.5rem] border-4 border-white shadow-xl animate-[float_4s_ease-in-out_infinite]"
                data-testid="hero-kids-illustration"
              />
            </div>
          </div>

          {/* Year navigation */}
          <div className="mt-12">
            <YearNav year={year} position="top" />
          </div>
        </div>
      </section>

      {/* Dignitaries Section */}
      {event.dignitaries.length > 0 && (
        <section className="py-20 bg-slate-900 relative overflow-hidden" data-testid="dignitaries-section">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-amber-400/30 backdrop-blur rounded-full px-4 py-2 mb-4">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-black uppercase tracking-wider text-amber-400">
                  Chief Guests
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Graced by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Eminent Personalities</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Distinguished guests presented awards to the toppers and inspired thousands of students and parents.
              </p>
            </div>

            {/* Featured Guest */}
            <div
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 mb-8 overflow-hidden hover:border-amber-400/40 transition-colors duration-300"
              data-testid="dignitary-card-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500">
                    {featured.photo ? (
                      <img
                        src={featured.photo}
                        alt={featured.name}
                        loading="lazy"
                        className="w-full h-full rounded-full object-cover object-top bg-slate-800"
                        onError={(e) => {
                          e.currentTarget.outerHTML = `<div class="w-full h-full bg-slate-800 rounded-full flex items-center justify-center"><span class="text-3xl font-black text-amber-400">${featured.initials}</span></div>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-black text-amber-400">{featured.initials}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-full px-3 py-1 whitespace-nowrap shadow-lg">
                    Guest of Honour
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{featured.name}</h3>
                  <p className="text-amber-300/90 font-semibold text-lg leading-snug max-w-xl">{featured.title}</p>
                </div>
              </div>
            </div>

            {/* Other Guests */}
            {others.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {others.map((guest, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-center overflow-hidden hover:border-amber-400/40 hover:-translate-y-2 transition-[transform,border-color] duration-300"
                    data-testid={`dignitary-card-${index + 1}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 mx-auto mb-5">
                        {guest.photo ? (
                          <img
                            src={guest.photo}
                            alt={guest.name}
                            loading="lazy"
                            className="w-full h-full rounded-full object-cover object-top bg-slate-800"
                            onError={(e) => {
                              e.currentTarget.outerHTML = `<div class="w-full h-full bg-slate-800 rounded-full flex items-center justify-center"><span class="text-2xl font-black text-amber-400">${guest.initials}</span></div>`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-black text-amber-400">{guest.initials}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-black text-white mb-2 leading-snug">{guest.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{guest.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Media Coverage Section */}
      {event.videos.length > 0 && (
        <section className="py-16 bg-slate-50" data-testid="media-coverage-section">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-rose-50 border-2 border-rose-100 rounded-full px-4 py-2 mb-4">
                <Tv className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-black uppercase tracking-wider text-rose-600">
                  In the News
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Featured Across Leading Media Channels
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The celebrations were covered by top TV channels across the region.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.videos.map((video, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:shadow-lg transition-shadow"
                  data-testid={`media-video-card-${index}`}
                >
                  <video
                    controls
                    preload="none"
                    className="w-full aspect-video bg-slate-900 object-cover"
                    src={video.src}
                  />
                  <div className="px-5 py-3 flex items-center gap-3">
                    {video.logo ? (
                      <div className="h-10 w-16 flex items-center justify-center bg-white rounded-lg border border-slate-100 p-1">
                        <img
                          src={video.logo}
                          alt={`${video.channel} logo`}
                          loading="lazy"
                          className="max-h-8 max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.outerHTML = `<span class="text-xs font-black text-slate-700">${video.channel}</span>`;
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`h-10 w-16 ${video.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-[11px] font-black text-white leading-none text-center px-1">{video.channel}</span>
                      </div>
                    )}
                    <span className="font-bold text-slate-800 text-sm">{video.channel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-16 bg-white" data-testid="gallery-section">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-4 py-2 mb-4">
                <Camera className="w-4 h-4 text-sky-600" />
                <span className="text-sm font-black uppercase tracking-wider text-sky-600">
                  Moments
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Celebration Gallery
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Glimpses of the joy, pride and celebration from the {year} awards function.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="rounded-3xl overflow-hidden border-2 border-slate-100 hover:shadow-lg transition-shadow group cursor-zoom-in"
                  data-testid={`gallery-image-${index}`}
                >
                  <img
                    src={src}
                    alt={`Awards Celebration ${year} moment ${index + 1}`}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>

            {/* More Photos */}
            {event.albums.length > 0 && (
              <div className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-8 text-center">
                <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center justify-center gap-2">
                  <Camera className="w-6 h-6 text-sky-600" />
                  Want More Photos?
                </h3>
                <p className="text-slate-600 mb-6">Browse the complete photo albums from the event.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {event.albums.map((album, index) => (
                    <a
                      key={index}
                      href={album.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white border-2 border-sky-200 text-sky-600 font-bold rounded-full px-6 py-3 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
                      data-testid={`photo-album-link-${index}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {album.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Year navigation (bottom) */}
      <section className="py-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Browse Other Years</p>
          <YearNav year={year} position="bottom" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Trophy className="w-14 h-14 text-white mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            You Could Be On This Stage Next Year!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Register for our Olympiad exams and get a chance to win exciting prizes and national recognition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="rounded-full font-bold px-10 py-6 text-lg bg-white text-slate-800 hover:bg-slate-100"
              data-testid="awards-cta-register-btn"
            >
              Register Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/options')}
              className="rounded-full font-bold px-10 py-6 text-lg border-2 border-white text-white hover:bg-white/10"
              data-testid="awards-cta-explore-btn"
            >
              Explore Exams
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          data-testid="gallery-lightbox"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
            data-testid="lightbox-close-btn"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Previous photo"
            data-testid="lightbox-prev-btn"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <img
            src={gallery[lightboxIndex]}
            alt={`Awards Celebration ${year} moment ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl"
            data-testid="lightbox-image"
          />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Next photo"
            data-testid="lightbox-next-btn"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur rounded-full px-5 py-2">
            <span className="text-white font-bold text-sm" data-testid="lightbox-counter">
              {lightboxIndex + 1} / {gallery.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardsCelebrationsPage;
