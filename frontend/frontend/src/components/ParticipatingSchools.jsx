// Keep the logo order aligned with the participating schools list.
const schoolLogos = [
  { name: "Bishop Conrod School", image: "/assests/school_images/BishopConrodSchool.png" },
  { name: "Sri Vidhya Bhrati School", image: "/assests/school_images/SriVidhyaBhratiSchool.png" },
  { name: "Police Modern School", image: "/assests/school_images/PoliceModernSchool.png" },
  { name: "Nehru International Public School", image: "/assests/school_images/NehruInternationalPublicSchool.png" },
  { name: "Ryan International School", image: "/assests/school_images/Ryan.jpg" },
  { name: "Kendriya Vidyalaya", image: "/assests/school_images/KendriyaVidyalaya.png" },
  { name: "Somerville School", image: "/assests/school_images/SomervilleSchool.png" },
  { name: "Imperial Public School", image: "/assests/school_images/ImperialPublicSchool.png" },
  { name: "St. Mary's Convent School", image: "/assests/school_images/St.MarysConventSchool.png" },
  { name: "Kennedy High School", image: "/assests/school_images/KennedyHighSchool.png" },
];

const PARTICIPATING_SCHOOLS = [
  { name: "Ryan International School", city: "Ghaziabad" },
  { name: "Kendriya Vidyalaya", city: "New Delhi" },
  { name: "St. Mary's Convent School", city: "Varanasi" },
  { name: "Imperial Public School", city: "Varanasi" },
  { name: "Somerville School", city: "Greater Noida" },
  { name: "Kennedy High School", city: "Narendra Puram" },
  { name: "Bishop Conrod Sr. Sec. School", city: "Dohna" },
  { name: "Sri Vidhya Bhrati School", city: "Salem" },
  { name: "Police Modern School", city: "Agra" },
  { name: "Nehru International Public School", city: "Noida" }
];

const ParticipatingSchools = () => {
  return (
    <section className="py-16 md:py-24 overflow-hidden" data-testid="participating-schools">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🏫</span>
            <span className="text-sm font-black uppercase tracking-wider text-sky-600">
              Our Partners
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
            Participating Schools
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Join 318+ schools across 15+ countries who trust Unified Council
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="marquee-container py-8">
        <div className="marquee-content">
          {/* First set */}
          {schoolLogos.map((school, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center justify-center mx-6 md:mx-10 flex-shrink-0"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-center shadow-lg grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-110" title={school.name}>
                <img src={school.image} alt={school.name} className="w-full h-full object-contain" />
              </div>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {schoolLogos.map((school, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center justify-center mx-6 md:mx-10 flex-shrink-0"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-center shadow-lg grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-110" title={school.name}>
                <img src={school.image} alt={school.name} className="w-full h-full object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* School list (hidden on mobile) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 mt-8">
        <div className="hidden md:flex flex-wrap justify-center gap-4">
          {PARTICIPATING_SCHOOLS.slice(0, 10).map((school, index) => (
            <div
              key={index}
              className="bg-white rounded-full px-5 py-2 border-2 border-slate-100 text-sm font-semibold text-slate-600 hover:border-sky-500 hover:text-sky-600 transition-colors cursor-pointer"
            >
              {school.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParticipatingSchools;
