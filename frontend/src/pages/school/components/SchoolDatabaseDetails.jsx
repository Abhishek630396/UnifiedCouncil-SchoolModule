const VISIBLE_FIELDS = [
  ["SchoolId", "School ID"],
  ["SchoolName", "School name"],
  ["SchoolAddress", "School address"],
  ["Place", "Place"],
  ["State", "State"],
  ["Pincode", "PIN code"],
];

const SchoolDatabaseDetails = ({ school }) => {
  const databaseDetails = school?.databaseDetails || {};
  const fields = VISIBLE_FIELDS
    .map(([field, label]) => [field, label, databaseDetails[field]])
    .filter(([, , value]) => value !== null && value !== undefined && String(value).trim() !== "");

  if (!fields.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm sm:p-7">
      <h2 className="text-lg font-bold text-slate-900">School information</h2>
      <p className="mt-1 text-sm text-slate-600">Only fields with a value in the selected school record are shown.</p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([field, label, value]) => (
          <div key={field} className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {label}
            </dt>
            <dd className="mt-1 break-words text-sm font-medium text-slate-800">
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default SchoolDatabaseDetails;
