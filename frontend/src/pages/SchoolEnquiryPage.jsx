import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Globe2,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/SchoolsFooter";
import SchoolEnquiryForm from "../components/SchoolEnquiryForm";

function SchoolEnquiryPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "School Enquiry — Unified Council";
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-white">
      <Header
        sticky={false}
        stickyUtility
        registerPath="/student-registration-through-school"
        showSchoolsUtility={false}
        showOptionsUtility={false}
        showResultsOnMobile={false}
        navigateToMissingSection={false}
        onResults={() => navigate("/#exams")}
        onRegister={() => navigate("/student-registration-through-school")}
      />
      <main className="relative isolate overflow-hidden bg-[#f4f8fc]">
        <div className="pointer-events-none absolute -right-40 -top-36 -z-10 h-[34rem] w-[34rem] rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
          <button
            type="button"
            onClick={() => navigate("/schools")}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:-translate-x-0.5 hover:border-sky-200 hover:text-sky-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Schools
          </button>

          <div className="grid items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <section className="order-2 relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#07152d] via-[#0c2850] to-[#104a76] p-7 text-white shadow-2xl shadow-sky-950/15 lg:order-1 md:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/20 bg-sky-300/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-100">
                  <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  School partnerships
                </div>
                <h1 className="max-w-xl text-3xl font-black leading-[1.12] tracking-tight md:text-5xl">
                  Give your students a bigger stage to shine.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
                  Tell us a little about your school. Our School Relations Team will help you explore Olympiads, exam dates and the next steps.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { value: "5,000+", label: "Partner schools", Icon: Trophy },
                    { value: "30+", label: "Countries", Icon: Globe2 },
                    { value: "14M+", label: "Students reached", Icon: UsersRound },
                  ].map(({ value, label, Icon }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur-sm sm:p-4">
                      <Icon className="mb-3 h-4 w-4 text-sky-300" aria-hidden="true" />
                      <p className="text-lg font-black tracking-tight sm:text-2xl">{value}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase leading-snug tracking-wider text-slate-300 sm:text-xs">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t border-white/15 pt-7">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.15em] text-sky-200">What happens next</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["01", "Share your details"],
                      ["02", "We understand your needs"],
                      ["03", "Plan your school’s next step"],
                    ].map(([number, label]) => (
                      <div key={number} className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-300/15 text-[11px] font-black text-sky-200">{number}</span>
                        <span className="pt-1 text-sm font-semibold leading-5 text-slate-200">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mt-auto grid gap-3 pt-8 sm:grid-cols-2">
                <a href="tel:+919030007881" className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 transition-colors hover:border-sky-200/50 hover:bg-white/10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-300/15">
                    <Phone className="h-4 w-4 text-sky-200" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">Call our team</span>
                    <span className="block truncate text-sm font-bold text-white">90300 07881</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
                </a>
                <a href="mailto:support@unifiedcouncil.com" className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 transition-colors hover:border-sky-200/50 hover:bg-white/10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-300/15">
                    <Mail className="h-4 w-4 text-indigo-200" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">Email us</span>
                    <span className="block truncate text-sm font-bold text-white">support@unifiedcouncil.com</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
                </a>
                <a
                  href="https://wa.me/919030007881?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Unified%20Council%20Olympiads%20for%20my%20school."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 transition-colors hover:border-emerald-200/50 hover:bg-white/10 sm:col-span-2"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15">
                    <MessageCircle className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">Prefer messaging?</span>
                    <span className="block text-sm font-bold text-white">Chat with us on WhatsApp</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section className="order-1 rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/[0.06] sm:p-8 md:p-10 lg:order-2" aria-labelledby="enquiry-form-title">
              <div className="mb-7 flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-sky-700">Let’s get started</p>
                  <h2 id="enquiry-form-title" className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                    Request a school call-back
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Share your details and our team will get in touch within 24 hours.
                  </p>
                </div>
              </div>
              <SchoolEnquiryForm className="min-w-0 border-0 bg-transparent p-0 shadow-none" />
              <div className="mt-6 flex items-start gap-3 border-t border-slate-100 pt-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Your details stay private</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    We’ll only use your information to respond to your school enquiry.
                  </p>
                </div>
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <Clock3 className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
                Usually takes less than a minute
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SchoolEnquiryPage;
