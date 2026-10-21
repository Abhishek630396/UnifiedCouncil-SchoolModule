import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const testimonialChildImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF6pBgei6eN-mp3c_OcsCdsonMoqVmMpYmcf0eywNuZg&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxfOVotBtsAibOV5ifXMhlvB1oyIDDg-72miQ-5dzcZg&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwP8C-RaTaFqGJr6y_4k3bm6rlDU1EKiBiDjM22FV7tQ&s=10",
];

const TestimonialCard = ({ testimonial, isActive, colorIndex, imageIndex }) => {
  return (
    <div
      className={`testimonial-card testimonial-card-palette-${colorIndex} bg-white rounded-3xl border-2 border-slate-100 p-8 md:p-10 shadow-sm transition-all duration-500 ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-50"
      }`}
      data-testid={`testimonial-${testimonial.id}`}
    >
      <img className="testimonial-student-photo" src={testimonialChildImages[imageIndex % testimonialChildImages.length]} alt="" />

      {/* Quote Text */}
      <p className="text-lg md:text-xl text-slate-700 font-medium leading-relaxed mb-6">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <h4 className="testimonial-author-name font-bold text-slate-800">{testimonial.name}</h4>
    </div>
  );
};

const TestimonialsSection = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const defaultTestimonials = [
    {
      id: "1",
      name: "Mr. R. Jagan",
      school: "Kennedy High School",
      text: "It is very good for the children to develop their knowledge in English. Our children show so much interest for the preparation.",
      role: "Principal"
    },
    {
      id: "2",
      name: "Ms. Namrata Gupta",
      school: "Bishop Conrod Sr. Sec. School",
      text: "The examinations undoubtedly inculcates the understanding of the fundamentals of education.",
      role: "Vice Principal"
    },
    {
      id: "3",
      name: "Mrs. Saroj Gupta",
      school: "Somerville School",
      text: "These exams are a launch pad for students enabling them to prepare for future competitions.",
      role: "Principal"
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev === displayTestimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayTestimonials.length]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === 0 ? displayTestimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev === displayTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50/50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-50 border-2 border-pink-100 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">💬</span>
            <span className="text-sm font-black uppercase tracking-wider text-pink-600">
              What Educators Say
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Hear from principals and educators who trust Unified Council
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Main Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayTestimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                  <TestimonialCard 
                    testimonial={testimonial} 
                    isActive={index === currentIndex}
                    colorIndex={index % 3}
                    imageIndex={index}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="rounded-full border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600"
              data-testid="testimonial-prev-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? "bg-sky-500 w-8" 
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  data-testid={`testimonial-dot-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600"
              data-testid="testimonial-next-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
