import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTopicWeightage,
  upsertTopicWeightage,
  deleteTopicWeightage,
} from "../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const YEARS = Array.from({ length: 11 }, (_, i) => 2015 + i); // 2015-2025

export default function TopicWeightageModal({ topic, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ year: "", weightage: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["topicWeightage", topic.Id],
    queryFn: () => getTopicWeightage(topic.Id),
    staleTime: 15000,
  });
  const rows = data?.data || [];
  const existingYears = new Set(rows.map((r) => r.year));
  const availableYears = YEARS.filter((y) => !existingYears.has(y));

  const saveMutation = useMutation({
    mutationFn: (d) => upsertTopicWeightage(topic.Id, d),
    onSuccess: () => {
      toast.success("Saved!");
      queryClient.invalidateQueries(["topicWeightage", topic.Id]);
      setForm({ year: "", weightage: "" });
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopicWeightage,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries(["topicWeightage", topic.Id]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleSave = () => {
    if (!form.year) return toast.error("Select a year");
    if (!form.weightage && form.weightage !== 0)
      return toast.error("Enter weightage");
    saveMutation.mutate({
      year: form.year,
      weightage: parseFloat(form.weightage),
    });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: `Delete ${row.year} entry?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(row.id);
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div className="flex-between px-20 py-16 border-bottom border-gray-100">
          <div>
            <h6 className="fw-bold text-gray-800 mb-2">{topic.topic_name}</h6>
            <p className="text-12 text-gray-400 mb-0">
              Year-wise JEE Weightage
            </p>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary rounded-circle"
            onClick={onClose}
            style={{ width: "32px", height: "32px", padding: 0 }}
          >
            <i className="ph ph-x" />
          </button>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "20px" }}>
          {/* Add entry */}
          <div className="card border border-gray-100 mb-16 p-16">
            <p
              className="text-12 fw-semibold text-gray-500 text-uppercase mb-12"
              style={{ letterSpacing: "0.5px" }}
            >
              Add / Update Entry
            </p>
            <div className="row g-10">
              <div className="col-5">
                <label className="text-12 text-gray-500 mb-4 d-block">
                  Year
                </label>
                <select
                  className="form-select rounded-8 form-select-sm"
                  value={form.year}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year: e.target.value }))
                  }
                >
                  <option value="">Select Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y} {existingYears.has(y) ? "✓" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-5">
                <label className="text-12 text-gray-500 mb-4 d-block">
                  Weightage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="form-control rounded-8 form-control-sm"
                  placeholder="e.g. 12.5"
                  value={form.weightage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, weightage: e.target.value }))
                  }
                />
              </div>
              <div className="col-2 d-flex align-items-end">
                <button
                  className="btn btn-main btn-sm rounded-8 w-100"
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <i className="ph ph-floppy-disk" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Entries table */}
          {isLoading && (
            <div className="text-center py-24">
              <span className="spinner-border text-main-600" />
            </div>
          )}
          {!isLoading && rows.length === 0 && (
            <div className="text-center py-32">
              <i className="ph ph-chart-bar text-48 text-gray-300 d-block mb-12" />
              <p className="text-gray-400 text-13">
                No weightage entries yet. Add years above.
              </p>
            </div>
          )}
          {rows.length > 0 && (
            <table className="table table-sm mb-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-12 text-gray-500 fw-medium py-10 px-14">
                    Year
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Weightage (%)
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Edit
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="text-13 fw-semibold text-gray-800 py-10 px-14">
                      {r.year}
                    </td>
                    <td className="py-10 text-center">
                      <span className="text-14 fw-bold text-main-600">
                        {r.weightage ?? "—"}%
                      </span>
                    </td>
                    <td className="py-10 text-center">
                      <button
                        className="btn btn-sm btn-outline-info-600 rounded-pill"
                        onClick={() =>
                          setForm({
                            year: String(r.year),
                            weightage: r.weightage ?? "",
                          })
                        }
                      >
                        <i className="ph ph-pencil text-12" />
                      </button>
                    </td>
                    <td className="py-10 text-center">
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDelete(r)}
                        disabled={deleteMutation.isPending}
                      >
                        <i className="ph ph-trash text-12" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-main-50">
                <tr>
                  <td className="text-13 fw-semibold text-main-700 py-10 px-14">
                    Total
                  </td>
                  <td className="text-14 fw-bold text-main-600 py-10 text-center">
                    {rows
                      .reduce((s, r) => s + (parseFloat(r.weightage) || 0), 0)
                      .toFixed(2)}
                    %
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
