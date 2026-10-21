// Offline (school-based) Olympiad exam data — sourced from unifiedcouncil.com
// about-nstse.html, about-uimo.html, about-uco.html

export const OFFLINE_EXAMS = {
  nstse: {
    id: "nstse",
    name: "NSTSE",
    fullName: "National Level Science Talent Search Examination",
    tagline: "India's largest diagnostic Science & Maths talent search",
    subject: "Science & Mathematics",
    classes: "1 – 12",
    color: "purple",
    logo: "https://www.unifiedcouncil.com/images/NSTSE-Logo.png",
    accentLogo: "https://www.unifiedcouncil.com/images/5-cr.jpg",
    offlineDates: ["20-11-2026 (Friday)", "02-12-2026 (Wednesday)"],
    fee: "₹150",
    duration: "1 hour",
    highlight: "Diagnostic Report",
    about: [
      "NSTSE is a diagnostic test which helps students improve their overall learning ability and educational performance. Unlike other tests that measure only how much a student has memorised, NSTSE measures how well a student has understood the concepts and provides detailed skill-wise feedback.",
      "NSTSE helps each child know early whether he/she has properly understood a concept, so that immediate action can be taken to correct the aberration and pave a path for improvement.",
      "The focus is on fundamentals — the base every child needs to face IIT-JEE, NEET, GRE, GMAT, CAT and the competitive world ahead. In NSTSE, the emphasis for scholastic-skill assessment is mainly on Mathematics and Science.",
    ],
    highlights: [
      "Interesting questions that require thinking, not recall",
      "Detailed skill-wise feedback highlighting strengths & weaknesses",
      "Benchmark of the student's performance vs. peers",
      "Aims at improvement — not comparison or grading",
      "Reduces exam stress: tests understanding & reasoning, not just knowing",
    ],
    eligibility:
      "Students of classes 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 and 11 & 12 (PCM / PCB) are eligible to participate.",
    structureNote:
      "This exam is conducted in the school premises of the respective schools.",
    examPattern: [
      { classes: "Class 1", questions: 40, marks: 40, duration: "1 hour" },
      { classes: "Class 2", questions: 50, marks: 50, duration: "1 hour" },
      { classes: "Classes 3 – 10", questions: 60, marks: 60, duration: "1 hour" },
      { classes: "Classes 11 & 12", questions: 80, marks: 80, duration: "1 hour" },
    ],
    marksDivision: [
      {
        group: "Class 1",
        items: [
          { name: "Mathematics", marks: 15 },
          { name: "General Science", marks: 25 },
        ],
      },
      {
        group: "Class 2",
        items: [
          { name: "Mathematics", marks: 20 },
          { name: "General Science", marks: 30 },
        ],
      },
      {
        group: "Classes 3 – 5",
        items: [
          { name: "Mathematics", marks: 25 },
          { name: "General Science", marks: 30 },
          { name: "Critical Thinking", marks: 5 },
        ],
      },
      {
        group: "Classes 6 – 10",
        items: [
          { name: "Mathematics", marks: 25 },
          { name: "Physics", marks: 10 },
          { name: "Chemistry", marks: 10 },
          { name: "Biology", marks: 10 },
          { name: "Critical Thinking", marks: 5 },
        ],
      },
    ],
    syllabusPdf:
      "https://www.unifiedcouncil.com/documents/Syllabus/NSTSE-Syllabus.pdf",
    awards: [
      {
        rank: "NSTSE Topper",
        prize:
          "₹2,00,000 cash prize + Memento (highest percentage across all classes)",
      },
      {
        rank: "Top 3 in each class",
        prize: "Laptop + Tablet PC + Memento",
      },
      { rank: "Ranks 4 – 10", prize: "₹1,500 cash prize each" },
      { rank: "Ranks 11 – 25", prize: "₹1,000 cash prize each" },
      {
        rank: "Ranks 26 – 100",
        prize: "BMA Talent & Olympiad Exams Resource Book",
      },
      {
        rank: "Ranks 1 – 100 (classes 1 – 9)",
        prize:
          "Olympiad Coach Online Subscription (worth up to ₹3,996) + Medal + Certificate",
      },
      {
        rank: "State Toppers (Top 3 per state, min 10,000 students)",
        prize: "Special Encouragement Award + Olympiad Coach Subscription",
      },
    ],
    certificates: [
      "Certificate of Scholar (91 – 100%)",
      "Certificate of Distinction (81 – 90%)",
      "Certificate of Brilliance (71 – 80%)",
      "Participation Certificate for every student",
      "Student Performance Report (SPR) with skill-wise graph",
    ],
    institutional: [
      "Best Performance School Award in each of the 17 zones — ₹3,000 cash prize to Principal + Teacher-in-charge",
      "Top Mentor Award (State) — Cash prize ₹1,500 + Certificate for top 5 schools per state",
      "Best Participation School — Certificate of Appreciation (100+ applications)",
      "Certificate of Appreciation to every co-ordinating Teacher-in-charge",
    ],
    howToApply: [
      "Send a single consolidated Demand Draft towards the exam fee of all students appearing from your school.",
      'D.D. should be drawn in favour of "UNIFIED COUNCIL" payable at HYDERABAD.',
      "Frame the list of students in the given format (preferably typed) and send it with the D.D via Courier / Register Post / Speed Post.",
      "For further details write to support@unifiedcouncil.com or contact the Teacher-in-charge at your school.",
    ],
    sampleQuestionsUrl:
      "https://www.unifiedcouncil.com/documents/nstse/NSTSE_5.pdf",
    sampleQuestions: [
      { label: "Class 1", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_1.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_1.pdf" },
      { label: "Class 2", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_2.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_2.pdf" },
      { label: "Class 3", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_3.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_3.pdf" },
      { label: "Class 4", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_4.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_4.pdf" },
      { label: "Class 5", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_5.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_5.pdf" },
      { label: "Class 6", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_6.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_6.pdf" },
      { label: "Class 7", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_7.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_7.pdf" },
      { label: "Class 8", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_8.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_8.pdf" },
      { label: "Class 9", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_9.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_9.pdf" },
      { label: "Class 10", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_10.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_10.pdf" },
      { label: "Class 11 PCM", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_11PCM.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_11PCM.pdf" },
      { label: "Class 11 PCB", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_11PCB.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_11PCB.pdf" },
      { label: "Class 12 PCM", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_12PCM.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_12PCM.pdf" },
      { label: "Class 12 PCB", questions: "https://www.unifiedcouncil.com/documents/nstse/NSTSE_12PCB.pdf", solutions: "https://www.unifiedcouncil.com/documents/nstse/Solutions_12PCB.pdf" },
    ],
    schoolFormUrl:
      "https://www.unifiedcouncil.com/documents/NSTSE-School-Registration-Form.pdf",
  },

  uimo: {
    id: "uimo",
    name: "UIMO",
    fullName: "Unified International Mathematics Olympiad",
    tagline: "Curriculum-based Maths Olympiad for classes 1 – 10",
    subject: "Mathematics",
    classes: "1 – 10",
    color: "green",
    logo: "https://www.unifiedcouncil.com/images/UIMO-Logo.png",
    accentLogo: null,
    offlineDates: ["11-12-2026 (Friday)"],
    fee: "₹150",
    duration: "1 hour",
    highlight: "Skill Blueprint",
    about: [
      "UIMO is a curriculum-based examination designed to help students assess their strengths & weaknesses in Maths. Developed by highly experienced educational specialists, it provides a conquering charm to young minds with a competitive spirit.",
      "The skill-blueprint reflects in the analysis of performance at individual, class, school and country levels — through a graphical report made available to all.",
    ],
    highlights: [
      "Curriculum-based assessment across CBSE / ICSE / ISC / State boards",
      "Skill-blueprint at individual, class, school and country level",
      "Objective questions with no negative marking",
      "Class-wise question papers",
      "Graphical performance report for every student",
    ],
    eligibility:
      "Students of classes 1, 2, 3, 4, 5, 6, 7, 8, 9 & 10 are eligible to participate.",
    structureNote:
      "This exam is conducted in the school premises of the respective schools.",
    examPattern: [
      { classes: "Classes 1 & 2", questions: 40, marks: 40, duration: "1 hour" },
      { classes: "Classes 3 – 5", questions: 50, marks: 50, duration: "1 hour" },
      { classes: "Classes 6 – 10", questions: 50, marks: 60, duration: "1 hour" },
    ],
    marksDivision: [
      {
        group: "Classes 1 & 2",
        items: [
          { name: "Mathematics", marks: 30 },
          { name: "Logical Reasoning", marks: 10 },
        ],
      },
      {
        group: "Classes 3 – 5",
        items: [
          { name: "Mathematics", marks: 35 },
          { name: "Logical Reasoning", marks: 10 },
          { name: "Critical Thinking", marks: 5 },
        ],
      },
      {
        group: "Classes 6 – 10",
        items: [
          { name: "Mathematics – 1", marks: 30 },
          { name: "Mathematics – 2 (Multiple correct)", marks: 15 },
          { name: "Logical Reasoning", marks: 10 },
          { name: "Critical Thinking", marks: 5 },
        ],
      },
    ],
    marksFootnote:
      "In Mathematics-2 (Questions 31 – 35 for classes 6 – 10), each question is a 'multiple correct answer' type carrying 3 marks. All other questions are 'single correct answer' type, 1 mark each.",
    syllabusPdf:
      "http://www.unifiedcouncil.com/documents/Syllabus/UIMO-Syllabus.pdf",
    awards: [
      {
        rank: "UIMO Topper",
        prize:
          "₹2,00,000 cash prize + Memento (highest percentage across all classes)",
      },
      {
        rank: "Top Rankers + next 2 in each class",
        prize: "Laptop + Tablet PC + Memento",
      },
      { rank: "Ranks 4 – 10", prize: "₹1,500 cash prize each" },
      { rank: "Ranks 11 – 25", prize: "₹1,000 cash prize each" },
      {
        rank: "Ranks 26 – 100",
        prize: "BMA Talent & Olympiad Exams Resource Book",
      },
      {
        rank: "Ranks 1 – 100 (classes 1 – 9)",
        prize:
          "Olympiad Coach Online Subscription (worth up to ₹3,996) + Medal + Certificate",
      },
      {
        rank: "State Toppers (Top 3 per state, min 10,000 students)",
        prize:
          "Olympiad Coach Subscription worth ₹1,198 + Certificate of Appreciation",
      },
      {
        rank: "Class Toppers (3 per class per school)",
        prize: "Medal + Certificate of Appreciation",
      },
    ],
    certificates: [
      "Participation Certificate for every student",
      "Student Performance Report (SPR) with skill-wise graph",
      "Certificate of Appreciation to Class Toppers",
      "Merit certificates for top rankers",
    ],
    institutional: [
      "Best Performance School Award in each of the 17 zones — ₹3,000 cash prize to Principal + Teacher-in-charge",
      "Top Mentor Award (State) — ₹1,500 + Certificate for top 5 schools per state",
      "Best Participation School — Certificate of Appreciation (100+ applications)",
      "Certificate of Appreciation to every co-ordinating Teacher-in-charge",
    ],
    howToApply: [
      "Send a single consolidated Demand Draft for the exam fee of all students from your school.",
      'D.D. should be drawn in favour of "UNIFIED COUNCIL" payable at HYDERABAD.',
      "Frame the list of students in the given format (preferably typed) and send it with the D.D via Courier / Register Post / Speed Post.",
      "For further details write to support@unifiedcouncil.com or contact the Teacher-in-charge at your school.",
      "Note: There is no open-centre facility. Applications only through respective schools.",
    ],
    sampleQuestionsUrl:
      "https://www.unifiedcouncil.com/sample-questions-uimo.html",
    sampleQuestions: [
      { label: "Class 1", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_1_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 2", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_2_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 3", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_3_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 4", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_4_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 5", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_5_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 6", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_6_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 7", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_7_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 8", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_8_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 9", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_9_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
      { label: "Class 10", questions: "https://www.unifiedcouncil.com/documents/UIMO_Sample%20Questions/Class_10_UIMO_Sample%20Questions%20with%20KEY%20&%20Sol..pdf" },
    ],
    preparationLinks: [
      { label: "4 Previous UCO Question Papers", href: "http://www.bmatalent.com/product-category/e-books-uco/", icon: "file" },
      { label: "Online Olympiad Preparation", href: "https://www.olympiadcoach.com/", icon: "monitor" },
      { label: "Unique Reference Books for Olympiads", href: "http://www.bmatalent.com/classwise-books-2/", icon: "book" },
    ],
    schoolFormUrl:
      "https://www.unifiedcouncil.com/documents/UIMO-School-Registration-Form.pdf",
  },

  uieo: {
    id: "uieo",
    name: "UIEO",
    fullName: "Unified International English Olympiad",
    tagline: "Build confidence in English language skills",
    subject: "English",
    classes: "1 – 10",
    color: "pink",
    logo: "/assests/exams/uieo.png",
    offlineDates: ["29-10-2026 (Thursday)", "13-11-2026 (Friday)"],
    onlineDate: "03-01-2027 (Sunday)",
    fee: "₹150",
    feeNote: "Add ₹100 for a set of Olympiad Power Pack question papers.",
    duration: "1 hour",
    highlight: "English Proficiency",
    about: [
      "English is the language most widely used for communication and the first global lingua franca. In the modern era, English is the most popular and most spoken language. Children who know English not only excel in exams but are known to do well in practically every aspect of their dealings.",
      "Assessment of language skills is key to identifying and measuring educational achievement. People's lives around the world are shaped by the outcomes of assessments they receive as part of their education.",
      "Assessment is used at all times and in every field to make decisions. The holistic assessment offered by UIEO helps shape an individual's future and plays a critical role in laying the foundation for a career.",
      "UIEO presents students with an all-encompassing assessment to make learning and mastering the language of the world easier and quicker.",
      "More than 14 million students have participated in examinations conducted by Unified Council to date.",
    ],
    highlights: [
      "Assesses vocabulary, functional grammar, reading comprehension and interactive English",
      "Class-specific question papers for classes 1 to 10",
      "Objective-type questions with no negative marking",
      "Student Performance Report for all participants",
    ],
    eligibility: "Students of classes 1 to 10 are eligible to participate.",
    structureNote:
      "The offline examination is conducted in the school premises of participating schools.",
    examPattern: [
      { classes: "Classes 1 – 4", questions: 35, marks: 35, duration: "1 hour" },
      { classes: "Classes 5 – 10", questions: 50, marks: 50, duration: "1 hour" },
    ],
    marksDivision: [
      {
        group: "Classes 1 – 4",
        items: [
          { name: "Vocabulary & Functional Grammar", marks: 25 },
          { name: "Reading Comprehension", marks: 5 },
          { name: "Interactive English", marks: 5 },
        ],
      },
      {
        group: "Classes 5 – 10",
        items: [
          { name: "Vocabulary & Functional Grammar", marks: 35 },
          { name: "Reading Comprehension", marks: 10 },
          { name: "Interactive English", marks: 5 },
        ],
      },
    ],
    syllabusPdf: "http://www.unifiedcouncil.com/docs/Uieo_Syllabus.pdf",
    syllabusDescription:
      "UIEO question papers are more class-specific than syllabus-specific. The papers are suitable for CBSE, ICSE, ISC and various State Board syllabi.",
    awards: [
      { rank: "Top Ranker and next 2 rankers in each class", prize: "Laptop and Tablet PC respectively, plus a Memento each" },
      { rank: "Ranks 4 – 15 in each class", prize: "₹1,000 cash prize each" },
      { rank: "Ranks 1 – 15 and 16 – 25 (classes 1 – 9)", prize: "Olympiad Coach subscriptions worth ₹1,998 and ₹3,996 respectively, with a Medal and Certificate of Appreciation" },
      { rank: "Top 25 in each class", prize: "Classes 2 – 4: Handbook of Science – Junior; classes 5 – 10: Awesome English, with a Medal and Certificate of Appreciation" },
      { rank: "Top 3 in each zone", prize: "Olympiad Coach subscription worth ₹1,998, a Medal and Certificate of Appreciation" },
      { rank: "Class Toppers", prize: "Three toppers per class in each school receive a Medal and Certificate of Appreciation" },
    ],
    certificates: [
      "Certificate and Student Performance Report (SPR) for all participants",
    ],
    resultDetails: [
      "When more than one student gets an equal top score, ranks are awarded according to marks in the specified order of sections in the question paper.",
      "If students have the same marks when deciding a rank, the student who completed the test in less time receives the higher rank.",
    ],
    institutional: [
      "One Best Performance School Award is presented in each of the 17 zones. The Principal and Teacher-in-Charge receive the Best Contribution in Computer Education Award and ₹3,000 each.",
      "A Certificate of Appreciation is presented to schools that forward more than 100 applications.",
      "All coordinating Teachers-in-Charge of UIEO receive a Certificate of Appreciation.",
    ],
    howToApply: [
      "Send one consolidated Demand Draft towards the examination fee for all students appearing for UIEO from your school.",
      'Draw the Demand Draft in favour of "UNIFIED COUNCIL", payable at HYDERABAD.',
      "Prepare the student list in the given format, preferably typed, and send it with the Demand Draft by courier, Registered Post or Speed Post.",
      "For further details or the information brochure, email support@unifiedcouncil.com or write to Unified Council.",
      "The venue is the respective school; there is no open-centre facility and individual applications are not accepted. Students must apply through their school. Contact the Teacher-in-Charge for details.",
    ],
    sampleQuestions: Array.from({ length: 10 }, (_, index) => {
      const classNumber = index + 1;
      return {
        label: `Class ${classNumber}`,
        questions: `https://www.unifiedcouncil.com/documents/uieo/Class%20-${classNumber}.pdf`,
      };
    }),
    preparationLinks: [
      { label: "Click here for 10 previous NSTSE Question Papers", href: "https://www.bmatalent.com/product-category/e-books-uieo/", icon: "file" },
      { label: "Click here for Online Olympiad preparation", href: "https://www.olympiadcoach.com/", icon: "monitor" },
      { label: "Click here for Unique Reference Books for various Olympiad", href: "http://www.bmatalent.com/classwise-books-2/", icon: "book" },
    ],
  },

  umo: {
    id: "umo",
    name: "UMO",
    fullName: "Unified Mathematics Olympiad",
    tagline: "Advanced mathematics for ambitious problem solvers",
    subject: "Advanced Mathematics",
    classes: "6 – 12",
    color: "orange",
    logo: "/assests/exams/umo.png",
    offlineDates: ["Please contact your school for offline exam details"],
    fee: "₹150",
    duration: "As notified",
    highlight: "Advanced Mathematics",
    about: [
      "UMO is an advanced mathematics olympiad for students in classes 6 to 12, designed to encourage mathematical reasoning and problem solving.",
      "Contact your school for current offline examination availability, schedule and paper details.",
    ],
    highlights: [
      "Advanced mathematics for classes 6 to 12",
      "Problem-solving and mathematical reasoning",
      "Offline participation details available through schools",
    ],
    eligibility: "Students of classes 6 to 12 are eligible to participate.",
    structureNote:
      "Contact your school to confirm offline examination availability and arrangements.",
    examPattern: [
      {
        classes: "Classes 6 – 12",
        questions: "To be announced",
        marks: "To be announced",
        duration: "As notified",
      },
    ],
    marksDivision: [
      {
        group: "Classes 6 – 12",
        items: [{ name: "Advanced Mathematics", marks: "As notified" }],
      },
    ],
    awards: [
      { rank: "Awards and recognition", prize: "Details announced by Unified Council" },
    ],
    certificates: [
      "Contact Unified Council for current certificate and report details.",
    ],
    institutional: [
      "Contact Unified Council for current institutional award details.",
    ],
    howToApply: [
      "Contact your school to confirm offline participation and registration details.",
      "Ask the school coordinator for the current schedule and examination fee.",
    ],
    sampleQuestions: [],
    sampleQuestionsMessage: "Official UMO sample questions are not currently available.",
  },

  uigko: {
    id: "uigko",
    name: "UIGKO",
    fullName: "Unified International General Knowledge Olympiad",
    tagline: "Expand your knowledge horizons",
    subject: "General Knowledge",
    classes: "1 – 10",
    color: "amber",
    logo: "/assests/exams/uigko.png",
    offlineDates: ["07-10-2026 (Wednesday)"],
    fee: "₹150",
    feeNote: "Add ₹100 for a set of Olympiad Power Pack question papers.",
    duration: "1 hour",
    highlight: "General Knowledge",
    about: [
      "The world is changing fast, and students need to be prepared to meet the challenges of the future. Alongside academic learning, young people need life skills such as communication, teamwork, leadership, critical thinking, ethics, smart consumer literacy and decision-making.",
      "Unified Council assesses and practises critical life skills including general knowledge, current affairs, critical and creative thinking, self-management, communication and economic common sense.",
      "A strong foundation in 21st-century skills helps students become successful individuals and global citizens, and better prepared for personal and professional opportunities.",
      "UIGKO tests students on these critical life skills and compares their skills aptitude with students across the globe through real-world scenario-based questions.",
      "Students in grades 1 to 10 from more than 30 countries participate and learn as global citizens. More than 11 million students have participated in UIGKO, and over 14 million students have participated in examinations conducted by Unified Council overall.",
    ],
    highlights: [
      "General Awareness, Current Affairs, Life Skills and Critical Thinking",
      "Real-world scenario-based questions",
      "Class-specific objective papers with no negative marking",
      "Student Performance Report for all participants",
    ],
    eligibility: "Students of classes 1 to 10 are eligible to participate.",
    structureNote:
      "The offline examination is conducted in the school premises of participating schools.",
    examPattern: [
      { classes: "Classes 1 – 4", questions: 40, marks: 40, duration: "1 hour" },
      { classes: "Classes 5 – 10", questions: 50, marks: 50, duration: "1 hour" },
    ],
    marksDivision: [
      {
        group: "Classes 1 – 4",
        items: [
          { name: "General Awareness", marks: 25 },
          { name: "Current Affairs", marks: 5 },
          { name: "Life Skills", marks: 5 },
          { name: "Critical Thinking", marks: 5 },
        ],
      },
      {
        group: "Classes 5 – 10",
        items: [
          { name: "General Awareness", marks: 30 },
          { name: "Current Affairs", marks: 10 },
          { name: "Life Skills", marks: 5 },
          { name: "Critical Thinking", marks: 5 },
        ],
      },
    ],
    marksFootnote:
      "Except for Critical Thinking, each correct answer carries 1 mark. Critical Thinking has 5 questions (questions 36 – 40 for classes 1 – 4 and 46 – 50 for classes 5 – 10), each carrying 1 mark.",
    syllabusPdf:
      "https://www.unifiedcouncil.com/documents/syllabus/UIGKO-Syllabus.pdf",
    syllabusDescription:
      "UIGKO question papers are more class-specific than syllabus-specific. The papers are suitable for CBSE, ICSE, ISC and various State Board syllabi.",
    awards: [
      { rank: "Top Ranker and next 2 rankers in each class", prize: "Laptop and Tablet PC respectively, plus a Memento each" },
      { rank: "Ranks 4 – 10 in each class", prize: "₹1,000 cash prize each" },
      { rank: "Ranks 1 – 25, 26 – 50 and 51 – 100 (classes 1 – 9)", prize: "Olympiad Coach subscriptions worth ₹3,996, ₹2,997 and ₹1,998 respectively, with a Medal and Certificate of Appreciation" },
      { rank: "Top 3 in each zone", prize: "Olympiad Coach subscription worth ₹1,998, a Medal and Certificate of Appreciation" },
      { rank: "Class Toppers and Class Rankers", prize: "Three class toppers per school receive a Medal and Certificate of Appreciation when the class has at least 5 participants. Second and third ranks require more than 10 and 15 participants respectively. Overall, 10% of participants in each class scoring at least 50% are class rankers and receive a Medal and Certificate of Appreciation." },
    ],
    certificates: [
      "Certificate and Student Performance Report (SPR) for all participants",
    ],
    resultDetails: [
      "When more than one student gets an equal top score, ranks are awarded according to marks in the specified order of sections in the question paper.",
      "If students have the same marks when deciding a rank, the student who completed the test in less time receives the higher rank.",
    ],
    institutional: [
      "One Best Performance School Award is presented in each of the 17 zones. The Principal and Teacher-in-Charge receive the Best Contribution in Computer Education Award and ₹3,000 each.",
      "The Principal and Teacher-in-Charge of the top 3 schools with the highest participation in each zone (minimum 300 schools participating) receive ₹1,500 and a Certificate each.",
      "A Certificate of Appreciation is presented to schools that forward more than 100 applications.",
      "All coordinating Teachers-in-Charge receive a Certificate of Appreciation.",
    ],
    howToApply: [
      "Send one consolidated Demand Draft towards the examination fee for all students appearing for UIGKO from your school.",
      'Draw the Demand Draft in favour of "UNIFIED COUNCIL", payable at HYDERABAD.',
      "Prepare the student list in the given format, preferably typed, and send it with the Demand Draft by courier, Registered Post or Speed Post.",
      "For further details or the information brochure, email support@unifiedcouncil.com or write to Unified Council.",
      "The venue is the respective school; there is no open-centre facility and individual applications are not accepted. Students must apply through their school. Contact the Teacher-in-Charge for details.",
    ],
    zones: [
      "Andhra Pradesh",
      "New Delhi",
      "Gujarat",
      "Karnataka, Kerala",
      "Rajasthan",
      "Tamil Nadu",
      "Himachal Pradesh & Punjab",
      "Bihar, Jharkhand",
      "Uttar Pradesh, Uttarakhand",
      "All Union Territories",
      "Madhya Pradesh, Chhattisgarh",
      "Maharashtra, Goa",
      "West Bengal, Odisha",
      "North East States (Assam, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Manipur and Arunachal Pradesh)",
      "Haryana",
      "NCR excluding Delhi",
      "Telangana",
    ],
    sampleQuestions: Array.from({ length: 10 }, (_, index) => {
      const classNumber = index + 1;
      return {
        label: `Class ${classNumber}`,
        questions: `https://www.unifiedcouncil.com/documents/UIGKO/sample-questions/GK-Sample%20Questions-cl-${classNumber}.pdf`,
      };
    }),
    preparationLinks: [
      { label: "Click here for 10 previous NSTSE Question Papers", href: "https://www.bmatalent.com/product-category/e-books-uieo/", icon: "file" },
      { label: "Click here for Online Olympiad preparation", href: "https://www.olympiadcoach.com/", icon: "monitor" },
      { label: "Click here for Unique Reference Books for various Olympiad", href: "http://www.bmatalent.com/classwise-books-2/", icon: "book" },
    ],
  },

  uco: {
    id: "uco",
    name: "UCO",
    fullName: "Unified Cyber Olympiad",
    tagline: "The global cyber talent search — for classes 2 – 10",
    subject: "Computers & Reasoning",
    classes: "2 – 10",
    color: "sky",
    logo: "https://www.unifiedcouncil.com/images/UCO-Logo.png",
    accentLogo: "https://www.unifiedcouncil.com/images/uco-1-crore.gif",
    offlineDates: ["18-09-2026 (Friday)"],
    fee: "₹150",
    duration: "1 hour",
    highlight: "Global Cyber Talent",
    about: [
      "India has seen a spectacular success in IT and computers, acknowledged worldwide. Unified Cyber Olympiad (UCO) is Unified Council's answer to streamlining and fortifying computer education across the country.",
      "UCO motivates children to strengthen their mental ability, logical reasoning and computer knowledge — skills that help them tackle software problems, management crises and everyday decision-making with confidence.",
    ],
    highlights: [
      "Streamlining computer education across India",
      "Instilling competitiveness in computer education",
      "Including logic, reasoning and mental ability in learning",
      "Identifying talent on a nationwide platform",
      "Exposing students to latest technology & study in computers",
    ],
    eligibility: "Students of classes 2, 3, 4, 5, 6, 7, 8, 9 & 10.",
    structureNote:
      "This exam is conducted in the school premises of the respective schools. Medium of the test is English.",
    examPattern: [
      { classes: "All classes (2 – 10)", questions: 50, marks: 50, duration: "1 hour" },
    ],
    marksDivision: [
      {
        group: "All Classes",
        items: [
          { name: "Mental Ability", marks: 15 },
          { name: "Reasoning", marks: 15 },
          { name: "Computers", marks: 15 },
          { name: "English", marks: 5 },
        ],
      },
    ],
    syllabusPdf: "http://www.unifiedcouncil.com/docs/UCO_Syllabus.pdf",
    awards: [
      {
        rank: "Top Ranker + next 2 in each class",
        prize: "Laptop + Tablet PC + Memento",
      },
      { rank: "Ranks 4 – 10", prize: "₹1,000 cash prize each" },
      {
        rank: "Top 25 in each class",
        prize:
          "Olympiad Coach Online Subscription (up to ₹3,996) + Medal + Reasoning Trainer Book (BMA)",
      },
      {
        rank: "All Top 1 – 25 rankers",
        prize: "Medal + Certificate of Appreciation",
      },
    ],
    certificates: [
      "Merit / Participation Certificates for all students",
      "Cyber Diagnostic Report (CDR) — free for every student, with skill graph & ranks",
      "General School Cyber Diagnostic Report (GSCDR) — free for schools",
      "School Cyber Diagnostic Report (SCDR) — free performance analysis per school",
    ],
    institutional: [
      "Best Performance School Award in each of the 17 zones — ₹3,000 cash prize to Principal + Teacher-in-charge",
      "Top Mentor Award (State) — Certificate + Cash prize",
      "Best Participation School — Certificate of Appreciation",
      "Certificate of Appreciation to every co-ordinating Teacher-in-charge",
    ],
    howToApply: [
      "Send a single consolidated Demand Draft for the exam fee of all students from your school.",
      'D.D. should be drawn in favour of "UNIFIED COUNCIL" payable at HYDERABAD.',
      "Frame the student list in the official format and send with the D.D by Courier / Register Post / Speed Post.",
      "For further details mail support@unifiedcouncil.com — school information brochure will be sent.",
      "Note: No open-centre facility. Applications only through respective schools.",
    ],
    sampleQuestionsUrl:
      "https://www.unifiedcouncil.com/sample-questions-uco.html",
    sampleQuestions: [
      { label: "Class 2", questions: "https://www.unifiedcouncil.com/documents/uco/2nd_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/2nd_UCO_SOL.pdf" },
      { label: "Class 3", questions: "https://www.unifiedcouncil.com/documents/uco/3rd_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/3rd_UCO_SOL.pdf" },
      { label: "Class 4", questions: "https://www.unifiedcouncil.com/documents/uco/4th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/4th_UCO_SOL.pdf" },
      { label: "Class 5", questions: "https://www.unifiedcouncil.com/documents/uco/5th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/5th_UCO_SOL.pdf" },
      { label: "Class 6", questions: "https://www.unifiedcouncil.com/documents/uco/6th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/6th_UCO_SOL.pdf" },
      { label: "Class 7", questions: "https://www.unifiedcouncil.com/documents/uco/7th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/7th_UCO_SOL.pdf" },
      { label: "Class 8", questions: "https://www.unifiedcouncil.com/documents/uco/8th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/8th_UCO_SOL.pdf" },
      { label: "Class 9", questions: "https://www.unifiedcouncil.com/documents/uco/9th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/9th_UCO_SOL.pdf" },
      { label: "Class 10", questions: "https://www.unifiedcouncil.com/documents/uco/10th_UCO.pdf", solutions: "https://www.unifiedcouncil.com/documents/uco/10th_UCO_SOL.pdf" },
    ],
    preparationLinks: [
      { label: "4 Previous UCO Question Papers", href: "http://www.bmatalent.com/product-category/e-books-uco/", icon: "file" },
      { label: "Online Olympiad Preparation", href: "https://www.olympiadcoach.com/", icon: "monitor" },
      { label: "Unique Reference Books for Olympiads", href: "http://www.bmatalent.com/classwise-books-2/", icon: "book" },
    ],
    schoolFormUrl:
      "http://www.unifiedcouncil.com/docs/UCO%20School%20Reg%20Form.pdf",
  },
};
