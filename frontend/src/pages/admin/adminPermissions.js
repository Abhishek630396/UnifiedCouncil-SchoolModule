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

const ALL_ADMIN_PERMISSIONS = ADMIN_PERMISSION_GROUPS.flatMap(
  (group) => group.permissions.map(({ key }) => key)
);

export function getAdminAuthorization() {
  const token = localStorage.getItem("uc_admin_token");
  if (!token) return { isSuperAdmin: false, permissions: [] };

  try {
    const encodedPayload = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(encodedPayload));
    const isSuperAdmin = payload.isSuperAdmin === true || !payload.managedUserId;
    if (isSuperAdmin) return { isSuperAdmin: true, permissions: ALL_ADMIN_PERMISSIONS };

    const permissions = JSON.parse(localStorage.getItem("uc_admin_permissions") || "[]");
    return {
      isSuperAdmin: false,
      permissions: Array.isArray(permissions) ? permissions : [],
    };
  } catch (error) {
    return { isSuperAdmin: false, permissions: [] };
  }
}

export function hasAdminPermission(permission, authorization = getAdminAuthorization()) {
  if (authorization.isSuperAdmin) return true;
  if (authorization.permissions.includes(permission)) return true;
  return permission.endsWith(".view")
    && authorization.permissions.includes(`${permission.slice(0, -5)}.manage`);
}

export { ADMIN_PERMISSION_GROUPS };
