import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Link2, LogOut, UserCircle } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/static-content-admin/dashboard", icon: LayoutDashboard },
  { label: "Hot Links", path: "/static-content-admin/hot-links", icon: Link2 },
  { label: "Profile", path: "/static-content-admin/profile", icon: UserCircle },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/SuperAdmin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="w-full max-w-[260px] border-r border-slate-200 bg-white/80 p-6 backdrop-blur-sm">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Admin</p>
            <h1 className="mt-2 text-2xl font-black text-slate-800">Unified Council</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                    isActive ? "bg-sky-500 text-white shadow-lg shadow-sky-200" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-10 flex w-full items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 transition hover:border-sky-500 hover:text-sky-600"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
