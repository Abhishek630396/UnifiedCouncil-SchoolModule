import { BookOpen, Gift, Sparkles } from "lucide-react";
import { PageShell } from "../components/PageShell";

const BOOKS = [
  { title: "Passport to Knowledge Republic — II & V", topics: "Moral stories, riddles testing general knowledge, interesting facts & questions, igniting puzzles, mind games and more.", color: "bg-sky-50 border-sky-100", iconBg: "bg-sky-100", iconText: "text-sky-600" },
  { title: "Success Plan Junior", topics: "Right attitude, better concentration, mnemonics, sequential thinking, orderly living, pushing your I.Q., memory trace, brain power and puzzles.", color: "bg-amber-50 border-amber-100", iconBg: "bg-amber-100", iconText: "text-amber-600" },
  { title: "Success Plan", topics: "Effective learning, remembering better, revision techniques, mind mapping, secrets for getting more marks in any exam, puzzles and many more.", color: "bg-green-50 border-green-100", iconBg: "bg-green-100", iconText: "text-green-600" },
  { title: "Success Plan Plus", topics: "How to read faster & more efficiently, relaxation techniques, memory methods, puzzles and other skill-honing topics.", color: "bg-rose-50 border-rose-100", iconBg: "bg-rose-100", iconText: "text-rose-600" },
  { title: "Success Wizard", topics: "Mnemonics, stress management, '25 hours a day', your 12-point plan for personal success, the creative process, lateral thinking puzzles, number & math play.", color: "bg-purple-50 border-purple-100", iconBg: "bg-purple-100", iconText: "text-purple-600" },
  { title: "Success Plan Senior", topics: "Applying memory techniques, classroom listening & note-making, logic puzzles, generating the Koch curve, spelling associations and IQ development.", color: "bg-teal-50 border-teal-100", iconBg: "bg-teal-100", iconText: "text-teal-600" },
  { title: "Success Blue Print", topics: "Winning attitude and success, self-esteem, 10 traps of studying, controlling your internal tapes, Analock, Digi clue and turning obstacles into power.", color: "bg-pink-50 border-pink-100", iconBg: "bg-pink-100", iconText: "text-pink-600" },
];

const SuccessSeriesPage = () => (
  <PageShell
    title="Success Series"
    seoDescription="Unified Council's Success Series — free books for every NSTSE/SLSTSE enrolled student, honing problem-solving skills with a competitive spirit."
    testId="success-series-page"
    badge={
      <div className="inline-flex items-center gap-2 bg-green-100 border-2 border-green-200 rounded-full px-4 py-2 mb-6">
        <Gift className="w-4 h-4 text-green-600" />
        <span className="text-sm font-black uppercase tracking-wider text-green-700">Free With Every NSTSE Enrollment</span>
      </div>
    }
    heroTitle={
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
        Welcome to the Amazing World of{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">Success!</span>
      </h1>
    }
    heroSubtitle="Designed and developed exclusively for today's smart kids and future geniuses — every student enrolling for NSTSE/SLSTSE gets a Success Series book completely FREE."
  >
    <section className="py-16 bg-white" data-testid="success-books-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-black uppercase tracking-wider text-amber-600">The Books</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Success Series Books</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Each book hones problem-solving skills and builds the competitive spirit — matched to the student's class level.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOOKS.map((b, i) => (
            <div key={i} className={`${b.color} border-2 rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300`} data-testid={`success-book-${i}`}>
              <div className={`w-14 h-14 ${b.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                <BookOpen className={`w-7 h-7 ${b.iconText}`} />
              </div>
              <h3 className="font-black text-slate-800 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{b.topics}</p>
            </div>
          ))}

          <div className="bg-slate-900 rounded-3xl p-6 flex flex-col justify-center text-center" data-testid="success-book-more">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-black text-white mb-2">Plus Mathematics & English Success Series</h3>
            <p className="text-sm text-slate-400">Subject-focused editions to sharpen maths and language skills too!</p>
          </div>
        </div>
      </div>
    </section>
  </PageShell>
);

export default SuccessSeriesPage;
