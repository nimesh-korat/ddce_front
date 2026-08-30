import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMentorSubjects,
  assignMentorSubject,
  removeMentorSubject,
  getSubjects,
  getMentorsList,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function MentorSubjects() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ mentor_id: "", subject_id: "" });

  const { data: mappingsData, isLoading } = useQuery({
    queryKey: ["mentorSubjects"],
    queryFn: getMentorSubjects,
    staleTime: 30 * 1000,
  });
  const { data: subjectData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
  const { data: mentorsData } = useQuery({
    queryKey: ["mentorsList"],
    queryFn: getMentorsList,
    staleTime: 5 * 60 * 1000,
  });

  const mappings = mappingsData?.data || [];
  const subjects = subjectData?.data || [];
  const mentors = mentorsData?.data || [];

  const assignMutation = useMutation({
    mutationFn: assignMentorSubject,
    onSuccess: () => {
      toast.success("Subject assigned!");
      queryClient.invalidateQueries(["mentorSubjects"]);
      setForm({ mentor_id: "", subject_id: "" });
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to assign"),
  });

  const removeMutation = useMutation({
    mutationFn: removeMentorSubject,
    onSuccess: () => {
      toast.success("Mapping removed");
      queryClient.invalidateQueries(["mentorSubjects"]);
    },
    onError: () => toast.error("Failed to remove"),
  });

  const handleAssign = () => {
    if (!form.mentor_id) return toast.error("Select a mentor");
    if (!form.subject_id) return toast.error("Select a subject");
    assignMutation.mutate({
      mentor_id: form.mentor_id,
      subject_id: form.subject_id,
    });
  };

  const handleRemove = (row) => {
    Swal.fire({
      title: "Remove mapping?",
      text: `${row.mentor_name} will no longer receive SMS for ${row.subject_name} doubts.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove",
    }).then((r) => {
      if (r.isConfirmed) removeMutation.mutate(row.id);
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
                  Mentor Subject Mapping
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
                    <i className="ph ph-link text-main-600" /> Assign Subject to
                    Mentor
                  </h6>
                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Mentor / Faculty *
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={form.mentor_id}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, mentor_id: e.target.value }))
                      }
                    >
                      <option value="">Select Mentor</option>
                      {mentors.map((m) => (
                        <option key={m.Id} value={m.Id}>
                          {m.Name} ({m.Phone})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-16">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Subject *
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={form.subject_id}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject_id: e.target.value }))
                      }
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.Id} value={s.Id}>
                          {s.Sub_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-main rounded-8 w-100 flex-align gap-8 justify-content-center"
                    onClick={handleAssign}
                    disabled={assignMutation.isPending}
                  >
                    {assignMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />{" "}
                        Assigning...
                      </>
                    ) : (
                      <>
                        <i className="ph ph-plus-circle" /> Assign
                      </>
                    )}
                  </button>
                  <p className="text-12 text-gray-400 mt-12 mb-0">
                    <i className="ph ph-info me-4" /> Assigned mentors receive
                    SMS when a student submits a doubt for their subject.
                  </p>
                </div>
              </div>
            </div>

            {/* Mappings Table */}
            <div className="col-lg-8">
              <div className="card border border-gray-100 shadow-sm">
                <div className="flex-between px-20 py-14 border-bottom border-gray-100">
                  <h6 className="fw-bold text-gray-800 mb-0">
                    Current Mappings
                  </h6>
                  <span className="text-13 text-gray-400">
                    {mappings.length} entries
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
                          Mentor
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Phone
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Subject
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading &&
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 5 }).map((__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{ height: "13px", width: "80%" }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      {!isLoading && mappings.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-gray-400 py-40"
                          >
                            <i className="ph ph-link-break text-48 d-block mb-12 text-gray-300" />
                            No mappings yet
                          </td>
                        </tr>
                      )}
                      {mappings.map((m, i) => (
                        <tr key={m.id}>
                          <td className="text-13 text-gray-400 py-12 px-16">
                            {i + 1}
                          </td>
                          <td className="text-13 fw-semibold text-gray-800 py-12">
                            {m.mentor_name}
                          </td>
                          <td className="text-13 text-gray-500 py-12">
                            {m.mentor_phone}
                          </td>
                          <td className="py-12">
                            <span className="text-12 bg-main-50 text-main-700 py-2 px-10 rounded-pill fw-medium">
                              {m.subject_name}
                            </span>
                          </td>
                          <td className="py-12 text-center">
                            <button
                              className="btn btn-sm btn-danger rounded-pill"
                              onClick={() => handleRemove(m)}
                              disabled={removeMutation.isPending}
                            >
                              <i className="ph ph-trash text-12" />
                            </button>
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
