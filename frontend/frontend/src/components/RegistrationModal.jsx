import { useState } from "react";
import { X, User, Mail, Phone, School, BookOpen, GraduationCap, MapPin, Users, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

const RegistrationModal = ({ type, exam, exams, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Student form state
  const [studentForm, setStudentForm] = useState({
    student_name: "",
    email: "",
    phone: "",
    class_grade: "",
    school_name: "",
    exam_type: exam?.id || "",
    exam_mode: "offline",
  });

  // School form state
  const [schoolForm, setSchoolForm] = useState({
    school_name: "",
    principal_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    student_count: "",
  });

  const classOptions = [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
    "Class 11", "Class 12"
  ];

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSuccess(true);
      toast.success("Registration successful! Check your email for confirmation.");
      setLoading(false);
    }, 1000);
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSuccess(true);
      toast.success("School registration successful! Our team will contact you shortly.");
      setLoading(false);
    }, 1000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">
            {type === "student" 
              ? "You will receive a confirmation email shortly with exam details."
              : "Our team will contact you within 24 hours to complete the onboarding."
            }
          </p>
          <Button
            onClick={onClose}
            className="w-full rounded-full font-bold py-6 bg-sky-500 hover:bg-sky-400"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="registration-modal">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {type === "student" ? "Student Registration" : "School Registration"}
            </h2>
            {exam && (
              <p className="text-sm text-sky-600 font-medium">{exam.name} - {exam.full_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            data-testid="close-modal-btn"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {type === "student" ? (
            <form onSubmit={handleStudentSubmit} className="space-y-5">
              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Name
                </Label>
                <Input
                  required
                  placeholder="Enter full name"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={studentForm.student_name}
                  onChange={(e) => setStudentForm({ ...studentForm, student_name: e.target.value })}
                  data-testid="student-name-input"
                />
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  required
                  type="email"
                  placeholder="Enter email"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  data-testid="student-email-input"
                />
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  required
                  type="tel"
                  placeholder="Enter phone number"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  data-testid="student-phone-input"
                />
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Class / Grade
                </Label>
                <Select
                  value={studentForm.class_grade}
                  onValueChange={(value) => setStudentForm({ ...studentForm, class_grade: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5" data-testid="student-class-select">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  School Name
                </Label>
                <Input
                  required
                  placeholder="Enter school name"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={studentForm.school_name}
                  onChange={(e) => setStudentForm({ ...studentForm, school_name: e.target.value })}
                  data-testid="student-school-input"
                />
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Select Exam
                </Label>
                <Select
                  value={studentForm.exam_type}
                  onValueChange={(value) => setStudentForm({ ...studentForm, exam_type: value })}
                >
                  <SelectTrigger className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5" data-testid="student-exam-select">
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>{ex.name} - {ex.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2">Exam Mode</Label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${studentForm.exam_mode === "offline" ? "border-sky-500 bg-sky-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="exam_mode"
                      value="offline"
                      checked={studentForm.exam_mode === "offline"}
                      onChange={(e) => setStudentForm({ ...studentForm, exam_mode: e.target.value })}
                      className="hidden"
                    />
                    <School className={`w-5 h-5 ${studentForm.exam_mode === "offline" ? "text-sky-500" : "text-slate-400"}`} />
                    <span className={`font-semibold ${studentForm.exam_mode === "offline" ? "text-sky-600" : "text-slate-600"}`}>Offline</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${studentForm.exam_mode === "online" ? "border-green-500 bg-green-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="exam_mode"
                      value="online"
                      checked={studentForm.exam_mode === "online"}
                      onChange={(e) => setStudentForm({ ...studentForm, exam_mode: e.target.value })}
                      className="hidden"
                    />
                    <GraduationCap className={`w-5 h-5 ${studentForm.exam_mode === "online" ? "text-green-500" : "text-slate-400"}`} />
                    <span className={`font-semibold ${studentForm.exam_mode === "online" ? "text-green-600" : "text-slate-600"}`}>Online</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full font-bold py-6 bg-sky-500 hover:bg-sky-400 btn-3d mt-6"
                data-testid="student-submit-btn"
              >
                {loading ? "Registering..." : "Register Now"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSchoolSubmit} className="space-y-5">
              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  School Name
                </Label>
                <Input
                  required
                  placeholder="Enter school name"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={schoolForm.school_name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, school_name: e.target.value })}
                  data-testid="school-name-input"
                />
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Principal Name
                </Label>
                <Input
                  required
                  placeholder="Enter principal name"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={schoolForm.principal_name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, principal_name: e.target.value })}
                  data-testid="principal-name-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    required
                    type="email"
                    placeholder="Email"
                    className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                    value={schoolForm.email}
                    onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                    data-testid="school-email-input"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input
                    required
                    type="tel"
                    placeholder="Phone"
                    className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                    value={schoolForm.phone}
                    onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                    data-testid="school-phone-input"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Input
                  required
                  placeholder="Enter full address"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={schoolForm.address}
                  onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                  data-testid="school-address-input"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-700 font-semibold mb-2">City</Label>
                  <Input
                    required
                    placeholder="City"
                    className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                    value={schoolForm.city}
                    onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                    data-testid="school-city-input"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold mb-2">State</Label>
                  <Input
                    required
                    placeholder="State"
                    className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                    value={schoolForm.state}
                    onChange={(e) => setSchoolForm({ ...schoolForm, state: e.target.value })}
                    data-testid="school-state-input"
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-semibold mb-2">Pincode</Label>
                  <Input
                    required
                    placeholder="Pincode"
                    className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                    value={schoolForm.pincode}
                    onChange={(e) => setSchoolForm({ ...schoolForm, pincode: e.target.value })}
                    data-testid="school-pincode-input"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of Students
                </Label>
                <Input
                  required
                  type="number"
                  placeholder="Approximate student count"
                  className="rounded-xl border-2 border-slate-200 focus:border-sky-500 py-5"
                  value={schoolForm.student_count}
                  onChange={(e) => setSchoolForm({ ...schoolForm, student_count: e.target.value })}
                  data-testid="school-student-count-input"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full font-bold py-6 bg-sky-500 hover:bg-sky-400 btn-3d mt-6"
                data-testid="school-submit-btn"
              >
                {loading ? "Registering..." : "Register School"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
