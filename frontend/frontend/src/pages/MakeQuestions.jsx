import { BookOpen, Mail } from "lucide-react";
import { PageShell } from "../components/PageShell";

const SUBJECTS = [
	"Maths",
	"General Science",
	"Physics",
	"Chemistry",
	"Biology",
	"Computers",
	"English",
	"General Awareness",
	"Reasoning",
];

const MakeQuestions = () => (
		<PageShell
			title="Make Questions for NSTSE"
			seoDescription="Contribute questions for Unified Council's NSTSE, UCO and UIEO Olympiad exams."
			testId="make-questions-page"
			badge={
				<div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
					<BookOpen className="w-4 h-4 text-sky-700" />
					<span className="text-sm font-black uppercase tracking-wider text-sky-700">Contribute to Olympiads</span>
				</div>
			}
			heroTitle={
				<h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
					Make Questions for NSTSE
				</h1>
			}
			heroSubtitle="Share your expertise and help create meaningful questions for students."
		>
			<main className="bg-white py-12 md:py-16">
				<div className="max-w-4xl mx-auto px-4">
					<section aria-labelledby="contribute-heading">
						<p className="text-lg leading-relaxed text-slate-700 mb-8">
							Would you like to contribute to our NSTSE/UCO/UIEO Olympiad exams by sending questions to be incorporated therein? We welcome contributions for students in classes 1 to 12.
						</p>
						<h2 id="contribute-heading" className="text-2xl font-black text-slate-900 mb-5">
							Subjects covered
						</h2>
						<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
							{SUBJECTS.map((subject) => (
								<li key={subject} className="flex items-center gap-3 text-slate-700">
									<span className="w-2 h-2 rounded-full bg-sky-500 flex-none" aria-hidden="true" />
									{subject}
								</li>
							))}
						</ul>
					</section>

					<section aria-labelledby="submission-heading" className="mt-10 border-t border-slate-200 pt-8">
						<h2 id="submission-heading" className="text-2xl font-black text-slate-900 mb-5">
							Submission and payment
						</h2>
						<div className="space-y-4 text-lg leading-relaxed text-slate-700">
							<p>We welcome contributions, but regret that every contribution may not be acknowledged.</p>
							<p>We pay Rs. 25 to Rs. 100 per accepted question, depending on the question’s quality and utility.</p>
						</div>
						<div className="mt-8">
							<p className="text-slate-700 mb-4">For details, please contact us with your sample questions:</p>
							<a
								href="mailto:coor@unifiedcouncil.com"
								className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-5 py-3 font-bold text-white hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
							>
								<Mail className="h-4 w-4" />
								coor@unifiedcouncil.com
							</a>
						</div>
					</section>
				</div>
			</main>
		</PageShell>
);

export default MakeQuestions;
