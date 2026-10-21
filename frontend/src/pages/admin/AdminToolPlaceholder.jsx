import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleCheck,
  CircleX,
  Construction,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  ListFilter,
  Plus,
  Power,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import API_BASE_URL from "@/services/apiBaseUrl";
import AdminPageJump from "./components/AdminPageJump";
import AdminListControls from "./components/AdminListControls";

const tools = {
  documents: { title: "Documents", tableKey: "documents", tableName: "dbo.Tbl_ClassDoc" },
  "create-tests": { title: "Create Tests", tableKey: "create-tests", tableName: "dbo.Tbl_Tests" },
  feedbacks: { title: "Feedbacks", tableKey: "feedbacks", tableName: "dbo.Tbl_KeyFeedBack" },
  "class-documents": {
    title: "ClassDocuments for Schools",
    tableKey: "class-documents",
    tableName: "dbo.Tbl_Classdocforschool",
  },
  "register-coordinator": { title: "Register Coordinator" },
  "coordinators-list": {
    title: "Coordinators List",
    tableKey: "coordinators-list",
    tableName: "dbo.Tbl_Coordinators",
  },
  "unsubmitted-registration": {
    title: "Unsubmitted Registration",
    tableKey: "unsubmitted-registration",
    tableName: "dbo.Tbl_UnsubmittedRegistrations",
  },
  "qr-users": {
    title: "QR Users",
    tableKey: "qr-users",
    tableName: "dbo.Tbl_M_Users",
  },
};

const DOCUMENT_EDITABLE_FIELDS = new Set([
  "title",
  "description",
  "examtype",
  "file1",
  "file2",
  "file3",
  "file4",
  "file5",
  "isactive",
]);

const TOOL_SUBTITLES = {
  documents: "Manage learning resources and class materials.",
  "create-tests": "Create, review, and manage available tests.",
  feedbacks: "Review student feedback and submitted answers.",
  "class-documents": "Manage class documents shared with schools.",
  "coordinators-list": "Manage registered coordinator accounts and contact details.",
  "unsubmitted-registration": "Review and manage saved registration submissions.",
  "qr-users": "View QR user records and their available profile details.",
};

function displayValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function isActiveTest(value) {
  return value === true || value === 1 || value === "1" || String(value).toLowerCase() === "true";
}

