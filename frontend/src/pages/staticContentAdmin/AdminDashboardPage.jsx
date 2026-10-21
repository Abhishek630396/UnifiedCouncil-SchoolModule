import { useEffect, useState } from "react";
import { BarChart3, Blocks, Users, Activity } from "lucide-react";
import { staticContentAdminApi } from "@/services/staticContentPublicApi";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBlocks: 0,
    inactiveBlocks: 0,
    totalBlocks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await staticContentAdminApi.dashboard();
        setStats(data);
      } catch (error) {
        setError(error.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);
  const cards = [
    { label: "Total users", value: stats.totalUsers, icon: Users, tone: "bg-sky-100 text-sky-600" },
    { label: "Active blocks", value: stats.activeBlocks, icon: Activity, tone: "bg-emerald-100 text-emerald-600" },
    { label: "Inactive blocks", value: stats.inactiveBlocks, icon: Blocks, tone: "bg-amber-100 text-amber-600" },
    { label: "Total content", value: stats.totalBlocks, icon: BarChart3, tone: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">Overview</p>
          <h1 className="mt-2 text-3xl font-black text-slate-800">Dashboard</h1>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-3xl border-2 border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-[2rem] border-2 border-slate-200 bg-white p-6 shadow-sm">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <h2 className="mt-3 text-3xl font-black text-slate-800">{value}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
