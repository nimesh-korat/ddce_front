import React, { useState, useEffect } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const api = process.env.REACT_APP_API_URL;
const getToken = () => localStorage.getItem("token");

const FEATURE_LABELS = {
  dashboard: "Dashboard",
  syllabus: "Syllabus",
  weightage: "Topic & Weightage",
  schedule: "Schedule",
  exams: "Exam / Quiz",
  accuracy_matrix: "Accuracy Matrix",
  analytics: "Analytics",
  training: "Training",
  solutions: "Materials & Solutions",
  practice: "Practice",
  doubts: "Doubts",
  flip_card: "Live Stats Flip Card",
};

const FEATURE_ICONS = {
  dashboard: "ph-squares-four",
  syllabus: "ph-books",
  weightage: "ph-chart-pie-slice",
  schedule: "ph-calendar-dots",
  exams: "ph-clipboard-text",
  accuracy_matrix: "ph-trophy",
  analytics: "ph-chart-bar",
  training: "ph-users",
  solutions: "ph-folder-open",
  practice: "ph-barbell",
  doubts: "ph-seal-question",
  flip_card: "ph-cards",
};

const VIS_OPTIONS = [
  {
    value: 1,
    label: "Enabled",
    color: "bg-success-50 text-success-700",
    icon: "ph-check-circle",
  },
  {
    value: 0,
    label: "Locked",
    color: "bg-warning-50 text-warning-700",
    icon: "ph-lock",
  },
  {
    value: 2,
    label: "Hidden",
    color: "bg-danger-50 text-danger-700",
    icon: "ph-eye-slash",
  },
];

