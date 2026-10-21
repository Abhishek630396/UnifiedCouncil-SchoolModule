import { useState, useEffect, useRef } from "react";
import { 
  ChevronRight, ChevronLeft, Check, GraduationCap, BookOpen, 
  Calculator, Globe, Monitor, Brain, ShoppingCart, Trash2, 
  User, Phone, Mail, MapPin, School, Info, Sparkles, X,
  CheckCircle, CreditCard, AlertCircle, Loader2, Edit2, ChevronUp
} from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

// Mock existing users database
const EXISTING_USERS = {
  "9876543210": {
    studentName: "Arjun Sharma",
    parentName: "Rajesh Sharma",
    email: "rajesh.sharma@gmail.com",
    state: "Maharashtra",
    city: "Mumbai",
    address1: "123, Green Valley Apartments",
    address2: "Andheri West",
    pincode: "400058",
    schoolName: "Ryan International School",
    schoolPhone: "022-26281234",
    schoolAddress: "Andheri West, Mumbai",
    principalName: "Mrs. Sunita Kapoor",
    schoolCity: "Mumbai",
    board: "CBSE"
  },
  "9123456789": {
    studentName: "Priya Patel",
    parentName: "Amit Patel",
    email: "amit.patel@gmail.com",
    state: "Gujarat",
    city: "Ahmedabad",
    address1: "45, Sunrise Society",
    address2: "Satellite Road",
    pincode: "380015",
    schoolName: "Delhi Public School",
    schoolPhone: "079-26851234",
    schoolAddress: "Satellite, Ahmedabad",
    principalName: "Mr. Vinod Mehta",
    schoolCity: "Ahmedabad",
    board: "CBSE"
  },
  "9988776655": {
    studentName: "Rohan Gupta",
    parentName: "Suresh Gupta",
    email: "suresh.gupta@gmail.com",
    state: "Delhi",
    city: "New Delhi",
    address1: "B-12, Vasant Kunj",
    address2: "Sector C",
    pincode: "110070",
    schoolName: "Kendriya Vidyalaya",
    schoolPhone: "011-26891234",
    schoolAddress: "Vasant Kunj, New Delhi",
    principalName: "Dr. R.K. Singh",
    schoolCity: "New Delhi",
    board: "CBSE"
  }
};

