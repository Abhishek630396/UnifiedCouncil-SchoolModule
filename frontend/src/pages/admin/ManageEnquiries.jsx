import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, MessageSquare, Eye, AlertCircle, Trash2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import API_BASE_URL from "@/services/apiBaseUrl";
import AdminPageJump from "./components/AdminPageJump";
import AdminListControls from "./components/AdminListControls";
import { AdminPermission } from "./AdminAccess";

const ENQUIRY_REPORT_COLUMNS = [
  ["Id", "Enquiry ID"],
  ["SchoolName", "School name"],
  ["ContactPersonName", "Contact person"],
  ["Designation", "Designation"],
  ["Phone", "Phone"],
  ["Email", "Email"],
  ["City", "City"],
  ["SchoolAddress", "School address"],
  ["ApproxStudents", "Approx. students"],
  ["AnythingElse", "Additional details"],
  ["SourceOfInformation", "Source"],
  ["Status", "Status"],
  ["CreatedAt", "Submitted"],
].map(([name, label]) => ({ name, label }));
const STATUSES = ["New Enquiry", "Contacted", "In Progress", "Awaiting Action", "Completed", "Closed"];

const formatEnquiryId = (id) => String(id ?? "").padStart(5, "0");

const ManageEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [draftDateFrom, setDraftDateFrom] = useState("");
  const [draftDateTo, setDraftDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const getToken = () => localStorage.getItem("uc_admin_token");

  const loadEnquiries = async (
    targetPage = 1,
    activeSearch = searchValue,
    activeDateFrom = dateFrom,
    activeDateTo = dateTo,
    activePageSize = pageSize,
  ) => {
    const token = getToken();
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/enquiries`, {
        params: {
          page: targetPage,
          pageSize: activePageSize,
          search: activeSearch || "",
          dateFrom: activeDateFrom || "",
          dateTo: activeDateTo || "",
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.success) {
        setEnquiries(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotal(response.data.pagination?.total || 0);
        setPage(targetPage);
      } else {
        toast.error("Failed to load enquiries");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
      } else {
        toast.error("Failed to load enquiries");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    const token = getToken();
    if (!token) {
      navigate("/school/login");
      return;
    }

    setIsStatusUpdating(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/enquiries/${enquiryId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        toast.success("Status updated successfully");
        loadEnquiries(page, searchValue, dateFrom, dateTo);
        if (selectedEnquiry && selectedEnquiry.Id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, Status: newStatus });
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleSearch = async (event) => {
    if (event) event.preventDefault();
    if (draftDateFrom && draftDateTo && draftDateFrom > draftDateTo) {
      toast.error("From date cannot be later than To date.");
      return;
    }

    const trimmedSearch = searchInput.trim();
    setSearchValue(trimmedSearch);
    setDateFrom(draftDateFrom);
    setDateTo(draftDateTo);
    await loadEnquiries(1, trimmedSearch, draftDateFrom, draftDateTo, pageSize);
  };

  const clearFilters = async () => {
    setSearchInput("");
    setSearchValue("");
    setDraftDateFrom("");
    setDraftDateTo("");
    setDateFrom("");
    setDateTo("");
    await loadEnquiries(1, "", "", "", pageSize);
  };

  const openDetailsModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (enquiry) => {
    if (!window.confirm(`Delete the enquiry from ${enquiry.SchoolName}? This cannot be undone.`)) {
      return;
    }

    const token = getToken();
    if (!token) {
      navigate("/school/login");
      return;
    }

    setDeletingId(enquiry.Id);
    try {
      await axios.delete(`${API_BASE_URL}/admin/enquiries/${enquiry.Id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Enquiry deleted successfully");
      if (selectedEnquiry?.Id === enquiry.Id) {
        setSelectedEnquiry(null);
        setIsDetailsModalOpen(false);
      }
      await loadEnquiries(enquiries.length === 1 && page > 1 ? page - 1 : page, searchValue, dateFrom, dateTo);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    loadEnquiries(1, "", "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrevPage = () => {
    if (page > 1) {
      loadEnquiries(page - 1, searchValue, dateFrom, dateTo);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      loadEnquiries(page + 1, searchValue, dateFrom, dateTo);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "New Enquiry": "bg-blue-100 text-blue-800",
      Contacted: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-purple-100 text-purple-800",
      "Awaiting Action": "bg-orange-100 text-orange-800",
      Completed: "bg-emerald-100 text-emerald-800",
      Closed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SchoolHeader />

      <div className="flex flex-1">
        <AdminSideBar />

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="p-3 sm:p-4 md:p-6">
            <header className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 p-5 text-white shadow-lg shadow-sky-950/10 sm:p-7">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
              <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 shadow-inner">
                    <MessageSquare className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Admin workspace</p>
                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Manage School Enquiries</h1>
                    <p className="mt-1 text-sm text-sky-100/80">Review and manage school enquiry submissions.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                    <p className="text-xl font-extrabold leading-none">{total.toLocaleString()}</p>
                    <p className="mt-1 text-xs font-medium text-sky-100/75">Matching enquiries</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => loadEnquiries(page, searchValue, dateFrom, dateTo)}
                    disabled={isLoading}
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    aria-label="Refresh school enquiries"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
                    Refresh
                  </Button>
                </div>
              </div>
            </header>

            <AdminListControls
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              searchPlaceholder="Search school, contact, phone, email or city"
              dateFrom={draftDateFrom}
              dateTo={draftDateTo}
              onDateChange={({ dateFrom: from, dateTo: to }) => {
                setDraftDateFrom(from);
                setDraftDateTo(to);
              }}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                loadEnquiries(1, searchValue, dateFrom, dateTo, size);
              }}
              onSubmit={handleSearch}
              onClear={clearFilters}
              isLoading={isLoading}
              rows={enquiries}
              columns={ENQUIRY_REPORT_COLUMNS}
              fileName="school-enquiries"
              exportPermission="enquiries.export"
              exportPermission="enquiries.export"
              title="Filter Enquiries"
              description="Refine the list by date or contact details"
              showEntriesInDateRow
            />

            {/* Enquiries Table */}
            <div className="rounded-lg sm:rounded-2xl border-2 border-slate-100 bg-white overflow-hidden shadow-sm">
              {isLoading ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="inline-flex items-center gap-2 text-slate-600">
                    <div className="w-4 h-4 rounded-full border-2 border-sky-300 border-t-sky-600 animate-spin" />
                    <span className="text-sm sm:text-base">Loading enquiries...</span>
                  </div>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <AlertCircle className="w-10 sm:w-12 h-10 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-sm sm:text-base text-slate-600 font-medium">No enquiries found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b-2 border-slate-100">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          Enquiry ID
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          School Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          Contact Person
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          Designation
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          Phone
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          City
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          Submitted
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-black uppercase tracking-wider text-slate-600">
                          Status
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-black uppercase tracking-wider text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enquiry) => (
                        <tr
                          key={enquiry.Id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-3 font-mono font-semibold text-slate-600 whitespace-nowrap">
                            {formatEnquiryId(enquiry.Id)}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-slate-900 whitespace-nowrap">
                            {enquiry.SchoolName}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 whitespace-nowrap">
                            {enquiry.ContactPersonName || enquiry.PrincipalName}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 whitespace-nowrap">
                            {enquiry.Designation || "—"}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 whitespace-nowrap">
                            {enquiry.Phone}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700 whitespace-nowrap">
                            {enquiry.City}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                            {formatDate(enquiry.CreatedAt)}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                enquiry.Status
                              )}`}
                            >
                              {enquiry.Status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openDetailsModal(enquiry)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-semibold text-sm"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <AdminPermission permission="enquiries.delete">
                                <button
                                  onClick={() => handleDelete(enquiry)}
                                  disabled={deletingId === enquiry.Id}
                                  className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Delete enquiry"
                                  aria-label={`Delete enquiry from ${enquiry.SchoolName}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </AdminPermission>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && enquiries.length > 0 && (
                <div className="flex items-center justify-between border-t-2 border-slate-100 px-4 py-4">
                  <AdminPermission permission="enquiries.edit">
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  </AdminPermission>
                  <AdminPageJump
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(targetPage) => loadEnquiries(targetPage, searchValue, dateFrom, dateTo)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedEnquiry.SchoolName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Enquiry ID
                  </label>
                  <p className="mt-1 font-mono font-semibold text-slate-900">
                    {formatEnquiryId(selectedEnquiry.Id)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    School Name
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.SchoolName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Contact Person Name
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.ContactPersonName || selectedEnquiry.PrincipalName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Designation
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.Designation || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    School Address
                  </label>
                  <p className="mt-1 whitespace-pre-wrap font-semibold text-slate-900">
                    {selectedEnquiry.SchoolAddress || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Contact Person Mobile No.
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.Phone}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Email ID
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.Email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    City
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.City || "Not provided"}
                  </p>
                </div>
                {selectedEnquiry.ApproxStudents && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Approx. Students (Previous Enquiry)
                    </label>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedEnquiry.ApproxStudents}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Source of Information
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedEnquiry.SourceOfInformation || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Submitted
                  </label>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatDate(selectedEnquiry.CreatedAt)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        selectedEnquiry.Status
                      )}`}
                    >
                      {selectedEnquiry.Status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEnquiry.AnythingElse && (
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Your Message
                  </label>
                  <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {selectedEnquiry.AnythingElse}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t pt-4">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 block">
                  Update Status
                </label>
                <div className="flex gap-2">
                  <Select
                    defaultValue={selectedEnquiry.Status}
                    onValueChange={(newStatus) =>
                      handleStatusChange(selectedEnquiry.Id, newStatus)
                    }
                    disabled={isStatusUpdating}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isStatusUpdating && (
                    <div className="flex items-center gap-2 px-3">
                      <div className="w-3 h-3 rounded-full border-2 border-sky-300 border-t-sky-600 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default ManageEnquiries;
