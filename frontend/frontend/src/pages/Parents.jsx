import { BookOpen, Lightbulb, LineChart, Target } from "lucide-react";
import { PageShell } from "../components/PageShell";

const ParentsPage = () => (
	<PageShell
		title="Help Your Child Discover Their Strengths"
		seoDescription="Learn how Unified Council assessments help parents understand children's academic strengths, learning gaps and skills."
		testId="parents-page"
		badge={
			<div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
				<BookOpen className="w-4 h-4 text-sky-700" />
				<span className="text-sm font-black uppercase tracking-wider text-sky-700">For Parents</span>
			</div>
		}
		heroTitle={
			<h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
				Discover Your Child’s <span className="text-sky-600">Strengths &amp; Weaknesses</span>
			</h1>
		}
		heroSubtitle="Help your child excel in Science, Mathematics, English and Computers."
	>
		<main>
			<section className="bg-white py-12 md:py-16">
				<div className="max-w-4xl mx-auto px-4">
					<div className="flex items-start gap-4 mb-10">
						<div className="hidden sm:flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-amber-100 text-amber-700">
							<Target className="h-6 w-6" />
						</div>
						<p className="text-lg leading-relaxed text-slate-700">
							A parent may know that their school-going child is near the top of the class, yet still wonder how the child is performing across the state or country. A report card offers one view; a wider benchmark can help show where a child is thriving and where more support may help.
						</p>
					</div>

					<div className="border-t border-slate-200 pt-8">
						<div className="flex items-center gap-3 mb-4">
							<Lightbulb className="h-5 w-5 text-amber-600" />
							<h2 className="text-2xl font-black text-slate-900">Are children learning better?</h2>
						</div>
						<div className="space-y-4 text-slate-700 leading-relaxed">
							<p>Education aims to help children learn and grow. Yet teaching approaches are often assessed through general impressions, enrolment or attendance figures, rather than by asking the central question: are children learning better?</p>
							<p>One reason is that validated tools for measuring student learning are not widely available. Reliable assessment can help parents, schools and education boards understand what students have learned and how their progress compares with that of students elsewhere.</p>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-slate-50 py-12 md:py-16">
				<div className="max-w-4xl mx-auto px-4">
					<div className="flex items-center gap-3 mb-5">
						<LineChart className="h-6 w-6 text-sky-700" />
						<h2 className="text-2xl md:text-3xl font-black text-slate-900">A clearer picture of learning</h2>
					</div>
					<p className="text-slate-700 leading-relaxed mb-5">
						Unified Council works to develop validated assessment tools that provide accurate measures of student learning. We also aim to build awareness among schools and educators about effective testing practices. Through assessment, children are encouraged to strengthen fundamental knowledge, clarify concepts and develop problem-solving skills.
					</p>
					<p className="text-slate-700 leading-relaxed">
						Our assessments are based on curriculum research, analysis of student achievement and defined skill levels across Indian State, CBSE and ICSE boards. They help parents see more clearly which scholastic skills are strong and where a child may benefit from further practice.
					</p>

					<div className="mt-9 border-t border-slate-200 pt-7">
						<h3 className="text-lg font-bold text-slate-900 mb-3">Assessments for Classes 1 to 12</h3>
						<p className="text-slate-700 leading-relaxed">
							Unified Council’s National Level Science Talent Search Examination (NSTSE), Unified International English Olympiad (UIEO) and Unified Cyber Olympiad (UCO) help assess students’ scholastic skills in areas including Mathematics, Science, English and Computers.
						</p>
					</div>
				</div>
			</section>

			<section className="bg-white py-12 md:py-16">
				<div className="max-w-4xl mx-auto px-4">
					<div className="border-l-4 border-amber-400 bg-amber-50 px-6 py-7 md:px-8">
						<p className="text-xl md:text-2xl font-black leading-snug text-slate-900">
							“Making the younger generation stronger in fundamentals and nourishing their minds for a bright and enterprising future.”
						</p>
					</div>
				</div>
			</section>
		</main>
	</PageShell>
);

export default ParentsPage;
