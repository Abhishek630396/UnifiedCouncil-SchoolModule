import { Newspaper, ExternalLink, PlayCircle } from "lucide-react";

const NEWS_ITEMS = [
  {
    source: "Ind Today",
    domain: "indtoday.com",
    headline: "Unified Council Foundation organised Annual Awards 2018",
    description: "Coverage of the grand Annual Awards function honouring Olympiad toppers.",
    url: "http://indtoday.com/tag/unified-council-foundation-organised-annual-awards-2018/",
    color: "bg-red-500",
    initials: "IT",
  },
  {
    source: "Social News",
    domain: "socialnews.xyz",
    headline: "Unified Council National Talent Search Annual Awards 2018 — Gallery",
    description: "Photo gallery from the National Talent Search Annual Awards celebrations.",
    url: "https://www.socialnews.xyz/2018/06/10/unified-council-national-talent-search-annual-awards-2018-gallery/",
    color: "bg-sky-500",
    initials: "SN",
  },
  {
    source: "Pinterest News",
    domain: "pinterest.com",
    headline: "Unified Council Annual Awards 2018 on Pinterest",
    description: "Pinned highlights and moments from the awards ceremony.",
    url: "https://www.pinterest.com/pin/522839837986155893/",
    color: "bg-rose-600",
    initials: "P",
  },
];

const NewsSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden" data-testid="news-section">
      <div className="absolute top-10 right-10 w-14 h-14 border-4 border-dashed border-amber-200 rounded-full opacity-60" />
      <div className="absolute bottom-16 left-8 w-5 h-5 bg-sky-300 rounded-full opacity-50" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-rose-50 border-2 border-rose-100 rounded-full px-4 py-2 mb-4">
            <Newspaper className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-black uppercase tracking-wider text-rose-600">In The News</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
            Making <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500">Headlines</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our Annual Awards celebrations featured across leading news platforms.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Video */}
          <div className="rounded-3xl overflow-hidden border-2 border-slate-100 shadow-lg bg-black" data-testid="news-video-card">
            <iframe
              src="https://www.youtube-nocookie.com/embed/XVfU7gWwWzU?start=9&rel=0"
              title="Unified Council Annual Awards media coverage"
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              data-testid="news-video-iframe"
            />
            <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <p className="text-white font-bold text-sm">Watch: Unified Council Annual Awards — TV Coverage</p>
            </div>
          </div>

          {/* News cards */}
          <div className="flex flex-col gap-4">
            {NEWS_ITEMS.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-amber-300 rounded-3xl p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-[transform,border-color,box-shadow,background-color] duration-300"
                data-testid={`news-card-${index}`}
              >
                <div className="w-14 h-14 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
                    alt={`${item.source} logo`}
                    loading="lazy"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.outerHTML = `<div class="w-full h-full ${item.color} flex items-center justify-center"><span class="text-white font-black text-sm">${item.initials}</span></div>`;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-wider text-rose-600 mb-1">{item.source}</p>
                  <h3 className="font-black text-slate-800 text-sm leading-snug mb-1 line-clamp-2">{item.headline}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-amber-500 flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
