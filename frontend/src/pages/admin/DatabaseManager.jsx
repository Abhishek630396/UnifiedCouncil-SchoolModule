import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Database,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Table2,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SchoolHeader from "../school/components/SchoolHeader";
import AdminSideBar from "./AdminSideBar";
import API_BASE_URL from "@/services/apiBaseUrl";
import AdminPageJump from "./components/AdminPageJump";

const DEFAULT_LIMIT = 25;

const DatabaseManager = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [schema, setSchema] = useState([]);
  const [records, setRecords] = useState([]);
  const [tableSearch, setTableSearch] = useState("");
  const [recordSearch, setRecordSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSchema, setLoadingSchema] = useState(false);

  const token = localStorage.getItem("uc_admin_token");

  const ensureAuthorized = () => {
    if (!token) {
      navigate("/school/login");
      return false;
    }
    return true;
  };

  const loadStatusAndTables = async () => {
    if (!ensureAuthorized()) return;

    setLoadingStatus(true);
    setLoadingTables(true);

    try {
      const [statusResponse, tableResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/database/status`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/admin/database/tables`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const connected = Boolean(statusResponse.data?.data?.connected);
      const tableList = Array.isArray(tableResponse.data?.data) ? tableResponse.data.data : [];

      setOverview({
        connected,
        status: connected ? "Connected" : "Disconnected",
        totalTables: tableList.length,
        tables: tableList,
        refreshedAt: new Date().toISOString(),
      });
      setTables(tableList);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      toast.error(error.response?.data?.message || "Database connection failed.");
    } finally {
      setLoadingStatus(false);
      setLoadingTables(false);
    }
  };

  const loadTableSchema = async (tableName, queryPage = 1) => {
    if (!tableName || !ensureAuthorized()) return;

    setLoadingSchema(true);
    setLoadingData(true);
    setPage(queryPage);

    try {
      const [schemaResponse, dataResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/database/tables/${encodeURIComponent(tableName)}/schema`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/admin/database/tables/${encodeURIComponent(tableName)}/data`, {
          params: { page: queryPage, limit: DEFAULT_LIMIT, search: recordSearch },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const schemaList = Array.isArray(schemaResponse.data?.data) ? schemaResponse.data.data : [];
      const dataPayload = dataResponse.data?.data || {};

      setSchema(schemaList);
      setRecords(Array.isArray(dataPayload.data) ? dataPayload.data : []);
      setPage(Number(dataPayload.page || queryPage));
      setTotalPages(Number(dataPayload.totalPages || 1));
      setTotalRows(Number(dataPayload.total || 0));
      setSelectedTable(tableName);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      const message = error.response?.data?.message || "Unable to retrieve table data.";
      toast.error(message);
      setSchema([]);
      setRecords([]);
      setTotalRows(0);
      setTotalPages(1);
    } finally {
      setLoadingSchema(false);
      setLoadingData(false);
    }
  };

  const refreshTableData = async (nextPage = page) => {
    if (!selectedTable) return;

    setLoadingData(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/database/tables/${encodeURIComponent(selectedTable)}/data`, {
        params: { page: nextPage, limit: DEFAULT_LIMIT, search: recordSearch },
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = response.data?.data || {};
      setRecords(Array.isArray(payload.data) ? payload.data : []);
      setPage(Number(payload.page || nextPage));
      setTotalPages(Number(payload.totalPages || 1));
      setTotalRows(Number(payload.total || 0));
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("uc_admin_token");
        navigate("/school/login");
        return;
      }
      toast.error(error.response?.data?.message || "Unable to retrieve table data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadStatusAndTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedTable) return;
    const timer = setTimeout(() => {
      refreshTableData(1);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordSearch]);

  const filteredTables = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    if (!query) return tables;
    return tables.filter((table) => {
      const full = `${table.schema}.${table.tableName}`.toLowerCase();
      return full.includes(query) || table.tableName.toLowerCase().includes(query);
    });
  }, [tableSearch, tables]);

  const renderCell = (value) => {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SchoolHeader />
      <div className="flex flex-col bg-slate-50 lg:flex-row">
        <AdminSideBar />
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-5">
          <section className="mx-auto max-w-7xl space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Database</p>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Database Management</h1>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => loadStatusAndTables()}
                disabled={loadingStatus || loadingTables}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loadingStatus || loadingTables ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Activity className="h-4 w-4 text-emerald-500" />
                Database Status: {loadingStatus ? "Checking..." : overview?.connected ? "Connected" : "Disconnected"}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span>Total Tables: {overview?.totalTables ?? tables.length}</span>
                <span>Last Refresh: {overview?.refreshedAt ? new Date(overview.refreshedAt).toLocaleString() : "--"}</span>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={tableSearch}
                    onChange={(event) => setTableSearch(event.target.value)}
                    placeholder="Search tables..."
                    className="pl-9"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Table2 className="h-4 w-4" />
                    Tables
                  </div>

                  {loadingTables ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                      Loading tables...
                    </div>
                  ) : filteredTables.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                      No tables match your search.
                    </div>
                  ) : (
                    <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
                      {filteredTables.map((table) => {
                        const fullName = `${table.schema}.${table.tableName}`;
                        const isSelected = selectedTable === fullName;

                        return (
                          <button
                            key={fullName}
                            type="button"
                            onClick={() => loadTableSchema(fullName)}
                            className={`w-full rounded-xl border p-3 text-left transition-colors ${
                              isSelected
                                ? "border-sky-200 bg-sky-50"
                                : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-slate-800">{fullName}</div>
                                <div className="text-xs text-slate-500">Rows: {table.rowCount ?? 0}</div>
                              </div>
                              <Button type="button" variant="outline" size="sm">
                                View Data
                              </Button>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                {selectedTable ? (
                  <>
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-left">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedTable(null)}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Table</div>
                          <h2 className="text-xl font-bold text-slate-900">{selectedTable}</h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative min-w-[220px]">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            value={recordSearch}
                            onChange={(event) => setRecordSearch(event.target.value)}
                            placeholder="Search records..."
                            className="pl-9"
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={() => refreshTableData(page)} disabled={loadingData}>
                          <RefreshCw className={`mr-2 h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {loadingSchema ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                        Loading schema and records...
                      </div>
                    ) : (
                      <>
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <div className="overflow-x-auto">
                            {records.length === 0 ? (
                              <div className="p-4 text-sm text-slate-500">No records found for this table.</div>
                            ) : (
                              <table className="min-w-full border-collapse text-left text-sm">
                                <thead className="bg-slate-100 text-slate-700">
                                  <tr>
                                    {schema.map((column) => (
                                      <th key={column.columnName} className="border-b border-slate-200 px-3 py-2 font-semibold whitespace-nowrap">
                                        {column.columnName}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {records.map((row, index) => (
                                    <tr key={`${selectedTable}-${index}`} className="odd:bg-white even:bg-slate-50">
                                      {schema.map((column) => (
                                        <td key={`${selectedTable}-${column.columnName}-${index}`} className="border-b border-slate-200 px-3 py-2 align-top text-slate-700">
                                          {renderCell(row[column.columnName])}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-slate-600">
                            Showing {records.length} of {totalRows} rows
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => refreshTableData(Math.max(1, page - 1))}
                              disabled={loadingData || page <= 1}
                            >
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Previous
                            </Button>
                            <AdminPageJump
                              page={page}
                              totalPages={totalPages}
                              onPageChange={refreshTableData}
                              disabled={loadingData}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => refreshTableData(Math.min(totalPages, page + 1))}
                              disabled={loadingData || page >= totalPages}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex min-h-[450px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                    <div className="space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                        <Database className="h-5 w-5" />
                      </div>
                      <p className="text-base font-semibold text-slate-800">No table selected</p>
                      <p className="text-sm">Choose a table from the left panel to view its real schema and records.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DatabaseManager;
