import { ExternalLink, TicketPercent } from "lucide-react";
import { PageShell } from "../components/PageShell";

const PAPERS = [
	{ exam: "NSTSE", label: "NSTSE - Past Question Papers", url: "http://www.bmatalent.com/product-category/e-books-nstse/", color: "amber" },
	{ exam: "UCO", label: "UCO - Past Question Papers", url: "http://www.bmatalent.com/product-category/e-books-uco/", color: "sky" },
	{ exam: "UIEO", label: "UIEO - Past Question Papers", url: "http://www.bmatalent.com/product-category/e-books-uieo/", color: "rose" },
	{ exam: "UIMO", label: "UIMO - Past Question Papers", url: "https://www.bmatalent.com/product-category/e-books-uimo/", color: "emerald" },
];

const colorStyles = {
	amber: "border-amber-200 hover:border-amber-400",
	sky: "border-sky-200 hover:border-sky-400",
	rose: "border-rose-200 hover:border-rose-400",
	emerald: "border-emerald-200 hover:border-emerald-400",
};

const PreviousQuestionPapers = () => (
	<PageShell
		title="Past Question Papers"
		seoDescription="Find past NSTSE, UCO, UIEO and UIMO question papers for purchase. Use discount code ebqp15 for 15% off."
		testId="previous-question-papers-page"
		badge={
			<div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
				<TicketPercent className="w-4 h-4 text-sky-700" />
				<span className="text-sm font-black uppercase tracking-wider text-sky-700">Practice Resources</span>
			</div>
		}
		heroTitle={
			<h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
				Past Question Papers
			</h1>
		}
		heroSubtitle="Purchase past question papers for Unified Council Olympiad exams."
	>
		<main className="bg-white py-12 md:py-16">
			<div className="max-w-4xl mx-auto px-4">
				<div className="grid sm:grid-cols-2 gap-4" aria-label="Past question papers by exam">
					{PAPERS.map((paper) => (
						<a
							key={paper.exam}
							href={paper.url}
							target="_blank"
							rel="noopener noreferrer"
							className={`group flex min-h-24 items-center justify-between gap-4 border-2 ${colorStyles[paper.color]} bg-white px-5 py-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700`}
						>
							<span>
								<span className="block text-xs font-black uppercase tracking-wide text-slate-500">{paper.exam}</span>
								<span className="mt-1 block font-bold text-slate-900 group-hover:text-sky-800">{paper.label}</span>
							</span>
							<ExternalLink className="h-5 w-5 flex-none text-slate-500" aria-hidden="true" />
						</a>
					))}
				</div>

				<aside className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 border-amber-400 bg-amber-50 p-5" aria-label="Discount code">
					<TicketPercent className="h-7 w-7 flex-none text-amber-700" />
					<p className="text-slate-800 leading-relaxed">
						Use discount code <strong className="inline-block rounded bg-white px-2 py-1 font-black tracking-wide text-amber-800">ebqp15</strong> to get <strong>15% off</strong> when buying these papers at BMATalent.com.
					</p>
				</aside>
			</div>
		</main>
	</PageShell>
);

export default PreviousQuestionPapers;
