const ADMIN_PERMISSION_GROUPS = [
  {
    label: "School Students",
    permissions: [
      { key: "school_students.view", label: "View school student records" },
      { key: "school_students.manage", label: "Update school student records" },
    ],
  },
  {
    label: "Individual Students",
    permissions: [
      { key: "individual_students.view", label: "View individual student records" },
      { key: "individual_students.manage", label: "Update individual student records" },
    ],
  },
  {
    label: "Registered Schools",
    permissions: [
      { key: "registered_schools.view", label: "View registered schools" },
      { key: "registered_schools.manage", label: "Update registered schools" },
    ],
  },
  {
    label: "Exam Dates",
    permissions: [
      { key: "exam_dates.view", label: "View exam dates" },
      { key: "exam_dates.manage", label: "Manage exam dates" },
    ],
  },
  {
    label: "Exam Prices",
    permissions: [
      { key: "exam_prices.view", label: "View exam prices" },
      { key: "exam_prices.manage", label: "Manage exam prices" },
    ],
  },
  {
    label: "Enquiries",
    permissions: [
      { key: "enquiries.view", label: "View enquiries" },
      { key: "enquiries.manage", label: "Update and remove enquiries" },
    ],
  },
  {
    label: "Documents",
    permissions: [
      { key: "documents.view", label: "View documents" },
      { key: "documents.manage", label: "Manage documents" },
    ],
  },
  {
    label: "Tests",
    permissions: [
      { key: "tests.view", label: "View tests" },
      { key: "tests.manage", label: "Manage tests" },
    ],
  },
  {
    label: "Feedbacks",
    permissions: [
      { key: "feedbacks.view", label: "View feedbacks" },
      { key: "feedbacks.manage", label: "Manage feedbacks" },
    ],
  },
  {
    label: "Class Documents",
    permissions: [
      { key: "class_documents.view", label: "View class documents" },
      { key: "class_documents.manage", label: "Manage class documents" },
    ],
  },
  {
    label: "Coordinators",
    permissions: [
      { key: "coordinators.view", label: "View coordinators" },
      { key: "coordinators.manage", label: "Manage coordinators" },
    ],
  },
  {
    label: "Unsubmitted Registrations",
    permissions: [
      { key: "unsubmitted_registrations.view", label: "View unsubmitted registrations" },
      { key: "unsubmitted_registrations.manage", label: "Manage unsubmitted registrations" },
    ],
  },
  {
    label: "Website Content",
    permissions: [
      { key: "static_content.view", label: "View website content" },
      { key: "static_content.manage", label: "Manage website content" },
    ],
  },
];

const ADMIN_PERMISSION_KEYS = new Set(
  ADMIN_PERMISSION_GROUPS.flatMap((group) => group.permissions.map(({ key }) => key))
);

module.exports = {
  ADMIN_PERMISSION_GROUPS,
  ADMIN_PERMISSION_KEYS,
};
