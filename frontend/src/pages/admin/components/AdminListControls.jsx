import { Download, FileSpreadsheet, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RegistrationDateFilter from "./RegistrationDateFilter";
import { AdminPermission } from "../AdminAccess";

const actionButtonClass = "group relative isolate inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 px-3 py-2 text-sm font-bold tracking-tight text-white transition duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 before:absolute before:-left-[8%] before:top-[-30%] before:h-[180%] before:w-[120%] before:rounded-[46%] before:bg-white/10 before:content-[''] after:absolute after:-bottom-[18%] after:left-[8%] after:h-[42%] after:w-[90%] after:rounded-[50%] after:bg-white/10 after:blur-[12px] after:content-['']";

const actionStyles = {
  search: {
    background: "linear-gradient(135deg, #0a2d7f 0%, #0c68d9 38%, #0bbef5 100%)",
    boxShadow: "0 10px 18px rgba(12, 90, 214, 0.24)",
  },
  excel: {
    background: "linear-gradient(135deg, #ff7a00 0%, #ff9b00 25%, #ff5d3a 100%)",
    boxShadow: "0 10px 18px rgba(255, 111, 0, 0.25)",
  },
  gst: {
    background: "linear-gradient(135deg, #00b14c 0%, #14d06e 30%, #0ec0b6 100%)",
    boxShadow: "0 10px 18px rgba(17, 184, 126, 0.22)",
  },
  gstState: {
    background: "linear-gradient(135deg, #7d2af5 0%, #b93ae9 32%, #ee4ab6 100%)",
    boxShadow: "0 10px 18px rgba(146, 54, 233, 0.22)",
  },
};

function escapeHtml(value) {
  const text = String(value ?? "");
  const safeText = /^[\t\r ]*[=+\-@]/.test(text) ? `'${text}` : text;
  return safeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadRows(rows, columns, fileName) {
  const safeColumns = columns.filter((column) => !/password/i.test(column.name));
  const header = safeColumns.map((column) => `<th>${escapeHtml(column.label || column.name)}</th>`).join("");
  const body = rows.map((row) => `<tr>${safeColumns.map((column) => (
    `<td>${escapeHtml(row[column.name])}</td>`
  )).join("")}</tr>`).join("");
  const workbook = `<html><head><meta charset="utf-8"></head><body><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function AdminReportButtons({
  rows,
  columns,
  fileName,
  onDownloadExcel,
  disabled = false,
  includeStateReport = true,
}) {
  const exportReport = (report) => {
    const reportColumns = report.startsWith("gst")
      ? columns.filter((column) => /gst|tax/i.test(column.name))
      : columns;
    downloadRows(rows, reportColumns.length ? reportColumns : columns, `${fileName}-${report}.xls`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        disabled={disabled || !rows.length}
        onClick={onDownloadExcel || (() => exportReport("excel"))}
        className={`${actionButtonClass} w-[190px]`}
        style={actionStyles.excel}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e07000] text-white shadow-inner">
            <Download className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>Download Excel</span>
          <span className="text-xl font-light leading-none">›</span>
        </span>
      </Button>
      <Button
        type="button"
        disabled={disabled || !rows.length}
        onClick={() => exportReport("gst-excel")}
        className={`${actionButtonClass} w-[210px]`}
        style={actionStyles.gst}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e9d61] text-white shadow-inner">
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>GST Excel Report</span>
          <span className="text-xl font-light leading-none">›</span>
        </span>
      </Button>
      {includeStateReport && (
        <Button
          type="button"
          disabled={disabled || !rows.length}
          onClick={() => exportReport("gst-state")}
          className={`${actionButtonClass} w-[235px]`}
          style={actionStyles.gstState}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7a2fd0] text-white shadow-inner">
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>GST State Report</span>
            <span className="text-xl font-light leading-none">›</span>
          </span>
        </Button>
      )}
    </div>
  );
}

export default function AdminListControls({
  searchInput,
  onSearchInputChange,
  searchPlaceholder,
  dateFrom,
  dateTo,
  onDateChange,
  pageSize,
  onPageSizeChange,
  onSubmit,
  onClear,
  isLoading,
  rows,
  columns,
  fileName,
  onDownloadExcel,
  showDateFilter = true,
  title = "Filter records",
  description = "Refine the list by date, status or relevant details",
  compactEntries = false,
  showEntriesInDateRow = false,
  compactFilterFields = false,
  includeStateReport = true,
  exportPermission,
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={`space-y-4 rounded-2xl border border-slate-200 bg-white shadow-sm ${compactFilterFields ? "p-3 sm:p-4" : "p-4 sm:p-5"}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="h-5 w-1 rounded-full bg-cyan-500" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">{title}</h2>
        <span className="text-xs text-slate-400">{description}</span>
        {(searchInput || dateFrom || dateTo) && (
          <Button type="button" variant="ghost" onClick={onClear} disabled={isLoading} className="ml-auto h-8 px-2 text-xs text-slate-500 hover:text-slate-800">
            <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>

      <div className={`grid min-w-0 grid-cols-1 gap-3 ${showDateFilter ? `sm:grid-cols-2 ${showEntriesInDateRow ? "lg:grid-cols-4" : "xl:grid-cols-3"}` : "sm:grid-cols-1"}`}>
        {showDateFilter && (
          <RegistrationDateFilter
            className={`sm:col-span-2 ${showEntriesInDateRow ? "lg:col-span-3 lg:grid-cols-3" : "xl:col-span-3 xl:grid-cols-3"}`}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onChange={onDateChange}
            compact={compactFilterFields}
          />
        )}

        {!compactEntries && !showEntriesInDateRow && <label className="block min-w-0 text-sm font-semibold text-slate-600">
          <span className={`text-xs font-bold uppercase tracking-wider text-slate-500 ${compactEntries ? "" : "mb-2 block"}`}>Show entries</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={isLoading}
            className={`h-11 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 ${compactEntries ? "w-[76px]" : "w-full"}`}
            aria-label="Entries per page"
          >
            {[5, 10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>}
        {showEntriesInDateRow && (
          <label className={`block min-w-0 text-sm font-semibold text-slate-600 ${compactFilterFields ? "lg:max-w-[120px]" : ""}`}>
            <span className={`${compactFilterFields ? "mb-1" : "mb-2"} block text-xs font-bold uppercase tracking-wider text-slate-500`}>Show entries</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              disabled={isLoading}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 ${compactFilterFields ? "h-10 lg:w-[100px]" : "h-11"}`}
              aria-label="Entries per page"
            >
              {[5, 10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className={`flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 ${showEntriesInDateRow ? "xl:flex-nowrap" : "2xl:flex-nowrap"}`}>
        {compactEntries && (
          <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Show entries</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              disabled={isLoading}
              className="h-11 w-[76px] rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
              aria-label="Entries per page"
            >
              {[5, 10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        )}
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search records"
            className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 text-sm shadow-sm placeholder:text-slate-400 focus-visible:border-sky-400 focus-visible:bg-white focus-visible:ring-sky-100"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className={`${actionButtonClass} w-[158px]`}
          style={actionStyles.search}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b2d73] text-white shadow-inner">
              <Search className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>Search</span>
            <span className="text-xl font-light leading-none">›</span>
          </span>
        </Button>
        <AdminPermission permission={exportPermission}>
          <div className="flex flex-wrap gap-2">
            <AdminReportButtons
              rows={rows}
              columns={columns}
              fileName={fileName}
              onDownloadExcel={onDownloadExcel}
              disabled={isLoading}
              includeStateReport={includeStateReport}
            />
          </div>
        </AdminPermission>
      </div>
    </form>
  );
}
