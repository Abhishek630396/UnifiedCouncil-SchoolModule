import { useState } from "react";
import { X, ChevronDown, Search } from "lucide-react";

export default function ResultsCheckFormPreview({ onClose, title = "2025-26 Exam Results" }) {
  const [formData, setFormData] = useState({
    rollNumber: "",
    exam: "",
    year: "",
  });

  const examOptions = ["NSTSE", "UIMO", "UIEO", "UICO", "UMO", "UIGKO"];
  const yearOptions = ["2024", "2023", "2022", "2021", "2020"];
  const demoRollNumbers = ["UC2024001", "NS2024001", "UM2024001", "UE2024001", "UG2024001"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">CHECK RESULTS</p>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6">
          <p className="text-sm text-slate-600 font-medium">Enter your roll number to view your results</p>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter your roll number"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium uppercase"
            />
          </div>

          {/* Exam Selection */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Exam</label>
            <div className="relative">
              <select
                name="exam"
                value={formData.exam}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium appearance-none"
              >
                <option value="">Select exam</option>
                {examOptions.map((exam) => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Year</label>
            <div className="relative">
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium appearance-none"
              >
                <option value="">Select year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Demo Roll Numbers */}
          <div className="rounded-2xl bg-blue-50 border-2 border-blue-100 p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-sm font-black text-blue-900 mb-2">Demo Roll Numbers for Testing:</p>
                <div className="flex flex-wrap gap-2">
                  {demoRollNumbers.map((roll) => (
                    <code
                      key={roll}
                      className="px-3 py-1 rounded-lg bg-white border-2 border-blue-200 text-xs font-bold text-blue-800 cursor-pointer hover:bg-blue-100 transition"
                      onClick={() => setFormData((prev) => ({ ...prev, rollNumber: roll }))}
                    >
                      {roll}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t-2 border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Search Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