function BatchAccess() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("1"); // default phase 1
  const [features, setFeatures] = useState([]);
  const [dirty, setDirty] = useState(false);

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // Get all batches
  const { data: batchData } = useQuery({
    queryKey: ["allBatch"],
    queryFn: async () => {
      const res = await axios.get(`${api}/api/admin/getAllBatch`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Get all phases
  const { data: phaseData } = useQuery({
    queryKey: ["allPhase"],
    queryFn: async () => {
      const res = await axios.get(`${api}/api/admin/getPhase`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const batches = batchData?.data || [];
  const phases = phaseData?.data || [];

  // Get access config for selected batch + phase
  const {
    data: accessData,
    isLoading: accessLoading,
    refetch,
  } = useQuery({
    queryKey: ["batchAccess", selectedBatch, selectedPhase],
    queryFn: async () => {
      const res = await axios.get(
        `${api}/api/admin/batchAccess/${selectedBatch}?phase_id=${selectedPhase}`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      return res.data;
    },
    enabled: !!selectedBatch && !!selectedPhase,
    staleTime: 0,
  });

  useEffect(() => {
    if (accessData?.data) {
      setFeatures(accessData.data.map((f) => ({ ...f })));
      setDirty(false);
    }
  }, [accessData]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.put(
        `${api}/api/admin/batchAccess/${selectedBatch}?phase_id=${selectedPhase}`,
        { features: payload, phase_id: selectedPhase },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Access settings saved!");
      setDirty(false);
      refetch();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to save"),
  });

  const handleVisChange = (key, value) => {
    setFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, visibility: value } : f)),
    );
    setDirty(true);
  };

  const handleSaveAll = () => {
    if (!selectedBatch) {
      toast.error("Select a batch first");
      return;
    }
    saveMutation.mutate(
      features.map((f) => ({ key: f.key, visibility: f.visibility })),
    );
  };

  const handleSetAll = (visibility) => {
    setFeatures((prev) => prev.map((f) => ({ ...f, visibility })));
    setDirty(true);
  };

  // Reset features when batch or phase changes
  const handleBatchChange = (val) => {
    setSelectedBatch(val);
    setFeatures([]);
    setDirty(false);
  };

  const handlePhaseChange = (val) => {
    setSelectedPhase(val);
    setFeatures([]);
    setDirty(false);
  };

  const currentVis = (vis) =>
    VIS_OPTIONS.find((v) => v.value === vis) || VIS_OPTIONS[1];

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* Breadcrumb */}
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-0">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-200 fw-normal text-15 hover-text-main-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Batch Access Control
                  </span>
                </li>
              </ul>
            </div>
            {dirty && (
              <button
                className="btn btn-main rounded-pill py-9 px-24 flex-align gap-8"
                onClick={handleSaveAll}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-6" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ph ph-floppy-disk me-6" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>

          {/* Batch + Phase selector */}
          <div className="card mb-20">
            <div className="card-body p-20">
              <div className="row g-16 align-items-end">
                <div className="col-md-3">
                  <label className="form-label fw-medium text-14 mb-6">
                    Select Batch
                  </label>
                  <select
                    className="form-control"
                    value={selectedBatch}
                    onChange={(e) => handleBatchChange(e.target.value)}
                  >
                    <option value="">— Choose a batch —</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium text-14 mb-6">
                    Select Phase
                    <span className="text-gray-400 fw-normal ms-4 text-12">
                      (default: Phase 1)
                    </span>
                  </label>
                  <select
                    className="form-control"
                    value={selectedPhase}
                    onChange={(e) => handlePhaseChange(e.target.value)}
                  >
                    {phases.length > 0 ? (
                      phases.map((p) => (
                        <option key={p.Id} value={p.Id}>
                          {p.title}
                        </option>
                      ))
                    ) : (
                      <option value="1">Phase 1</option>
                    )}
                  </select>
                </div>

                {selectedBatch && features.length > 0 && (
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-14 mb-6">
                      Quick Set All
                    </label>
                    <div className="flex-align gap-8 flex-wrap">
                      {VIS_OPTIONS.map((v) => (
                        <button
                          key={v.value}
                          className={`btn btn-sm rounded-pill py-6 px-16 flex-align gap-6 ${v.color}`}
                          onClick={() => handleSetAll(v.value)}
                          style={{ border: "1px solid transparent" }}
                        >
                          <i className={`ph ${v.icon}`} />
                          {v.label} All
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected info badge */}
              {selectedBatch && (
                <div className="mt-12 flex-align gap-8">
                  <span className="text-13 text-gray-500">Configuring:</span>
                  <span className="text-13 fw-semibold text-main-600 bg-main-50 py-2 px-10 rounded-pill">
                    {batches.find((b) => String(b.id) === String(selectedBatch))
                      ?.batch_title || "—"}
                  </span>
                  <i className="ph ph-arrow-right text-gray-400 text-12" />
                  <span className="text-13 fw-semibold text-main-600 bg-main-50 py-2 px-10 rounded-pill">
                    {phases.find((p) => String(p.Id) === String(selectedPhase))
                      ?.title || `Phase ${selectedPhase}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Empty state */}
          {!selectedBatch && (
            <div className="card">
              <div className="card-body text-center py-48">
                <i className="ph ph-lock text-64 text-gray-300 d-block mb-16" />
                <h5 className="text-gray-500 fw-medium">
                  Select a batch and phase to manage feature access
                </h5>
              </div>
            </div>
          )}

          {selectedBatch && accessLoading && (
            <div className="card">
              <div className="card-body text-center py-32">
                <span className="spinner-border text-main-600" />
              </div>
            </div>
          )}

          {selectedBatch && !accessLoading && features.length > 0 && (
            <>
              {/* Legend */}
              <div className="flex-align gap-16 mb-16 flex-wrap">
                {VIS_OPTIONS.map((v) => (
                  <span
                    key={v.value}
                    className={`text-13 py-4 px-14 rounded-pill fw-medium flex-align gap-6 ${v.color}`}
                  >
                    <i className={`ph ${v.icon}`} />
                    {v.label}
                  </span>
                ))}
                <span className="text-12 text-gray-400 ms-4">
                  Locked = visible with 🔒, Hidden = removed from sidebar,
                  Enabled = fully accessible
                </span>
              </div>

              <div className="row g-16">
                {features.map((f) => {
                  const vis = currentVis(f.visibility);
                  return (
                    <div className="col-xl-4 col-md-6" key={f.key}>
                      <div
                        className={`card border-2 h-100 transition-2 ${
                          f.visibility === 1
                            ? "border-success-200"
                            : f.visibility === 0
                              ? "border-warning-200"
                              : "border-danger-200"
                        }`}
                      >
                        <div className="card-body p-20">
                          <div className="flex-align gap-12 mb-16">
                            <div
                              className={`w-44 h-44 rounded-10 d-flex align-items-center justify-content-center flex-shrink-0 ${
                                f.visibility === 1
                                  ? "bg-success-50"
                                  : f.visibility === 0
                                    ? "bg-warning-50"
                                    : "bg-danger-50"
                              }`}
                            >
                              <i
                                className={`ph ${FEATURE_ICONS[f.key] || "ph-star"} text-22 ${
                                  f.visibility === 1
                                    ? "text-success-600"
                                    : f.visibility === 0
                                      ? "text-warning-600"
                                      : "text-danger-600"
                                }`}
                              />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-2 text-gray-800">
                                {FEATURE_LABELS[f.key] || f.key}
                              </h6>
                              <span
                                className={`text-12 py-2 px-10 rounded-pill fw-medium flex-align gap-4 d-inline-flex ${vis.color}`}
                              >
                                <i className={`ph ${vis.icon} text-12`} />
                                {vis.label}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex gap-8">
                            {VIS_OPTIONS.map((v) => (
                              <button
                                key={v.value}
                                onClick={() => handleVisChange(f.key, v.value)}
                                className={`flex-grow-1 py-8 rounded-8 border-2 text-13 fw-medium flex-align justify-content-center gap-6 transition-2 ${
                                  f.visibility === v.value
                                    ? `${v.color} border-current`
                                    : "bg-gray-50 text-gray-500 border-gray-100 hover-bg-gray-100"
                                }`}
                                style={{
                                  borderColor:
                                    f.visibility === v.value
                                      ? v.value === 1
                                        ? "#22c55e"
                                        : v.value === 0
                                          ? "#f59e0b"
                                          : "#ef4444"
                                      : undefined,
                                  cursor: "pointer",
                                }}
                              >
                                <i className={`ph ${v.icon} text-14`} />
                                <span>{v.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {dirty && (
                <div className="mt-24 text-end">
                  <button
                    className="btn btn-main rounded-pill py-10 px-32 flex-align gap-8"
                    onClick={handleSaveAll}
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-6" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ph ph-floppy-disk me-6" />
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default BatchAccess;
