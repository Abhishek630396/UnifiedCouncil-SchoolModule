import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export default function RegistrationFormPreview({ onClose, title = "Register for 2026-27 Olympiads" }) {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    phone: "",
    class: "",
    school: "",
    exam: "",
    mode: "Online",
  });

  const classOptions = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
  const examOptions = ["NSTSE - National Science Talent Search Examination", "UIMO - Unified International Mathematics Olympiad", "UIEO - Unified International English Olympiad", "UICO - Unified International Cyber Olympiad", "UMO - Unified Mathematics Olympiad", "UIGKO - Unified International General Knowledge Olympiad"];

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
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">STUDENT REGISTRATION</p>
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
          {/* Student Name */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student's full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Class / Grade</label>
            <div className="relative">
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium appearance-none"
              >
                <option value="">Select class</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">School Name</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter school name"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none bg-white font-medium"
            />
          </div>

          {/* Exam Selection */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Select Exam</label>
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

          {/* Exam Mode */}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-slate-700 mb-2">Exam Mode</label>
            <div className="flex gap-4">
              {["Offline", "Online"].map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value={mode}
                    checked={formData.mode === mode}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="font-bold text-slate-700">{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t-2 border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
