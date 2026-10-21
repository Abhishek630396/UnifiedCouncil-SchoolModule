import { HelpCircle } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

const FAQS = [
  { q: "How does a student benefit by participating in NSTSE/UCO/UIEO?", a: "These curriculum-based examinations help students assess their strengths and weaknesses in Maths, Science, Computers and English. Developed by highly experienced educational specialists based on a 'skill blueprint', performance analysis is provided at individual student, class, school and country levels." },
  { q: "Who is eligible?", a: "Students of classes I to X, XI (PCM/PCB) and XII (PCM/PCB) are eligible to appear for NSTSE. Students of classes II–X are eligible for UCO & UIEO as well." },
  { q: "How will I come to know about the details of the exam?", a: "You can contact your school's Principal or In-charge Teacher for taking part. Your school can also participate in the examination directly." },
  { q: "My school has not received any information. What do we do?", a: "Send your school's complete address to exam@unifiedcouncil.com. We will send detailed information and registration forms to your school so that your Principal/Teacher can register your names for the exam." },
  { q: "What is the syllabus?", a: "NSTSE is based on the CBSE syllabus — 85% of it is considered for setting the question paper. All our question papers are also suitable for students following ICSE/ISC and various State Board syllabi." },
  { q: "Are there any special books to refer to for preparation?", a: "Brain Mapping Academy (BMA), a leading publishing house, specialises in thought-provoking and application-based questions. Popular series include Talent & Olympiad Exams Resource Books, IIT Foundation & Olympiad Explorer and Reasoning Trainer. Find more at www.bmatalent.com." },
  { q: "My school does not want to register, can I apply on my own?", a: "Yes — you can apply for NSTSE directly as an individual. Other exams require school participation." },
  { q: "Can I get sample questions before writing for the first time?", a: "Sure! You can check the free sample questions on our exam pages, purchase model question papers, or practise previous 5 years' question papers at www.mapmystep.com." },
  { q: "What is the structure and pattern of the examination?", a: "There is a different question paper for each class. All questions are objective-type with NO negative marking for wrong answers." },
  { q: "Are the exams conducted only in English?", a: "Yes, the medium of conducting NSTSE, UCO and UIEO is English only." },
  { q: "When are the results declared?", a: "Results are normally declared about 40 days after the exam date." },
  { q: "Do I have to regularly visit the website for updates?", a: "Important information like date, time and venue of exams and seminars is communicated through your school and published on our website — checking in periodically is a good idea!" },
];

const FAQPage = () => (
  <PageShell
    title="FAQs"
    seoDescription="Frequently asked questions about Unified Council's NSTSE, UCO, UIEO and other Olympiad exams — eligibility, syllabus, pattern, results and more."
    testId="faq-page"
    badge={
      <div className="inline-flex items-center gap-2 bg-purple-100 border-2 border-purple-200 rounded-full px-4 py-2 mb-6">
        <HelpCircle className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-black uppercase tracking-wider text-purple-700">Got Questions?</span>
      </div>
    }
    heroTitle={
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
        Frequently Asked{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500">Questions</span>
      </h1>
    }
    heroSubtitle="Everything parents, students and schools ask us about NSTSE, UCO, UIEO and our other Olympiads."
  >
    <section className="py-16 bg-white" data-testid="faq-section">
      <div className="max-w-3xl mx-auto px-4">
        <Accordion type="single" collapsible className="space-y-4">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 data-[state=open]:border-purple-200 data-[state=open]:bg-purple-50/50"
              data-testid={`faq-item-${i}`}
            >
              <AccordionTrigger className="font-black text-slate-800 text-left hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 text-center" data-testid="faq-contact-note">
          <p className="text-slate-600 font-medium">
            Still have a question? Write to us at{" "}
            <a href="mailto:exam@unifiedcouncil.com" className="font-black text-amber-600 hover:text-amber-700">exam@unifiedcouncil.com</a>{" "}
            or visit our <a href="/contact" className="font-black text-amber-600 hover:text-amber-700">Contact page</a>.
          </p>
        </div>
      </div>
    </section>
  </PageShell>
);

export default FAQPage;
