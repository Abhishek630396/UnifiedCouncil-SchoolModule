import { Medal, Trophy } from "lucide-react";
import { PageShell } from "../components/PageShell";

const examAwards = [
	{
		exam: "NSTSE",
		accent: "amber",
		awards: [
			{
				title: "Best Performance Award - School",
				details: [
					"The five top-performing schools in each zone (South, North, East and West) will receive the Best Performance School Award.",
				],
			},
			{
				title: "Top Mentor Award & Best Participation Award - School",
				details: [
					"The award will be presented to schools that forward more than 100 applications.",
					"All principals and coordinating teachers in charge of the exam will receive a Certificate of Appreciation.",
				],
			},
		],
	},
	{
		exam: "UCO",
		accent: "sky",
		awards: [
			{
				title: "Performance Award - School",
				details: [
					"One Best Performance School in each of the 17 zones will be presented with the award.",
					"The principal and teacher in charge of each winning school will receive the Best Contribution in Computer Education Award.",
				],
			},
			{
				title: "Top Mentor Award & Best Participation Award - School",
				details: [
					"A Certificate of Appreciation will be presented to schools that forward more than 100 applications.",
					"All principals and coordinating teachers in charge of the exam will receive a Certificate of Appreciation.",
				],
			},
		],
	},
	{
		exam: "UIEO",
		accent: "rose",
		awards: [
			{
				title: "Best Performance Award - School",
				details: [
					"One Best Performance School in each of the 17 zones will be presented with the award.",
					"The principal and teacher in charge of each winning school will receive the Best Contribution in English Education Award.",
				],
			},
			{
				title: "Top Mentor Award & Best Participation Award - School",
				details: [
					"The award will be presented to schools that forward more than 100 applications.",
					"All principals and coordinating teachers in charge of the exam will receive a Certificate of Appreciation.",
				],
			},
		],
	},
	{
		exam: "UIMO",
		accent: "emerald",
		awards: [
			{
				title: "Best Performance Award - School",
				details: [
					"One Best Performance School in each of the 17 zones will be presented with the award.",
					"The principal and teacher in charge of each winning school will receive the Best Contribution in Computer Education Award and a cash prize of Rs. 3,000 each.",
				],
			},
			{
				title: "Top Mentor Award - State",
				details: [
					"The principal and teacher in charge of the five schools with the highest participation from each state will each receive a cash prize of Rs. 1,500 and a certificate. A minimum participation of 300 schools in the state is required.",
				],
			},
			{
				title: "Best Participation School",
				details: [
					"A Certificate of Appreciation will be presented to schools that forward more than 100 applications.",
					"All UIMO coordinating teachers in charge will receive a Certificate of Appreciation.",
				],
			},
		],
	},
];

const accentStyles = {
	amber: {
		text: "text-amber-700",
		icon: "bg-amber-100 text-amber-700",
		border: "border-amber-200",
		wash: "bg-amber-50",
	},
	sky: {
		text: "text-sky-700",
		icon: "bg-sky-100 text-sky-700",
		border: "border-sky-200",
		wash: "bg-sky-50",
	},
	rose: {
		text: "text-rose-700",
		icon: "bg-rose-100 text-rose-700",
		border: "border-rose-200",
		wash: "bg-rose-50",
	},
	emerald: {
		text: "text-emerald-700",
		icon: "bg-emerald-100 text-emerald-700",
		border: "border-emerald-200",
		wash: "bg-emerald-50",
	},
};

const SchoolAwards = () => (
		<PageShell
		title="School Awards"
		seoDescription="Institutional awards for NSTSE, UCO, UIEO and UIMO, including school performance, participation and mentor awards."
		testId="school-awards-page"
		badge={
			<div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-200 rounded-full px-4 py-2 mb-6">
				<Trophy className="w-4 h-4 text-amber-700" />
				<span className="text-sm font-black uppercase tracking-wider text-amber-800">Institutional Awards</span>
			</div>
		}
		heroTitle={
			<h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
				School Awards
			</h1>
		}
		heroSubtitle="Recognising school performance, participation and the educators who make learning possible."
	>
	      <main className="bg-white py-12 md:py-16">
				<div className="max-w-5xl mx-auto px-4 space-y-10">
					{examAwards.map(({ exam, accent, awards }) => {
						const colors = accentStyles[accent];

						return (
							<section key={exam} aria-labelledby={`awards-${exam.toLowerCase()}`}>
								<div className={`flex items-center gap-3 border-b-2 ${colors.border} pb-4 mb-5`}>
									<span className={`w-11 h-11 flex items-center justify-center rounded-lg ${colors.icon}`}>
										<Medal className="w-5 h-5" />
									</span>
									<h2 id={`awards-${exam.toLowerCase()}`} className={`text-2xl md:text-3xl font-black ${colors.text}`}>
										Institutional Awards - {exam}
									</h2>
								</div>

								<div className="divide-y divide-slate-200">
									{awards.map((award) => (
										<article key={award.title} className="py-5 first:pt-0 last:pb-0">
											<h3 className="text-lg font-bold text-slate-900 mb-3">{award.title}</h3>
											<ul className="space-y-2">
												{award.details.map((detail) => (
													<li key={detail} className="flex items-start gap-3 text-slate-700 leading-relaxed">
														<span className={`mt-2 w-2 h-2 flex-none rounded-full ${colors.wash}`} aria-hidden="true" />
														<span>{detail}</span>
													</li>
												))}
											</ul>
										</article>
									))}
								</div>
							</section>
						);
					})}
				</div>
			</main>
			</PageShell>
	);

export default SchoolAwards;
