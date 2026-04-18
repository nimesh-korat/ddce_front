import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";
import StatCard from "./components/StatCard";
import TestsChart from "./components/TestsChart";
import { format } from "date-fns";

function AdminDashboard() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => setIsSidebarActive((prev) => !prev);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getAdminDashboardStats,
    staleTime: 2 * 60 * 1000,
  });

  const d = stats?.data;

  const difficultyLabel = (key) => {
    const map = { "0": "Easy", "1": "Medium", "2": "Hard", "3": "Time Consuming" };
    return map[key] || key;
  };

  const difficultyColor = (key) => {
    const map = {
      "0": "bg-success-50 text-success-600",
      "1": "bg-info-50 text-info-600",
      "2": "bg-warning-50 text-warning-600",
      "3": "bg-danger-50 text-danger-600",
    };
    return map[key] || "bg-gray-50 text-gray-600";
  };

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {isLoading ? (
          <Preloader />
        ) : isError ? (
          <div className="dashboard-body">
            <div className="alert alert-danger">
              Failed to load dashboard stats. Please try again.
            </div>
          </div>
        ) : (
          <div className="dashboard-body">
            {/* Breadcrumb */}
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
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Dashboard
                  </span>
                </li>
              </ul>
            </div>

            {/* Stat Cards */}
            <div className="row g-20 mb-24">
              <StatCard
                icon="ph-users"
                label="Total Users"
                value={d?.total_users ?? 0}
                color="bg-main-600"
                link="/admin/viewStudentWiseGivenExamData"
              />
              <StatCard
                icon="ph-article-ny-times"
                label="Total Tests"
                value={d?.total_tests ?? 0}
                color="bg-success-600"
                link="/admin/showTests"
              />
              <StatCard
                icon="ph-question-mark"
                label="Total Questions"
                value={d?.total_questions ?? 0}
                color="bg-warning-600"
                link="/admin/showQuestions"
              />
              <StatCard
                icon="ph-files"
                label="Total Materials"
                value={d?.total_materials ?? 0}
                color="bg-info-600"
                link="/admin/materials"
              />
              <StatCard
                icon="ph-stack"
                label="Total Batches"
                value={d?.total_batches ?? 0}
                color="bg-purple-600"
                link="/admin/assignBatch"
              />
              <StatCard
                icon="ph-video-camera"
                label="Total Sessions"
                value={d?.total_sessions ?? 0}
                color="bg-danger-600"
                link="/admin/showSession"
              />
              <StatCard
                icon="ph-check-circle"
                label="Exams Submitted"
                value={d?.total_exams_submitted ?? 0}
                color="bg-teal-600"
                link="/admin/viewGivenExamData"
              />
            </div>

            {/* Charts Row */}
            <div className="row g-20 mb-24">
              {/* Test Status Breakdown */}
              <div className="col-xxl-4 col-md-6">
                <TestsChart breakdown={d?.test_breakdown} />
              </div>

              {/* Monthly Registrations */}
              <div className="col-xxl-8 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="fw-semibold mb-16 text-main-600">
                      <i className="ph ph-chart-bar me-2" />
                      Monthly User Registrations (Last 6 Months)
                    </h6>
                    {d?.monthly_registrations?.length > 0 ? (
                      <div className="d-flex flex-column gap-12">
                        {d.monthly_registrations.map((item, i) => {
                          const maxCount = Math.max(
                            ...d.monthly_registrations.map((m) => m.count)
                          );
                          const pct = maxCount
                            ? Math.round((item.count / maxCount) * 100)
                            : 0;
                          return (
                            <div key={i}>
                              <div className="flex-between mb-4">
                                <span className="text-13 text-gray-700 fw-medium">
                                  {item.month}
                                </span>
                                <span className="text-13 text-main-600 fw-semibold">
                                  {item.count}
                                </span>
                              </div>
                              <div
                                className="bg-gray-100 rounded-pill"
                                style={{ height: "8px" }}
                              >
                                <div
                                  className="bg-main-600 rounded-pill"
                                  style={{ width: `${pct}%`, height: "8px" }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-14">No registration data yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="row g-20">
              {/* Recent Registrations */}
              <div className="col-xxl-8">
                <div className="card">
                  <div className="card-body">
                    <div className="flex-between mb-16">
                      <h6 className="fw-semibold text-main-600">
                        <i className="ph ph-user-circle-plus me-2" />
                        Recent Registrations
                      </h6>
                      <Link
                        to="/admin/viewStudentWiseGivenExamData"
                        className="text-13 text-main-600 hover-text-main-800"
                      >
                        View All
                      </Link>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th className="text-13 text-gray-500 fw-medium">#</th>
                            <th className="text-13 text-gray-500 fw-medium">Name</th>
                            <th className="text-13 text-gray-500 fw-medium">Phone</th>
                            <th className="text-13 text-gray-500 fw-medium">College</th>
                            <th className="text-13 text-gray-500 fw-medium">Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d?.recent_users?.length > 0 ? (
                            d.recent_users.map((user, i) => (
                              <tr key={i}>
                                <td className="text-13">{i + 1}</td>
                                <td className="text-13 fw-medium">{user.Name}</td>
                                <td className="text-13">{user.Phone_Number}</td>
                                <td className="text-13">{user.College_Name || "—"}</td>
                                <td className="text-13 text-gray-500">
                                  {user.registration_time
                                    ? format(
                                        new Date(user.registration_time),
                                        "dd MMM yyyy"
                                      )
                                    : "—"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center text-gray-400 text-13">
                                No recent registrations.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions by Difficulty */}
              <div className="col-xxl-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h6 className="fw-semibold mb-16 text-main-600">
                      <i className="ph ph-chart-pie-slice me-2" />
                      Questions by Difficulty
                    </h6>
                    {d?.difficulty_breakdown?.length > 0 ? (
                      <div className="d-flex flex-column gap-12">
                        {d.difficulty_breakdown.map((item, i) => (
                          <div
                            key={i}
                            className="flex-between p-12 rounded-8 bg-gray-50"
                          >
                            <span
                              className={`text-13 py-2 px-12 rounded-pill fw-medium ${difficultyColor(
                                item.question_difficulty
                              )}`}
                            >
                              {difficultyLabel(item.question_difficulty)}
                            </span>
                            <span className="text-15 fw-semibold text-gray-700">
                              {item.total}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-14">No question data yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default AdminDashboard;
