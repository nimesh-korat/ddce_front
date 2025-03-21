import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import Footer from "../../common/footer";
import { useQuery } from "@tanstack/react-query";
import { getActiveScheduleForStudent } from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";
import { toZonedTime, format } from "date-fns-tz";

function Schedule() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  function formatDateInUserTimezone(date) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = toZonedTime(date, userTimeZone);
    return format(zonedDate, "dd/MM/yyyy hh:mm a"); // 12-hour format with AM/PM
  }

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["schedule"],
    queryFn: getActiveScheduleForStudent,
  });

  if (isError) {
    console.log(error);
  }
  // Get the current date and time
  const now = new Date();

  // Ensure `data` exists before processing
  const sortedData = data
    ? [...data].sort((a, b) => {
        const isAActive =
          new Date(a.start_date) <= now && now <= new Date(a.end_date);
        const isBActive =
          new Date(b.start_date) <= now && now <= new Date(b.end_date);
        return isBActive - isAActive; // Active items will come first
      })
    : [];

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />

        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link
                  to="/"
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
                  Schedule
                </span>
              </li>
            </ul>
          </div>
          {isLoading ? (
            <Preloader />
          ) : (
            <div className="container-fluid dashboard-content">
              <div className="container mt-5">
                <h2 className="text-center mb-15">Schedule</h2>

                <div className="row g-20">
                  {sortedData.length === 0 ? (
                    <>No Schedule Found.</>
                  ) : (
                    sortedData.map((schedule) => {
                      const startDate = new Date(schedule.start_date);
                      const endDate = new Date(schedule.end_date);
                      const currentDate = new Date();

                      let testStatus = "upcoming"; // Default to "upcoming"
                      if (currentDate >= startDate && currentDate <= endDate) {
                        testStatus = "current"; // Ongoing if current date is between start and end
                      } else if (currentDate > endDate) {
                        testStatus = "completed"; // Completed if current date is past end date
                      }

                      // Check if the current date is within the schedule's range
                      const isActive = startDate <= now && now <= endDate;
                      return (
                        <div
                          className={`col-xxl-3 col-lg-4 col-sm-6`}
                          key={schedule.sr_no}
                        >
                          <div
                            className={`card border border-gray-100 ${
                              isActive ? "today-meeting" : ""
                            }`}
                          >
                            <div className="card-body p-8">
                              <div className="p-8">
                                <div className="flex-align gap-10">
                                  <span className="text-13 py-2 px-10 rounded-pill bg-warning-100 text-success-600 mb-16 shadow-sm">
                                    {schedule.for_who}
                                  </span>
                                  <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16 shadow-sm">
                                    {schedule.type}
                                  </span>
                                </div>
                                <h5 className="mb-8">
                                  {schedule.session_link ? (
                                    <a
                                      href={schedule.session_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {schedule.description}
                                    </a>
                                  ) : (
                                    schedule.description
                                  )}
                                </h5>
                                <div className="row gap-8">
                                  <div className="flex-align gap-4">
                                    <span className="text-sm text-main-600 d-flex">
                                      <i className="ph ph-clock" />
                                    </span>
                                    <span className="text-13 text-gray-600">
                                      <b>Starts at: </b>{" "}
                                      {formatDateInUserTimezone(
                                        schedule.start_date
                                      )}
                                    </span>
                                  </div>{" "}
                                  <div className="flex-align gap-4">
                                    <span className="text-sm text-main-600 d-flex">
                                      <i className="ph ph-clock" />
                                    </span>
                                    <span className="text-13 text-gray-600">
                                      <b>Ends at: </b>{" "}
                                      {formatDateInUserTimezone(
                                        schedule.end_date
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-between gap-4 flex-wrap mt-20">
                                  <Link
                                    to={`${
                                      schedule.type === "Test" &&
                                      testStatus === "current"
                                        ? "/exams#current"
                                        : schedule.type === "Test" &&
                                          testStatus === "completed"
                                        ? "/exams#completed"
                                        : schedule.type === "Test" &&
                                          testStatus === "upcoming"
                                        ? "/exams#upcoming"
                                        : "#"
                                    }`}
                                    className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
                                  >
                                    View Details
                                    <span className="d-flex text-xl">
                                      <i className="ph ph-arrow-right" />
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {/* <div className="card mb-10 shadow-sm">
                  <div className="card-body d-flex flex-wrap justify-content-between text-center">
                    <p className="mb-1 fw-bold col-6 col-md-2 text-md-center">
                      SR No.
                    </p>
                    <p className="mb-1 fw-bold col-6 col-md-2 text-md-center">
                      Start Date
                    </p>
                    <p className="mb-1 fw-bold col-6 col-md-2 text-md-center">
                      End Date
                    </p>
                    <p className="mb-1 fw-bold col-6 col-md-2 text-md-center">
                      Description
                    </p>
                    <p className="mb-1 fw-bold col-6 col-md-2 text-md-center">
                      Type
                    </p>
                    <p className="mb-1 fw-bold col-6 col-md-2 text-md-center">
                      For
                    </p>
                  </div>
                </div> */}

                {/* {sortedData.length === 0 ? (
                  <>No Schedule Found.</>
                ) : (
                  sortedData.map((schedule) => {
                    const startDate = new Date(schedule.start_date);
                    const endDate = new Date(schedule.end_date);

                    // Check if the current date is within the schedule's range
                    const isActive = startDate <= now && now <= endDate;

                    return (
                      <div
                        key={schedule.sr_no}
                        className={`card mb-10 ${
                          isActive ? "today-meeting" : ""
                        }`}
                      >
                        <div className="card-body d-flex flex-wrap justify-content-between align-items-center">
                          <p className="mb-1 col-6 col-md-2 text-md-center">
                            {schedule.sr_no}
                          </p>
                          <p className="mb-1 col-6 col-md-2 text-md-center">
                            {startDate.toLocaleString()}
                          </p>
                          <p className="mb-1 col-6 col-md-2 text-md-center">
                            {endDate.toLocaleString()}
                          </p>
                          <p className="mb-1 col-6 col-md-2 text-md-center">
                            {schedule.session_link ? (
                              <a
                                href={schedule.session_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {schedule.description}
                              </a>
                            ) : (
                              schedule.description
                            )}
                          </p>
                          <p className="mb-1 col-6 col-md-2 text-md-center">
                            {schedule.type}
                          </p>
                          <p className="mb-1 col-6 col-md-2 text-md-center">
                            {schedule.for_who}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )} */}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Schedule;
