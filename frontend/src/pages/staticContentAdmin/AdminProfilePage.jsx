import { useEffect, useState } from "react";
import { staticContentAdminApi } from "@/services/staticContentPublicApi";

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await staticContentAdminApi.me();
        setProfile(data.admin);
      } catch (error) {
        setError(error.message || "Unable to load profile");
      }
    };

    loadProfile();
  }, []);

  if (!profile) {
    if (error) {
      return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">{error}</div>;
    }
    return <div className="rounded-[2rem] border-2 border-slate-200 bg-white p-8 text-slate-600">Loading profile...</div>;
  }

  return (
    <div className="max-w-xl rounded-[2rem] border-2 border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">Profile</p>
      <h1 className="mt-2 text-3xl font-black text-slate-800">{profile.name}</h1>
      <div className="mt-6 space-y-4 text-slate-700">
        <div><span className="font-bold">Username:</span> {profile.username}</div>
        <div><span className="font-bold">Email:</span> {profile.email}</div>
        <div><span className="font-bold">Role:</span> {profile.role}</div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
