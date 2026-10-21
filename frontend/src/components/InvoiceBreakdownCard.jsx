function formatMoney(amount) {
  const numeric = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function DiscountValue({ amount }) {
  return <span className="font-semibold text-red-600">-{formatMoney(amount)}</span>;
}

function SummaryRow({ label, value, discount = false, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className={`text-xs sm:text-sm ${strong ? "font-bold text-slate-800" : "text-slate-600"}`}>{label}</span>
      <span className={`${strong ? "font-black text-slate-900" : "text-slate-800"} text-right text-xs sm:text-sm`}>
        {discount ? <DiscountValue amount={value} /> : formatMoney(value)}
      </span>
    </div>
  );
}

function InvoiceBreakdownCard({ breakdown, title = "Invoice Breakdown" }) {
  const rows = breakdown?.rows || [];
  const summary = breakdown?.summary || null;

  if (!rows.length || !summary) {
    return null;
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-base sm:text-lg font-black text-slate-900">{title}</h3>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
          GST {summary.gstPercent}%
        </span>
      </div>

      {/* Mobile-friendly card view for small screens */}
      <div className="md:hidden space-y-3">
        {rows.map((row, index) => (
          <div key={`${row.examLabel}-${index}`} className="rounded-xl border border-slate-100 bg-sky-50/40 p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-bold text-sm text-slate-900 flex-1">{row.examLabel}</span>
              <span className="font-bold text-slate-900 whitespace-nowrap">{formatMoney(row.amountToPay)}</span>
            </div>
            <div className="space-y-1 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Exam Fee:</span>
                <span>{formatMoney(row.examFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST on Fee:</span>
                <span>{formatMoney(row.gstOnFee)}</span>
              </div>
              {row.onlinePackageAmount > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Online Package:</span>
                    <span>{formatMoney(row.onlinePackageAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST on Package:</span>
                    <span>{formatMoney(row.gstOnPackages)}</span>
                  </div>
                </>
              )}
              {row.specialDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Special Discount:</span>
                  <span>-{formatMoney(row.specialDiscount)}</span>
                </div>
              )}
              {row.comboOffer > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Combo Offer:</span>
                  <span>-{formatMoney(row.comboOffer)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-sky-600 text-white">
              {[
                "Exam(s)",
                "Exam Fee",
                "GST on Fee",
                "Online Packages (MRP)",
                "Special Discount",
                "Online Packages",
                "GST on Packages",
                "Combo Offer",
                "Amount to Pay",
              ].map((header) => (
                <th key={header} className="whitespace-nowrap px-2 sm:px-3 py-2 text-left font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.examLabel}-${index}`} className={index % 2 === 0 ? "bg-sky-50/60" : "bg-white"}>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 font-semibold text-slate-800">{row.examLabel}</td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 text-slate-700">{formatMoney(row.examFee)}</td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 text-slate-700">{formatMoney(row.gstOnFee)}</td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 text-slate-700">{formatMoney(row.onlinePackageMRP)}</td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2"><DiscountValue amount={row.specialDiscount} /></td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 text-slate-700">{formatMoney(row.onlinePackageAmount)}</td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 text-slate-700">{formatMoney(row.gstOnPackages)}</td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2"><DiscountValue amount={row.comboOffer} /></td>
                <td className="whitespace-nowrap px-2 sm:px-3 py-2 font-bold text-slate-900">{formatMoney(row.amountToPay)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 sm:mt-5 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3">
        <SummaryRow label="Sub-Total" value={summary.subTotal} />
        <SummaryRow label="Instant Discount" value={summary.specialDiscountTotal} discount />
        <SummaryRow label="Combo Offer" value={summary.comboOfferTotal} discount />
        <SummaryRow label="Taxable Amount" value={summary.taxableAmount} />
        <SummaryRow label="Exempted" value={summary.exemptedAmount ?? 0} />
        {summary.igstAmount > 0 ? (
          <SummaryRow label={`IGST (${summary.gstPercent}%)`} value={summary.igstAmount} />
        ) : (
          <>
            <SummaryRow label={`CGST (${summary.gstPercent / 2}%)`} value={summary.cgstAmount} />
            <SummaryRow label={`SGST (${summary.gstPercent / 2}%)`} value={summary.sgstAmount} />
          </>
        )}
        <div className="mt-2 border-t border-slate-200 pt-2">
          <SummaryRow label="Total" value={summary.amountToPay} strong />
        </div>
      </div>
    </div>
  );
}

export default InvoiceBreakdownCard;
