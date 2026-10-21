export const SectionCard = ({ title, description, children, className = "" }) => {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`.trim()}>
      {(title || description) && (
        <div className="mb-5 space-y-1">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
};
