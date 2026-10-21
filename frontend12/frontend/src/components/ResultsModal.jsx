import { useState } from "react";
import { X, Search, Award, Medal, Trophy, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

// Static mock results data
const MOCK_RESULTS = {
  "UC2024001": { name: "Arjun Sharma", exam: "UCO", score: 85, rank: 156, certificate: "Gold" },
  "NS2024001": { name: "Priya Patel", exam: "NSTSE", score: 92, rank: 42, certificate: "Platinum" },
  "UM2024001": { name: "Rohan Gupta", exam: "UIMO", score: 78, rank: 312, certificate: "Silver" },
  "UE2024001": { name: "Ananya Singh", exam: "UIEO", score: 88, rank: 98, certificate: "Gold" },
  "UG2024001": { name: "Vikram Reddy", exam: "UIGKO", score: 75, rank: 425, certificate: "Bronze" },
};

const certificateColors = {
  Platinum: { bg: "bg-slate-100", text: "text-slate-700", icon: "🏆" },
  Gold: { bg: "bg-amber-100", text: "text-amber-700", icon: "🥇" },
  Silver: { bg: "bg-slate-200", text: "text-slate-600", icon: "🥈" },
  Bronze: { bg: "bg-orange-100", text: "text-orange-700", icon: "🥉" },
};

const ResultsModal = ({ exams, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    roll_number: "",
    exam_type: "",
    year: "2024",
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setNotFound(false);

    // Simulate API call delay
    setTimeout(() => {
      const foundResult = MOCK_RESULTS[formData.roll_number.toUpperCase()];
      if (foundResult) {
        setResult({
          roll_number: formData.roll_number.toUpperCase(),
          ...foundResult
        });
        toast.success("Result found!");
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 800);
  };

  const yearOptions = ["2024", "2023", "2022", "2021", "2020"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="results-modal">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800">Check Results</h2>
            <p className="text-sm text-slate-500 font-medium">Enter your roll number to view your results</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            data-testid="close-results-modal-btn"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Roll Number
              </Label>
              <Input
                required
                placeholder="Enter your roll number (e.g., UC2024001)"
                className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value.toUpperCase() })}
                data-testid="results-roll-number-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 font-semibold mb-2">Exam</Label>
                <Select
                  value={formData.exam_type}
                  onValueChange={(value) => setFormData({ ...formData, exam_type: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5" data-testid="results-exam-select">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2">Year</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5" data-testid="results-year-select">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full font-bold py-6 bg-sky-500 hover:bg-sky-400 btn-3d"
              data-testid="results-search-btn"
            >
              {loading ? (
                <>Searching...</>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Results
                </>
              )}
            </Button>
          </form>

          {/* Result Display */}
          {result && (
            <div className="mt-8 animate-slide-up" data-testid="result-display">
              {/* Success Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Result Found!</h3>
                  <p className="text-sm text-slate-500">Congratulations on completing the exam</p>
                </div>
              </div>

              {/* Result Card */}
              <div className="bg-gradient-to-br from-sky-50 to-pink-50 rounded-2xl p-6 border-2 border-slate-100">
                {/* Student Info */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Student Name</p>
                    <h4 className="text-xl font-black text-slate-800">{result.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Roll Number</p>
                    <p className="font-bold text-sky-600">{result.roll_number}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-800">{result.score}</p>
                    <p className="text-xs text-slate-500 font-medium">Score</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-5 h-5 text-sky-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-800">#{result.rank}</p>
                    <p className="text-xs text-slate-500 font-medium">Rank</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Medal className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-800">{result.exam}</p>
                    <p className="text-xs text-slate-500 font-medium">Exam</p>
                  </div>
                </div>

                {/* Certificate Badge */}
                {result.certificate && (
                  <div className={`flex items-center justify-between p-4 rounded-xl ${certificateColors[result.certificate]?.bg || "bg-slate-100"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{certificateColors[result.certificate]?.icon || "🏅"}</span>
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Certificate</p>
                        <p className={`font-bold ${certificateColors[result.certificate]?.text || "text-slate-700"}`}>
                          {result.certificate} Certificate
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Not Found */}
          {notFound && (
            <div className="mt-8 animate-slide-up" data-testid="result-not-found">
              <div className="bg-slate-50 rounded-2xl p-8 text-center border-2 border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">No Results Found</h3>
                <p className="text-sm text-slate-500 mb-4">
                  We couldn't find any results for the given roll number. Please check and try again.
                </p>
                <p className="text-xs text-slate-400">
                  If you believe this is an error, please contact support.
                </p>
              </div>
            </div>
          )}

          {/* Sample Roll Numbers Hint */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-800 font-medium mb-2">
              💡 Demo Roll Numbers for Testing:
            </p>
            <div className="flex flex-wrap gap-2">
              {["UC2024001", "NS2024001", "UM2024001", "UE2024001", "UG2024001"].map((roll) => (
                <button
                  key={roll}
                  onClick={() => setFormData({ ...formData, roll_number: roll })}
                  className="text-xs bg-white px-3 py-1 rounded-full border border-amber-200 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
                >
                  {roll}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
