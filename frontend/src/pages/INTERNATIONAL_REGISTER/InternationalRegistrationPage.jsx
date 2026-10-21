import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "@/services/apiBaseUrl";
import { 
  ChevronRight, ChevronLeft, Check, GraduationCap, BookOpen, 
  Calculator, Globe, Monitor, Brain, ShoppingCart, Trash2, 
  User, Phone, Mail, MapPin, Info, Sparkles, X,
  CheckCircle, CreditCard, AlertCircle, Loader2, Edit2, ChevronUp, Percent,
  Chrome, Facebook, Instagram, Share2, History, BadgeInfo, Tag, Gift, WalletCards
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import TermsAndConditionsContent from "../../components/TermsAndConditionsContent";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { toast } from "sonner";
import { buildCartInvoiceBreakdown } from "../../utils/invoicePricing";

const PAYMENT_SESSION_KEY = "uc_pending_payment";
const LOGO_SRC = "/assests/logo/uc_logo.jpeg";
const COMBO_EXAM_IDS = ["nstse", "uimo", "uieo", "uico"];
const COMBO_DISCOUNT_BY_OPTION = {
  1: 0.07,
  2: 0.1,
  3: 0.15,
};

// Exam data with pricing options
const EXAMS_DATA = {
  nstse: {
    id: "nstse",
    name: "NSTSE",
    fullName: "National Level Science Talent Search Examination",
    emphasisWord: "Science",
    subject: "Science",
    icon: "Atom",
    color: "purple",
    options: [
      {
        id: 1,
        name: "Option-1",
        price: 350,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "Success Series Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Option-2",
        price: 800,
        originalPrice: 2647,
        popular: true,
        features: [
          "All Option-1 features",
          "Maths & Science Chapter-wise Online Tests",
          "Online Previous 5 years Question Papers"
        ]
      },
      {
        id: 3,
        name: "Option-3",
        price: 1200,
        originalPrice: 5948,
        features: [
          "All Option-2 features",
          "Online Maths & Science Mock Tests Packages"
        ]
      }
    ]
  },
  uimo: {
    id: "uimo",
    name: "UIMO",
    fullName: "Unified International Mathematics Olympiad",
    emphasisWord: "Mathematics",
    subject: "Mathematics",
    icon: "Calculator",
    color: "green",
    options: [
      {
        id: 1,
        name: "Option-1",
        price: 350,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "Maths Success Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Option-2",
        price: 800,
        originalPrice: 1648,
        popular: true,
        features: [
          "All Option-1 features",
          "Online UIMO Mock Tests Package",
          "Online Previous 5 years Question Papers"
        ]
      },
      {
        id: 3,
        name: "Option-3",
        price: 1200,
        originalPrice: 2549,
        features: [
          "All Option-2 features",
          "Curriculum Based Brain Training Package (CBBT)"
        ]
      }
    ]
  },
  uieo: {
    id: "uieo",
    name: "UIEO",
    fullName: "Unified International English Olympiad",
    emphasisWord: "English",
    subject: "English",
    icon: "BookOpen",
    color: "pink",
    options: [
      {
        id: 1,
        name: "Option-1",
        price: 350,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "English Success Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Option-2",
        price: 500,
        originalPrice: 649,
        features: [
          "All Option-1 features",
          "Previous 5 years Question Papers (Online)"
        ]
      },
      {
        id: 3,
        name: "Option-3",
        price: 800,
        originalPrice: 3148,
        popular: true,
        features: [
          "All Option-2 features",
          "English Chapter-wise Tests & Mock Tests Online"
        ]
      }
    ]
  },
  uico: {
    id: "uico",
    name: "UICO",
    fullName: "Unified International Cyber Olympiad",
    emphasisWord: "Cyber",
    subject: "Cyber",
    icon: "Monitor",
    color: "sky",
    options: [
      {
        id: 1,
        name: "Option-1",
        price: 350,
        originalPrice: null,
        features: [
          "Exam Registration Fee",
          "Cyber Success Book (E-Book)",
          "2 Previous Question Papers (E-Book)"
        ]
      },
      {
        id: 2,
        name: "Option-2",
        price: 500,
        originalPrice: 649,
        features: [
          "All Option-1 features",
          "Previous 5 years Question Papers (Online)"
        ]
      },
      {
        id: 3,
        name: "Option-3",
        price: 800,
        originalPrice: 2547,
        popular: true,
        features: [
          "All Option-2 features",
          "Reasoning Chapter-wise Tests & Computer Mock Tests"
        ]
      }
    ]
  },
  umo: {
    id: "umo",
    name: "UMO",
    fullName: "Unified Monthly Olympiad with Remedial Tests",
    emphasisWord: "Monthly",
    subject: "Monthly Practice",
    icon: "Brain",
    color: "amber",
    options: [
      {
        id: 1,
        name: "Maths Only",
        price: 650,
        originalPrice: null,
        features: [
          "Unified Monthly Olympiad - Math",
          "Remedial Tests Included"
        ]
      },
      {
        id: 2,
        name: "Science Only",
        price: 651,
        originalPrice: null,
        features: [
          "Unified Monthly Olympiad - Science",
          "Remedial Tests Included"
        ]
      },
      {
        id: 3,
        name: "Maths + Science",
        price: 850,
        originalPrice: null,
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

const SOURCE_OPTIONS = [
  { value: "Google", label: "Google", icon: Chrome },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "Others", label: "Others", icon: Share2 },
  { value: "I am Previous Student", label: "I am Previous Student", icon: History },
];

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

const renderExamFullName = (exam, colors) => {
  const segments = String(exam.fullName || "").split(exam.emphasisWord);

  if (!exam.emphasisWord || segments.length < 2) {
    return exam.fullName;
  }

  return (
    <>
      {segments[0]}
      <span className={`font-black italic ${colors.text}`}>{exam.emphasisWord}</span>
      {segments.slice(1).join(exam.emphasisWord)}
    </>
  );
};

const roundCurrency = (amount) => Number(Number(amount || 0).toFixed(2));

const formatCurrency = (amount) => {
  const numeric = Number(amount || 0);
  return Number.isInteger(numeric) ? numeric.toString() : numeric.toFixed(2);
};

const computeComboOffer = (cart, invoiceBreakdown = null) => {
  const comboItems = COMBO_EXAM_IDS.map((examId) =>
    Array.isArray(cart) ? cart.find((item) => String(item.examId || "").toLowerCase() === examId) : null
  );

  if (comboItems.some((item) => !item)) {
    return {
      isApplied: false,
      optionId: null,
      discountRate: 0,
      comboSubtotal: 0,
      discountAmount: 0,
      message: "",
      popupTitle: "Special Offer!",
      popupDescription:
        "Select all Olympiads with Option 1 for a 7% discount. Option 2 for 10%. Option 3 for 15%.",
      upgradeMessage: "",
    };
  }

  const optionId = Number(comboItems[0]?.optionId || 0);
  const discountRate = COMBO_DISCOUNT_BY_OPTION[optionId];

  if (!discountRate || comboItems.some((item) => Number(item.optionId || 0) !== optionId)) {
    return {
      isApplied: false,
      optionId: null,
      discountRate: 0,
      comboSubtotal: 0,
      discountAmount: 0,
      message: "",
      popupTitle: "Special Offer!",
      popupDescription:
        "Select all Olympiads with Option 1 for a 7% discount. Option 2 for 10%. Option 3 for 15%.",
      upgradeMessage: "",
    };
  }

  const comboSubtotal = comboItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const discountAmount = roundCurrency(
    invoiceBreakdown?.summary?.comboOfferTotal ?? comboSubtotal * discountRate
  );
  const message = `You have selected Option ${optionId} from NSTSE, UIMO, UIEO and UICO. ${(discountRate * 100).toFixed(0)}% combo discount applied.`;
  const popupTitle = "Combo Discount Applied";
  const popupDescription = `You have saved \u20B9${formatCurrency(discountAmount)} with your Option ${optionId} combo selection across NSTSE, UIMO, UIEO and UICO.`;
  const upgradeMessage =
    optionId === 1 || optionId === 2
      ? "Upgrade all four to Option 3 to save 15%. Option 3 is the most preferred choice for complete preparation."
      : "";

  return {
    isApplied: true,
    optionId,
    discountRate,
    comboSubtotal,
    discountAmount,
    message,
    popupTitle,
    popupDescription,
    upgradeMessage,
  };
};

const examDetailsRoutes = {
  nstse: "/exam/nstse",
  uimo: "/exam/uimo",
  uieo: "/exam/uieo",
  uico: "/exam/uico",
  umo: "/exam/umo"
};

const getExamDetailsRoute = (examId, optionId) => {
  const normalizedExamId = examId?.toLowerCase();
  const baseRoute = examDetailsRoutes[normalizedExamId];

  if (!baseRoute) {
    return null;
  }

  switch (optionId) {
    case 1:
      return baseRoute;
    case 2:
      return `${baseRoute}/option-2`;
    case 3:
      return `${baseRoute}/option-3`;
    default:
      return baseRoute;
  }
};

const InternationalRegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearchParams = new URLSearchParams(location.search);
  const initialStep = Number.parseInt(initialSearchParams.get("step") || "1", 10);
  const initialClass = initialSearchParams.get("class") || "";
  const [currentStep, setCurrentStep] = useState(
    Number.isNaN(initialStep) || initialStep < 1 || initialStep > 4 ? 1 : initialStep
  );
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [cart, setCart] = useState([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [comboOfferOpen, setComboOfferOpen] = useState(false);
  const examSectionRefs = useRef({});
  const previousComboOptionRef = useRef(null);
  
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
    coordinatorId: "",
    needPhysicalCertificate: false,
    agreedToTerms: false,
    source: []
  });
  const [loading, setLoading] = useState(false);
  const success = false;

  const steps = [
    { id: 1, name: "Select Class", icon: GraduationCap },
    { id: 2, name: "Choose Exams", icon: BookOpen },
    { id: 3, name: "Your Details", icon: User },
    { id: 4, name: "Payment", icon: CreditCard },
  ];

  const invoiceBreakdown = buildCartInvoiceBreakdown(cart, formData.state);
  const pricingSummary = invoiceBreakdown.summary;
  const subtotalAmount = roundCurrency(pricingSummary.subTotal);
  const packageSavings = roundCurrency(pricingSummary.specialDiscountTotal);
  const comboOffer = computeComboOffer(cart, invoiceBreakdown);
  const comboDiscountAmount = roundCurrency(comboOffer.discountAmount);
  const hasComboDiscount = comboDiscountAmount > 0;
  const originalTotalAmount = roundCurrency(subtotalAmount);
  const totalAmount = roundCurrency(pricingSummary.amountToPay);
  const totalSavings = roundCurrency(packageSavings + comboDiscountAmount);

  useEffect(() => {
    const returnState = location.state;
    if (!returnState?.fromExamDetails) {
      return;
    }

    if (returnState.selectedClass) {
      setSelectedClass(returnState.selectedClass);
    }

    if (Array.isArray(returnState.cart)) {
      setCart(returnState.cart);
    }

    setCurrentStep(returnState.currentStep ?? 2);
    setMobileCartOpen(false);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const returnState = location.state;
    if (!returnState?.fromTerms) {
      return;
    }

    setCurrentStep(returnState.currentStep ?? 1);
    setSelectedClass(returnState.selectedClass || "");
    setCart(Array.isArray(returnState.cart) ? returnState.cart : []);
    setMobileCartOpen(Boolean(returnState.mobileCartOpen));
    setFormData(returnState.formData || {
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
      coordinatorId: "",
      needPhysicalCertificate: false,
      agreedToTerms: false,
      source: []
    });
    navigate(location.pathname + location.search, { replace: true, state: null });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const nextStep = String(currentStep);
    const nextClass = selectedClass || "";
    const currentStepParam = searchParams.get("step") || "1";
    const currentClassParam = searchParams.get("class") || "";

    if (currentStepParam === nextStep && currentClassParam === nextClass) {
      return;
    }

    searchParams.set("step", nextStep);

    if (nextClass) {
      searchParams.set("class", nextClass);
    } else {
      searchParams.delete("class");
    }

    navigate(
      {
        pathname: location.pathname,
        search: `?${searchParams.toString()}`,
      },
      { replace: true }
    );
  }, [currentStep, selectedClass, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!selectedClass && currentStep > 1) {
      setCurrentStep(1);
      return;
    }

    if (selectedClass && cart.length === 0 && currentStep > 2) {
      setCurrentStep(2);
    }
  }, [currentStep, selectedClass, cart.length]);

  useEffect(() => {
    if (currentStep === 2) {
      const [firstExamId] = Object.keys(EXAMS_DATA);
      setExpandedExamId(firstExamId || null);
      setComboOfferOpen(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 2) {
      previousComboOptionRef.current = null;
      return;
    }

    if (comboOffer.isApplied && previousComboOptionRef.current !== comboOffer.optionId) {
      setComboOfferOpen(true);
    }

    previousComboOptionRef.current = comboOffer.isApplied ? comboOffer.optionId : null;
  }, [comboOffer.isApplied, comboOffer.optionId, currentStep]);

  useEffect(() => {
    if (currentStep !== 2 || !expandedExamId) {
      return;
    }

    const sectionElement = examSectionRefs.current[expandedExamId];
    if (!sectionElement) {
      return;
    }

    const scrollToExpandedSection = () => {
      const headerOffset = 112;
      const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(sectionTop - headerOffset, 0),
        behavior: "smooth",
      });
    };

    requestAnimationFrame(scrollToExpandedSection);
  }, [currentStep, expandedExamId]);

  const validateMobile = (number) => /^[6-9]\d{9}$/.test(number);

  const toggleSource = (sourceValue, checked) => {
    setFormData((prev) => {
      return {
        ...prev,
        source: checked ? [sourceValue] : [],
      };
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

    const examIds = Object.keys(EXAMS_DATA);
    const currentExamIndex = examIds.indexOf(exam.id);
    const nextExamId =
      currentExamIndex >= 0 && currentExamIndex < examIds.length - 1
        ? examIds[currentExamIndex + 1]
        : null;

    setExpandedExamId(nextExamId);
    toast.success(`${exam.name} - ${option.name} added to cart!`);
  };

  const removeFromCart = (examId) => {
    setCart(cart.filter(item => item.examId !== examId));
    toast.info("Item removed from cart");
  };

  const toggleExamSection = (examId) => {
    setExpandedExamId((prev) => (prev === examId ? null : examId));
  };

  const isInCart = (examId) => cart.some(item => item.examId === examId);
  const getCartOption = (examId) => cart.find(item => item.examId === examId);
  const continueToDetailsStep = () => {
    if (cart.length === 0) {
      toast.error("Please select at least one exam to continue");
      return;
    }

    setCurrentStep(3);
  };

  const getMissingPersonalInfoFields = () => {
    const missingFields = [];

    if (!validateMobile(formData.mobile)) missingFields.push("valid 10-digit mobile number");
    if (!String(formData.studentName || "").trim()) missingFields.push("student name");
    if (!String(formData.parentName || "").trim()) missingFields.push("parent name");
    if (!String(formData.email || "").trim()) missingFields.push("email");
    if (!String(formData.pincode || "").trim()) missingFields.push("pincode");
    if (!String(formData.city || "").trim()) missingFields.push("city");
    if (!String(formData.state || "").trim()) missingFields.push("state");
    if (!String(formData.address1 || "").trim()) missingFields.push("address line 1");
    if (!String(formData.address2 || "").trim()) missingFields.push("address line 2");
    if (!String(formData.schoolName || "").trim()) missingFields.push("school name");
    if (!formData.agreedToTerms) missingFields.push("terms and conditions");

    return missingFields;
  };

  const handleContinue = () => {
    if (currentStep === 3) {
      const missingFields = getMissingPersonalInfoFields();

      if (missingFields.length > 0) {
        toast.error(`Please fill these fields: ${missingFields.join(", ")}`);
        return;
      }
    }

    if (currentStep === 2 && cart.length === 0) {
      toast.error("Please select at least one exam to continue");
      return;
    }

    if (currentStep === 1 && !selectedClass) {
      toast.error("Please select your class to continue");
      return;
    }

    setCurrentStep(Math.min(4, currentStep + 1));
  };

  const handleSubmit = async () => {
    const trimmedSchoolName = formData.schoolName?.trim();

    if (!trimmedSchoolName) {
      toast.error("Please enter the school name");
      return;
    }

    setLoading(true);

    try {
      const submissionFormData = {
        ...formData,
        schoolName: trimmedSchoolName,
        board: formData.board?.trim() || "Others",
      };

      console.log("[Frontend] Submitting registration payload");
      const registrationResponse = await axios.post(`${API_BASE_URL}/registrations`, {
        selectedClass,
        cart,
        formData: submissionFormData,
      });

      const registrationResult = registrationResponse.data;
      console.log("[Frontend] Registration API response:", registrationResult);

      if (!registrationResult?.success) {
        throw new Error(registrationResult?.message || "Registration failed");
      }

      if (!registrationResult?.data?.registrationCode) {
        throw new Error("Registration saved, but reference number was not generated.");
      }

      toast.success(`Registration saved. Ref: ${registrationResult.data.registrationCode}`);
      const pendingPaymentData = {
        registrationCode: registrationResult.data.registrationCode,
        amount: registrationResult.data.amount ?? totalAmount,
        fullAmount: registrationResult.data.fullAmount ?? subtotalAmount,
        invoiceBreakdown: registrationResult.data.invoiceBreakdown || invoiceBreakdown,
        selectedClass,
        cart,
        formData: submissionFormData,
      };

      sessionStorage.setItem(PAYMENT_SESSION_KEY, JSON.stringify(pendingPaymentData));
      navigate("/register/payment", {
        state: pendingPaymentData,
      });
    } catch (error) {
      console.error("[Frontend] Registration failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || "Unable to save registration");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedClass !== "";
      case 2: return cart.length > 0;
      case 3: return true;
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
            <p className="text-3xl font-black text-green-600">{"\u20B9"}{formatCurrency(totalAmount)}</p>
            {totalSavings > 0 && (
              <p className="text-sm text-green-600 font-semibold">You saved {"\u20B9"}{formatCurrency(totalSavings)}!</p>
            )}
          </div>
          <Button
            onClick={() => navigate("/")}
            className="w-full rounded-full font-bold py-6 bg-sky-500 hover:bg-sky-400"
          >
            Go to Home page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="registration-page">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_SRC}
              alt="Unified Council Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-800 leading-tight">Unified Council</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-semibold text-slate-600">+91-90300 07882, 96030 64939</span>
          </div>
          <Button
            type="button"
            onClick={() => {
              window.location.href = "tel:+919603064939";
            }}
            className="h-9 rounded-full bg-slate-900 px-3 text-[11px] font-bold hover:bg-slate-800 sm:hidden"
          >
            <Phone className="mr-1.5 h-3.5 w-3.5" />
            Call our Expert
          </Button>
        </div>
      </header>

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
                    <span className="text-sm font-bold text-amber-600">Step 2 - Choose Your Olympiads</span>
                  </div>
                  {/* <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
                    Choose Your Olympiads
                  </h2> */}
                  <p className="text-slate-600">
                    Select exams and packages for Class {selectedClass}. You can register for multiple exams.
                  </p>
                  {hasComboDiscount && (
                    <div className="mx-auto mt-4 max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      {comboOffer.message}
                    </div>
                  )}
                </div>

                {Object.values(EXAMS_DATA).map((exam) => {
                  const IconComponent = iconMap[exam.icon] || BookOpen;
                  const colors = colorMap[exam.color];
                  const cartItem = getCartOption(exam.id);
                  const isExpanded = expandedExamId === exam.id;

                  return (
                    <div 
                      key={exam.id} 
                      ref={(element) => {
                        if (element) {
                          examSectionRefs.current[exam.id] = element;
                        }
                      }}
                      className={`rounded-[28px] border-2 bg-white p-6 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.28)] ${
                        isInCart(exam.id) ? colors.border : "border-slate-100"
                      }`}
                      data-testid={`exam-section-${exam.id}`}
                    >
                      {/* Exam Header */}
                      <div className="mb-4 lg:mb-6">
                        <button
                          type="button"
                          onClick={() => toggleExamSection(exam.id)}
                          className="hidden w-full lg:flex items-start justify-between gap-4 text-left"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                              <IconComponent className={`w-7 h-7 ${colors.text}`} />
                            </div>
                            <div>
                              <h3 className="text-xl font-black uppercase tracking-[0.18em] text-slate-800">{exam.name}</h3>
                              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                                {renderExamFullName(exam, colors)}
                              </p>
                              <div className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${colors.bg} ${colors.border} ${colors.text}`}>
                                {exam.subject}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {isInCart(exam.id) && (
                              <Badge className="bg-green-100 text-green-700 font-semibold">
                                <Check className="w-3 h-3 mr-1" /> Added
                              </Badge>
                            )}
                            <ChevronUp
                              className={`mt-1 w-5 h-5 text-slate-400 transition-transform duration-300 ${
                                isExpanded ? "" : "rotate-180"
                              }`}
                            />
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExamSection(exam.id)}
                          className="flex w-full items-start justify-between gap-3 text-left lg:hidden"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className={`w-6 h-6 ${colors.text}`} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-black uppercase tracking-[0.16em] text-slate-800">{exam.name}</h3>
                                {isInCart(exam.id) && (
                                  <Badge className="bg-green-100 text-green-700 font-semibold">
                                    <Check className="w-3 h-3 mr-1" /> Added
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                                {renderExamFullName(exam, colors)}
                              </p>
                              <div className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] ${colors.bg} ${colors.border} ${colors.text}`}>
                                {exam.subject}
                              </div>
                            </div>
                          </div>
                          <ChevronUp
                            className={`mt-3 w-5 h-5 text-slate-400 transition-transform duration-300 ${
                              isExpanded ? "" : "rotate-180"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Pricing Options */}
                      <div className={isExpanded ? "block" : "hidden"}>
                        <div className="grid items-stretch gap-4 md:grid-cols-3">
                        {exam.options.map((option) => {
                          const detailsRoute = getExamDetailsRoute(exam.id, option.id);
                          const isSelectedOption = cartItem?.optionId === option.id;
                          return (
                            <div
                              key={option.id}
                              className={`relative flex h-full flex-col rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                                isSelectedOption
                                  ? `${colors.border} ${colors.bg}`
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              onClick={() => {
                                if (!isSelectedOption) {
                                  addToCart(exam, option);
                                }
                              }}
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
                                      {"\u20B9"}{option.originalPrice}
                                    </span>
                                  )}
                                  <span className="text-2xl font-black text-slate-800">{"\u20B9"}{option.price}</span>
                                </div>
                                {option.originalPrice && (
                                  <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                                    Save {"\u20B9"}{option.originalPrice - option.price}
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

                              {isSelectedOption ? (
                                <div className="mt-auto pt-4 space-y-2">
                                  <div className={`${colors.accent} text-white py-2 rounded-xl text-center font-semibold text-sm`}>
                                    Selected
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFromCart(exam.id);
                                    }}
                                    className="w-full py-2 rounded-xl text-center font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" /> Remove from cart
                                  </button>
                                </div>
                              ) : (
                                <div className="mt-auto pt-4 py-2 rounded-xl text-center font-semibold text-sm bg-slate-100 text-slate-600">
                                  Select
                                </div>
                              )}

                              {/* Details button for every option */}
                              {detailsRoute && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(detailsRoute, {
                                      state: {
                                        returnToRegister: {
                                          currentStep: 2,
                                          selectedClass,
                                          cart,
                                        },
                                      },
                                    });
                                  }}
                                  className="mt-4 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline w-full"
                                >
                                  Click here for more details
                                </button>
                              )}
                            </div>
                          );
                        })}
                        </div>

                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={() => {
                      window.location.href = "tel:+919603064939";
                    }}
                    className="rounded-full bg-slate-900 px-6 py-6 font-bold hover:bg-slate-800"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call our Expert Support
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Your Details */}
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
                    Enter your contact details to continue
                  </p>
                </div>

                <div className="space-y-8">
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
                          <Label className="text-slate-700 font-semibold mb-2">Mobile Number *</Label>
                          <Input
                            required
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            className="rounded-xl border-2"
                            value={formData.mobile}
                            onChange={(e) => setFormData((prev) => ({
                              ...prev,
                              mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                            }))}
                            data-testid="mobile-input"
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
                          <Label className="text-slate-700 font-semibold mb-2">Pincode *</Label>
                          <Input
                            required
                            placeholder="Pincode"
                            className="rounded-xl border-2"
                            value={formData.pincode}
                            onChange={async (e) => {
                              const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setFormData((prev) => ({ ...prev, pincode }));
                              if (pincode.length === 6) {
                                try {
                                  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                                  const data = await res.json();
                                  if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                                    const post = data[0].PostOffice[0];
                                    setFormData((prev) => ({
                                      ...prev,
                                      city: post.District || prev.city,
                                      state: post.State || prev.state,
                                    }));
                                  }
                                } catch (err) {
                                  // ignore error, do not autofill
                                }
                              }
                            }}
                            data-testid="pincode-input"
                          />
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
                        
                        
                        <div className="md:col-span-2">
                          <Label className="text-slate-700 font-semibold mb-2">Address *</Label>
                          <Input
                            required
                            placeholder="Address line 1 *"
                            className="rounded-xl border-2 mb-2"
                            value={formData.address1}
                            onChange={(e) => setFormData({...formData, address1: e.target.value})}
                          />
                          <Input
                            required
                            placeholder="Address line 2 *"
                            className="rounded-xl border-2"
                            value={formData.address2}
                            onChange={(e) => setFormData({...formData, address2: e.target.value})}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-slate-700 font-semibold mb-2">School Name *</Label>
                          <Input
                            required
                            placeholder="Enter school name"
                            className="rounded-xl border-2"
                            value={formData.schoolName}
                            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                            data-testid="school-name-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <BadgeInfo className="w-5 h-5 text-violet-500" />
                          Source of Information
                        </h3>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                          {SOURCE_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            const checked = Array.isArray(formData.source)
                              ? formData.source[0] === option.value
                              : false;

                            return (
                              <label
                                key={option.value}
                                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 cursor-pointer transition-colors ${
                                  checked
                                    ? "border-sky-300 bg-sky-50"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) => toggleSource(option.value, Boolean(value))}
                                />
                                <span className="flex items-center gap-3 text-slate-700 font-medium">
                                  <Icon className="w-4 h-4 text-sky-600" />
                                  {option.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-700 font-semibold mb-2">
                          Unified Council&apos;s Regional Co-ordinator&apos;s ID (Optional)
                        </Label>
                        <Input
                          placeholder="Enter co-ordinator ID"
                          className="rounded-xl border-2"
                          value={formData.coordinatorId}
                          onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-4">
                      {/* <div className="flex items-center gap-3">
                        <Checkbox
                          id="certificate"
                          checked={formData.needPhysicalCertificate}
                          onCheckedChange={(checked) => setFormData({...formData, needPhysicalCertificate: checked})}
                        />
                        <Label htmlFor="certificate" className="text-slate-700 cursor-pointer">
                          I need a physical certificate (additional charges may apply)
                        </Label>
                      </div> */}
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="terms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked})}
                          data-testid="terms-checkbox"
                        />
                        <Label htmlFor="terms" className="text-slate-700 cursor-pointer">
                          I agree to the{" "}
                          <button
                            type="button"
                            className="text-sky-600 underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTermsOpen(true);
                            }}
                          >
                            terms and conditions
                          </button>{" "}
                          *
                        </Label>
                      </div>
                    </div>
                  </div>
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
                    {/* <div className="flex justify-between">
                      <span className="text-slate-600">School</span>
                      <span className="font-semibold text-slate-800">{formData.schoolName}</span>
                    </div> */}
                    <hr className="my-3" />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Exams Selected</span>
                      <span className="font-semibold text-slate-800">{cart.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-800">{"\u20B9"}{formatCurrency(subtotalAmount)}</span>
                    </div>
                    {hasComboDiscount && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Combo Discount ({(comboOffer.discountRate * 100).toFixed(0)}%)</span>
                        <span className="font-semibold">-{"\u20B9"}{formatCurrency(comboDiscountAmount)}</span>
                      </div>
                    )}
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Total Savings</span>
                        <span className="font-semibold">{"\u20B9"}{formatCurrency(totalSavings)}</span>
                      </div>
                    )}
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-slate-800">Total Amount</span>
                      <span className="font-black text-sky-600">{"\u20B9"}{formatCurrency(totalAmount)}</span>
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
                    `Pay \u20B9${formatCurrency(totalAmount)} & Register`
                  )}
                </Button>

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
                  onClick={handleContinue}
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
                            <p className="font-bold text-slate-800">{"\u20B9"}{formatCurrency(item.price)}</p>
                            {item.originalPrice && (
                              <p className="text-xs text-slate-400 line-through">{"\u20B9"}{formatCurrency(item.originalPrice)}</p>
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
                  {hasComboDiscount && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                      <p className="font-bold">Combo Discount Applied</p>
                      <p className="mt-1">{comboOffer.message}</p>
                    </div>
                  )}
                </div>
              )}

              {cart.length > 0 && (
                <>
                  {/* redesigned cart summary */}
                  <div className="relative mt-6 rounded-[2rem] border-2 border-orange-300 bg-white p-4 shadow-[0_18px_50px_-30px_rgba(249,115,22,0.55)]">
                    <div className="space-y-3">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-[1.4rem] border border-slate-200 bg-slate-50/70 px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Tag className="h-5 w-5" />
                          </div>
                          <span className="min-w-0 text-[10px] font-bold leading-tight text-slate-700 sm:text-[11px]">Original Price</span>
                        </div>
                        <span className="shrink-0 text-right text-[clamp(0.8rem,3vw,1.1rem)] font-black leading-none text-slate-900">{"\u20B9"}{formatCurrency(originalTotalAmount)}</span>
                      </div>
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-[1.4rem] border border-rose-100 bg-rose-50/70 px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <Percent className="h-5 w-5" />
                          </div>
                          <span className="min-w-0 text-[10px] font-bold leading-tight text-slate-700 sm:text-[11px]">Instant Discount</span>
                        </div>
                        <span className="shrink-0 text-right text-[clamp(0.8rem,3vw,1.1rem)] font-black leading-none text-rose-600">-{"\u20B9"}{formatCurrency(packageSavings)}</span>
                      </div>
                      {hasComboDiscount && (
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-[1.4rem] border border-orange-100 bg-orange-50/70 px-4 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                              <Gift className="h-5 w-5" />
                            </div>
                            <span className="min-w-0 text-[10px] font-bold leading-tight text-slate-700 sm:text-[11px]">Combo Offer</span>
                          </div>
                          <span className="shrink-0 text-right text-[clamp(0.8rem,3vw,1.1rem)] font-black leading-none text-orange-600">-{"\u20B9"}{formatCurrency(comboDiscountAmount)}</span>
                        </div>
                      )}
                      <div className="rounded-[1.6rem] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-4 py-4">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <Sparkles className="h-5 w-5" />
                            </div>
                            <span className="min-w-0 text-[11px] font-black leading-tight text-emerald-700 sm:text-[12px]">Total Savings</span>
                          </div>
                          <span className="shrink-0 text-right text-[clamp(0.88rem,3.2vw,1.22rem)] font-black leading-none text-emerald-700">{"\u20B9"}{formatCurrency(totalSavings)}</span>
                        </div>
                      </div>
                      <div className="rounded-[1.6rem] border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-blue-50 px-4 py-4">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                              <WalletCards className="h-5 w-5" />
                            </div>
                            <span className="min-w-0 text-[11px] font-black leading-tight text-sky-700 sm:text-[12px]">Amount to Pay</span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="block text-[clamp(0.95rem,3.4vw,1.32rem)] font-black leading-none tracking-tight text-sky-700">{"\u20B9"}{formatCurrency(totalAmount)}</span>
                            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.08em] text-sky-500">incl GST 18%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <div className="max-w-full rounded-full bg-sky-700 px-4 py-2 text-center text-xs font-black leading-tight text-white shadow-lg">
                        {hasComboDiscount ? "You Save More with Combo!" : "Add all 4 same exams to unlock combo savings"}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 hidden" />
                  <div className="hidden justify-between text-slate-600 mb-2">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold">{"\u20B9"}{formatCurrency(subtotalAmount)}</span>
                  </div>
                  {hasComboDiscount && (
                    <div className="hidden justify-between text-emerald-600 mb-2">
                      <span className="font-semibold">Combo Discount</span>
                      <span className="font-bold">-{"\u20B9"}{formatCurrency(comboDiscountAmount)}</span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="hidden justify-between text-green-600 mb-2">
                      <span className="font-semibold">You Save</span>
                      <span className="font-bold">{"\u20B9"}{formatCurrency(totalSavings)}</span>
                    </div>
                  )}
                  <div className="hidden justify-between text-lg">
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="font-black text-sky-600">{"\u20B9"}{formatCurrency(totalAmount)}</span>
                  </div>
                </>
              )}
              {currentStep === 2 && cart.length > 0 && (
                <Button
                  onClick={continueToDetailsStep}
                  className="w-full mt-4 rounded-full bg-sky-500 hover:bg-sky-400 font-bold"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
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
                              <p className="font-bold text-slate-800 text-sm">{"\u20B9"}{formatCurrency(item.price)}</p>
                              {item.originalPrice && (
                                <p className="text-xs text-slate-400 line-through">{"\u20B9"}{formatCurrency(item.originalPrice)}</p>
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
                    {hasComboDiscount && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        <p className="font-bold">Combo Discount Applied</p>
                        <p className="mt-1">{comboOffer.message}</p>
                      </div>
                    )}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="mt-2 rounded-[1.75rem] border-2 border-orange-300 bg-white p-3 shadow-[0_16px_36px_-26px_rgba(249,115,22,0.5)]">
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Tag className="h-4 w-4" />
                          </div>
                          <span className="min-w-0 text-[9px] font-bold leading-tight text-slate-700 sm:text-[10px]">Original Price</span>
                        </div>
                        <span className="shrink-0 text-right text-[clamp(0.75rem,3vw,0.95rem)] font-black leading-none text-slate-900">{"\u20B9"}{formatCurrency(originalTotalAmount)}</span>
                      </div>
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 rounded-2xl border border-rose-100 bg-rose-50/80 px-3 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <Percent className="h-4 w-4" />
                          </div>
                          <span className="min-w-0 text-[9px] font-bold leading-tight text-slate-700 sm:text-[10px]">Instant Discount</span>
                        </div>
                        <span className="shrink-0 text-right text-[clamp(0.75rem,3vw,0.95rem)] font-black leading-none text-rose-600">-{"\u20B9"}{formatCurrency(packageSavings)}</span>
                      </div>
                      {hasComboDiscount && (
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5 rounded-2xl border border-orange-100 bg-orange-50/80 px-3 py-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                              <Gift className="h-4 w-4" />
                            </div>
                            <span className="min-w-0 text-[9px] font-bold leading-tight text-slate-700 sm:text-[10px]">Combo Offer</span>
                          </div>
                          <span className="shrink-0 text-right text-[clamp(0.75rem,3vw,0.95rem)] font-black leading-none text-orange-600">-{"\u20B9"}{formatCurrency(comboDiscountAmount)}</span>
                        </div>
                      )}
                      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-3 py-3">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="min-w-0 text-[10px] font-black leading-tight text-emerald-700 sm:text-[11px]">Total Savings</span>
                          </div>
                          <span className="shrink-0 text-right text-[clamp(0.8rem,3.2vw,1.05rem)] font-black leading-none text-emerald-700">{"\u20B9"}{formatCurrency(totalSavings)}</span>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-blue-50 px-3 py-3">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2.5">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                              <WalletCards className="h-4 w-4" />
                            </div>
                            <span className="min-w-0 text-[10px] font-black leading-tight text-sky-700 sm:text-[11px]">Amount to Pay</span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="block text-[clamp(0.86rem,3.4vw,1.12rem)] font-black leading-none tracking-tight text-sky-700">{"\u20B9"}{formatCurrency(totalAmount)}</span>
                            <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.08em] text-sky-500">incl GST</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center">
                      <div className="max-w-full rounded-full bg-sky-700 px-4 py-2 text-center text-[11px] font-black leading-tight text-white shadow-md">
                        {hasComboDiscount ? "You Save More with Combo!" : "Add all 4 exams to unlock combo savings"}
                      </div>
                    </div>
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="hidden mb-2 justify-between px-1 text-sm text-slate-600">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold">{"\u20B9"}{formatCurrency(subtotalAmount)}</span>
                  </div>
                )}
                {hasComboDiscount && (
                  <div className="hidden mb-2 justify-between px-1 text-sm text-emerald-600">
                    <span className="font-semibold">Combo Discount</span>
                    <span className="font-bold">-{"\u20B9"}{formatCurrency(comboDiscountAmount)}</span>
                  </div>
                )}
                {cart.length > 0 && totalSavings > 0 && (
                  <div className="hidden justify-between text-green-600 text-sm mb-2 px-1">
                    <span className="font-semibold">You Save</span>
                    <span className="font-bold">{"\u20B9"}{formatCurrency(totalSavings)}</span>
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
                      <p className="text-xl font-black text-sky-600">₹{formatCurrency(totalAmount)}</p>
                      <p className="text-[10px] font-semibold tracking-wide text-sky-500">incl GST</p>
                      {totalSavings > 0 && (
                        <p className="text-xs text-green-600 font-semibold">Save {"\u20B9"}{formatCurrency(totalSavings)}</p>
                      )}
                      {currentStep === 2 && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            continueToDetailsStep();
                          }}
                          className="mt-2 rounded-full bg-sky-500 hover:bg-sky-400 px-4 h-9 text-sm font-bold"
                        >
                          Continue
                        </Button>
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

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="flex w-[calc(100vw-2rem)] max-w-4xl max-h-[85vh] flex-col overflow-hidden rounded-3xl p-0">
          <DialogHeader className="shrink-0 border-b border-slate-200 px-6 py-5 text-left">
            <DialogTitle className="text-2xl font-black text-slate-900">
              Olympiads Terms & Conditions
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
            <TermsAndConditionsContent />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={comboOfferOpen} onOpenChange={setComboOfferOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[380px] rounded-[2rem] border border-slate-200 bg-white p-0 shadow-[0_28px_70px_-28px_rgba(15,23,42,0.45)] overflow-hidden [&>button]:hidden">
          <div className="relative bg-white px-7 pb-7 pt-5 text-center sm:px-8 sm:pb-8 sm:pt-5">
            <button
              type="button"
              onClick={() => setComboOfferOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md border border-slate-400 bg-white text-rose-500 shadow-sm transition-colors hover:border-slate-500 hover:text-rose-600"
              aria-label="Close special offer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_18px_30px_-14px_rgba(244,63,94,0.75)]">
              <Percent className="h-12 w-12" />
            </div>
            <h3 className="mt-7 text-[2.1rem] font-black leading-none tracking-tight text-slate-700">
              {comboOffer.isApplied ? comboOffer.popupTitle : "Special Offer!"}
            </h3>
            <p className="mx-auto mt-6 max-w-[300px] text-[1.02rem] font-medium leading-9 text-slate-500">
              {comboOffer.isApplied ? (
                comboOffer.popupDescription
              ) : (
                <>
                  Select all Olympiads with <span className="font-black text-slate-700">Option 1</span> for a 7% discount.
                  <br />
                  <span className="font-black text-slate-700">Option 2</span> for 10%. <span className="font-black text-slate-700">Option 3</span> for 15%.
                </>
              )}
            </p>
            {comboOffer.isApplied && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700">
                {comboOffer.message}
              </div>
            )}
            {comboOffer.isApplied && comboOffer.upgradeMessage && (
              <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold leading-6 text-indigo-700">
                {comboOffer.upgradeMessage}
              </div>
            )}
            <Button
              type="button"
              onClick={() => setComboOfferOpen(false)}
              className="mt-7 h-12 rounded-xl bg-indigo-500 px-8 text-[1.05rem] font-black shadow-[0_14px_24px_-16px_rgba(79,70,229,0.9)] hover:bg-indigo-400"
            >
              Get Now!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternationalRegistrationPage;
