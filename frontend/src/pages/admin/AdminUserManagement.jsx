import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  KeyRound,
  Search,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import API_BASE_URL from "@/services/apiBaseUrl";
import AdminSideBar from "./AdminSideBar";
import { getAdminAuthorization } from "./adminPermissions";

const getRequestConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("uc_admin_token")}` },
});

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const [authorization] = useState(getAdminAuthorization);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [expandedRoleId, setExpandedRoleId] = useState(null);
  const [rolePermissionDrafts, setRolePermissionDrafts] = useState({});
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleName, setRoleName] = useState("");
  const [userForm, setUserForm] = useState({
    displayName: "",
    username: "",
    password: "",
    roleId: "",
  });
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [savingRoleId, setSavingRoleId] = useState(null);
  const [deletingRoleId, setDeletingRoleId] = useState(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const handleRequestError = useCallback((error, fallbackMessage) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("uc_admin_token");
      localStorage.removeItem("uc_admin_permissions");
      navigate("/school/login", { replace: true });
      return;
    }
    toast.error(error.response?.data?.message || error.message || fallbackMessage);
  }, [navigate]);

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login", { replace: true });
      return;
    }
    if (!authorization.isSuperAdmin) {
      navigate("/SuperAdmin", { replace: true });
      return;
    }

    setIsLoading(true);
    try {
      const config = getRequestConfig();
      const [permissionResponse, roleResponse, userResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/managed-roles/permissions`, config),
        axios.get(`${API_BASE_URL}/admin/managed-roles`, config),
        axios.get(`${API_BASE_URL}/admin/managed-users`, config),
      ]);
      setPermissionGroups(Array.isArray(permissionResponse.data?.data) ? permissionResponse.data.data : []);
      const loadedRoles = Array.isArray(roleResponse.data?.data) ? roleResponse.data.data : [];
      setRoles(loadedRoles);
      setUsers(Array.isArray(userResponse.data?.data) ? userResponse.data.data : []);
      setUserForm((current) => ({
        ...current,
        roleId: current.roleId || String(loadedRoles[0]?.id || ""),
      }));
    } catch (error) {
      handleRequestError(error, "Unable to load admin users and roles.");
    } finally {
      setIsLoading(false);
    }
  }, [authorization, handleRequestError, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!authorization.isSuperAdmin) {
    return localStorage.getItem("uc_admin_token")
      ? <Navigate to="/SuperAdmin" replace />
      : <Navigate to="/schools/Admin/login" replace />;
  }

  const handleCreateRole = async (event) => {
    event.preventDefault();
    setIsSavingRole(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/managed-roles`,
        { name: roleName, permissions: [] },
        getRequestConfig()
      );
      toast.success(response.data?.message || "Role created successfully.");
      setRoleName("");
      const newRoleId = response.data?.data?.id;
      if (newRoleId !== undefined) {
        setExpandedRoleId(String(newRoleId));
        setRolePermissionDrafts((current) => ({ ...current, [newRoleId]: [] }));
      }
      await loadData();
    } catch (error) {
      handleRequestError(error, "Unable to create this role.");
    } finally {
      setIsSavingRole(false);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setIsSavingUser(true);
    setCreatedCredentials(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/managed-users`,
        userForm,
        getRequestConfig()
      );
      setCreatedCredentials({
        username: userForm.username.trim().toLowerCase(),
        password: userForm.password,
      });
      toast.success(response.data?.message || "Admin user created successfully.");
      setUserForm((current) => ({
        ...current,
        displayName: "",
        username: "",
        password: "",
      }));
      await loadData();
    } catch (error) {
      handleRequestError(error, "Unable to create this admin user.");
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleUser = async (user) => {
    setUpdatingUserId(user.id);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/managed-users/${user.id}/status`,
        { isActive: !user.isActive },
        getRequestConfig()
      );
      toast.success(response.data?.message || "Admin user status updated.");
      await loadData();
    } catch (error) {
      handleRequestError(error, "Unable to update this admin user.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteRole = async (role) => {
    const confirmed = window.confirm(
      `Delete the "${role.name}" role? This cannot be undone. Roles assigned to users cannot be deleted.`
    );
    if (!confirmed) return;

    setDeletingRoleId(role.id);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/managed-roles/${role.id}`,
        getRequestConfig()
      );
      const remainingRoles = roles.filter((item) => item.id !== role.id);
      setRoles(remainingRoles);
      setRolePermissionDrafts((current) => {
        const nextDrafts = { ...current };
        delete nextDrafts[role.id];
        return nextDrafts;
      });
      if (expandedRoleId === String(role.id)) setExpandedRoleId(null);
      setUserForm((current) => (
        current.roleId === String(role.id)
          ? { ...current, roleId: String(remainingRoles[0]?.id || "") }
          : current
      ));
      toast.success(response.data?.message || "Role deleted successfully.");
    } catch (error) {
      handleRequestError(error, "Unable to delete this role.");
    } finally {
      setDeletingRoleId(null);
    }
  };

  const toggleRolePermission = (roleId, permission) => {
    setRolePermissionDrafts((current) => {
      const role = roles.find((item) => String(item.id) === String(roleId));
      const currentPermissions = current[roleId] || role?.permissions || [];
      const permissions = currentPermissions.includes(permission)
        ? currentPermissions.filter((item) => item !== permission)
        : [...currentPermissions, permission];
      return { ...current, [roleId]: permissions };
    });
  };

  const handleExpandRole = (role) => {
    const roleId = String(role.id);
    if (expandedRoleId === roleId) {
      setExpandedRoleId(null);
      return;
    }
    setExpandedRoleId(roleId);
    setRolePermissionDrafts((current) => (
      current[role.id] ? current : { ...current, [role.id]: [...role.permissions] }
    ));
  };

  const handleSaveRolePermissions = async (role) => {
    const permissions = rolePermissionDrafts[role.id] || role.permissions;
    setSavingRoleId(role.id);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/managed-roles/${role.id}/permissions`,
        { permissions },
        getRequestConfig()
      );
      setRoles((current) => current.map((item) => (
        item.id === role.id ? { ...item, permissions: [...permissions] } : item
      )));
      setRolePermissionDrafts((current) => ({ ...current, [role.id]: [...permissions] }));
      toast.success(response.data?.message || "Role permissions updated successfully.");
    } catch (error) {
      handleRequestError(error, "Unable to update this role's permissions.");
    } finally {
      setSavingRoleId(null);
    }
  };

  const activeUserCount = users.filter((user) => user.isActive).length;
  const query = userSearch.trim().toLowerCase();
  const filteredUsers = query
    ? users.filter((user) => (
      [user.displayName, user.username, user.roleName]
        .some((value) => String(value || "").toLowerCase().includes(query))
    ))
    : users;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-50 via-[#f4f7fb] to-[#eef2ff]">
      <div className="flex flex-col lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 p-3 sm:p-5 lg:pl-6">
          <div className="mx-auto max-w-[1500px] space-y-6 pb-8">
            <header className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#101c49] via-[#174a79] to-[#0c8291] px-6 py-7 text-white shadow-xl shadow-sky-950/10 sm:px-9 sm:py-9">
              <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-cyan-100">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Super admin workspace
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Users &amp; access</h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50/85 sm:text-base">
                    Manage administrator accounts, assign roles and control access to each area.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadData}
                  disabled={isLoading}
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? "Refreshing" : "Refresh data"}
                </Button>
              </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-3" aria-label="User management summary">
              {[
                { label: "Total administrators", value: users.length, icon: UsersRound, color: "bg-sky-50 text-sky-700", detail: "Managed accounts" },
                { label: "Active accounts", value: activeUserCount, icon: Check, color: "bg-emerald-50 text-emerald-700", detail: "Access currently enabled" },
                { label: "Access roles", value: roles.length, icon: ShieldCheck, color: "bg-violet-50 text-violet-700", detail: "Permission profiles" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <article key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-900" aria-live="polite">
                          {isLoading ? "—" : stat.value.toLocaleString("en-IN")}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
                      </div>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>

            {createdCredentials && (
              <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm" aria-live="polite">
                <div className="flex items-start gap-4 bg-emerald-50/80 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <KeyRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-bold text-emerald-950">Account created — share credentials securely</h2>
                    <p className="mt-1 text-sm text-emerald-800">The password is shown once and is not stored in readable form.</p>
                  </div>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Username</p>
                    <p className="mt-1 break-all font-semibold text-slate-800">{createdCredentials.username}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Initial password</p>
                    <p className="mt-1 break-all font-semibold text-slate-800">{createdCredentials.password}</p>
                  </div>
                </div>
              </section>
            )}

            <div className="grid items-start gap-6 2xl:grid-cols-2">
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 ring-4 ring-violet-50">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-extrabold text-slate-900">Create a role</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Create a permission profile for your team.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateRole} className="space-y-4 p-5 sm:p-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-role-name" className="text-sm font-bold text-slate-700">Role name</Label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="admin-role-name"
                        value={roleName}
                        onChange={(event) => setRoleName(event.target.value)}
                        maxLength={80}
                        placeholder="e.g. Registration Manager"
                        required
                        className="h-11 flex-1 rounded-xl border-slate-200 bg-slate-50/70 focus-visible:bg-white"
                      />
                      <Button type="submit" disabled={isSavingRole || isLoading} className="h-11 rounded-xl px-5 shadow-sm">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {isSavingRole ? "Creating..." : "Create role"}
                      </Button>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    New roles start with no permissions. Open the role below to configure access.
                  </p>
                </form>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700 ring-4 ring-sky-50">
                    <UserPlus className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-extrabold text-slate-900">Create an admin user</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Give a teammate secure access to the admin area.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateUser} className="grid gap-x-4 gap-y-4 p-5 sm:grid-cols-2 sm:p-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-user-display-name" className="text-sm font-bold text-slate-700">Full name</Label>
                    <Input
                      id="admin-user-display-name"
                      value={userForm.displayName}
                      onChange={(event) => setUserForm((current) => ({ ...current, displayName: event.target.value }))}
                      maxLength={120}
                      autoComplete="name"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 focus-visible:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="admin-user-username" className="text-sm font-bold text-slate-700">Username or email</Label>
                    <Input
                      id="admin-user-username"
                      value={userForm.username}
                      onChange={(event) => setUserForm((current) => ({ ...current, username: event.target.value }))}
                      minLength={3}
                      maxLength={100}
                      autoComplete="username"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 focus-visible:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="admin-user-password" className="text-sm font-bold text-slate-700">Initial password</Label>
                    <Input
                      id="admin-user-password"
                      type="password"
                      value={userForm.password}
                      onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
                      minLength={12}
                      maxLength={128}
                      autoComplete="new-password"
                      required
                      className="h-11 rounded-xl border-slate-200 bg-slate-50/70 focus-visible:bg-white"
                    />
                    <p className="text-xs text-slate-500">Use at least 12 characters. The password is securely hashed.</p>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="admin-user-role" className="text-sm font-bold text-slate-700">Assign role</Label>
                    <select
                      id="admin-user-role"
                      value={userForm.roleId}
                      onChange={(event) => setUserForm((current) => ({ ...current, roleId: event.target.value }))}
                      disabled={!roles.length}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="" disabled>Select a role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                    {!roles.length && <p className="text-xs text-amber-700">Create a role before adding users.</p>}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:col-span-2">
                    <p className="hidden text-xs text-slate-500 sm:block">Credentials will be displayed once after account creation.</p>
                    <Button type="submit" disabled={isSavingUser || isLoading || !roles.length} className="h-11 w-full rounded-xl px-5 shadow-sm sm:w-auto">
                      <KeyRound className="mr-2 h-4 w-4" />
                      {isSavingUser ? "Creating user..." : "Create user"}
                    </Button>
                  </div>
                </form>
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50">
                  <UsersRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-900">Admin users</h2>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{users.length}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">Manage account access and assigned roles.</p>
                  </div>
                </div>
                <label className="relative block w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <Input
                    value={userSearch}
                    onChange={(event) => setUserSearch(event.target.value)}
                    placeholder="Search users or roles"
                    aria-label="Search admin users"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 focus-visible:bg-white"
                  />
                </label>
              </div>
              {isLoading ? (
                <div className="space-y-3 p-5 sm:p-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : filteredUsers.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-slate-50/80">
                      <tr className="border-b border-slate-100 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                        <th className="px-5 py-3.5 font-bold">Administrator</th>
                        <th className="px-4 py-3.5 font-bold">Username</th>
                        <th className="px-4 py-3.5 font-bold">Assigned role</th>
                        <th className="px-4 py-3.5 font-bold">Status</th>
                        <th className="px-5 py-3.5 text-right font-bold">Account access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-100 last:border-0 transition hover:bg-sky-50/40">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sm font-extrabold uppercase text-indigo-700">
                                {String(user.displayName || "?").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
                              </span>
                              <span className="font-bold text-slate-800">{user.displayName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">{user.username}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700">
                              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              {user.roleName}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                              user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={updatingUserId === user.id}
                              onClick={() => handleToggleUser(user)}
                              className={user.isActive
                                ? "rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                                : "rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"}
                            >
                              {updatingUserId === user.id ? "Saving..." : user.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-12 text-center sm:px-6">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <CircleUserRound className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 font-bold text-slate-800">{userSearch ? "No matching users" : "No admin users yet"}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {userSearch ? "Try another name, username, or role." : "Create an admin user to give a teammate access."}
                  </p>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Roles &amp; permissions</h2>
                  <p className="mt-0.5 text-sm text-slate-500">Expand a role to review or change its access.</p>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                  {roles.length} {roles.length === 1 ? "role" : "roles"}
                </span>
              </div>
              <div className="space-y-3 p-5 sm:p-6">
                {roles.map((role) => (
                  <article key={role.id} className={`overflow-hidden rounded-xl border transition ${
                    expandedRoleId === String(role.id)
                      ? "border-violet-200 bg-violet-50/20 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}>
                    <div className="flex items-center gap-2 pr-3">
                      <button
                        type="button"
                        aria-expanded={expandedRoleId === String(role.id)}
                        aria-controls={`role-permissions-${role.id}`}
                        onClick={() => handleExpandRole(role)}
                        className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50/80"
                      >
                        {expandedRoleId === String(role.id)
                          ? <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
                          : <ChevronRight className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />}
                        <span className="min-w-0 flex-1">
                          <span className="block font-bold text-slate-800">{role.name}</span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"} enabled
                          </span>
                        </span>
                      </button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={deletingRoleId === role.id}
                        onClick={() => handleDeleteRole(role)}
                        aria-label={`Delete ${role.name} role`}
                        className="h-9 shrink-0 rounded-lg border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        {deletingRoleId === role.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                    {expandedRoleId === String(role.id) && (
                      <div id={`role-permissions-${role.id}`} className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                        <p className="mb-4 text-sm text-slate-600">
                          Tick the permissions this role should have, then save your changes.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {permissionGroups.map((group) => (
                            <fieldset key={group.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
                              <legend className="px-1 text-sm font-bold text-slate-800">{group.label}</legend>
                              <div className="space-y-2">
                                {group.permissions.map((permission) => {
                                  const selectedPermissions = rolePermissionDrafts[role.id] || role.permissions;
                                  return (
                                    <label key={permission.key} className="flex cursor-pointer items-start gap-2 rounded-lg px-1 py-1 text-sm text-slate-600 transition hover:text-slate-900">
                                      <input
                                        type="checkbox"
                                        checked={selectedPermissions.includes(permission.key)}
                                        onChange={() => toggleRolePermission(role.id, permission.key)}
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                      />
                                      <span>{permission.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            type="button"
                            disabled={savingRoleId === role.id}
                            onClick={() => handleSaveRolePermissions(role)}
                            className="rounded-xl px-5 shadow-sm"
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            {savingRoleId === role.id ? "Saving permissions..." : "Save permissions"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
                {!isLoading && !roles.length && (
                  <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
                    <ShieldCheck className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
                    <p className="mt-2 font-semibold text-slate-700">No roles created yet</p>
                    <p className="mt-1 text-sm text-slate-500">Create a role above to define admin permissions.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserManagement;
