import { useState } from "react";
import { AlertCircle, Archive, Search } from "lucide-react";
import { PageShell } from "../components/PageShell";

const EXAMS = [
	{ id: "nstse", name: "NSTSE", logo: "nstse.png" },
	{ id: "uico", name: "UICO", logo: "uico.png" },
	{ id: "uigko", name: "UIGKO", logo: "uigko.png" },
	{ id: "uimo", name: "UIMO", logo: "uimo.png" },
	{ id: "uieo", name: "UIEO", logo: "uieo.png" },
];

const EXAM_OPTIONS = EXAMS.flatMap((exam) => [
	{ value: `${exam.id}-online`, label: `${exam.name} Online` },
	{ value: `${exam.id}-offline`, label: `${exam.name} Offline` },
]);

const YEARS = [2026];
const CLASSES = Array.from({ length: 12 }, (_, index) => index + 1);

const ExamArchivers = () => {
	const [submittedSelection, setSubmittedSelection] = useState(null);

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const exam = EXAM_OPTIONS.find((option) => option.value === formData.get("exam"));

		setSubmittedSelection({
			exam: exam.label,
			year: formData.get("year"),
			className: formData.get("class"),
		});
	};

	return (
		<PageShell
			title="Exam Archives"
			seoDescription="Browse archived Unified Council exam results by exam, year and class."
			testId="exam-archives-page"
			badge={
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-sky-200 bg-sky-100 px-4 py-2">
					<Archive className="h-4 w-4 text-sky-700" aria-hidden="true" />
					<span className="text-sm font-black uppercase tracking-wider text-sky-700">Exam Archives</span>
				</div>
			}
			heroTitle={
				<h1 className="mb-4 text-4xl font-black leading-tight text-slate-800 md:text-5xl">
					Exam Results Archive
				</h1>
			}
			heroSubtitle="Choose an exam, year and class to look up archived results."
		>
			<main className="bg-white py-12 md:py-16">
				<div className="mx-auto max-w-6xl px-4">
					<section aria-label="Available exams" className="mb-12">
						<h2 className="mb-6 text-center text-sm font-black uppercase tracking-widest text-slate-500">
							Our Exams
						</h2>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
							{EXAMS.map((exam) => (
								<div
									key={exam.id}
									className="flex min-h-36 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-5 transition-colors hover:border-sky-200"
								>
									<img
										src={`/assests/exams/${exam.logo}`}
										alt={`${exam.name} logo`}
										className="max-h-24 w-full object-contain"
									/>
								</div>
							))}
						</div>
					</section>

					<section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
						<div className="mb-7">
							<h2 className="text-2xl font-black text-slate-800">Find archived results</h2>
							<p className="mt-2 text-slate-600">Select all three options to continue.</p>
						</div>

						<form onSubmit={handleSubmit} onChange={() => setSubmittedSelection(null)}>
							<div className="grid gap-5 md:grid-cols-3">
								<div>
									<label htmlFor="archive-exam" className="mb-2 block text-sm font-bold text-slate-700">
										Select Exam
									</label>
									<select
										id="archive-exam"
										name="exam"
										required
										defaultValue=""
										className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-3 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
										data-testid="archive-exam-select"
									>
										<option value="" disabled>Select exam</option>
										{EXAM_OPTIONS.map((exam) => (
											<option key={exam.value} value={exam.value}>{exam.label}</option>
										))}
									</select>
								</div>

								<div>
									<label htmlFor="archive-year" className="mb-2 block text-sm font-bold text-slate-700">
										Select Year
									</label>
									<select
										id="archive-year"
										name="year"
										required
										defaultValue=""
										className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-3 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
										data-testid="archive-year-select"
									>
										<option value="" disabled>Select year</option>
										{YEARS.map((year) => (
											<option key={year} value={year}>{year}</option>
										))}
									</select>
								</div>

								<div>
									<label htmlFor="archive-class" className="mb-2 block text-sm font-bold text-slate-700">
										Select Class
									</label>
									<select
										id="archive-class"
										name="class"
										required
										defaultValue=""
										className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-3 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
										data-testid="archive-class-select"
									>
										<option value="" disabled>Select class</option>
										{CLASSES.map((classNumber) => (
											<option key={classNumber} value={classNumber}>Class {classNumber}</option>
										))}
									</select>
								</div>
							</div>

							<div className="mt-7 flex justify-center">
								<button
									type="submit"
									className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-8 py-3 font-bold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
									data-testid="archive-submit-btn"
								>
									<Search className="h-4 w-4" aria-hidden="true" />
									Submit
								</button>
							</div>
						</form>

						{submittedSelection && (
							<div
								role="status"
								className="mt-7 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"
								data-testid="archive-no-results"
							>
								<AlertCircle className="mt-0.5 h-5 w-5 flex-none text-amber-700" aria-hidden="true" />
								<div>
									<p className="font-bold text-slate-800">Results are not available yet.</p>
									<p className="mt-1 text-sm leading-relaxed text-slate-600">
										No results source is connected for {submittedSelection.exam}, {submittedSelection.year}, Class {submittedSelection.className}.
										Please check back later.
									</p>
								</div>
							</div>
						)}
					</section>
				</div>
			</main>
		</PageShell>
	);
};

export default ExamArchivers;
