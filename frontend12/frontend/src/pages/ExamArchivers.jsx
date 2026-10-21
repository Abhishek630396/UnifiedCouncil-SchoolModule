import { useEffect, useRef, useState } from "react";
import {
	AlertCircle,
	Atom,
	BookOpen,
	Brain,
	ChevronLeft,
	ChevronRight,
	GraduationCap,
	Globe,
	LoaderCircle,
	Medal,
	Search,
	Sparkles,
	Trophy,
	UserRound,
	UsersRound,
} from "lucide-react";
import { PageShell } from "../components/PageShell";
import { getPublicAchieverExams, getPublicAchievers } from "../services/staticContentPublicApi";

const EXAM_CATEGORIES = [
	{ key: "uco-offline", label: "UCO Offline", icon: BookOpen, color: "from-sky-500 to-blue-700" },
	{ key: "uco-online", label: "UCO Online", icon: Sparkles, color: "from-cyan-500 to-teal-600" },
	{ key: "uigko-offline", label: "UIGKO Offline", icon: Globe, color: "from-emerald-500 to-teal-700" },
	{ key: "uieo-offline", label: "UIEO Offline", icon: Brain, color: "from-violet-500 to-purple-700" },
	{ key: "uieo-online", label: "UIEO Online", icon: Sparkles, color: "from-fuchsia-500 to-pink-700" },
	{ key: "nstse-offline", label: "NSTSE Offline", icon: GraduationCap, color: "from-orange-500 to-amber-600" },
	{ key: "nstse-online", label: "NSTSE Online", icon: Trophy, color: "from-rose-500 to-red-700" },
	{ key: "uimo-offline", label: "UIMO Offline", icon: Medal, color: "from-indigo-500 to-blue-800" },
	{ key: "uimo-online", label: "UIMO Online", icon: UsersRound, color: "from-amber-500 to-orange-700" },
];

const RESULT_LIMITS = [
	{ value: "all", label: "All achievers" },
	{ value: "5", label: "Top 5" },
	{ value: "10", label: "Top 10" },
	{ value: "50", label: "Top 50" },
	{ value: "100", label: "Top 100" },
];

const RESULTS_PER_PAGE = 100;
const inputClassName =
	"w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10";

const AchieverPhoto = ({ name, photo }) => {
	const [imageFailed, setImageFailed] = useState(false);

	return (
		<span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
			{(!photo || imageFailed) && <UserRound className="h-6 w-6" aria-hidden="true" />}
			{photo && !imageFailed && (
				<img
					src={photo}
					alt={`${name} photo`}
					loading="lazy"
					className="absolute inset-0 h-full w-full object-cover"
					onError={() => setImageFailed(true)}
				/>
			)}
		</span>
	);
};

