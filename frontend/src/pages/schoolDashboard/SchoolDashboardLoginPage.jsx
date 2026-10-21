import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import schoolDashboardApi from "@/services/schoolDashboardApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LOGO_SRC = "https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png";
const LIGHT_LOGO_SRC = "/assests/logo/uc_full_logo_light.png";

const SchoolDashboardLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationId, setRegistrationId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    schoolDashboardApi.get("/school-dashboard/overview")
      .then(() => navigate("/school-dashboard", { replace: true }))
      .catch(() => { if (active) setIsCheckingSession(false); });
    return () => { active = false; };
  }, [navigate]);

  const submitLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await schoolDashboardApi.post("/school-auth/login", {
        registrationId: registrationId.trim().toUpperCase(),
        password,
        rememberMe,
      });
      navigate("/school-dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-600">Checking your secure session...</div>;
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:block">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(110deg, rgba(8,20,43,.94), rgba(8,20,43,.58)), url('/assests/banner/banner.jpeg')" }} />
        <div className="relative flex min-h-screen flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="inline-flex w-fit items-center">
            <img src={LIGHT_LOGO_SRC} alt="Unified Council — Foundation for Success" className="h-auto w-56 object-contain" />
          </Link>
          <div className="max-w-xl pb-10">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-sky-300">School Partner Portal</p>
            <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">One place to manage your Olympiad registrations.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">Review student registrations, monitor their status, and keep your school details close at hand.</p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"><ShieldCheck className="h-5 w-5" /></span>
              School-specific access with protected student records
            </div>
          </div>
          <p className="text-xs text-slate-300">Unified Council · Inspiring Young Minds</p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-8 lg:bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 inline-flex w-fit items-center lg:hidden">
            <img src={LOGO_SRC} alt="Unified Council — Foundation for Success" className="h-auto w-48 object-contain" />
          </Link>
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">School Dashboard</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Access your school's registration and student management dashboard.</p>
          </div>

          {location.state?.sessionExpired && (
            <div role="status" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Your session has expired. Sign in again to continue.</div>
          )}
          {location.state?.passwordChanged && (
            <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">Your password was changed. Sign in with your new password.</div>
          )}
          {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

          <form onSubmit={submitLogin} className="space-y-5">
            <div>
              <label htmlFor="school-registration-id" className="mb-2 block text-sm font-semibold text-slate-800">School ID or Registration ID</label>
              <Input id="school-registration-id" name="username" autoComplete="username" autoCapitalize="characters" required value={registrationId} onChange={(event) => setRegistrationId(event.target.value)} placeholder="Enter your school ID" className="h-12 rounded-lg border-slate-300" />
            </div>
            <div>
              <label htmlFor="school-dashboard-password" className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="school-dashboard-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-lg border-slate-300 pl-10 pr-11" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-700">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-sky-600" />
                Remember me
              </label>
              <Link to="/school-dashboard/forgot-password" className="font-semibold text-sky-700 hover:text-sky-900">Forgot password?</Link>
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-lg bg-sky-600 text-sm font-bold text-white hover:bg-sky-700">
              {isSubmitting ? "Signing in..." : "Login"}
              {!isSubmitting && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-600">Don't have a School Registration ID?</p>
            <Button asChild variant="outline" className="mt-3 h-11 w-full rounded-lg border-slate-300 font-semibold text-slate-800">
              <Link to="/school-registration">Register Your School</Link>
            </Button>
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-slate-500">Your password is sent securely for verification and is never saved in your browser.</p>
        </div>
      </section>
    </main>
  );
};

export default SchoolDashboardLoginPage;
