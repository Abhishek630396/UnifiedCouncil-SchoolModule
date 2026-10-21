import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  GripVertical,
  RefreshCw,
  Rocket,
  Camera,
  Download,
  Trophy,
  FileQuestion,
  TrendingUp,
  Grid3X3,
  Brain,
  ClipboardList,
  Medal,
  Award,
  Star,
  BookOpen,
  Monitor,
  Globe,
  Atom,
  Calculator,
  Sigma,
  Users,
  School,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { staticContentAdminApi as adminApi } from "@/services/staticContentPublicApi";
import HotLinkForm from "./components/admin/HotLinkForm";
import RegistrationFormPreview from "./components/admin/RegistrationFormPreview";
import ResultsCheckFormPreview from "./components/admin/ResultsCheckFormPreview";
import { toast } from "sonner";
import { AdminPermission } from "../admin/AdminAccess";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  icon: "Rocket",
  iconColor: "white",
  gradientFrom: "from-sky-500",
  gradientTo: "to-indigo-500",
  badgeText: "",
  badgeColor: "from-sky-500 to-indigo-500",
  url: "",
  openInNewTab: false,
  isActive: true,
  displayOrder: 0,
};

const gradientMap = {
  "from-amber-500 to-orange-500": "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500": "from-pink-500 to-rose-500",
  "from-purple-500 to-fuchsia-500": "from-purple-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500": "from-emerald-500 to-teal-500",
  "from-sky-500 to-cyan-500": "from-sky-500 to-cyan-500",
  "from-rose-500 to-pink-500": "from-rose-500 to-pink-500",
  "from-amber-500 to-yellow-500": "from-amber-500 to-yellow-500",
  "from-green-500 to-emerald-500": "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500": "from-orange-500 to-red-500",
  "from-sky-500 to-indigo-500": "from-sky-500 to-indigo-500",
};

