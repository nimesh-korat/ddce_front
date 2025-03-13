import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { getSession } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";
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
                    <div className="col-md-3" key={index}>
                      <div className="card shadow-sm border-0">
                        <div className="card-body">
                          <h5 className="card-title">📌{item.description}</h5>
                          <p className="card-text mb-5">
                            <strong>For Who:</strong> {item.for_who}
                            <br />
                            <strong>Link: </strong>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.link}
                            </a>
                          </p>
                          <Link
                            to={"/admin/assignSessionToBatch"}
                            state={item}
                            className="btn btn-primary"
                          >
                            View Details
                          </Link>
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
