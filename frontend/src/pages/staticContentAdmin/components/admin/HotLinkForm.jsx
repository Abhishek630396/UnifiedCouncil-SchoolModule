import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  Rocket,
  Camera,
  Download,
  Trophy,
  FileQuestion,
  TrendingUp,
  Grid3X3,
  Brain,
  ClipboardList,
  Medal,
  Award,
  Star,
  BookOpen,
  Monitor,
  Globe,
  Atom,
  Calculator,
  Sigma,
  Users,
  School,
} from "lucide-react";

const ICON_OPTIONS = {
  Rocket: { icon: Rocket, label: "Rocket" },
  Camera: { icon: Camera, label: "Camera" },
  Download: { icon: Download, label: "Download" },
  Trophy: { icon: Trophy, label: "Trophy" },
  FileQuestion: { icon: FileQuestion, label: "File Question" },
  TrendingUp: { icon: TrendingUp, label: "Trending Up" },
  Grid3X3: { icon: Grid3X3, label: "Grid 3x3" },
  Brain: { icon: Brain, label: "Brain" },
  ClipboardList: { icon: ClipboardList, label: "Clipboard" },
  Medal: { icon: Medal, label: "Medal" },
  Award: { icon: Award, label: "Award" },
  Star: { icon: Star, label: "Star" },
  BookOpen: { icon: BookOpen, label: "Book Open" },
  Monitor: { icon: Monitor, label: "Monitor" },
  Globe: { icon: Globe, label: "Globe" },
  Atom: { icon: Atom, label: "Atom" },
  Calculator: { icon: Calculator, label: "Calculator" },
  Sigma: { icon: Sigma, label: "Sigma" },
  Users: { icon: Users, label: "Users" },
  School: { icon: School, label: "School" },
};

const COLOR_OPTIONS = [
  { label: "Sky", value: "sky" },
  { label: "Blue", value: "blue" },
  { label: "Purple", value: "purple" },
  { label: "Pink", value: "pink" },
  { label: "Red", value: "red" },
  { label: "Orange", value: "orange" },
  { label: "Amber", value: "amber" },
  { label: "Yellow", value: "yellow" },
  { label: "Green", value: "green" },
  { label: "Emerald", value: "emerald" },
  { label: "Teal", value: "teal" },
  { label: "Cyan", value: "cyan" },
];

const GRADIENT_PRESETS = [
  { label: "Sky → Indigo", from: "from-sky-500", to: "to-indigo-500" },
  { label: "Pink → Rose", from: "from-pink-500", to: "to-rose-500" },
  { label: "Emerald → Teal", from: "from-emerald-500", to: "to-teal-500" },
  { label: "Amber → Orange", from: "from-amber-500", to: "to-orange-500" },
  { label: "Purple → Fuchsia", from: "from-purple-500", to: "to-fuchsia-500" },
  { label: "Green → Emerald", from: "from-green-500", to: "to-emerald-500" },
  { label: "Rose → Pink", from: "from-rose-500", to: "to-pink-500" },
];

const HotLinkForm = ({ hotLink, onSave, onCancel, loading, error, success }) => {
  const [form, setForm] = useState(hotLink || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(hotLink || {});
    setErrors({});
  }, [hotLink]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title || form.title.trim() === "") {
      newErrors.title = "Title is required";
    }
    if (!form.icon) {
      newErrors.icon = "Icon is required";
    }
    if (!form.gradientFrom || !form.gradientTo) {
      newErrors.gradient = "Gradient is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., Register for Olympiads"
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600 font-bold">{errors.title}</p>
        )}
      </div>

      {/* Subtitle */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Subtitle
        </label>
        <input
          type="text"
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="e.g., Enroll in minutes"
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none"
        />
      </div>

      {/* Icon Selection */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Icon *
        </label>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3">
          {Object.entries(ICON_OPTIONS).map(([key, { icon: Icon, label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, icon: key }))}
              className={`flex items-center gap-2 rounded-lg p-2 transition ${
                form.icon === key
                  ? "bg-sky-500 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-bold">{label}</span>
            </button>
          ))}
        </div>
        {errors.icon && (
          <p className="mt-1 text-xs text-red-600 font-bold">{errors.icon}</p>
        )}
      </div>

      {/* Gradient Selection */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Gradient Preset *
        </label>
        <select
          value={`${form.gradientFrom}|${form.gradientTo}`}
          onChange={(e) => {
            const [from, to] = e.target.value.split("|");
            setForm((prev) => ({
              ...prev,
              gradientFrom: from,
              gradientTo: to,
            }));
          }}
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none"
        >
          <option value="">Select a gradient</option>
          {GRADIENT_PRESETS.map((preset) => (
            <option key={preset.label} value={`${preset.from}|${preset.to}`}>
              {preset.label}
            </option>
          ))}
        </select>
        {errors.gradient && (
          <p className="mt-1 text-xs text-red-600 font-bold">{errors.gradient}</p>
        )}
      </div>

      {/* Badge Text */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Badge Text
        </label>
        <input
          type="text"
          name="badgeText"
          value={form.badgeText}
          onChange={handleChange}
          placeholder="e.g., NEW, LIVE, FREE"
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none"
        />
      </div>

      {/* URL */}
      <div>
        <label className="mb-2 block text-sm font-bold text-slate-700">
          URL
        </label>
        <input
          type="text"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="e.g., /options or https://example.com"
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none"
        />
      </div>

      {/* Open in New Tab */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          name="openInNewTab"
          checked={form.openInNewTab}
          onChange={handleChange}
          className="w-5 h-5 rounded accent-sky-500"
        />
        <span className="text-sm font-bold text-slate-700">Open URL in new tab</span>
      </div>

      {/* Active/Inactive */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          className="w-5 h-5 rounded accent-sky-500"
        />
        <span className="text-sm font-bold text-slate-700">Active (visible on frontend)</span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-3 flex gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-green-600">{success}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-300 text-white font-black py-3 transition"
        >
          {loading ? "Saving..." : "Save Hot Link"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-full border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-black py-3 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HotLinkForm;
