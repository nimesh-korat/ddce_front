import React, { useState } from "react";
import MentorSidebar from "../../common/MentorSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mentorGetQuestions, getMyPracticeAssignments } from "../../apis/apis";

function MentorDashboard() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: questionsData } = useQuery({
    queryKey: ["mentorQuestions", { page: 1, limit: 1 }],
    queryFn: () => mentorGetQuestions({ page: 1, limit: 1 }),
    staleTime: 2 * 60 * 1000,
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ["myPracticeAssignments"],
    queryFn: getMyPracticeAssignments,
    staleTime: 2 * 60 * 1000,
  });

  const totalQuestions = questionsData?.totalQuestions || 0;
  const assignments = assignmentsData?.data || [];
  const activeAssignments = assignments.filter((a) => a.status === "active").length;
  const totalAssignments = assignments.length;

  const statCards = [
    {
      icon: "ph-question-mark",
      label: "My Questions",
      value: totalQuestions,
      color: "bg-main-600",
      link: "/mentor/showQuestions",
    },
    {
      icon: "ph-barbell",
      label: "Active Assignments",
      value: activeAssignments,
      color: "bg-success-600",
      link: "/mentor/myAssignments",
    },
    {
      icon: "ph-clipboard-text",
      label: "Total Assignments",
      value: totalAssignments,
      color: "bg-warning-600",
      link: "/mentor/myAssignments",
    },
  ];

  return (
    <>
      <MentorSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* Breadcrumb */}
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link to="/mentor/dashboard" className="text-gray-200 fw-normal text-15 hover-text-main-600">
                  Home
                </Link>
              </li>
              <li><span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right" /></span></li>
              <li><span className="text-main-600 fw-normal text-15">Dashboard</span></li>
            </ul>
          </div>

          {/* Stat Cards */}
          <div className="row g-20 mb-24">
            {statCards.map((card, i) => (
              <div className="col-xxl-4 col-sm-6" key={i}>
                <div className="card">
                  <div className="card-body p-20">
                    <div className="flex-align gap-16">
                      <div className={`w-48 h-48 d-flex align-items-center justify-content-center rounded-circle ${card.color} text-white flex-shrink-0`}>
                        <i className={`ph ${card.icon} text-22`} />
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-gray-500 text-13 mb-2">{card.label}</p>
                        <h4 className="fw-semibold text-gray-800 mb-0">{card.value.toLocaleString()}</h4>
                      </div>
                    </div>
                    <div className="mt-12 pt-12 border-top border-gray-100">
                      <Link to={card.link} className="text-13 text-main-600 hover-text-main-800 flex-align gap-4">
                        View Details <i className="ph ph-arrow-right text-14" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="card-body p-24">
              <h6 className="fw-semibold mb-16 text-main-600">Quick Actions</h6>
              <div className="d-flex gap-12 flex-wrap">
                <Link to="/mentor/addQuestion" className="btn btn-main rounded-pill py-9 flex-align gap-8">
                  <i className="ph ph-plus-circle" />Add Question
                </Link>
                <Link to="/mentor/assignPractice" className="btn btn-outline-main rounded-pill py-9 flex-align gap-8">
                  <i className="ph ph-barbell" />Assign Practice
                </Link>
                <Link to="/mentor/showQuestions" className="btn btn-outline-main rounded-pill py-9 flex-align gap-8">
                  <i className="ph ph-list-bullets" />My Questions
                </Link>
              </div>
            </div>
          </div>

          {/* Recent assignments */}
          {assignments.length > 0 && (
            <div className="card mt-20">
              <div className="card-body p-0">
                <div className="flex-between p-20 border-bottom border-gray-100">
                  <h6 className="fw-semibold mb-0 text-main-600">Recent Assignments</h6>
                  <Link to="/mentor/myAssignments" className="text-13 text-main-600">View All</Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-13 text-gray-500 fw-medium py-12 px-20">Title</th>
                        <th className="text-13 text-gray-500 fw-medium py-12">Batch</th>
                        <th className="text-13 text-gray-500 fw-medium py-12">Questions</th>
                        <th className="text-13 text-gray-500 fw-medium py-12">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.slice(0, 5).map((a) => (
                        <tr key={a.id}>
                          <td className="text-13 fw-medium py-12 px-20">{a.title}</td>
                          <td className="text-13 py-12">{a.batch_title || "—"}</td>
                          <td className="text-13 py-12">{a.total_questions}</td>
                          <td className="py-12">
                            <span className={`text-12 py-2 px-10 rounded-pill fw-medium ${
                              a.status === "active" ? "bg-success-50 text-success-600"
                              : a.status === "upcoming" ? "bg-info-50 text-info-600"
                              : "bg-gray-50 text-gray-500"
                            }`}>
                              {a.status}
                            </span>
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
        <Footer />
      </div>
    </>
  );
}

export default MentorDashboard;
