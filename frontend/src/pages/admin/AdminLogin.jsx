import { useState } from "react";
import axios from "axios";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SchoolHeader from "../school/components/SchoolHeader";
import API_BASE_URL from "@/services/apiBaseUrl";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      const token = response.data?.data?.token;

      if (!token) {
        throw new Error("Admin token was not returned.");
      }

      localStorage.setItem("uc_admin_token", token);
      localStorage.setItem("uc_admin_permissions", JSON.stringify(response.data?.data?.permissions || []));
      toast.success("Admin login successful");
      navigate("/SuperAdmin");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader showFullLogo />
      <main className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="space-y-2 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Admin Login</p>
            <h1 className="text-2xl font-bold text-slate-900">Unified Council administration</h1>
            <p className="text-sm text-slate-600">Sign in with your admin account to continue to your authorized workspace.</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <Label>Username</Label>
              <Input
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter admin username"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
