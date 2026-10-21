import { ArrowUpRight, BriefcaseBusiness, MapPin, UsersRound } from "lucide-react";
import { PageShell } from "../components/PageShell";

const APPLICATION_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSedIT4m5XtKGbzJOrw3aUHx2qQmcekU6d90LPZ_bi370DxAZA/viewform?vc=0&c=0&w=1&flr=0";

const RESPONSIBILITIES = [
	"Build a list of schools in your town or nearby areas, visit them periodically and present Unified Council's Olympiads.",
	"Coordinate between schools that sign up and Unified Council to help ensure smooth execution of assessments and related activities.",
	"Since the academic year 2020-21, exams have been conducted online. Coordinators can also motivate individual participants from anywhere in the country.",
];

const PROFILES = [
	"Good communication skills and an inclination towards accepting challenges.",
	"Teachers, lecturers, professors and homemakers with an orientation towards school education are preferred.",
	"Homemakers with prior work experience who can devote some time are welcome.",
	"Readiness to work on a freelance basis. Most remuneration is commission-based, with earning potential linked to results.",
	"A quick learner with strong personal motivation for self-improvement.",
	"Willingness to work in the field and travel within the city or town. Having a vehicle would help.",
	"An interest in education and a desire to do something different. Prior experience interacting with schools is helpful.",
];

const CoordinatorPage = () => (
	<PageShell
		title="Become a Coordinator"
		seoDescription="Become a freelance Regional Coordinator with Unified Council and help schools and students participate in Olympiad assessments."
		testId="coordinator-page"
		badge={
			<div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
				<BriefcaseBusiness className="w-4 h-4 text-sky-700" />
				<span className="text-sm font-black uppercase tracking-wider text-sky-700">Regional Coordinators</span>
			</div>
		}
		heroTitle={
			<h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
				Become a Coordinator
			</h1>
		}
		heroSubtitle="Commission-based Sales Executives · Freelance opportunity from anywhere in India"
	>
		<main>
			<section className="bg-white py-12 md:py-16">
				<div className="max-w-4xl mx-auto px-4 space-y-8">
					<div>
						<h2 className="text-2xl font-black text-slate-900 mb-4">Help schools strengthen learning</h2>
						<div className="space-y-4 text-slate-700 leading-relaxed">
							<p>If you want to contribute to education, Unified Council offers an opportunity to interact with schools and partner with them in testing and assessment. Unified Council conducts popular Olympiads for school students, including NSTSE, UIMO, UIEO and UCO.</p>
							<p>These skill-based Olympiads measure understanding, not just the ability to impart information. Their outcomes provide detailed feedback about the academic strengths and areas for improvement of students in classes 1 to 12. Schools can use these insights to benchmark their students nationally and identify where learning support may be needed.</p>
							<p>Many schools have raised their education standards and overall ranking after studying their strengths and weaknesses through our assessments and taking appropriate steps. To date, 11 million students have benefited by participating in our Olympiads.</p>
						</div>
					</div>

					<div className="border-t border-slate-200 pt-8">
						<div className="flex items-center gap-3 mb-5">
							<UsersRound className="h-6 w-6 text-sky-700" />
							<h2 className="text-2xl font-black text-slate-900">Job Description</h2>
						</div>
						<ol className="space-y-4">
							{RESPONSIBILITIES.map((item, index) => (
								<li key={item} className="flex items-start gap-4 text-slate-700 leading-relaxed">
									<span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-800">{index + 1}</span>
									<span>{item}</span>
								</li>
							))}
						</ol>
					</div>

					<div className="border-t border-slate-200 pt-8">
						<h2 className="text-2xl font-black text-slate-900 mb-5">Desired Profiles</h2>
						<ol className="space-y-3">
							{PROFILES.map((item, index) => (
								<li key={item} className="flex items-start gap-4 text-slate-700 leading-relaxed">
									<span className="w-6 flex-none text-right font-bold text-sky-700">{index + 1}.</span>
									<span>{item}</span>
								</li>
							))}
						</ol>
					</div>
				</div>
			</section>

			<section className="bg-slate-50 py-12 md:py-16">
				<div className="max-w-4xl mx-auto px-4">
					<h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Two types of Regional Coordinators</h2>
					<div className="divide-y divide-slate-200 border-y border-slate-200">
						<article className="py-6">
							<h3 className="text-lg font-bold text-slate-900 mb-2">Regional Coordinator (Direct)</h3>
							<p className="text-slate-700 leading-relaxed">Promotes all Unified Council Olympiads for direct registrations on our website.</p>
						</article>
						<article className="py-6">
							<h3 className="text-lg font-bold text-slate-900 mb-2">Regional Coordinator (Institutional)</h3>
							<p className="text-slate-700 leading-relaxed">Promotes all Unified Council Olympiads to schools and institutions in a particular area.</p>
						</article>
					</div>
					<p className="mt-5 text-sm text-slate-600">Both types of coordinators are appointed based on their skills, capabilities and feasibility.</p>

					<div className="mt-10 flex flex-col gap-4 border-l-4 border-amber-400 bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div className="flex items-center gap-2 text-slate-900">
								<MapPin className="h-5 w-5 text-amber-700" />
								<h3 className="text-lg font-black">Interested?</h3>
							</div>
							<p className="mt-1 text-slate-700">Share your details to express your interest in becoming a coordinator.</p>
						</div>
						<a
							href={APPLICATION_FORM}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-700 px-5 py-3 font-bold text-white hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
						>
							Rush your details <ArrowUpRight className="h-4 w-4" />
						</a>
					</div>
				</div>
			</section>
		</main>
	</PageShell>
);

export default CoordinatorPage;