const AdminHotLinksPage = () => {
  const [hotLinks, setHotLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentForm, setCurrentForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(null); // 'registration', 'results', or null

  const loadHotLinks = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getHotLinks();
      setHotLinks(data.data || []);
    } catch (err) {
      setError(err.message || "Unable to load hot links");
      toast.error(err.message || "Failed to load hot links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotLinks();
  }, []);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return hotLinks;
    const query = searchQuery.toLowerCase();
    return hotLinks.filter(l =>
      l.Title.toLowerCase().includes(query) ||
      l.Subtitle?.toLowerCase().includes(query) ||
      l.BadgeText?.toLowerCase().includes(query)
    );
  }, [hotLinks, searchQuery]);

  const handleNewHotLink = () => {
    setEditingId(null);
    setCurrentForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleEditHotLink = (link) => {
    // Check if this is a custom form type
    if (link.Url?.startsWith("form:")) {
      const formType = link.Url.replace("form:", "");
      setShowCustomForm(formType);
      setEditingId(link.Id);
      return;
    }

    setEditingId(link.Id);
    setCurrentForm({
      title: link.Title || "",
      subtitle: link.Subtitle || "",
      description: link.Description || "",
      icon: link.Icon || "Rocket",
      iconColor: link.IconColor || "white",
      gradientFrom: link.GradientFrom || "from-sky-500",
      gradientTo: link.GradientTo || "to-indigo-500",
      badgeText: link.BadgeText || "",
      badgeColor: link.BadgeColor || "from-sky-500 to-indigo-500",
      url: link.Url || "",
      openInNewTab: Boolean(link.OpenInNewTab),
      isActive: Boolean(link.IsActive),
      displayOrder: link.DisplayOrder || 0,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSaveHotLink = async (formData) => {
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        displayOrder: Number(formData.displayOrder || 0),
        isActive: Boolean(formData.isActive),
      };

      if (editingId) {
        await adminApi.updateHotLink(editingId, payload);
        setSuccess("Hot link updated successfully.");
        toast.success("Hot link updated successfully");
      } else {
        await adminApi.createHotLink(payload);
        setSuccess("Hot link created successfully.");
        toast.success("Hot link created successfully");
      }

      setTimeout(() => {
        setShowForm(false);
        setCurrentForm(emptyForm);
        setEditingId(null);
        loadHotLinks();
      }, 1000);
    } catch (err) {
      setError(err.message || "Unable to save hot link");
      toast.error(err.message || "Failed to save hot link");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowCustomForm(null);
    setEditingId(null);
    setCurrentForm(emptyForm);
    setError("");
    setSuccess("");
  };

  const handleDeleteHotLink = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hot link?")) return;

    try {
      await adminApi.deleteHotLink(id);
      toast.success("Hot link deleted successfully");
      await loadHotLinks();
    } catch (err) {
      toast.error(err.message || "Failed to delete hot link");
    }
  };

  const handleToggleHotLink = async (id, isActive) => {
    try {
      await adminApi.toggleHotLinkStatus(id, !isActive);
      toast.success(`Hot link ${!isActive ? 'activated' : 'deactivated'}`);
      await loadHotLinks();
    } catch (err) {
      toast.error(err.message || "Failed to update hot link");
    }
  };

  const handleDragStart = (id) => {
    setDraggedId(id);
  };

  const handleDropOnCard = async (targetId) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const reordered = [...hotLinks];
    const fromIndex = reordered.findIndex((item) => item.Id === draggedId);
    const toIndex = reordered.findIndex((item) => item.Id === targetId);

    if (fromIndex === -1 || toIndex === -1) {
      setDraggedId(null);
      return;
    }

    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);
    setHotLinks(reordered);
    setDraggedId(null);

    try {
      const reorderItems = reordered.map((item, idx) => ({ id: item.Id, order: idx + 1 }));
      await adminApi.reorderHotLinks(reorderItems);
      toast.success("Hot links reordered successfully");
      await loadHotLinks();
    } catch (err) {
      toast.error("Failed to reorder hot links");
      await loadHotLinks();
    }
  };

  const handleOpenHotLink = (link) => {
    const rawUrl = typeof link?.Url === "string" ? link.Url.trim() : "";
    if (!rawUrl) {
      toast.error("This hot link does not have a URL");
      return;
    }

    if (rawUrl === "form:registration" || rawUrl === "form:results") {
      const form = rawUrl === "form:registration" ? "registration" : "results";
      window.open(`${window.location.origin}/?hotLinkForm=${form}`, "_blank", "noopener,noreferrer");
      return;
    }

    const normalizedUrl = rawUrl.startsWith("www.") ? `https://${rawUrl}` : rawUrl;
    const isExternalUrl = /^(https?:)?\/\//i.test(normalizedUrl);
    const targetUrl = isExternalUrl ? normalizedUrl : new URL(normalizedUrl, window.location.origin).href;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const stats = {
    total: hotLinks.length,
    active: hotLinks.filter(l => l.IsActive).length,
    inactive: hotLinks.filter(l => !l.IsActive).length,
  };

  return (
    <div className="w-full px-0 py-0">
      <div className="mx-auto w-full max-w-[1680px] space-y-7 sm:space-y-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">Hot Links</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Hot Links Management</h1>
            <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">Manage the trending links displayed on the homepage</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl border-slate-200 bg-white px-5 font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={() => loadHotLinks()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <AdminPermission permission="static_content.create">
              <Button
                onClick={handleNewHotLink}
                className="h-11 rounded-xl bg-sky-600 px-5 font-bold text-white shadow-sm hover:bg-sky-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Hot Link
              </Button>
            </AdminPermission>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-5 shadow-sm">
          <p className="text-sm font-bold text-sky-600">Total</p>
          <p className="mt-2 text-4xl font-black tabular-nums text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
          <p className="text-sm font-bold text-emerald-600">Active</p>
          <p className="mt-2 text-4xl font-black tabular-nums text-slate-900">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 shadow-sm">
          <p className="text-sm font-bold text-red-600">Inactive</p>
          <p className="mt-2 text-4xl font-black tabular-nums text-slate-900">{stats.inactive}</p>
        </div>
      </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search hot links"
            placeholder="Search by title, subtitle, or badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 sm:text-base"
          />
        </label>

        <section aria-label="Hot links list">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {loading ? (
              [...Array(10)].map((_, idx) => (
                <div key={idx} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))
            ) : filteredLinks.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                <p className="text-slate-600 font-bold text-lg">No hot links found</p>
                <p className="text-slate-500 text-sm mt-2">
                  {searchQuery ? "Try adjusting your search criteria" : "Create your first hot link to get started"}
                </p>
              </div>
            ) : (
              filteredLinks.map((link, index) => (
                <HotLinkCard
                  key={link.Id}
                  link={link}
                  index={index}
                  onEdit={() => handleEditHotLink(link)}
                  onDelete={() => handleDeleteHotLink(link.Id)}
                  onToggle={() => handleToggleHotLink(link.Id, link.IsActive)}
                  onOpen={() => handleOpenHotLink(link)}
                  onDragStart={() => handleDragStart(link.Id)}
                  onDrop={() => handleDropOnCard(link.Id)}
                />
              ))
            )}
          </div>
        </section>

        {showForm && (
        <AdminPermission permission={editingId ? "static_content.edit" : "static_content.create"}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
          <div className="w-full max-w-5xl rounded-[2rem] border-2 border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-200 bg-white">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-600">EDIT BLOCK</p>
                <h2 className="mt-1 text-4xl font-black text-slate-900">{editingId ? "Block #" + (hotLinks.findIndex((item) => item.Id === editingId) + 1) : "New Hot Link"}</h2>
              </div>
              <button
                onClick={handleCancelForm}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.4fr]">
              <div className="rounded-[1.5rem] border-2 border-slate-200 bg-slate-50 p-4">
                <HotLinkPreviewCard form={editingId ? currentForm : emptyForm} />
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <HotLinkForm
                  hotLink={editingId ? currentForm : emptyForm}
                  onSave={handleSaveHotLink}
                  onCancel={handleCancelForm}
                  loading={formLoading}
                  error={error}
                  success={success}
                />
              </div>
            </div>
          </div>
        </div>
        </AdminPermission>
        )}

        {showCustomForm === "registration" && (
          <RegistrationFormPreview
            onClose={handleCancelForm}
            title={hotLinks.find((l) => l.Id === editingId)?.Title}
          />
        )}
        {showCustomForm === "results" && (
          <ResultsCheckFormPreview
            onClose={handleCancelForm}
            title={hotLinks.find((l) => l.Id === editingId)?.Title}
          />
        )}
      </div>
    </div>
  );
};

