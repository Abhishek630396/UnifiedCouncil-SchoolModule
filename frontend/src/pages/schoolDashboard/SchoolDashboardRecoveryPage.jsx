import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import schoolDashboardApi from "@/services/schoolDashboardApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LOGO_SRC = "/assests/logo/uc_logo.jpeg";

const SchoolDashboardRecoveryPage = ({ mode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const [resetToken] = useState(tokenFromUrl);
  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isReset = mode === "reset";
  const hasToken = Boolean(resetToken);

  useEffect(() => {
    if (tokenFromUrl) navigate("/school-dashboard/reset-password", { replace: true });
  }, [tokenFromUrl, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (isReset && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isReset) {
        const response = await schoolDashboardApi.post("/school-auth/reset-password", { token: resetToken, password });
        setMessage(response.data?.message || "Password updated. Sign in with your new password.");
      } else {
        const response = await schoolDashboardApi.post("/school-auth/forgot-password", { registrationId: registrationId.trim() });
        setMessage(response.data?.message || "If the ID matches an account, reset instructions will be sent to its registered email address.");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to complete this request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-9">
        <Link to="/" className="mb-8 inline-flex items-center gap-3">
          <img src={LOGO_SRC} alt="Unified Council" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-bold text-slate-900">Unified Council</span>
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">School Dashboard</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">{isReset ? "Set a new password" : "Reset your password"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isReset ? "Choose a new password for your School Registration ID." : "Enter your School Registration ID and we’ll email a secure reset link to the address on file."}
        </p>

        {message ? (
          <div role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" /><span>{message}</span></div>
            {isReset && <Button type="button" onClick={() => navigate("/school-dashboard/login", { replace: true })} className="mt-4 bg-sky-600 text-white hover:bg-sky-700">Go to Login</Button>}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5">
            {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
            {isReset ? (
              hasToken ? (
                <>
                  <div>
                    <label htmlFor="new-school-password" className="mb-2 block text-sm font-semibold text-slate-800">New password</label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="new-school-password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={10} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-lg pl-10 pr-11" />
                      <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Use 10 to 128 characters.</p>
                  </div>
                  <div>
                    <label htmlFor="confirm-school-password" className="mb-2 block text-sm font-semibold text-slate-800">Confirm password</label>
                    <Input id="confirm-school-password" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-12 rounded-lg" />
                  </div>
                </>
              ) : <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">This reset link is missing its secure token. Request a new password reset.</div>
            ) : (
              <div>
                <label htmlFor="reset-school-id" className="mb-2 block text-sm font-semibold text-slate-800">School Registration ID</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="reset-school-id" autoComplete="username" required value={registrationId} onChange={(event) => setRegistrationId(event.target.value)} placeholder="e.g. SCH000123" className="h-12 rounded-lg pl-10" />
                </div>
              </div>
            )}
            {(!isReset || hasToken) && (
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-lg bg-sky-600 font-bold text-white hover:bg-sky-700">
                {isSubmitting ? "Please wait..." : isReset ? "Update Password" : "Send Reset Link"}
              </Button>
            )}
          </form>
        )}
        <Link to="/school-dashboard/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft className="h-4 w-4" />Back to login</Link>
      </section>
    </main>
  );
};

export default SchoolDashboardRecoveryPage;
