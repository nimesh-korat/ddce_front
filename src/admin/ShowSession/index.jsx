import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { getSession } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Preloader from "../../utils/preloader/Preloader";

function ShowSession() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getSessions"],
    queryFn: getSession,
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching session:", error.message);
    },
  });

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link
                  to={"/admin"}
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
                  Show Session
                </span>
              </li>
            </ul>
          </div>

          <div className="dashboard-body">
            <div className="container-fluid dashboard-content">
              {isLoading ? (
                <Preloader />
              ) : (
                <div className="row g-4">
                  {data.data.map((item, index) => (
                    <div className="col-md-4" key={index}>
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title mb-2">
                            📌 {item.description}
                          </h5>
                          <p className="card-text mb-3">
                            <strong>For:</strong> {item.for_who} <br />
                            <strong>Link:</strong>{" "}
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ wordBreak: "break-word" }}
                            >
                              {item.link}
                            </a>
                          </p>
                          <hr />
                          <h6 className="fw-semibold mb-2">Assignments:</h6>
                          {item.assignments.length > 0
                            ? item.assignments.map((assign, idx) => (
                                <div
                                  key={idx}
                                  className="mb-3 p-3 bg-light rounded shadow-sm"
                                >
                                  <div className="d-flex flex-wrap gap-10 mb-2">
                                    {assign.phase && (
                                      <p className="mb-0 d-flex align-items-center gap-1">
                                        <i className="ph ph-target text-primary" />
                                        <strong>Phase:</strong>{" "}
                                        {assign.phase.title}
                                      </p>
                                    )}
                                    {assign.batch && (
                                      <p className="mb-0 d-flex align-items-center gap-1">
                                        <i className="ph ph-users text-success" />
                                        <strong>Batch:</strong>{" "}
                                        {assign.batch.title}
                                      </p>
                                    )}
                                  </div>
                                  <p className="mb-1">
                                    <i className="ph ph-calendar-check text-info" />{" "}
                                    <strong>Start:</strong>{" "}
                                    {assign.start_date
                                      ? format(
                                          new Date(assign.start_date),
                                          "dd/MM/yyyy hh:mm a"
                                        )
                                      : "N/A"}
                                  </p>
                                  <p className="mb-1">
                                    <i className="ph ph-calendar-x text-danger" />{" "}
                                    <strong>End:</strong>{" "}
                                    {assign.end_date
                                      ? format(
                                          new Date(assign.end_date),
                                          "dd/MM/yyyy hh:mm a"
                                        )
                                      : "N/A"}
                                  </p>
                                  {assign.is_featured === 1 && (
                                    <span className="badge bg-warning text-dark">
                                      🌟 Featured
                                    </span>
                                  )}
                                </div>
                              ))
                            : "No Assignments"}

                          <div className="mt-auto pt-3">
                            <Link
                              to={"/admin/assignSessionToBatch"}
                              state={item}
                              className="btn btn-primary w-100"
                            >
                              Manage Assignments
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowSession;