// Exam data with pricing options
const EXAMS_DATA = {
  nstse: {
    id: "nstse",
    name: "NSTSE",
    fullName: "National Level Science Talent Search Examination",
    subject: "Science",
    icon: "Atom",
    color: "purple",
    options: [
      {
        id: 1,
        name: "Basic",
        price: 354,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "Success Series Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Standard",
        price: 944,
        originalPrice: 2651,
        popular: true,
        features: [
          "All Basic features",
          "Maths & Science Chapter-wise Online Tests",
          "Online Previous 5 years Question Papers"
        ]
      },
      {
        id: 3,
        name: "Premium",
        price: 1416,
        originalPrice: 4649,
        features: [
          "All Standard features",
          "Online Maths & Science Mock Tests Packages"
        ]
      }
    ]
  },
  uimo: {
    id: "uimo",
    name: "UIMO",
    fullName: "Unified International Mathematics Olympiad",
    subject: "Mathematics",
    icon: "Calculator",
    color: "green",
    options: [
      {
        id: 1,
        name: "Basic",
        price: 354,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "Maths Success Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Standard",
        price: 944,
        originalPrice: 1652,
        popular: true,
        features: [
          "All Basic features",
          "Online UIMO Mock Tests Package",
          "Online Previous 5 years Question Papers"
        ]
      },
      {
        id: 3,
        name: "Premium",
        price: 1416,
        originalPrice: 3052,
        features: [
          "All Standard features",
          "Curriculum Based Brain Training Package (CBBT)"
        ]
      }
    ]
  },
  uieo: {
    id: "uieo",
    name: "UIEO",
    fullName: "Unified International English Olympiad",
    subject: "English",
    icon: "BookOpen",
    color: "pink",
    options: [
      {
        id: 1,
        name: "Basic",
        price: 354,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "English Success Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Standard",
        price: 590,
        originalPrice: 707,
        features: [
          "All Basic features",
          "Previous 5 years Question Papers (Online)"
        ]
      },
      {
        id: 3,
        name: "Premium",
        price: 944,
        originalPrice: 2651,
        popular: true,
        features: [
          "All Standard features",
          "English Chapter-wise Tests & Mock Tests Online"
        ]
      }
    ]
  },
  uico: {
    id: "uico",
    name: "UICO",
    fullName: "Unified International Cyber Olympiad",
    subject: "Computer Science",
    icon: "Monitor",
    color: "sky",
    options: [
      {
        id: 1,
        name: "Basic",
        price: 354,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "Cyber Success Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Standard",
        price: 590,
        originalPrice: 707,
        features: [
          "All Basic features",
          "Previous 5 years Question Papers (Online)"
        ]
      },
      {
        id: 3,
        name: "Premium",
        price: 944,
        originalPrice: 2651,
        popular: true,
        features: [
          "All Standard features",
          "Reasoning Chapter-wise Tests & Computer Mock Tests"
        ]
      }
    ]
  },
  umo: {
    id: "umo",
    name: "UMO",
    fullName: "Unified Monthly Olympiad with Remedial Tests",
    subject: "Monthly Practice",
    icon: "Brain",
    color: "amber",
    options: [
      {
        id: 1,
        name: "Maths Only",
        price: 750,
        originalPrice: 1250,
        features: [
          "Unified Monthly Olympiad - Math",
          "Remedial Tests Included"
        ]
      },
      {
        id: 2,
        name: "Science Only",
        price: 751,
        originalPrice: 1250,
        features: [
          "Unified Monthly Olympiad - Science",
          "Remedial Tests Included"
        ]
      },
      {
        id: 3,
        name: "Maths + Science",
        price: 1000,
        originalPrice: 2000,
        popular: true,
        features: [
          "Both Maths & Science Monthly Olympiads",
          "Complete Remedial Tests Package"
        ]
      }
    ]
  }
};

const CLASSES = [
  { value: "1", label: "Class 1" },
  { value: "2", label: "Class 2" },
  { value: "3", label: "Class 3" },
  { value: "4", label: "Class 4" },
  { value: "5", label: "Class 5" },
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal"
];

const BOARDS = ["CBSE", "ICSE", "State Board", "Others"];

const iconMap = {
  Atom: Brain,
  Calculator: Calculator,
  BookOpen: BookOpen,
  Monitor: Monitor,
  Brain: Brain,
  Globe: Globe,
};

const colorMap = {
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", accent: "bg-purple-500" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", accent: "bg-green-500" },
  pink: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", accent: "bg-pink-500" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-600", accent: "bg-sky-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", accent: "bg-amber-500" },
};

