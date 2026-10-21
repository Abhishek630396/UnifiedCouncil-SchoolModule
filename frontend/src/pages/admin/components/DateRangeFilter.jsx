import { useEffect, useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DateRangeFilter = ({ dateFrom, dateTo, onChange }) => {
  const [fromValue, setFromValue] = useState(dateFrom || "");
  const [toValue, setToValue] = useState(dateTo || "");

  useEffect(() => {
    setFromValue(dateFrom || "");
    setToValue(dateTo || "");
  }, [dateFrom, dateTo]);

  const handleApply = () => {
    onChange({
      dateFrom: fromValue || "",
      dateTo: toValue || "",
    });
  };

  const handleClear = () => {
    setFromValue("");
    setToValue("");
    onChange({ dateFrom: "", dateTo: "" });
  };

  return (
    <div className="flex w-full items-center gap-3 rounded-[26px] border border-slate-200 bg-slate-50 p-2.5 shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-3 py-2.5">
        <CalendarIcon className="h-4 w-4 flex-shrink-0 text-slate-500" />
        <input
          type="date"
          value={fromValue}
          onChange={(event) => setFromValue(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none"
          aria-label="From date"
        />
      </div>

      <span className="text-sm font-medium text-slate-500">to</span>

      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-3 py-2.5">
        <CalendarIcon className="h-4 w-4 flex-shrink-0 text-slate-500" />
        <input
          type="date"
          value={toValue}
          onChange={(event) => setToValue(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none"
          aria-label="To date"
        />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleApply}
        className="h-[50px] min-w-[118px] flex-shrink-0 rounded-[18px] bg-sky-600 px-5 text-base font-semibold text-white shadow-md shadow-sky-200 transition-all hover:bg-sky-700"
      >
        Apply
      </Button>

      {(dateFrom || dateTo) && (
        <Button type="button" variant="ghost" size="icon" onClick={handleClear} aria-label="Clear date range" className="h-10 w-10 rounded-full text-slate-500 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DateRangeFilter;
