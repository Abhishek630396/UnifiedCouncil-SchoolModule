import { CalendarDays } from "lucide-react";

const DATE_PERIODS = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["last7Days", "Last 7 days"],
  ["last30Days", "Last 30 days"],
  ["thisMonth", "This month"],
  ["custom", "Custom date range"],
];

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateRange(period, currentDate = new Date()) {
  const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const start = new Date(end);

  if (period === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (period === "last7Days") {
    start.setDate(start.getDate() - 6);
  } else if (period === "last30Days") {
    start.setDate(start.getDate() - 29);
  } else if (period === "thisMonth") {
    start.setDate(1);
  }

  return { dateFrom: formatDateInput(start), dateTo: formatDateInput(end) };
}

export function getDefaultRegistrationDateRange() {
  return { dateFrom: "", dateTo: "" };
}

function getSelectedPeriod(dateFrom, dateTo) {
  const period = DATE_PERIODS.find(([key]) => (
    key !== "custom"
    && getDateRange(key).dateFrom === dateFrom
    && getDateRange(key).dateTo === dateTo
  ));
  return period?.[0] || "custom";
}

export default function RegistrationDateFilter({ dateFrom, dateTo, onChange, className = "", compact = false }) {
  const selectedPeriod = getSelectedPeriod(dateFrom, dateTo);
  const labelSpacing = compact ? "mb-1" : "mb-2";
  const fieldHeight = compact ? "h-10" : "h-11";

  const handlePeriodChange = (event) => {
    const period = event.target.value;
    onChange(period === "custom" ? { dateFrom: "", dateTo: "" } : getDateRange(period));
  };

  return (
    <div className={`grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}>
      <label className="block min-w-0 text-sm font-semibold text-slate-600">
        <span className={`${labelSpacing} block text-xs font-bold uppercase tracking-wider text-slate-500`}>Date period</span>
        <select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className={`${fieldHeight} w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100`}
          aria-label="Date period"
        >
          {DATE_PERIODS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="block min-w-0 text-sm font-semibold text-slate-600">
        <span className={`${labelSpacing} block text-xs font-bold uppercase tracking-wider text-slate-500`}>From date</span>
        <span className={`flex ${fieldHeight} items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 shadow-sm transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100`}>
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => onChange({ dateFrom: event.target.value, dateTo })}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none"
            aria-label="From date"
          />
        </span>
      </label>
      <label className="block min-w-0 text-sm font-semibold text-slate-600">
        <span className={`${labelSpacing} block text-xs font-bold uppercase tracking-wider text-slate-500`}>To date</span>
        <span className={`flex ${fieldHeight} items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 shadow-sm transition focus-within:border-sky-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100`}>
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => onChange({ dateFrom, dateTo: event.target.value })}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none"
            aria-label="To date"
          />
        </span>
      </label>
    </div>
  );
}