// OTP Input Component
const OTPInput = ({ length = 6, value, onChange, disabled }) => {
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val.length > 1) return;
    
    const newOtp = value.split('');
    newOtp[index] = val;
    onChange(newOtp.join(''));

    // Move to next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    onChange(pastedData);
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all
            ${disabled ? 'bg-slate-100 border-slate-200' : 'border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'}
          `}
          data-testid={`otp-input-${index}`}
        />
      ))}
    </div>
  );
};

const RegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [cart, setCart] = useState([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  
  // OTP and verification states
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState("");
  
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pincode: "",
    schoolName: "",
    schoolPhone: "",
    schoolAddress: "",
    principalName: "",
    schoolCity: "",
    board: "",
    needPhysicalCertificate: false,
    agreedToTerms: false,
    source: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const steps = [
    { id: 1, name: "Select Class", icon: GraduationCap },
    { id: 2, name: "Choose Exams", icon: BookOpen },
    { id: 3, name: "Your Details", icon: User },
    { id: 4, name: "Payment", icon: CreditCard },
  ];

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = cart.reduce((sum, item) => sum + (item.originalPrice ? item.originalPrice - item.price : 0), 0);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateMobile = (number) => {
    return /^[6-9]\d{9}$/.test(number);
  };

  const sendOTP = async () => {
    if (!validateMobile(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setSendingOtp(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use fixed OTP for demo - 123456
    const newOtp = "123456";
    setGeneratedOtp(newOtp);
    
    setOtpSent(true);
    setResendTimer(30);
    setSendingOtp(false);
    
    // Show OTP in toast for demo purposes
    toast.success(`OTP sent to ${mobileNumber}`, {
      description: `Demo OTP: ${newOtp}`,
      duration: 15000
    });
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === generatedOtp) {
      setOtpVerified(true);
      setFormData(prev => ({ ...prev, mobile: mobileNumber }));
      
      // Check if user exists
      const existingUser = EXISTING_USERS[mobileNumber];
      if (existingUser) {
        setIsExistingUser(true);
        setFormData(prev => ({
          ...prev,
          ...existingUser,
          mobile: mobileNumber
        }));
        toast.success("Welcome back! Your details have been loaded.");
      } else {
        setIsExistingUser(false);
        toast.success("OTP verified! Please fill in your details.");
      }
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
    
    setVerifyingOtp(false);
  };

  const changeMobileNumber = () => {
    setMobileNumber("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setIsExistingUser(false);
    setFormData({
      studentName: "",
      parentName: "",
      mobile: "",
      email: "",
      state: "",
      city: "",
      address1: "",
      address2: "",
      pincode: "",
      schoolName: "",
      schoolPhone: "",
      schoolAddress: "",
      principalName: "",
      schoolCity: "",
      board: "",
      needPhysicalCertificate: false,
      agreedToTerms: false,
      source: ""
    });
  };

  const addToCart = (exam, option) => {
    const existingIndex = cart.findIndex(item => item.examId === exam.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex] = {
        examId: exam.id,
        examName: exam.name,
        examFullName: exam.fullName,
        optionId: option.id,
        optionName: option.name,
        price: option.price,
        originalPrice: option.originalPrice,
        color: exam.color
      };
      setCart(newCart);
    } else {
      setCart([...cart, {
        examId: exam.id,
        examName: exam.name,
        examFullName: exam.fullName,
        optionId: option.id,
        optionName: option.name,
        price: option.price,
        originalPrice: option.originalPrice,
        color: exam.color
      }]);
    }
    toast.success(`${exam.name} - ${option.name} added to cart!`);
  };

  const removeFromCart = (examId) => {
    setCart(cart.filter(item => item.examId !== examId));
    toast.info("Item removed from cart");
  };

  const isInCart = (examId) => cart.some(item => item.examId === examId);
  const getCartOption = (examId) => cart.find(item => item.examId === examId);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedClass !== "";
      case 2: return cart.length > 0;
      case 3: return otpVerified && formData.studentName && formData.parentName && 
               formData.email && formData.state && formData.city && formData.schoolName && 
               formData.board && formData.agreedToTerms;
      default: return true;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-sky-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center animate-bounce-in">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">
            Thank you for registering for Unified Olympiads. You will receive confirmation details on your email and mobile.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-slate-500">Total Amount Paid</p>
            <p className="text-3xl font-black text-green-600">₹{totalAmount}</p>
            {totalSavings > 0 && (
              <p className="text-sm text-green-600 font-semibold">You saved ₹{totalSavings}!</p>
            )}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full rounded-full font-bold py-6 bg-sky-500 hover:bg-sky-400"
          >
            Register Another Student
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="registration-page">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all ${
                    currentStep === step.id 
                      ? "bg-sky-500 text-white" 
                      : currentStep > step.id 
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                  <span className="hidden md:inline font-semibold text-sm">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className={`w-5 h-5 mx-1 ${currentStep > step.id ? "text-green-500" : "text-slate-300"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Class */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-slate-100 animate-slide-up">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-sky-50 border-2 border-sky-100 rounded-full px-4 py-2 mb-4">
                    <GraduationCap className="w-4 h-4 text-sky-600" />
                    <span className="text-sm font-bold text-sky-600">Step 1</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
                    Select Your Class
                  </h2>
                  <p className="text-slate-600">
                    Choose the class for which you want to register for Olympiads
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {CLASSES.map((cls) => (
                    <button
                      key={cls.value}
                      onClick={() => setSelectedClass(cls.value)}
                      className={`p-4 md:p-6 rounded-2xl border-2 transition-all font-bold text-lg ${
                        selectedClass === cls.value
                          ? "border-sky-500 bg-sky-50 text-sky-600 shadow-lg scale-105"
                          : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                      }`}
                      data-testid={`class-${cls.value}`}
                    >
                      {cls.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Exams */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-up">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-amber-50 border-2 border-amber-100 rounded-full px-4 py-2 mb-4">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-600">Step 2</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
                    Choose Your Olympiads
                  </h2>
                  <p className="text-slate-600">
                    Select exams and packages for Class {selectedClass}. You can register for multiple exams.
                  </p>
                </div>

                {Object.values(EXAMS_DATA).map((exam) => {
                  const IconComponent = iconMap[exam.icon] || BookOpen;
                  const colors = colorMap[exam.color];
                  const cartItem = getCartOption(exam.id);

                  return (
                    <div 
                      key={exam.id} 
                      className={`bg-white rounded-3xl p-6 shadow-sm border-2 ${isInCart(exam.id) ? colors.border : "border-slate-100"}`}
                      data-testid={`exam-section-${exam.id}`}
                    >
                      {/* Exam Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                            <IconComponent className={`w-7 h-7 ${colors.text}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-800">{exam.name}</h3>
                            <p className="text-sm text-slate-500">{exam.fullName}</p>
                          </div>
                        </div>
                        {isInCart(exam.id) && (
                          <Badge className="bg-green-100 text-green-700 font-semibold">
                            <Check className="w-3 h-3 mr-1" /> Added
                          </Badge>
                        )}
                      </div>

                      {/* Pricing Options */}
                      <div className="grid md:grid-cols-3 gap-4">
                        {exam.options.map((option) => (
                          <div
                            key={option.id}
                            className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                              cartItem?.optionId === option.id
                                ? `${colors.border} ${colors.bg}`
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() => addToCart(exam, option)}
                            data-testid={`option-${exam.id}-${option.id}`}
                          >
                            {option.popular && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className={`${colors.accent} text-white font-bold text-xs`}>
                                  <Sparkles className="w-3 h-3 mr-1" /> Popular
                                </Badge>
                              </div>
                            )}
                            
                            <div className="text-center mb-4 mt-2">
                              <h4 className="font-bold text-slate-800">{option.name}</h4>
                              <div className="mt-2">
                                {option.originalPrice && (
                                  <span className="text-sm text-slate-400 line-through mr-2">
                                    ₹{option.originalPrice}
                                  </span>
                                )}
                                <span className="text-2xl font-black text-slate-800">₹{option.price}</span>
                              </div>
                              {option.originalPrice && (
                                <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                                  Save ₹{option.originalPrice - option.price}
                                </Badge>
                              )}
                            </div>

                            <ul className="space-y-2 text-sm">
                              {option.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                  <span className="text-slate-600">{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <div className={`mt-4 py-2 rounded-xl text-center font-semibold text-sm ${
                              cartItem?.optionId === option.id
                                ? `${colors.accent} text-white`
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {cartItem?.optionId === option.id ? "Selected" : "Select"}
                            </div>
                          </div>
                        ))}
                      </div>

                      {isInCart(exam.id) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromCart(exam.id); }}
                          className="mt-4 text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Remove from cart
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Step 3: Your Details with OTP Verification */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-slate-100 animate-slide-up">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-100 rounded-full px-4 py-2 mb-4">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-600">Step 3</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
                    Your Details
                  </h2>
                  <p className="text-slate-600">
                    Verify your mobile number to continue
                  </p>
                </div>

                {/* Mobile OTP Section */}
                {!otpVerified ? (
                  <div className="max-w-md mx-auto">
                    {!otpSent ? (
                      // Enter Mobile Number
                      <div className="space-y-6">
                        <div className="bg-sky-50 rounded-2xl p-6 border-2 border-sky-100">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                              <Phone className="w-6 h-6 text-sky-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-800">Mobile Verification</h3>
                              <p className="text-sm text-slate-500">We'll send an OTP to verify</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="text-slate-700 font-semibold mb-2">Mobile Number</Label>
                              <div className="flex gap-2">
                                <div className="flex items-center px-4 bg-slate-100 rounded-xl border-2 border-slate-200">
                                  <span className="font-semibold text-slate-600">+91</span>
                                </div>
                                <Input
                                  type="tel"
                                  placeholder="Enter 10-digit mobile number"
                                  maxLength={10}
                                  className="flex-1 rounded-xl border-2 border-slate-200 text-lg font-semibold"
                                  value={mobileNumber}
                                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                  data-testid="mobile-input"
                                />
                              </div>
                            </div>
                            
                            <Button
                              onClick={sendOTP}
                              disabled={sendingOtp || mobileNumber.length !== 10}
                              className="w-full rounded-xl font-bold py-6 bg-sky-500 hover:bg-sky-400"
                              data-testid="send-otp-btn"
                            >
                              {sendingOtp ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Sending OTP...
                                </>
                              ) : (
                                "Send OTP"
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Demo numbers hint */}
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                          <p className="text-sm text-amber-800 font-medium mb-2">
                            💡 Demo: Try these numbers for existing users
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(EXISTING_USERS).map((num) => (
                              <button
                                key={num}
                                onClick={() => setMobileNumber(num)}
                                className="text-xs bg-white px-3 py-1 rounded-full border border-amber-200 text-amber-700 font-semibold hover:bg-amber-100 transition-colors"
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Enter OTP
                      <div className="space-y-6">
                        <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-100">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                              <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Enter OTP</h3>
                            <p className="text-sm text-slate-500 mt-1">
                              We've sent a 6-digit OTP to <br />
                              <span className="font-semibold text-slate-700">+91 {mobileNumber}</span>
                              <button 
                                onClick={changeMobileNumber}
                                className="ml-2 text-sky-600 hover:underline"
                              >
                                <Edit2 className="w-3 h-3 inline" /> Change
                              </button>
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <OTPInput
                              length={6}
                              value={otp}
                              onChange={setOtp}
                              disabled={verifyingOtp}
                            />
                            
                            <Button
                              onClick={verifyOTP}
                              disabled={verifyingOtp || otp.length !== 6}
                              className="w-full rounded-xl font-bold py-6 bg-green-500 hover:bg-green-400"
                              data-testid="verify-otp-btn"
                            >
                              {verifyingOtp ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                "Verify OTP"
                              )}
                            </Button>

                            <div className="text-center">
                              {resendTimer > 0 ? (
                                <p className="text-sm text-slate-500">
                                  Resend OTP in <span className="font-semibold text-slate-700">{resendTimer}s</span>
                                </p>
                              ) : (
                                <button
                                  onClick={sendOTP}
                                  disabled={sendingOtp}
                                  className="text-sm text-sky-600 font-semibold hover:underline"
                                >
                                  Resend OTP
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // User Details Form
                  <div className="space-y-8">
                    {/* Verified Badge */}
                    <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">Mobile Verified</p>
                          <p className="text-sm text-green-600">+91 {mobileNumber}</p>
                        </div>
                      </div>
                      <button
                        onClick={changeMobileNumber}
                        className="text-sm text-sky-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" /> Change
                      </button>
                    </div>

                    {isExistingUser && (
                      <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                        <div className="flex items-center gap-2 text-sky-700">
                          <Info className="w-5 h-5" />
                          <p className="font-semibold">Welcome back! We've loaded your saved details.</p>
                        </div>
                      </div>
                    )}

                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-sky-500" />
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">Student Name *</Label>
                          <Input
                            required
                            placeholder="Enter student's full name"
                            className="rounded-xl border-2"
                            value={formData.studentName}
                            onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                            data-testid="student-name-input"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">Parent Name *</Label>
                          <Input
                            required
                            placeholder="Father's/Mother's name"
                            className="rounded-xl border-2"
                            value={formData.parentName}
                            onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                            data-testid="parent-name-input"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">Email *</Label>
                          <Input
                            required
                            type="email"
                            placeholder="Email address"
                            className="rounded-xl border-2"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            data-testid="email-input"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">State *</Label>
                          <Select value={formData.state} onValueChange={(v) => setFormData({...formData, state: v})}>
                            <SelectTrigger className="rounded-xl border-2" data-testid="state-select">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {STATES.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">City *</Label>
                          <Input
                            required
                            placeholder="City name"
                            className="rounded-xl border-2"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            data-testid="city-input"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">Pincode</Label>
                          <Input
                            placeholder="Pincode"
                            className="rounded-xl border-2"
                            value={formData.pincode}
                            onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                            data-testid="pincode-input"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-slate-700 font-semibold mb-2">Address</Label>
                          <Input
                            placeholder="Address line 1"
                            className="rounded-xl border-2 mb-2"
                            value={formData.address1}
                            onChange={(e) => setFormData({...formData, address1: e.target.value})}
                          />
                          <Input
                            placeholder="Address line 2"
                            className="rounded-xl border-2"
                            value={formData.address2}
                            onChange={(e) => setFormData({...formData, address2: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* School Information */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <School className="w-5 h-5 text-amber-500" />
                        School Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">School Name *</Label>
                          <Input
                            required
                            placeholder="Name of the school"
                            className="rounded-xl border-2"
                            value={formData.schoolName}
                            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                            data-testid="school-name-input"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">Board *</Label>
                          <Select value={formData.board} onValueChange={(v) => setFormData({...formData, board: v})}>
                            <SelectTrigger className="rounded-xl border-2" data-testid="board-select">
                              <SelectValue placeholder="Select board" />
                            </SelectTrigger>
                            <SelectContent>
                              {BOARDS.map((board) => (
                                <SelectItem key={board} value={board}>{board}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">School City</Label>
                          <Input
                            placeholder="School city"
                            className="rounded-xl border-2"
                            value={formData.schoolCity}
                            onChange={(e) => setFormData({...formData, schoolCity: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label className="text-slate-700 font-semibold mb-2">Principal Name</Label>
                          <Input
                            placeholder="Principal's name"
                            className="rounded-xl border-2"
                            value={formData.principalName}
                            onChange={(e) => setFormData({...formData, principalName: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="certificate"
                          checked={formData.needPhysicalCertificate}
                          onCheckedChange={(checked) => setFormData({...formData, needPhysicalCertificate: checked})}
                        />
                        <Label htmlFor="certificate" className="text-slate-700 cursor-pointer">
                          I need a physical certificate (additional charges may apply)
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="terms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked})}
                          data-testid="terms-checkbox"
                        />
                        <Label htmlFor="terms" className="text-slate-700 cursor-pointer">
                          I agree to the <a href="#" className="text-sky-600 underline">terms and conditions</a> *
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-2 border-slate-100 animate-slide-up">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-purple-50 border-2 border-purple-100 rounded-full px-4 py-2 mb-4">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-600">Step 4</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
                    Review & Pay
                  </h2>
                  <p className="text-slate-600">
                    Review your registration and complete payment
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-slate-800 mb-4">Registration Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Student Name</span>
                      <span className="font-semibold text-slate-800">{formData.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mobile</span>
                      <span className="font-semibold text-slate-800">+91 {formData.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Class</span>
                      <span className="font-semibold text-slate-800">Class {selectedClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">School</span>
                      <span className="font-semibold text-slate-800">{formData.schoolName}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exams Selected</span>
                      <span className="font-semibold text-slate-800">{cart.length}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Total Savings</span>
                        <span className="font-semibold">₹{totalSavings}</span>
                      </div>
                    )}
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-slate-800">Total Amount</span>
                      <span className="font-black text-sky-600">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-full font-bold py-6 bg-green-500 hover:bg-green-400 text-lg"
                  data-testid="pay-now-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${totalAmount} & Register`
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500 mt-4">
                  <Info className="w-4 h-4 inline mr-1" />
                  Secure payment powered by Razorpay
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pb-24 lg:pb-0">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="rounded-full px-6 border-2"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {currentStep < 4 && (
                <Button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={!canProceed()}
                  className="rounded-full px-6 bg-sky-500 hover:bg-sky-400"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Cart Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Your Cart</h3>
                  <p className="text-sm text-slate-500">{cart.length} item(s)</p>
                </div>
              </div>

              {selectedClass && (
                <div className="bg-sky-50 rounded-xl p-3 mb-4">
                  <p className="text-sm text-sky-600 font-semibold">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Registering for Class {selectedClass}
                  </p>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No exams selected yet</p>
                  <p className="text-sm text-slate-400">Choose exams from Step 2</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {cart.map((item) => {
                    const colors = colorMap[item.color];
                    return (
                      <div key={item.examId} className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-800">{item.examName}</p>
                            <p className="text-xs text-slate-500">{item.optionName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-800">₹{item.price}</p>
                            {item.originalPrice && (
                              <p className="text-xs text-slate-400 line-through">₹{item.originalPrice}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.examId)}
                          className="text-xs text-red-500 mt-2 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <hr className="my-4" />
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600 mb-2">
                      <span className="font-semibold">You Save</span>
                      <span className="font-bold">₹{totalSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="font-black text-sky-600">₹{totalAmount}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Cart - Only visible on mobile in Steps 2 & 3 */}
      {(currentStep === 2 || currentStep === 3) && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          {/* Expandable Cart Panel */}
          {mobileCartOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
              onClick={() => setMobileCartOpen(false)}
            />
          )}
          
          <div className={`relative z-50 bg-white border-t-2 border-slate-100 shadow-2xl transition-all duration-300 ${
            mobileCartOpen ? 'rounded-t-3xl' : ''
          }`}>
            {/* Expanded Cart View */}
            {mobileCartOpen && (
              <div className="max-h-[60vh] overflow-y-auto p-4 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-sky-600" />
                    <h3 className="font-bold text-slate-800">Your Cart</h3>
                    <Badge className="bg-sky-100 text-sky-700">{cart.length}</Badge>
                  </div>
                  <button 
                    onClick={() => setMobileCartOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {selectedClass && (
                  <div className="bg-sky-50 rounded-xl p-3 mb-4">
                    <p className="text-sm text-sky-600 font-semibold">
                      <GraduationCap className="w-4 h-4 inline mr-1" />
                      Class {selectedClass}
                    </p>
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm">No exams selected</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => {
                      const colors = colorMap[item.color];
                      return (
                        <div key={item.examId} className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{item.examName}</p>
                              <p className="text-xs text-slate-500">{item.optionName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800 text-sm">₹{item.price}</p>
                              {item.originalPrice && (
                                <p className="text-xs text-slate-400 line-through">₹{item.originalPrice}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.examId)}
                            className="text-xs text-red-500 mt-2 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {cart.length > 0 && totalSavings > 0 && (
                  <div className="flex justify-between text-green-600 text-sm mb-2 px-1">
                    <span className="font-semibold">You Save</span>
                    <span className="font-bold">₹{totalSavings}</span>
                  </div>
                )}
              </div>
            )}

            {/* Collapsed Cart Bar - Always Visible */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setMobileCartOpen(!mobileCartOpen)}
              data-testid="mobile-cart-bar"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-sky-600" />
                    </div>
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {cart.length === 0 ? 'Your Cart is Empty' : `${cart.length} Exam${cart.length > 1 ? 's' : ''} Selected`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {cart.length > 0 
                        ? (mobileCartOpen ? 'Tap to collapse' : 'Tap to view details')
                        : 'Select exams to continue'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cart.length > 0 && (
                    <div className="text-right">
                      <p className="text-xl font-black text-sky-600">₹{totalAmount}</p>
                      {totalSavings > 0 && (
                        <p className="text-xs text-green-600 font-semibold">Save ₹{totalSavings}</p>
                      )}
                    </div>
                  )}
                  <ChevronUp className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${mobileCartOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;