function CoordinatorRegistrationForm({ title }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    CO_ID: "",
    CO_Name: "",
    CO_Email: "",
    CO_Password: "",
    CO_Mobile: "",
    CO_Address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/coordinators`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to register coordinator.");
      }
      toast.success(response.data.message || "Coordinator registered successfully.");
      setValues({
        CO_ID: "",
        CO_Name: "",
        CO_Email: "",
        CO_Password: "",
        CO_Mobile: "",
        CO_Address: "",
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || error.message || "Unable to register coordinator.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    { name: "CO_ID", label: "Co-ID", type: "text", placeholder: "Enter CO_ID" },
    { name: "CO_Name", label: "Co-Name", type: "text", placeholder: "Enter CO_Name" },
    { name: "CO_Email", label: "Co-Email", type: "email", placeholder: "Enter CO_Email" },
    { name: "CO_Password", label: "Co-Password", type: "password", placeholder: "Enter CO_Password" },
    { name: "CO_Mobile", label: "Co-Mobile", type: "tel", placeholder: "Enter CO_Mobile" },
    { name: "CO_Address", label: "Co-Address", type: "text", placeholder: "Enter Address" },
  ];

  return (
    <section className="mx-auto max-w-[1200px] space-y-5">
      <header className="rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-5 text-white shadow-lg shadow-sky-950/10 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Admin workspace</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-sky-100/80">Add a coordinator and provide their account and contact details.</p>
      </header>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} htmlFor={`coordinator-${field.name}`} className="space-y-1.5 text-sm font-semibold text-slate-700">
              <span>{field.label} <span className="text-rose-600" aria-hidden="true">*</span></span>
              <Input
                id={`coordinator-${field.name}`}
                type={field.type}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                required
                autoComplete={field.name === "CO_Password" ? "new-password" : "off"}
                className="bg-white"
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-32 bg-sky-700 text-white hover:bg-sky-800">
            {isSubmitting ? "Registering…" : "Register"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function DatabaseTableTool({ tool, title, tableName }) {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [primaryKey, setPrimaryKey] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25, total: 0, totalPages: 1 });
  const [pageSize, setPageSize] = useState(25);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateColumn, setDateColumn] = useState("");
  const [statusCounts, setStatusCounts] = useState(null);
  const [statusFilter, setStatusFilter] = useState(tool === "create-tests" ? "active" : "all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingKey, setUpdatingKey] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [newTestName, setNewTestName] = useState("");
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [closingRegistration, setClosingRegistration] = useState(null);
  const [isClosingRegistration, setIsClosingRegistration] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState({});

  useEffect(() => {
    setStatusFilter(tool === "create-tests" ? "active" : "all");
    setSearchInput("");
    setSearch("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setDateFrom("");
    setDateTo("");
    setPageSize(25);
    setPagination((current) => ({ ...current, page: 1 }));
  }, [tool]);

  const loadRows = useCallback(async (
    targetPage,
    targetStatus,
    activeSearch = search,
    activeDateFrom = dateFrom,
    activeDateTo = dateTo,
    activePageSize = pageSize,
  ) => {
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setRevealedPasswords({});
    try {
      const requestStatus = tool === "create-tests"
        ? (["all", "active", "inactive"].includes(targetStatus) ? targetStatus : "active")
        : tool === "unsubmitted-registration"
          ? (["all", "close", "registered", "not-open"].includes(targetStatus) ? targetStatus : "all")
          : targetStatus;
      const response = await axios.get(`${API_BASE_URL}/admin/tables/${tool}`, {
        params: {
          page: targetPage,
          pageSize: activePageSize,
          ...(["create-tests", "unsubmitted-registration"].includes(tool) ? { status: requestStatus } : {}),
          search: activeSearch,
          dateFrom: activeDateFrom,
          dateTo: activeDateTo,
          _t: Date.now(),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || `Unable to load ${title.toLowerCase()}.`);
      }

      setColumns(Array.isArray(response.data.columns) ? response.data.columns : []);
      setPrimaryKey(Array.isArray(response.data.primaryKey) ? response.data.primaryKey : []);
      setRows(Array.isArray(response.data.data) ? response.data.data : []);
      setPagination(response.data.pagination || { page: targetPage, pageSize: activePageSize, total: 0, totalPages: 1 });
      setStatusCounts(response.data.statusCounts || null);
      setDateColumn(response.data.dateColumn || "");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      const message = error.response?.data?.message || error.message || `Unable to load ${title.toLowerCase()}.`;
      setErrorMessage(message);
      toast.error(message);
      setRows([]);
      setColumns([]);
      setPrimaryKey([]);
      setStatusCounts(null);
      setDateColumn("");
      setPagination({ page: targetPage, pageSize: activePageSize, total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, navigate, pageSize, search, title, tool]);

  useEffect(() => {
    loadRows(pagination.page, statusFilter);
  }, [loadRows, pagination.page, statusFilter]);

  const applyFilters = () => {
    if (draftDateFrom && draftDateTo && draftDateFrom > draftDateTo) {
      toast.error("From date cannot be later than To date.");
      return;
    }
    setSearch(searchInput.trim());
    setDateFrom(draftDateFrom);
    setDateTo(draftDateTo);
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setDateFrom("");
    setDateTo("");
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const updateTestStatus = async (row) => {
    const key = Object.fromEntries(primaryKey.map((column) => [column, row[column]]));
    const keyId = JSON.stringify(key);
    const statusColumn = columns.find((column) => column.name.toLowerCase() === "status");
    if (!statusColumn || !primaryKey.length) return;

    setUpdatingKey(keyId);
    try {
      const token = localStorage.getItem("uc_admin_token");
      await axios.patch(`${API_BASE_URL}/admin/tests/status`, {
        key,
        status: isActiveTest(row[statusColumn.name]) ? 0 : 1,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Test status updated.");
      await loadRows(pagination.page, statusFilter);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || "Unable to update test status.");
      }
    } finally {
      setUpdatingKey("");
    }
  };

  const createTest = async (event) => {
    event.preventDefault();
    const testName = newTestName.trim();
    if (!testName) {
      toast.error("Enter a test name.");
      return;
    }

    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsCreatingTest(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/tests`, { testName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to create test.");
      }
      toast.success(response.data.message || "Test created successfully.");
      setNewTestName("");
      setIsCreateTestOpen(false);
      setStatusFilter("active");
      setPagination((current) => ({ ...current, page: 1 }));
      if (statusFilter === "active" && pagination.page === 1) {
        await loadRows(1, "active");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || error.message || "Unable to create test.");
      }
    } finally {
      setIsCreatingTest(false);
    }
  };

  const documentColumns = tool === "documents" || tool === "class-documents";
  const displayColumns = documentColumns
    ? columns.map((column) => ({
      ...column,
      label: ({
        classid: "Class ID",
        examtype: "Exam Type",
        createdon: "Created On",
        isactive: "Active Status",
      })[column.name.toLowerCase()] || column.name.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
    }))
    : columns.map((column) => ({ ...column, label: column.name }));
  const editableColumns = documentColumns
    ? columns.filter((column) => (
      DOCUMENT_EDITABLE_FIELDS.has(column.name.toLowerCase())
      && !column.isPrimaryKey
      && !column.isIdentity
      && !column.isComputed
    ))
    : [];

  const openEditDialog = (row) => {
    setEditingRow(row);
    setEditValues(Object.fromEntries(editableColumns.map((column) => [
      column.name,
      column.dataType.toLowerCase() === "bit"
        ? isActiveTest(row[column.name])
        : row[column.name] ?? "",
    ])));
  };

  const saveDocument = async (event) => {
    event.preventDefault();
    if (!editingRow) return;
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    const key = Object.fromEntries(primaryKey.map((column) => [column, editingRow[column]]));
    const values = Object.fromEntries(editableColumns.map((column) => {
      const value = editValues[column.name];
      if (column.dataType.toLowerCase() === "bit") {
        return [column.name, value ? 1 : 0];
      }
      if (value === "" || value === null) {
        return [column.name, column.nullable ? null : ""];
      }
      if (["int", "bigint", "smallint", "tinyint", "decimal", "numeric", "float", "real"].includes(column.dataType.toLowerCase())) {
        return [column.name, Number(value)];
      }
      return [column.name, value];
    }));

    setIsSavingEdit(true);
    try {
      await axios.patch(`${API_BASE_URL}/admin/tables/${tool}/row`, { key, values }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document updated successfully.");
      setEditingRow(null);
      await loadRows(pagination.page, statusFilter);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || "Unable to update this document.");
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteDocument = async () => {
    if (!deletingRow) return;
    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    const key = Object.fromEntries(primaryKey.map((column) => [column, deletingRow[column]]));
    const nextPage = Math.min(
      pagination.page,
      Math.max(1, Math.ceil((pagination.total - 1) / pageSize))
    );
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/admin/tables/${tool}/row`, {
        data: { key },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document deleted successfully.");
      setDeletingRow(null);
      await loadRows(nextPage, statusFilter);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || "Unable to delete this document.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const closeUnsubmittedRegistration = async () => {
    if (!closingRegistration) return;
    const idColumn = primaryKey.find((column) => column.toLowerCase() === "id");
    const registrationId = Number(idColumn ? closingRegistration[idColumn] : NaN);
    if (!Number.isSafeInteger(registrationId) || registrationId <= 0) {
      toast.error("This unsubmitted registration does not have a valid ID.");
      return;
    }

    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsClosingRegistration(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/unsubmitted-registrations/close`,
        { registrationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Unable to close this registration.");
      }

      toast.success(response.data.message || "Registration submitted successfully.");
      setClosingRegistration(null);
      const nextPage = Math.min(
        pagination.page,
        Math.max(1, Math.ceil((pagination.total - 1) / pageSize))
      );
      await loadRows(nextPage, statusFilter);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || error.message || "Unable to close this registration.");
      }
    } finally {
      setIsClosingRegistration(false);
    }
  };

  const renderDocumentCell = (column, row) => {
    const value = row[column.name];
    if (value === null || value === undefined || value === "") return <span className="text-slate-300">—</span>;
    if (column.name.toLowerCase() === "isactive") {
      const active = isActiveTest(value);
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
          active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
        }`}>
          {active ? "Active" : "Inactive"}
        </span>
      );
    }
    if (column.name.toLowerCase().startsWith("file")) {
      try {
        const fileUrl = new URL(String(value), window.location.origin);
        if (fileUrl.protocol === "http:" || fileUrl.protocol === "https:") {
          return (
            <a
              href={String(value)}
              target="_blank"
              rel="noreferrer"
              title={`Open ${column.name}: ${String(value)}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-sky-50 px-2.5 py-1.5 font-semibold text-sky-700 ring-1 ring-inset ring-sky-200 transition-colors hover:bg-sky-100 hover:text-sky-900"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Open {column.name.replace(/([a-z])([0-9])/i, "$1 $2")}
            </a>
          );
        }
      } catch {
        return displayValue(value);
      }
    }
    return displayValue(value);
  };

  const changePage = (nextPage) => {
    if (loading || nextPage < 1 || nextPage > pagination.totalPages) return;
    setPagination((current) => ({ ...current, page: nextPage }));
  };

  const toggleCoordinatorPassword = async (row, rowKey, columnName) => {
    const passwordKey = `${rowKey}:${columnName}`;
    const current = revealedPasswords[passwordKey];
    if (current?.visible) {
      setRevealedPasswords((previous) => ({
        ...previous,
        [passwordKey]: { visible: false, password: "" },
      }));
      return;
    }
    if (current?.loading) return;

    const token = localStorage.getItem("uc_admin_token");
    if (!token) {
      navigate("/school/login");
      return;
    }
    const key = Object.fromEntries(primaryKey.map((column) => [column, row[column]]));
    setRevealedPasswords((previous) => ({
      ...previous,
      [passwordKey]: { visible: false, password: "", loading: true },
    }));
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/coordinators/password`, {
        key,
        column: columnName,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data?.success || typeof response.data?.data?.password !== "string") {
        throw new Error(response.data?.message || "Unable to retrieve coordinator password.");
      }
      setRevealedPasswords((previous) => ({
        ...previous,
        [passwordKey]: { visible: true, password: response.data.data.password, loading: false },
      }));
    } catch (error) {
      setRevealedPasswords((previous) => ({
        ...previous,
        [passwordKey]: { visible: false, password: "", loading: false },
      }));
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error(error.response?.data?.message || error.message || "Unable to retrieve coordinator password.");
      }
    }
  };

  const statusColumn = columns.find((column) => column.name.toLowerCase() === "status");
  const userStatusColumn = columns.find((column) => column.name.toLowerCase() === "userstatus");
  const showAdminFilters = ["feedbacks", "coordinators-list", "unsubmitted-registration", "qr-users"].includes(tool);

  return (
    <section className="mx-auto max-w-[1600px] space-y-5">
      <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-5 text-white shadow-lg shadow-sky-950/10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Admin workspace</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-sky-100/80">{TOOL_SUBTITLES[tool] || "Manage admin records."}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <p className="text-xl font-extrabold leading-none">{Number(pagination.total || 0).toLocaleString()}</p>
            <p className="mt-1 text-xs font-medium text-sky-100/75">Records</p>
          </div>
          {tool === "create-tests" && (
            <Button
              type="button"
              onClick={() => setIsCreateTestOpen(true)}
              className="bg-cyan-500 text-white hover:bg-cyan-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => loadRows(pagination.page, statusFilter)}
            disabled={loading}
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <RefreshCw className={loading ? "mr-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4"} />
            Refresh
          </Button>
        </div>
      </header>

      {showAdminFilters && (
        <AdminListControls
          exportPermission={
            tool === "feedbacks"
              ? "tools.feedbacks.export"
              : tool === "coordinators-list"
                ? "tools.coordinators.export"
                : "tools.unsubmitted_registrations.export"
          }
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          searchPlaceholder={tool === "qr-users"
            ? "Search QR user details"
            : tool === "coordinators-list"
            ? "Search coordinator name, ID, email, mobile or address"
            : tool === "feedbacks"
              ? "Search feedback, student, email, question or answer"
              : "Search registration or student details"}
          dateFrom={draftDateFrom}
          dateTo={draftDateTo}
          onDateChange={({ dateFrom: from, dateTo: to }) => {
            setDraftDateFrom(from);
            setDraftDateTo(to);
          }}
          showDateFilter={Boolean(dateColumn)}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPagination((current) => ({ ...current, page: 1 }));
          }}
          onSubmit={applyFilters}
          onClear={clearFilters}
          isLoading={loading}
          rows={rows}
          columns={displayColumns}
          fileName={tool}
          title={"Filter " + title}
          description={"Refine " + title.toLowerCase() + " by date or details"}
          compactEntries={tool === "coordinators-list"}
          showEntriesInDateRow={["feedbacks", "unsubmitted-registration"].includes(tool)}
          includeStateReport={tool !== "coordinators-list"}
        />
      )}

      {tool === "create-tests" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Test status</h2>
            <p className="mt-1 text-xs text-slate-500">Choose which tests to display.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[400px]">
            <Button
              type="button"
              aria-pressed={statusFilter === "active"}
              onClick={() => {
                setStatusFilter("active");
                setPagination((current) => ({ ...current, page: 1 }));
              }}
              disabled={loading}
              className={`h-auto min-h-14 justify-start gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition-all ${
                statusFilter === "active"
                  ? "border-emerald-600 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-200 hover:from-emerald-700 hover:to-green-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              <CircleCheck className="h-5 w-5 shrink-0" />
              <span className="flex-1">
                <span className="block font-bold">Active</span>
                <span className={`block text-xs ${statusFilter === "active" ? "text-emerald-50" : "text-emerald-700"}`}>
                  {Number(statusCounts?.active || 0).toLocaleString()} tests
                </span>
              </span>
            </Button>
            <Button
              type="button"
              aria-pressed={statusFilter === "inactive"}
              onClick={() => {
                setStatusFilter("inactive");
                setPagination((current) => ({ ...current, page: 1 }));
              }}
              disabled={loading}
              className={`h-auto min-h-14 justify-start gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition-all ${
                statusFilter === "inactive"
                  ? "border-amber-600 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200 hover:from-amber-600 hover:to-orange-600"
                  : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100"
              }`}
            >
              <CircleX className="h-5 w-5 shrink-0" />
              <span className="flex-1">
                <span className="block font-bold">Deactivated</span>
                <span className={`block text-xs ${statusFilter === "inactive" ? "text-amber-50" : "text-amber-700"}`}>
                  {Number(statusCounts?.inactive || 0).toLocaleString()} tests
                </span>
              </span>
            </Button>
          </div>
        </div>
      )}

      {tool === "unsubmitted-registration" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Registration status</h2>
            <p className="mt-1 text-xs text-slate-500">Choose which saved registrations to display.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[
              {
                value: "all",
                label: "All",
                count: statusCounts?.all,
                icon: ListFilter,
                selected: "border-sky-600 bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sky-200 hover:from-sky-700 hover:to-blue-700",
                idle: "border-sky-200 bg-sky-50 text-sky-800 hover:border-sky-300 hover:bg-sky-100",
                idleCount: "text-sky-700",
              },
              {
                value: "registered",
                label: "Submitted",
                count: statusCounts?.registered,
                icon: CircleCheck,
                selected: "border-emerald-600 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-emerald-200 hover:from-emerald-700 hover:to-green-700",
                idle: "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:bg-emerald-100",
                idleCount: "text-emerald-700",
              },
              {
                value: "not-open",
                label: "Not open",
                count: statusCounts?.notOpen,
                icon: CircleX,
                selected: "border-slate-600 bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-slate-200 hover:from-slate-700 hover:to-slate-800",
                idle: "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100",
                idleCount: "text-slate-600",
              },
              {
                value: "close",
                label: "Close",
                count: statusCounts?.close,
                icon: Clock3,
                selected: "border-amber-600 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200 hover:from-amber-600 hover:to-orange-600",
                idle: "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100",
                idleCount: "text-amber-700",
              },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = statusFilter === option.value;
              return (
                <Button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setPagination((current) => ({ ...current, page: 1 }));
                  }}
                  disabled={loading}
                  className={`h-auto min-h-14 justify-start gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition-all ${
                    isSelected
                      ? `${option.selected} shadow-md`
                      : `${option.idle} shadow-sm`
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block font-bold">{option.label}</span>
                    <span className={`block text-xs ${isSelected ? "text-white/85" : option.idleCount}`}>
                      {Number(option.count || 0).toLocaleString()} records
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm font-medium text-slate-500">Loading database records…</div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <p role="alert" className="text-sm font-medium text-rose-700">{errorMessage}</p>
            <Button type="button" variant="outline" onClick={() => loadRows(pagination.page, statusFilter)}>
              Try again
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm font-medium text-slate-500">No records found in {tableName}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full ${documentColumns ? "min-w-[1000px]" : "min-w-max"} border-collapse text-left text-sm`}>
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  {displayColumns.map((column) => (
                    <th key={column.name} className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-3 font-extrabold">
                      {column.label}
                    </th>
                  ))}
                  {documentColumns && <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-extrabold">Action</th>}
                  {tool === "create-tests" && statusColumn && primaryKey.length > 0 && (
                    <th className="border-b border-slate-200 px-4 py-3 font-extrabold">Action</th>
                  )}
                  {tool === "unsubmitted-registration" && (
                    <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-extrabold">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const rowKey = primaryKey.length
                    ? JSON.stringify(Object.fromEntries(primaryKey.map((column) => [column, row[column]])))
                    : `${pagination.page}-${index}`;
                  return (
                    <tr key={rowKey} className="even:bg-slate-50/50 hover:bg-sky-50/60">
                      {displayColumns.map((column) => {
                        const isCoordinatorPassword = tool === "coordinators-list" && /password/i.test(column.name);
                        const passwordKey = `${rowKey}:${column.name}`;
                        const passwordState = revealedPasswords[passwordKey];
                        return (
                          <td key={column.name} className="max-w-xs border-b border-r border-slate-200 px-4 py-3 align-top text-slate-700">
                            {documentColumns
                              ? renderDocumentCell(column, row)
                              : isCoordinatorPassword
                                ? (
                                  <div className="flex items-center gap-2">
                                    <span className="block max-w-[220px] whitespace-pre-wrap break-all font-mono text-xs">
                                      {passwordState?.visible ? passwordState.password : "••••••••"}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      disabled={passwordState?.loading || !primaryKey.length}
                                      onClick={() => toggleCoordinatorPassword(row, rowKey, column.name)}
                                      aria-label={passwordState?.visible ? "Hide coordinator password" : "Show coordinator password"}
                                      title={passwordState?.visible ? "Hide password" : "Show password"}
                                      className="h-8 w-8 shrink-0 p-0"
                                    >
                                      {passwordState?.loading
                                        ? <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                                        : passwordState?.visible
                                          ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                                          : <Eye className="h-4 w-4" aria-hidden="true" />}
                                    </Button>
                                  </div>
                                )
                                : <span className="block whitespace-pre-wrap break-words">{displayValue(row[column.name])}</span>}
                          </td>
                        );
                      })}
                      {documentColumns && (
                        <td className="whitespace-nowrap border-b border-slate-200 px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => openEditDialog(row)}
                              aria-label={`Edit document for class ${row.ClassId}`}
                              title="Edit document"
                              className="h-9 min-w-[88px] rounded-lg border border-sky-700 bg-gradient-to-b from-sky-600 to-sky-700 px-3 font-semibold text-white shadow-[0_2px_5px_rgba(2,132,199,0.22)] transition-all duration-150 hover:-translate-y-0.5 hover:from-sky-500 hover:to-sky-600 hover:shadow-[0_5px_12px_rgba(2,132,199,0.28)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                            >
                              <Edit2 className="h-4 w-4" strokeWidth={2.2} />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setDeletingRow(row)}
                              aria-label={`Delete document for class ${row.ClassId}`}
                              title="Delete document"
                              className="h-9 min-w-[92px] rounded-lg border border-rose-200 bg-white px-3 font-semibold text-rose-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 hover:shadow-[0_4px_10px_rgba(225,29,72,0.12)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                      {tool === "create-tests" && statusColumn && primaryKey.length > 0 && (
                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3">
                          <Button
                            type="button"
                            size="sm"
                            disabled={loading || updatingKey === rowKey}
                            onClick={() => updateTestStatus(row)}
                            aria-label={`${isActiveTest(row[statusColumn.name]) ? "Deactivate" : "Activate"} test`}
                            className={`h-9 min-w-[116px] rounded-lg border font-semibold shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                              isActiveTest(row[statusColumn.name])
                                ? "border-rose-700 bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-700 hover:to-red-700"
                                : "border-emerald-700 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700"
                            }`}
                          >
                            {updatingKey === rowKey ? (
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Power className="mr-2 h-4 w-4" />
                            )}
                            {updatingKey === rowKey ? "Updating…" : isActiveTest(row[statusColumn.name]) ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      )}
                      {tool === "unsubmitted-registration" && (
                        <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3">
                          {String(userStatusColumn ? row[userStatusColumn.name] : "") === "1" ? (
                            <Button
                              type="button"
                              size="sm"
                              disabled={loading || isClosingRegistration || !primaryKey.some((column) => column.toLowerCase() === "id")}
                              onClick={() => setClosingRegistration(row)}
                              aria-label={`Close registration for ${row.StudentName || "this student"}`}
                              className="group h-9 min-w-[112px] rounded-xl border border-emerald-500/70 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-3 font-bold text-white shadow-[0_6px_14px_rgba(5,150,105,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 hover:shadow-[0_10px_20px_rgba(5,150,105,0.26)] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:opacity-60"
                            >
                              {isClosingRegistration && closingRegistration === row ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                              ) : (
                                <CircleCheck className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                              )}
                              {isClosingRegistration && closingRegistration === row ? "Closing…" : "Close"}
                            </Button>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                              String(userStatusColumn ? row[userStatusColumn.name] : "") === "2"
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                                : "bg-slate-100 text-slate-600 ring-slate-500/20"
                            }`}>
                              {String(userStatusColumn ? row[userStatusColumn.name] : "") === "2" && <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                              {String(userStatusColumn ? row[userStatusColumn.name] : "") === "2" ? "Submitted" : "Not open"}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {pagination.total ? (pagination.page - 1) * pagination.pageSize + 1 : 0}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total || 0)} of {Number(pagination.total || 0).toLocaleString()} records
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => changePage(pagination.page - 1)} disabled={loading || pagination.page <= 1}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <AdminPageJump
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={changePage}
              disabled={loading}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => changePage(pagination.page + 1)} disabled={loading || pagination.page >= pagination.totalPages}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={isCreateTestOpen}
        onOpenChange={(open) => {
          if (!open && !isCreatingTest) {
            setIsCreateTestOpen(false);
            setNewTestName("");
          }
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl border-slate-200 p-0 text-left">
          <form onSubmit={createTest}>
            <DialogHeader className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white p-6 pr-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Admin workspace</p>
              <DialogTitle className="text-2xl font-bold text-slate-900">Create Test</DialogTitle>
              <DialogDescription>
                Enter the test name. The new test will be created as active.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <label htmlFor="new-test-name" className="block space-y-1.5 text-sm font-semibold text-slate-700">
                <span>Test name <span className="text-rose-600" aria-hidden="true">*</span></span>
                <Input
                  id="new-test-name"
                  value={newTestName}
                  onChange={(event) => setNewTestName(event.target.value)}
                  placeholder="Enter test name"
                  maxLength={2000}
                  autoComplete="off"
                  autoFocus
                  required
                  className="bg-white"
                />
              </label>
            </div>
            <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateTestOpen(false);
                  setNewTestName("");
                }}
                disabled={isCreatingTest}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingTest} className="bg-sky-700 text-white hover:bg-sky-800">
                {isCreatingTest ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {isCreatingTest ? "Creating…" : "Create Test"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingRow)} onOpenChange={(open) => { if (!open && !isSavingEdit) setEditingRow(null); }}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-slate-200 p-0 text-left">
          <form onSubmit={saveDocument}>
            <DialogHeader className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-white p-6 pr-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">{title}</p>
              <DialogTitle className="text-2xl font-bold text-slate-900">Edit document</DialogTitle>
              <DialogDescription>Update the document details and file links, then save your changes.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {editableColumns.map((column) => {
                const fieldName = column.name.toLowerCase();
                const label = column.name.replace(/([a-z])([A-Z])/g, "$1 $2");
                if (column.dataType.toLowerCase() === "bit") {
                  return (
                    <label key={column.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(editValues[column.name])}
                        onChange={(event) => setEditValues((current) => ({ ...current, [column.name]: event.target.checked }))}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      {label}
                    </label>
                  );
                }
                const inputProps = {
                  id: `edit-${tool}-${column.name}`,
                  value: editValues[column.name] ?? "",
                  onChange: (event) => setEditValues((current) => ({ ...current, [column.name]: event.target.value })),
                  className: "mt-1.5 bg-white",
                };
                return (
                  <label
                    key={column.name}
                    htmlFor={inputProps.id}
                    className={`block text-sm font-semibold text-slate-700 ${fieldName === "description" ? "sm:col-span-2" : ""}`}
                  >
                    {label}
                    {fieldName === "description" ? (
                      <Textarea {...inputProps} rows={4} />
                    ) : (
                      <Input {...inputProps} type={["int", "bigint", "smallint", "tinyint"].includes(column.dataType.toLowerCase()) ? "number" : "text"} />
                    )}
                  </label>
                );
              })}
            </div>
            <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button type="button" variant="outline" onClick={() => setEditingRow(null)} disabled={isSavingEdit}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSavingEdit} className="bg-sky-600 text-white hover:bg-sky-700">
                {isSavingEdit ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSavingEdit ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deletingRow)} onOpenChange={(open) => { if (!open && !isDeleting) setDeletingRow(null); }}>
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the document record for class {deletingRow?.ClassId ?? "—"} from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteDocument();
              }}
              disabled={isDeleting}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {isDeleting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {isDeleting ? "Deleting…" : "Delete document"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(closingRegistration)}
        onOpenChange={(open) => { if (!open && !isClosingRegistration) setClosingRegistration(null); }}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Submit this registration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will match {closingRegistration?.StudentName || "the student"} with their pending registration, mark that registration successful, and move this record into submitted registrations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClosingRegistration}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                closeUnsubmittedRegistration();
              }}
              disabled={isClosingRegistration}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isClosingRegistration ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <CircleCheck className="mr-2 h-4 w-4" />}
              {isClosingRegistration ? "Submitting…" : "Submit registration"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function AdminToolPlaceholder() {
  const { tool } = useParams();
  const config = tools[tool] || { title: "Admin Tool" };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolHeader />
      <div className="flex flex-col lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 p-3 sm:p-5">
          {tool === "register-coordinator" ? (
            <CoordinatorRegistrationForm title={config.title} />
          ) : config.tableKey ? (
            <DatabaseTableTool
              key={config.tableKey}
              tool={config.tableKey}
              title={config.title}
              tableName={config.tableName}
            />
          ) : (
            <section className="mx-auto max-w-[1200px] space-y-5">
              <header className="rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-5 text-white shadow-lg shadow-sky-950/10 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Admin workspace</p>
                <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{config.title}</h1>
              </header>

              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <Construction className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-extrabold text-slate-900">{config.title}</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                  This admin section is ready for its functionality. Tell us what you would like it to do next.
                </p>
                <Button asChild className="mt-6 bg-sky-700 text-white hover:bg-sky-800">
                  <Link to="/admin/registrations">
                    Back to registrations <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminToolPlaceholder;