const ExamArchivers = () => {
	const [customExams, setCustomExams] = useState([]);
	const [customExamError, setCustomExamError] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [years, setYears] = useState([]);
	const [classes, setClasses] = useState([]);
	const [selectedYear, setSelectedYear] = useState("");
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedLimit, setSelectedLimit] = useState("all");
	const [categoryLoading, setCategoryLoading] = useState(false);
	const [resultsLoading, setResultsLoading] = useState(false);
	const [resultData, setResultData] = useState(null);
	const [error, setError] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const requestId = useRef(0);

	useEffect(() => {
		const controller = new AbortController();
		getPublicAchieverExams(controller.signal)
			.then(setCustomExams)
			.catch((requestError) => {
				if (requestError.name !== "AbortError") {
					setCustomExamError(requestError.message || "Unable to load custom exams.");
				}
			});

		return () => controller.abort();
	}, []);

	const examCategories = [
		...EXAM_CATEGORIES,
		...customExams.map((exam) => ({
			key: `custom-${exam.id}`,
			label: exam.name,
			icon: Trophy,
			color: "from-sky-500 to-indigo-700",
			isCustom: true,
		})),
	];

	const handleCategorySelect = async (category) => {
		const currentRequestId = requestId.current + 1;
		requestId.current = currentRequestId;
		setSelectedCategory(category);
		setYears([]);
		setClasses([]);
		setSelectedYear("");
		setSelectedClass("");
		setSelectedLimit("all");
		setResultData(null);
		setCurrentPage(1);
		setError("");
		setCategoryLoading(true);

		try {
			const data = await getPublicAchievers({ category: category.key });
			if (currentRequestId === requestId.current) {
				setYears(data.years);
				setClasses(data.classes || Array.from({ length: 10 }, (_value, index) => index + 1));
				setResultData(data);
				setCurrentPage(1);
			}
		} catch (requestError) {
			if (currentRequestId === requestId.current) {
				setError(requestError.message || "Unable to load this exam's filters.");
			}
		} finally {
			if (currentRequestId === requestId.current) {
				setCategoryLoading(false);
			}
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!selectedCategory) return;

		const currentRequestId = requestId.current + 1;
		requestId.current = currentRequestId;
		setResultsLoading(true);
		setError("");

		try {
			const data = await getPublicAchievers({
				category: selectedCategory.key,
				year: selectedYear,
				studentClass: selectedClass,
				limit: selectedLimit,
			});
			if (currentRequestId === requestId.current) {
				setResultData(data);
				setCurrentPage(1);
			}
		} catch (requestError) {
			if (currentRequestId === requestId.current) {
				setError(requestError.message || "Unable to load achievers.");
			}
		} finally {
			if (currentRequestId === requestId.current) {
				setResultsLoading(false);
			}
		}
	};

	const records = resultData?.records || [];
	const pageCount = Math.max(1, Math.ceil(records.length / RESULTS_PER_PAGE));
	const visibleRecords = records.slice(
		(currentPage - 1) * RESULTS_PER_PAGE,
		currentPage * RESULTS_PER_PAGE
	);

	return (
		<PageShell
			title="Exam Archives"
			seoDescription="Browse archived Unified Council exam results by exam, year and class."
			testId="exam-archives-page"
			badge={
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-sky-200 bg-sky-100 px-4 py-2">
					<Atom className="h-4 w-4 text-sky-700" aria-hidden="true" />
					<span className="text-sm font-black uppercase tracking-wider text-sky-700">Exam Archives</span>
				</div>
			}
			heroTitle={
				<h1 className="mb-4 text-4xl font-black leading-tight text-slate-800 md:text-5xl">
					Exam Results Archive
				</h1>
			}
			heroSubtitle="Choose an exam, year and class to browse achiever records."
		>
			<main className="bg-slate-50 py-12 md:py-16">
				<div className="mx-auto max-w-7xl space-y-6 px-4">
					<section
						aria-labelledby="archive-exam-heading"
						className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
					>
						<div className="mb-5">
							<p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Browse results</p>
							<h2 id="archive-exam-heading" className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
								Choose an exam category
							</h2>
							<p className="mt-1 text-sm text-slate-500">Select an exam to find its achievers.</p>
						</div>
						{customExamError && (
							<div className="mb-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4" role="status">
								<AlertCircle className="mt-0.5 h-5 w-5 flex-none text-amber-700" aria-hidden="true" />
								<p className="text-sm font-medium text-amber-800">{customExamError}</p>
							</div>
						)}

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
							{examCategories.map((category) => {
								const isSelected = selectedCategory?.key === category.key;
								const Icon = category.icon;
								return (
									<button
										key={category.key}
										type="button"
										aria-pressed={isSelected}
										onClick={() => handleCategorySelect(category)}
										className={`group relative flex min-h-[5.25rem] items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:p-4 ${
											isSelected
												? `border-transparent bg-gradient-to-r ${category.color} text-white shadow-lg`
												: "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300"
										}`}
									>
										{!isSelected && <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${category.color}`} />}
										<span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
											isSelected ? "bg-white/20 text-white" : `bg-gradient-to-br ${category.color} text-white shadow-md`
										}`}>
											<Icon className="h-5 w-5" aria-hidden="true" />
										</span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-extrabold sm:text-base">{category.label}</span>
											<span className={`mt-1 block text-xs font-medium ${isSelected ? "text-white/80" : "text-slate-500"}`}>
												{category.isCustom ? "Custom exam" : category.key.endsWith("online") ? "Online Olympiad" : "Offline Olympiad"}
											</span>
										</span>
										{isSelected && <span className="text-lg font-black" aria-hidden="true">✓</span>}
									</button>
								);
							})}
						</div>
					</section>

					{selectedCategory && (
						<section
							aria-labelledby="archive-filters-heading"
							className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
						>
							<div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-5 sm:p-6">
								<p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">Achievers</p>
								<h2 id="archive-filters-heading" className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
									{selectedCategory.label}
								</h2>
								<p className="mt-1 text-sm text-slate-600">All achievers are shown below. Use the optional filters to narrow the results.</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
								<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
									<div>
										<label htmlFor="archive-year" className="mb-2 block text-sm font-bold text-slate-700">Select year</label>
										<select
											id="archive-year"
											value={selectedYear}
											onChange={(event) => {
												setSelectedYear(event.target.value);
												setCurrentPage(1);
											}}
											className={inputClassName}
											disabled={categoryLoading || years.length === 0}
										>
											<option value="">All years</option>
											{years.map((year) => <option key={year} value={year}>{year}</option>)}
										</select>
									</div>
									<div>
										<label htmlFor="archive-class" className="mb-2 block text-sm font-bold text-slate-700">Select class</label>
										<select
											id="archive-class"
											value={selectedClass}
											onChange={(event) => {
												setSelectedClass(event.target.value);
												setCurrentPage(1);
											}}
											className={inputClassName}
											disabled={categoryLoading || classes.length === 0}
										>
											<option value="">All classes</option>
											{classes.map((studentClass) => (
												<option key={studentClass} value={studentClass}>Class {studentClass}</option>
											))}
										</select>
									</div>
									<div>
										<label htmlFor="archive-limit" className="mb-2 block text-sm font-bold text-slate-700">Select result range</label>
										<select
											id="archive-limit"
											value={selectedLimit}
											onChange={(event) => {
												setSelectedLimit(event.target.value);
												setCurrentPage(1);
											}}
											className={inputClassName}
											disabled={categoryLoading}
										>
											{RESULT_LIMITS.map((limit) => (
												<option key={limit.value} value={limit.value}>{limit.label}</option>
											))}
										</select>
									</div>
								</div>

								<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
									<button
										type="submit"
										disabled={categoryLoading || resultsLoading}
										className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-7 font-bold text-white shadow-lg shadow-indigo-200 transition hover:from-sky-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
										data-testid="archive-submit-btn"
									>
										{resultsLoading
											? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
											: <Search className="mr-2 h-4 w-4" aria-hidden="true" />}
										{resultsLoading ? "Loading achievers..." : "Apply Filters"}
									</button>
									<p className="text-xs text-slate-500">Leave a filter set to “All” to include every matching record. Photos appear when available.</p>
								</div>

								{categoryLoading && (
									<div className="flex items-center gap-2 py-3 text-sm font-medium text-slate-500" role="status">
										<LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
										Loading available years and classes...
									</div>
								)}

								{resultsLoading && (
									<div className="flex items-center gap-2 py-3 text-sm font-medium text-slate-500" role="status">
										<LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
										Loading Class {selectedClass} achievers for {selectedYear}...
									</div>
								)}

								{error && (
									<div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left" role="alert">
										<AlertCircle className="mt-0.5 h-5 w-5 flex-none text-red-700" aria-hidden="true" />
										<p className="text-sm font-medium text-red-800">{error}</p>
									</div>
								)}

								{!resultsLoading && resultData?.available && resultData.records.length === 0 && (
									<div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center" role="status">
										<Trophy className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
										<p className="mt-2 font-bold text-amber-950">No achiever records available yet</p>
										<p className="mt-1 text-sm text-amber-800">
											No {selectedCategory.label} records were found for {selectedYear}, Class {selectedClass}.
										</p>
									</div>
								)}

								{!resultsLoading && resultData?.records?.length > 0 && (
									<div className="overflow-hidden rounded-2xl border border-slate-200">
										<div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-sky-50 to-indigo-50 px-4 py-4">
											<div>
												<h3 className="font-extrabold text-slate-900">
													{selectedYear ? selectedYear : "All years"} · {selectedClass ? `Class ${selectedClass}` : "All classes"}
												</h3>
												<p className="mt-1 text-sm text-slate-600">{selectedCategory.label}</p>
											</div>
											<span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
												{records.length.toLocaleString()} {records.length === 1 ? "achiever" : "achievers"}
											</span>
										</div>
										<div className="overflow-x-auto">
											<table className="w-full min-w-[760px] text-left text-sm">
												<thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
													<tr>
														<th className="px-4 py-3 font-bold">Photo</th>
														<th className="px-4 py-3 font-bold">Rank</th>
														<th className="px-4 py-3 font-bold">Student</th>
														<th className="px-4 py-3 font-bold">School</th>
														<th className="px-4 py-3 font-bold">Score</th>
														<th className="px-4 py-3 font-bold">Place</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-slate-100">
													{visibleRecords.map((record, index) => (
														<tr key={`${selectedCategory.key}-${selectedYear}-${selectedClass}-${record.id}`} className="transition hover:bg-sky-50/50">
															<td className="px-4 py-3"><AchieverPhoto name={record.name} photo={record.photo} /></td>
															<td className="px-4 py-3">
																<span className={`inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 font-extrabold ${
																	index === 0 ? "bg-amber-100 text-amber-800" : "bg-indigo-50 text-indigo-700"
																}`}>
																	{record.rank}
																</span>
															</td>
															<td className="px-4 py-3 font-semibold text-slate-900">{record.name}</td>
															<td className="px-4 py-3 text-slate-600">{record.school}</td>
															<td className="px-4 py-3 font-semibold text-slate-700">{record.score ?? "—"}</td>
															<td className="px-4 py-3 text-slate-600">{record.location || "—"}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
										{pageCount > 1 && (
											<div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
												<p className="text-sm text-slate-600" aria-live="polite">
													Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1}–
													{Math.min(currentPage * RESULTS_PER_PAGE, records.length)} of {records.length.toLocaleString()}
												</p>
												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
														disabled={currentPage === 1}
														className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
													>
														<ChevronLeft className="h-4 w-4" aria-hidden="true" />
														Previous
													</button>
													<span className="text-sm font-semibold text-slate-700">
														Page {currentPage} of {pageCount}
													</span>
													<button
														type="button"
														onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
														disabled={currentPage === pageCount}
														className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
													>
														Next
														<ChevronRight className="h-4 w-4" aria-hidden="true" />
													</button>
												</div>
											</div>
										)}
									</div>
								)}
							</form>
						</section>
					)}
				</div>
			</main>
		</PageShell>
	);
};

export default ExamArchivers;