function HotLinkPreviewCard({ form }) {
  const previewIconName = form.icon || "Rocket";
  const previewGradientKey = `${form.gradientFrom || "from-sky-500"} ${form.gradientTo || "to-indigo-500"}`;
  const previewGradient = gradientMap[previewGradientKey] || gradientMap["from-sky-500 to-indigo-500"];
  const IconMap = {
    Rocket,
    Camera,
    Download,
    Trophy,
    FileQuestion,
    TrendingUp,
    Grid3X3,
    Brain,
    ClipboardList,
    Medal,
    Award,
    Star,
    BookOpen,
    Monitor,
    Globe,
    Atom,
    Calculator,
    Sigma,
    Users,
    School,
  };
  const PreviewIcon = IconMap[previewIconName] || Rocket;

  return (
    <div className="flex h-full min-h-[20rem] flex-col items-center justify-center rounded-[1.25rem] border-2 border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between w-full">
        <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${previewGradient} shadow-md`}>
          <PreviewIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          ON
        </span>
      </div>

      <div className="mb-4 mt-2 inline-flex items-center justify-center w-28 h-28 rounded-full bg-sky-100 text-sky-600">
        <PreviewIcon className="w-14 h-14" strokeWidth={2.5} />
      </div>

      <h3 className="text-[32px] font-black text-slate-900 leading-tight text-center">
        {form.title || "Your Title"}
      </h3>
      <p className="mt-2 text-base text-slate-500 font-medium text-center">
        {form.subtitle || "Subtitle here"}
      </p>
    </div>
  );
}

function HotLinkCard({ link, index, onEdit, onDelete, onToggle, onOpen, onDragStart, onDrop }) {
  const canEdit = true;
  const gradientKey = `${link.GradientFrom || "from-sky-500"} ${link.GradientTo || "to-indigo-500"}`;
  const gradient = gradientMap[gradientKey] || gradientMap["from-sky-500 to-indigo-500"];
  const iconName = typeof link.Icon === "string" ? link.Icon.trim() : "";
  const Icon = {
    Rocket,
    Camera,
    Download,
    Trophy,
    FileQuestion,
    TrendingUp,
    Grid3X3,
    Brain,
    ClipboardList,
    Medal,
    Award,
    Star,
    BookOpen,
    Monitor,
    Globe,
    Atom,
    Calculator,
    Sigma,
    Users,
    School,
  }[iconName] || (link.Title === "Young Achievers Gallery" ? Medal : Rocket);

  return (
    <div
      className="group relative flex min-h-[16rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
      draggable={Boolean(canEdit)}
      onDragStart={canEdit ? onDragStart : undefined}
      onDragOver={(event) => event.preventDefault()}
      onDrop={canEdit ? onDrop : undefined}
    >
      <div className="absolute top-3 right-3 text-[11px] font-black tracking-wider text-slate-300 group-hover:text-slate-400">
        #{String(index + 1).padStart(2, "0")}
      </div>

      <div className="mb-4 flex justify-end gap-2">
        <AdminPermission permission="static_content.edit">
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
            link.IsActive ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-400"
          }`}
          title={link.IsActive ? "Deactivate" : "Activate"}
        >
          {link.IsActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        </AdminPermission>
        <AdminPermission permission="static_content.delete">
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        </AdminPermission>
      </div>

      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
        <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
      </div>

      <h3 className="pr-6 text-base font-black leading-snug text-slate-900">
        {link.Title}
      </h3>
      <p className="mt-1 text-sm font-medium leading-snug text-slate-500">
        {link.Subtitle || "No subtitle"}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
        {link.BadgeText ? (
          <span className={`text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${gradient}`}>
            {link.BadgeText}
          </span>
        ) : <span />}

        <button
          type="button"
          onClick={onOpen}
          title="Open hot link URL"
          aria-label={`Open ${link.Title}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        <GripVertical className="w-4 h-4" />
        Drag to reorder
      </div>

      <span className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`} />
    </div>
  );
}

export default AdminHotLinksPage;
