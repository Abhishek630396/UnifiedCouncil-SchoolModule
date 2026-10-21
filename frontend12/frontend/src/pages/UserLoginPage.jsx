import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import API_BASE_URL from "../services/apiBaseUrl";

const MOBILE_NUMBER_PATTERN = /^[6-9]\d{9}$/;
const OTP_PATTERN = /^\d{6}$/;
const USER_SESSION_KEY = "uc-user-session";
const OTP_TTL_MS = 5 * 60 * 1000;
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function generateDemoOtp() {
  const randomValue = new Uint32Array(1);
  const range = 0x100000000;
  const acceptedRange = Math.floor(range / 900000) * 900000;
  let value;

  do {
    window.crypto.getRandomValues(randomValue);
    value = randomValue[0];
  } while (value >= acceptedRange);

  return String(100000 + (value % 900000));
}

const UserLoginPage = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [demoOtpExpiresAt, setDemoOtpExpiresAt] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.sessionStorage.getItem(USER_SESSION_KEY)) {
      navigate("/user-dashboard", { replace: true });
    }
  }, [navigate]);

  const requestOtp = async (event) => {
    event.preventDefault();
    setError("");
    if (!MOBILE_NUMBER_PATTERN.test(mobileNumber)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (LOCAL_HOSTNAMES.has(window.location.hostname)) {
        setDemoOtp(generateDemoOtp());
        setDemoOtpExpiresAt(Date.now() + OTP_TTL_MS);
        setOtp("");
        setIsOtpSent(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to send the OTP. Please try again.");
      }
      setDemoOtp(payload.demoOtp || "");
      setOtp("");
      setIsOtpSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send the OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    if (!OTP_PATTERN.test(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (LOCAL_HOSTNAMES.has(window.location.hostname)) {
        if (Date.now() >= demoOtpExpiresAt) {
          throw new Error("This demo OTP has expired. Generate a new OTP.");
        }
        if (otp !== demoOtp) {
          throw new Error("The OTP is incorrect. Please try again.");
        }

        const response = await fetch(`${API_BASE_URL}/auth/demo-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: mobileNumber }),
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || "Unable to load registrations for this number.");
        }

        window.sessionStorage.setItem(
          USER_SESSION_KEY,
          JSON.stringify({ mobileNumber, existingUser: payload.existingUser || null })
        );
        navigate("/user-dashboard", { replace: true });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "Unable to verify the OTP. Please try again.");
      }

      window.sessionStorage.setItem(
        USER_SESSION_KEY,
        JSON.stringify({ mobileNumber, existingUser: payload.existingUser || null })
      );
      navigate("/user-dashboard", { replace: true });
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Unable to verify the OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <Link to="/" className="mb-8 inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Unified Council
        </Link>
        <div className="mb-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            {isOtpSent ? <LockKeyhole className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Student &amp; Parent Login</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{isOtpSent ? "Verify your number" : "Welcome back"}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isOtpSent
              ? `Enter the OTP for +91 ${mobileNumber}.`
              : "Sign in with your mobile number to access your dashboard."}
          </p>
        </div>
        {demoOtp && (
          <div role="status" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-bold uppercase tracking-wide">Demo OTP (no SMS sent)</p>
            <p className="mt-1 font-mono text-2xl font-black tracking-[0.3em]">{demoOtp}</p>
            <p className="mt-1 text-xs">Use this code to test login. It expires in 5 minutes.</p>
          </div>
        )}

        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        {!isOtpSent ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <div>
              <label htmlFor="user-mobile-number" className="mb-2 block text-sm font-semibold text-slate-800">Mobile number</label>
              <div className="flex gap-2">
                <span className="inline-flex h-12 items-center rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-semibold text-slate-600">+91</span>
                <Input
                  id="user-mobile-number"
                  name="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  required
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="h-12 rounded-lg border-slate-300"
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-lg bg-sky-600 text-sm font-bold text-white hover:bg-sky-700">
              {isSubmitting ? "Sending OTP..." : "Continue"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-5">
            <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {demoOtp ? "Enter the demo OTP shown above." : `Enter the OTP sent to +91 ${mobileNumber}.`}
            </div>
            <div>
              <label htmlFor="user-otp" className="mb-2 block text-sm font-semibold text-slate-800">6-digit OTP</label>
              <Input
                id="user-otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter OTP"
                className="h-12 rounded-lg border-slate-300 text-center font-mono text-lg tracking-[0.4em]"
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-lg bg-sky-600 text-sm font-bold text-white hover:bg-sky-700">
              {isSubmitting ? "Verifying..." : "Verify &amp; continue"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <button
              type="button"
              onClick={() => {
                setIsOtpSent(false);
                setOtp("");
                setDemoOtp("");
                setDemoOtpExpiresAt(0);
                setError("");
              }}
              className="w-full text-center text-sm font-semibold text-sky-700 hover:text-sky-900"
            >
              Change mobile number
            </button>
          </form>
        )}

        <p className="mt-8 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
          School account?{" "}
          <a href="https://school.unifiedcouncil.com/school-dashboard/login" className="font-semibold text-sky-700 hover:text-sky-900">
            School login
          </a>
        </p>
      </section>
    </main>
  );
};

export default UserLoginPage;
