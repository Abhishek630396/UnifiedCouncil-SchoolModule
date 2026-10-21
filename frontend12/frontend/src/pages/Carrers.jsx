import { BriefcaseBusiness, MapPin, Mail, ArrowUpRight } from "lucide-react";
import { PageShell } from "../components/PageShell";

const POSITIONS = [
	{ id: "sales-manager", title: "Sales Managers", code: "SMR", location: "Various towns" },
	{ id: "regional-coordinator", title: "Regional Coordinators", subtitle: "Commission-based Sales Executives", code: "CO", location: "Various towns" },
	{ id: "educational-specialist", title: "Educational Specialists", code: "ES", location: "Hyderabad; remote considered" },
	{ id: "teacher-trainer", title: "Teacher Trainers", code: "TT", location: "Metros" },
	{ id: "public-relations", title: "Public Relations Executive", code: "PR", location: "Hyderabad" },
	{ id: "dtp-operator", title: "DTP Operators", code: "DTP", location: "Hyderabad" },
];

const ROLES = [
	{
		...POSITIONS[0],
		intro: "The Sales Manager coordinates Unified Council's regional operations. The position carries significant responsibility and requires a strong focus on targets. The current product portfolio includes NSTSE, UCO and UIEO Olympiad exams for school students.",
		description: "Unified Council's flagship offering, NSTSE, is a diagnostic skill-based test that measures understanding and gives students in classes 1 to 12 detailed feedback about their academic strengths and areas for improvement. Over 7.7 million students have taken the tests in 16 countries, including India, Nepal, the Middle East, Russia, Tanzania and Indonesia. NSTSE helps schools benchmark their students' understanding of the curriculum against schools across the country.",
		duties: [
			"Build relationships with school principals, management and teachers, creating demand for Unified Council's offerings and supporting schools after adoption.",
			"Build a team of Regional Coordinators who will lead the frontline sales effort.",
			"Inspire, lead and coordinate the team as partners in school improvement, working with school management.",
			"Grow NSTSE, UCO and UIEO by reaching schools in smaller cities and towns.",
			"Coordinate with product and service leads to maximise geographical reach and coverage.",
		],
		profile: [
			"At least five years of field sales experience with a proven record.",
			"Strong target orientation and a history of exceeding targets.",
			"A quick learner with personal motivation for self-improvement.",
			"Willingness to work in the field and travel extensively.",
			"A team-oriented leader who can motivate and develop an effective team of advisors.",
			"Travel experience and knowledge of the working region's geography and culture are an advantage.",
			"An entrepreneurial outlook, interest in education and enthusiasm for doing something different.",
		],
		notes: ["Minimum experience: 4 years", "Sales Managers are being appointed for major cities across India."],
	},
	{
		...POSITIONS[1],
		intro: "Freelance, commission-based opportunity in any town in India. If you want to contribute to education, Unified Council offers an opportunity to work with schools on skill testing and assessment. Our work with schools includes diagnostic assessment, training programmes and student skill improvement.",
		description: "NSTSE, UCO and UIEO are diagnostic skill-based tests that measure understanding and give students in classes 1 to 12 detailed feedback about their academic strengths and areas for improvement. The exams help schools benchmark student understanding of the curriculum. To date, 7.7 million students have participated and benefited.",
		duties: [
			"Build a list of schools in your town or city, visit them periodically and present NSTSE, UCO and UIEO.",
			"Coordinate between participating schools and Unified Council to keep assessments and related activities running smoothly.",
			"Follow up on school activities and collect feedback from students and teachers.",
			"Report regularly to the Relationship Manager for your region.",
		],
		profile: [
			"Good communication skills and an aptitude for overcoming challenges.",
			"Teachers or professors with an orientation towards school education are preferred.",
			"Former Unified Council homemakers who can devote up to four hours a day are welcome.",
			"Ready to work on a freelance basis. Most remuneration is commission-based, with earning potential tied to results.",
			"A quick learner, comfortable with field work and local travel. Having a vehicle would help.",
			"Interest in education and a desire to do something different. Experience working with schools is helpful.",
		],
		notes: ["Location: Any city or town in India."],
	},
	{
		...POSITIONS[2],
		intro: "Unified Council's mission is to improve the quality of learning in schools through innovative, research-based products. We aim to bring together educational theory and classroom practice, developing approaches that work for India's education system.",
		duties: [
			"Help develop high-quality diagnostic tests that identify learning levels and provide specific feedback for improvement.",
			"Contribute to instructional design and curriculum-related books.",
			"Participate in subject-based research projects to design more effective assessment methods.",
		],
		profile: [
			"Very strong academic fundamentals in school-level English, Mathematics and Science; 80% or higher in school Board examinations.",
			"Teaching or educational experience is highly desirable, along with an understanding of children's abilities at different class levels.",
			"Innovative thinker with a strong interest in reading.",
			"Comfortable using the internet.",
		],
		detail: "Potentially suitable candidates include experienced educationists such as former teachers, principals and academicians, as well as academically strong people with a substantial teaching background.",
		notes: ["Minimum experience: 4 years", "Location: Hyderabad. Full-time remote work via the internet may be considered."],
	},
	{
		...POSITIONS[3],
		duties: [
			"Join the educational specialists team in delivering high-quality training programmes that support fundamental school improvement.",
			"Collect, develop and share successful teaching methodologies that schools can use in the classroom.",
		],
		profile: [
			"Senior educationists, including former teachers, principals and academics, with a strong teaching background and educational fundamentals.",
			"Good presentation and training skills.",
			"Strong teaching experience in the chosen subject.",
			"Teaching or educational experience is essential for subject trainers.",
		],
		notes: ["Positions available in metros; part-time positions are also available.", "Minimum experience: 4 years", "Location: All metros."],
	},
	{
		...POSITIONS[4],
		duties: [
			"Manage relationships and coordination with internal and external customers.",
			"Develop and implement the PR strategy, building awareness of the organisation and its products through media partnerships.",
			"Write and publish articles in leading media across the country.",
			"Develop and update content for company newsletters and the website.",
		],
		profile: [
			"Background in Mass Media or Journalism; one to two years of experience as a PR executive preferred. Freshers will be considered.",
			"Smart and presentable, with excellent spoken and written communication skills.",
			"Able to act quickly, work to deadlines and handle PR and media assignments.",
			"Media savvy, internet savvy and proficient with computer applications such as MS Office.",
			"Able to network and build contacts in media and PR organisations.",
			"Experience working with children and doing design work is an added advantage.",
		],
		detail: "The original profile also highlights senior educationists, including former teachers, principals and academics, with strong educational fundamentals.",
		notes: ["Location: Hyderabad."],
	},
	{
		...POSITIONS[5],
		intro: "The image of an organisation is shaped in part by its communication materials. A good designer can make an invaluable contribution to the organisation.",
		duties: [
			"Conceptualise, design, lay out and format materials for print, and supervise printing.",
			"Design and lay out pages for books.",
			"Develop templates for certificates, mark sheets and analysis forms that improve readability and communicate effectively with students and parents.",
			"Develop and update content for company newsletters and the website.",
		],
		profile: [
			"Any degree.",
			"Sound knowledge of digital graphic software, especially PageMaker/CorelDRAW and Adobe Acrobat; MathType experience is also relevant.",
			"Illustration skills are an added advantage.",
			"A natural aptitude for colour, balance and presentation, with a strong foundation in design.",
		],
		notes: ["Minimum experience: 2 years", "Location: Hyderabad."],
	},
];

