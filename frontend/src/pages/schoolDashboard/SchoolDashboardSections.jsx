import { useState } from "react";
import { ArrowRight, Building2, CheckCircle2, Globe2, KeyRound, MapPin, Mail, Phone, UserRound } from "lucide-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import schoolDashboardApi from "@/services/schoolDashboardApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const display = (value) => value === null || value === undefined || value === "" ? "—" : value;

const ProfileField = ({ icon: Icon, label, value, wide = false }) => (
  <div className={`flex min-w-0 gap-3 rounded-lg border border-slate-200 bg-white p-4 ${wide ? "sm:col-span-2" : ""}`}>
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700"><Icon className="h-4 w-4" /></span>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">{display(value)}</p>
    </div>
  </div>
);

export const SchoolProfilePage = () => {
  const { school } = useOutletContext();
  return (
    <div className="space-y-5">
      <div><p className="text-sm font-semibold text-sky-700">School workspace</p><h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">School Profile</h1><p className="mt-1 text-sm text-slate-600">Your registered school information.</p></div>
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200"><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-sky-700" />{display(school?.schoolName)}</CardTitle></CardHeader>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
          <ProfileField icon={Building2} label="School Name" value={school?.schoolName} />
          <ProfileField icon={KeyRound} label="School Registration ID" value={school?.registrationId} />
          <ProfileField icon={UserRound} label="Principal / Contact Name" value={school?.principalName} />
          <ProfileField icon={Mail} label="Email" value={school?.email} />
          <ProfileField icon={Phone} label="Phone" value={school?.phone} />
          <ProfileField icon={MapPin} label="City" value={school?.city} />
          <ProfileField icon={MapPin} label="District" value={school?.district} />
          <ProfileField icon={MapPin} label="State" value={school?.state} />
          <ProfileField icon={Globe2} label="Country" value={school?.country} />
          <ProfileField icon={MapPin} label="Address" value={school?.address} wide />
        </CardContent>
      </Card>
      <p className="text-xs text-slate-500">Profile changes are managed by Unified Council support.</p>
    </div>
  );
};

export const SchoolDashboardPlaceholder = ({ title, message, linkTo, linkLabel }) => (
  <div className="space-y-5">
    <div><p className="text-sm font-semibold text-sky-700">School workspace</p><h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1></div>
    <Card className="rounded-xl border-slate-200 shadow-sm">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-700"><CheckCircle2 className="h-6 w-6" /></span>
        <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">{message}</p>
        {linkTo && <Button asChild className="mt-5 bg-sky-600 text-white hover:bg-sky-700"><Link to={linkTo}>{linkLabel || "Open registrations"}<ArrowRight className="h-4 w-4" /></Link></Button>}
      </CardContent>
    </Card>
  </div>
);

export const SchoolChangePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await schoolDashboardApi.post("/school-auth/change-password", { currentPassword, newPassword });
      setMessage(response.data?.message || "Password changed. Sign in again.");
      setTimeout(() => navigate("/school-dashboard/login", { replace: true, state: { passwordChanged: true } }), 1200);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update your password right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div><p className="text-sm font-semibold text-sky-700">Account security</p><h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">Change Password</h1><p className="mt-1 text-sm text-slate-600">Changing your password signs out all active dashboard sessions.</p></div>
      <Card className="max-w-2xl rounded-xl border-slate-200 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          {message ? <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{message}</div> : (
            <form onSubmit={submit} className="space-y-4">
              {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
              <div><label htmlFor="current-password" className="mb-1.5 block text-sm font-semibold text-slate-800">Current password</label><Input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></div>
              <div><label htmlFor="new-password" className="mb-1.5 block text-sm font-semibold text-slate-800">New password</label><Input id="new-password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><p className="mt-1 text-xs text-slate-500">Use 10 to 128 characters.</p></div>
              <div><label htmlFor="confirm-password" className="mb-1.5 block text-sm font-semibold text-slate-800">Confirm new password</label><Input id="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></div>
              <Button type="submit" disabled={isSubmitting} className="bg-sky-600 font-semibold text-white hover:bg-sky-700">{isSubmitting ? "Updating..." : "Update password"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
