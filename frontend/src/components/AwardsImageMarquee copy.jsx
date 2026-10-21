const MARQUEE_IMAGES = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  src: `/assests/images/${index + 1}.jpeg`,
  alt: `Unified Council highlight ${index + 1}`,
}));

function AwardsImageMarquee() {
  const trackImages = [...MARQUEE_IMAGES, ...MARQUEE_IMAGES];

  return (
    <section className="bg-white py-12 md:py-16" data-testid="awards-image-marquee">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-600">
            Highlights
          </p>
          <h3 className="mt-3 text-2xl font-black text-slate-800 md:text-3xl">
            Awards Moments & Recognition
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-500 md:text-base">
            A responsive gallery of Unified Council achievements, moving continuously from right to left.
          </p>
        </div>

        <div className="marquee-shell overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 px-3 py-4 md:px-4 md:py-5">
          <div className="marquee-track flex w-max items-stretch gap-3 md:gap-4">
            {trackImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className="marquee-card group relative shrink-0 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: "center 18%" }}
                  loading={index < MARQUEE_IMAGES.length ? "eager" : "lazy"}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/35 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-shell {
          --card-width: clamp(9.5rem, 24vw, 16rem);
          --card-height: clamp(7.25rem, 16vw, 11rem);
        }

        .marquee-track {
          animation: unified-marquee-scroll 32s linear infinite;
          will-change: transform;
        }

        .marquee-card {
          width: var(--card-width);
          height: var(--card-height);
        }

        .marquee-shell:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes unified-marquee-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(calc(-50% - 0.5rem), 0, 0);
          }
        }

        @media (max-width: 767px) {
          .marquee-shell {
            --card-width: clamp(8rem, 42vw, 10.5rem);
            --card-height: clamp(6.25rem, 28vw, 8rem);
          }
        }
      `}</style>
    </section>
  );
}

export default AwardsImageMarquee;