const BulletList = ({ items }) => (
	<ul className="space-y-2">
		{items.map((item) => (
			<li key={item} className="flex items-start gap-3 text-slate-700 leading-relaxed">
				<span className="mt-2 w-2 h-2 flex-none rounded-full bg-sky-500" aria-hidden="true" />
				<span>{item}</span>
			</li>
		))}
	</ul>
);

const CareersPage = () => (
	<PageShell
		title="Careers"
		seoDescription="Explore career opportunities with Unified Council in sales, education, teacher training, public relations and design."
		testId="careers-page"
		badge={
			<div className="inline-flex items-center gap-2 bg-sky-100 border-2 border-sky-200 rounded-full px-4 py-2 mb-6">
				<BriefcaseBusiness className="w-4 h-4 text-sky-700" />
				<span className="text-sm font-black uppercase tracking-wider text-sky-700">Careers</span>
			</div>
		}
		heroTitle={
			<h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
				Career with Unified Council
			</h1>
		}
		heroSubtitle="We are continually looking for talented, thoughtful and creative people with the confidence and drive to take on challenging projects independently and see them through."
	>
		<main>
			<section className="bg-white py-10 md:py-14">
				<div className="max-w-5xl mx-auto px-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-8">
						<p className="text-slate-700 leading-relaxed max-w-2xl">
							If you find an opportunity below that suits you, please send your CV to {" "}
							<a className="font-bold text-sky-700 underline underline-offset-4" href="mailto:coor@unifiedcouncil.com">coor@unifiedcouncil.com</a>.
						</p>
						<a
							href="mailto:coor@unifiedcouncil.com?subject=Career%20with%20Unified%20Council"
							className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-700 px-5 py-3 font-bold text-white hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
						>
							<Mail className="w-4 h-4" /> Send your CV
						</a>
					</div>

					<div className="pt-8">
						<h2 className="text-2xl font-black text-slate-900 mb-5">Positions Available</h2>
						<div className="divide-y divide-slate-200">
							{POSITIONS.map((position, index) => (
								<a
									key={position.id}
									href={`#${position.id}`}
									className="grid grid-cols-[2rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)_5rem_minmax(9rem,0.7fr)_auto] gap-x-3 gap-y-1 items-center py-4 group"
								>
									<span className="text-sm text-slate-400">{index + 1}.</span>
									<span className="font-bold text-slate-900 group-hover:text-sky-700">
										{position.title}
										{position.subtitle && <span className="block text-sm font-normal text-slate-500">{position.subtitle}</span>}
									</span>
									<span className="hidden sm:block text-sm text-slate-600">{position.code}</span>
									<span className="hidden sm:flex items-center gap-1 text-sm text-slate-600"><MapPin className="w-3.5 h-3.5" />{position.location}</span>
									<ArrowUpRight className="hidden sm:block w-4 h-4 text-slate-400 group-hover:text-sky-700" />
								</a>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="bg-slate-50 py-12 md:py-16">
				<div className="max-w-5xl mx-auto px-4 space-y-12">
					{ROLES.map((role) => (
						<article id={role.id} key={role.id} className="scroll-mt-24 border-b border-slate-200 pb-10 last:border-0">
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
								<div>
									<p className="text-sm font-bold uppercase tracking-wide text-sky-700">{role.code} · {role.location}</p>
									<h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{role.title}</h2>
									{role.subtitle && <p className="text-slate-600 mt-1">{role.subtitle}</p>}
								</div>
								<a className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-900" href={`mailto:coor@unifiedcouncil.com?subject=${encodeURIComponent(`Application: ${role.title}`)}`}>
									<Mail className="w-4 h-4" /> Apply by email
								</a>
							</div>
							{role.intro && <p className="text-slate-700 leading-relaxed mb-4">{role.intro}</p>}
							{role.description && <p className="text-slate-700 leading-relaxed mb-6">{role.description}</p>}
							{role.detail && <p className="text-slate-700 leading-relaxed mb-6">{role.detail}</p>}
							<div className="grid md:grid-cols-2 gap-8">
								<div>
									<h3 className="text-lg font-bold text-slate-900 mb-4">Job Description</h3>
									<BulletList items={role.duties} />
								</div>
								<div>
									<h3 className="text-lg font-bold text-slate-900 mb-4">Desired Profile</h3>
									<BulletList items={role.profile} />
								</div>
							</div>
							{role.notes && <ul className="mt-6 space-y-1 text-sm font-semibold text-slate-600">{role.notes.map((note) => <li key={note}>{note}</li>)}</ul>}
						</article>
					))}
				</div>
			</section>
		</main>
	</PageShell>
);

export default CareersPage;
