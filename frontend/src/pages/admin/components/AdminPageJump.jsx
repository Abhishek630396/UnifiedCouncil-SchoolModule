import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AdminPageJump({ page, totalPages, onPageChange, disabled = false }) {
  const [pageInput, setPageInput] = useState(String(page));
  const pageCount = Math.max(1, Number(totalPages) || 1);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestedPage = Number(pageInput);
    if (!Number.isSafeInteger(requestedPage) || requestedPage < 1 || requestedPage > pageCount) {
      toast.error(`Enter a page number from 1 to ${pageCount}.`);
      return;
    }
    if (requestedPage !== page) onPageChange(requestedPage);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
      <label htmlFor="admin-page-jump" className="whitespace-nowrap text-slate-600">Page</label>
      <Input
        id="admin-page-jump"
        type="number"
        min={1}
        max={pageCount}
        step={1}
        inputMode="numeric"
        value={pageInput}
        onChange={(event) => setPageInput(event.target.value)}
        disabled={disabled}
        aria-label="Page number"
        className="h-8 w-16 border-slate-200 bg-white px-1 text-center text-slate-700"
      />
      <span className="whitespace-nowrap text-slate-600">of {pageCount}</span>
      <Button type="submit" size="sm" disabled={disabled} className="h-8 bg-sky-700 px-3 text-white hover:bg-sky-800">
        Go
      </Button>
    </form>
  );
}

export default AdminPageJump;
