import React, { useState } from "react";
import MentorSidebar from "../../common/MentorSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPracticeAssignments, deletePracticeAssignment } from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Preloader from "../../utils/preloader/Preloader";
import { format } from "date-fns";

function MyAssignments() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data, isLoading } = useQuery({
    queryKey: ["myPracticeAssignments"],
    queryFn: getMyPracticeAssignments,
    staleTime: 2 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePracticeAssignment(id),
    onSuccess: () => { toast.success("Assignment deleted!"); queryClient.invalidateQueries(["myPracticeAssignments"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete"),
  });

  const handleDelete = (a) => {
    Swal.fire({
      title: "Delete Assignment?",
      text: `"${a.title}" will be deleted. Students won't see these questions anymore.`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(a.id); });
  };

  const assignments = data?.data || [];

  const statusBadge = (s) => {
    const map = { active: "bg-success-50 text-success-600", upcoming: "bg-info-50 text-info-600", ended: "bg-gray-50 text-gray-500" };
    return map[s] || "bg-gray-50 text-gray-500";
  };

  const fmtDate = (d) => d ? format(new Date(d), "dd MMM yyyy, hh:mm a") : "—";

  return (
    <>
      <MentorSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {isLoading ? <Preloader /> : (
          <div className="dashboard-body">
            <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
              <div className="breadcrumb mb-0">
                <ul className="flex-align gap-4">
                  <li><Link to="/mentor/dashboard" className="text-gray-200 fw-normal text-15 hover-text-main-600">Home</Link></li>
                  <li><span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right" /></span></li>
                  <li><span className="text-main-600 fw-normal text-15">My Assignments</span></li>
                </ul>
              </div>
              <Link to="/mentor/assignPractice" className="btn btn-main rounded-pill py-9 flex-align gap-8">
                <i className="ph ph-plus" />New Assignment
              </Link>
            </div>

            {assignments.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-48">
                  <i className="ph ph-clipboard-text text-64 text-gray-300 d-block mb-16" />
                  <h5 className="text-gray-500 fw-medium mb-8">No assignments yet</h5>
                  <Link to="/mentor/assignPractice" className="btn btn-main rounded-pill py-9">Create First Assignment</Link>
                </div>
              </div>
            ) : (
              <div className="card border border-gray-100">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-13 text-gray-500 fw-medium py-14 px-20">#</th>
                          <th className="text-13 text-gray-500 fw-medium py-14">Title</th>
                          <th className="text-13 text-gray-500 fw-medium py-14">Batch</th>
                          <th className="text-13 text-gray-500 fw-medium py-14">Questions</th>
                          <th className="text-13 text-gray-500 fw-medium py-14">Start</th>
                          <th className="text-13 text-gray-500 fw-medium py-14">End</th>
                          <th className="text-13 text-gray-500 fw-medium py-14 text-center">Status</th>
                          <th className="text-13 text-gray-500 fw-medium py-14 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((a, i) => (
                          <tr key={a.id}>
                            <td className="text-13 py-14 px-20">{i + 1}</td>
                            <td className="py-14">
                              <p className="text-14 fw-semibold mb-0">{a.title}</p>
                              {a.assigned_by_name && <span className="text-12 text-gray-400">by {a.assigned_by_name}</span>}
                            </td>
                            <td className="text-13 py-14">{a.batch_title || "—"}</td>
                            <td className="py-14">
                              <span className="text-13 fw-semibold text-main-600">{a.total_questions}</span>
                            </td>
                            <td className="text-13 py-14">{fmtDate(a.start_date)}</td>
                            <td className="text-13 py-14">{fmtDate(a.end_date)}</td>
                            <td className="py-14 text-center">
                              <span className={`text-12 py-2 px-10 rounded-pill fw-medium ${statusBadge(a.status)}`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="py-14 text-center">
                              <button className="btn btn-sm btn-outline-danger rounded-pill"
                                onClick={() => handleDelete(a)} disabled={deleteMutation.isPending} title="Delete">
                                <i className="ph ph-trash text-14" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default MyAssignments;
