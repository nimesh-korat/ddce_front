import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGetExamTypes,
  createExamType,
  updateExamType,
  deleteExamType,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ExamType() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();
  const emptyForm = { name: "", description: "" };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminExamTypes"],
    queryFn: adminGetExamTypes,
    staleTime: 30000,
  });
  const examTypes = data?.data || [];

  const saveMutation = useMutation({
    mutationFn: (d) => (editId ? updateExamType(editId, d) : createExamType(d)),
    onSuccess: () => {
      toast.success(editId ? "Updated!" : "Created!");
      queryClient.invalidateQueries(["adminExamTypes"]);
      setForm(emptyForm);
      setEditId(null);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExamType,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries(["adminExamTypes"]);
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to delete"),
  });

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    saveMutation.mutate(form);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm({ name: row.name, description: row.description || "" });
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Delete Exam Type?",
      text: `"${row.name}" will be permanently deleted. Students and batches linked to it will lose their exam type.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(row.id);
    });
  };

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
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
                <span className="text-gray-500 d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Exam Types
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* Form */}
            <div className="col-lg-4">
              <div className="card border border-gray-100 shadow-sm">
                <div className="card-body p-20">
                  <h6 className="fw-bold text-gray-800 mb-16 flex-align gap-8">
                    <i
                      className={`ph ${editId ? "ph-pencil" : "ph-plus-circle"} text-main-600`}
                    />
                    {editId ? "Edit Exam Type" : "Add Exam Type"}
                  </h6>
                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-8"
                      placeholder="e.g. DDCET, JEE, NEET"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-16">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Description
                    </label>
                    <textarea
                      className="form-control rounded-8"
                      rows={3}
                      placeholder="Short description..."
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex-align gap-8">
                    <button
                      className="btn btn-main rounded-8 flex-1 flex-align gap-6 justify-content-center"
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <i className="ph ph-floppy-disk" />
                      )}
                      {editId ? "Update" : "Create"}
                    </button>
                    {editId && (
                      <button
                        className="btn btn-outline-secondary rounded-8"
                        onClick={() => {
                          setEditId(null);
                          setForm(emptyForm);
                        }}
                      >
                        <i className="ph ph-x" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="col-lg-8">
              <div className="card border border-gray-100 shadow-sm">
                <div className="flex-between px-20 py-14 border-bottom border-gray-100">
                  <h6 className="fw-bold text-gray-800 mb-0">All Exam Types</h6>
                  <span className="text-13 text-gray-400">
                    {examTypes.length} types
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-hover mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                          #
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Name
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Description
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading &&
                        Array.from({ length: 2 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 4 }).map((__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{ height: "13px", width: "80%" }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      {!isLoading && examTypes.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center text-gray-400 py-40"
                          >
                            No exam types yet
                          </td>
                        </tr>
                      )}
                      {examTypes.map((row, i) => (
                        <tr
                          key={row.id}
                          className={editId === row.id ? "bg-main-50" : ""}
                        >
                          <td className="text-13 text-gray-400 py-12 px-16">
                            {i + 1}
                          </td>
                          <td className="py-12">
                            <span className="text-13 fw-bold text-gray-800 bg-main-50 text-main-700 py-3 px-12 rounded-pill">
                              {row.name}
                            </span>
                          </td>
                          <td className="text-13 text-gray-500 py-12">
                            {row.description || "—"}
                          </td>
                          <td className="py-12 text-center">
                            <div className="flex-align gap-6 justify-content-center">
                              <button
                                className="btn btn-sm btn-outline-info-600 rounded-pill"
                                onClick={() => handleEdit(row)}
                              >
                                <i className="ph ph-pencil text-12" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                onClick={() => handleDelete(row)}
                                disabled={deleteMutation.isPending}
                              >
                                <i className="ph ph-trash text-12" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
