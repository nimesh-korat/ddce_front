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

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["schedule"],
  //   queryFn: getActiveScheduleForStudent,
  // });

  const isLoading = false;
  const isError = false;
  const error = null;
  const data = [
    {
      sr_no: 1,
      for_who: "Online",
      type: "Session",
      description: "Session - Mathematics",
      start_date: "2025-03-21T11:58:00.000Z",
      end_date: "2025-03-21T13:58:00.000Z",
      session_link: "",
    },
    {
      sr_no: 2,
      for_who: "Offline",
      type: "Test",
      description: "Quiz - Mathematics",
      start_date: "2025-03-20T13:30:00.000Z",
      end_date: "2025-03-20T15:30:00.000Z",
      session_link: "",
    },
    {
      sr_no: 3,
      for_who: "Online",
      type: "Session",
      description: "Session - English",
      start_date: "2025-03-19T02:05:00.000Z",
      end_date: "2025-01-19T09:05:00.000Z",
      session_link: "",
    },
    {
      sr_no: 4,
      for_who: "Online",
      type: "Session",
      description: "Session - Mathematics",
      start_date: "2025-03-18T12:30:00.000Z",
      end_date: "2025-03-18T13:30:00.000Z",
      session_link: "",
    },
    {
      sr_no: 5,
      for_who: "Online",
      type: "Session",
      description: "Session - Physics",
      start_date: "2025-03-18T11:50:00.000Z",
      end_date: "2025-03-18T12:50:00.000Z",
      session_link: "",
    },
    {
      sr_no: 6,
      for_who: "Online",
      type: "Test",
      description: "Quiz - English",
      start_date: "2025-03-17T16:31:00.000Z",
      end_date: "2025-03-17T18:31:00.000Z",
      session_link: "",
    },
    {
      sr_no: 7,
      for_who: "Online",
      type: "Session",
      description: "Session - English",
      start_date: "2025-03-16T13:35:00.000Z",
      end_date: "2025-03-16T14:35:00.000Z",
      session_link: "",
    },
    {
      sr_no: 8,
      for_who: "Offline",
      type: "Session",
      description: "Session - Chemistry",
      start_date: "2025-03-15T12:16:00.000Z",
      end_date: "2025-03-15T14:16:00.000Z",
      session_link: "",
    },
    {
      sr_no: 9,
      for_who: "Offline",
      type: "Test",
      description: "Quiz - Chemistry",
      start_date: "2025-03-14T14:47:00.000Z",
      end_date: "2025-03-14T16:47:00.000Z",
      session_link: "",
    },
    {
      sr_no: 10,
      for_who: "Offline",
      type: "Test",
      description: "Quiz - Reasoning",
      start_date: "2025-03-13T09:30:00.000Z",
      end_date: "2025-03-13T11:30:00.000Z",
      session_link: "",
    },
    {
      sr_no: 11,
      for_who: "Online",
      type: "Session",
      description: "Session - Reasoning",
      start_date: "2025-03-12T15:38:00.000Z",
      end_date: "2025-03-12T17:38:00.000Z",
      session_link: "",
    },
    {
      sr_no: 12,
      for_who: "Online",
      type: "Test",
      description: "Quiz - Mathematics",
      start_date: "2025-03-11T15:50:00.000Z",
      end_date: "2025-03-11T17:50:00.000Z",
      session_link: "",
    },
    {
      sr_no: 13,
      for_who: "Online",
      type: "Test",
      description: "Quiz - Mathematics",
      start_date: "2025-03-10T11:36:00.000Z",
      end_date: "2025-03-10T12:36:00.000Z",
      session_link: "",
    },
    {
      sr_no: 14,
      for_who: "Online",
      type: "Session",
      description: "Session - Mathematics",
      start_date: "2025-03-09T13:28:00.000Z",
      end_date: "2025-03-09T14:28:00.000Z",
      session_link: "",
    },
    {
      sr_no: 15,
      for_who: "Online",
      type: "Test",
      description: "Quiz - Mathematics",
      start_date: "2025-03-08T13:10:00.000Z",
      end_date: "2025-03-08T14:10:00.000Z",
      session_link: "",
    },
    {
      sr_no: 16,
      for_who: "Offline",
      type: "Test",
      description: "Quiz - Mathematics",
      start_date: "2025-01-07T09:00:00.000Z",
      end_date: "2025-01-07T11:00:00.000Z",
      session_link: "",
    },
    {
      sr_no: 17,
      for_who: "Online",
      type: "Test",
      description: "Quiz - Chemistry",
      start_date: "2025-04-06T16:59:00.000Z",
      end_date: "2025-04-06T17:59:00.000Z",
      session_link: "",
    },
    {
      sr_no: 18,
      for_who: "Offline",
      type: "Test",
      description: "Quiz - English",
      start_date: "2025-03-07T14:30:00.000Z",
      end_date: "2025-03-07T16:30:00.000Z",
      session_link: "",
    },
    {
      sr_no: 19,
      for_who: "Offline",
      type: "Test",
      description: "Quiz - Mathematics",
      start_date: "2025-03-06T09:56:00.000Z",
      end_date: "2025-03-06T11:56:00.000Z",
      session_link: "",
    },
    {
      sr_no: 20,
      for_who: "Offline",
      type: "Session",
      description: "Session - Reasoning",
      start_date: "2025-03-05T11:14:00.000Z",
      end_date: "2025-03-05T12:14:00.000Z",
      session_link: "",
    },
  ];

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
                                  {schedule.type === "Test" ? (
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
                                  ) : schedule.type === "Session" ? (
                                    <a
                                      href={schedule.session_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-outline-main
                                      rounded-pill py-9 flex-align gap-4"
                                    >
                                      Join Session
                                      <span className="d-flex text-xl">
                                        <i className="ph ph-arrow-right" />
                                      </span>
                                    </a>
                                  ) : null}
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
