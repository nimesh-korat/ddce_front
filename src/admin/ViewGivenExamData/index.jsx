import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { getTestNames, getUsersWithExamData } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

function ViewGivenExamData() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  // Individual column filters
  const [columnFilters, setColumnFilters] = useState({
    name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    gender: "",
    enrollment_no: "",
    college_name: "",
    branch_name: "",
    semester: "",
    registration_time: "",
    isAttempted: "",
    obtained_marks: "",
    result_generated_on: "",
  });

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data: testnames, isLoading: isloadingtestnames } = useQuery({
    queryKey: ["test_names"],
    queryFn: getTestNames,
  });

  const testOptions =
    testnames?.map((test) => ({
      value: test.test_id,
      label: test.test_name,
    })) || [];

  const { data: userWithExamData, isLoading: isUserWithExamData } = useQuery({
    queryKey: ["userWithTestData", selectedTestId],
    queryFn: () => getUsersWithExamData(selectedTestId),
    enabled: !!selectedTestId,
  });
  const parseMarksFilter = (filter) => {
    if (!filter) return { operator: null, value: null };

    const operators = [">=", "<=", ">", "<", "="];
    for (const op of operators) {
      if (filter.startsWith(op)) {
        const value = filter.slice(op.length).trim();
        return {
          operator: op,
          value: parseFloat(value),
        };
      }
    }

    // Default to "=" if no operator specified
    return {
      operator: "=",
      value: parseFloat(filter),
    };
  };

  // Handle filter change
  const handleFilterChange = (columnName, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnName]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Filter data based on all column filters
  const filteredData = userWithExamData
    ? userWithExamData.filter((user) => {
        return Object.entries(columnFilters).every(([key, filterValue]) => {
          if (!filterValue) return true;

          const userValue =
            key === "obtained_marks"
              ? user.exam_data?.obtained_marks
              : key === "result_generated_on"
              ? user.exam_data?.result_generated_on
              : user[key];

          if (userValue === undefined || userValue === null) return false;

          // Handle date fields
          if (key === "registration_time" || key === "result_generated_on") {
            return new Date(userValue)
              .toLocaleString()
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          }

          // Handle numeric fields
          if (key === "obtained_marks") {
            if (!filterValue) return true;

            const { operator, value } = parseMarksFilter(filterValue);
            const userMarks = parseFloat(user.exam_data?.obtained_marks);

            if (isNaN(value)) return true;
            if (isNaN(userMarks)) return false;

            switch (operator) {
              case ">":
                return userMarks > value;
              case ">=":
                return userMarks >= value;
              case "<":
                return userMarks < value;
              case "<=":
                return userMarks <= value;
              case "=":
                return userMarks === value;
              default:
                return true;
            }
          }

          // Handle boolean/Yes-No fields
          if (key === "isAttempted") {
            return userValue.toLowerCase().includes(filterValue.toLowerCase());
          }

          // Default string comparison
          return String(userValue)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        });
      })
    : [];

  // Pagination Logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const paginatedData = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Add this function to generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    // Always show first page
    items.push(1);

    // Add ellipsis if needed before current page range
    if (currentPage - halfVisiblePages > 2) {
      items.push("...");
    }

    // Calculate start and end of visible pages
    let startPage = Math.max(2, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisiblePages);

    // Adjust if we're near the start or end
    if (currentPage <= halfVisiblePages + 1) {
      endPage = Math.min(maxVisiblePages, totalPages - 1);
    } else if (currentPage >= totalPages - halfVisiblePages) {
      startPage = Math.max(totalPages - maxVisiblePages + 1, 2);
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        items.push(i);
      }
    }

    // Add ellipsis if needed after current page range
    if (currentPage + halfVisiblePages < totalPages - 1) {
      items.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };
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
                  Given Exam Data
                </span>
              </li>
            </ul>
          </div>

          <div className="dashboard-body">
            <div className="container-fluid dashboard-content">
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="col-md-4">
                    <Select
                      options={testOptions}
                      placeholder="Select Test"
                      isClearable
                      isLoading={isloadingtestnames}
                      onChange={(selectedOption) =>
                        setSelectedTestId(selectedOption?.value || null)
                      }
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "42px",
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>

              <div className="row pt-10">
                <div className="container mt-5">
                  <div className="card overflow-hidden">
                    <div className="card-body p-0 overflow-x-auto">
                      <table
                        id="studentTable"
                        className="table table-hover table-bordered"
                      >
                        <thead>
                          <tr>
                            <th className="h6 text-gray-300">Index</th>
                            <th className="h6 text-gray-300">
                              Students
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.name}
                                onChange={(e) =>
                                  handleFilterChange("name", e.target.value)
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Email ID
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.email}
                                onChange={(e) =>
                                  handleFilterChange("email", e.target.value)
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Phone No
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.phone_number}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "phone_number",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Wp No
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.whatsapp_number}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "whatsapp_number",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Gender
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.gender}
                                onChange={(e) =>
                                  handleFilterChange("gender", e.target.value)
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Enrollment_No
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.enrollment_no}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "enrollment_no",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              College_Name
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.college_name}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "college_name",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Branch_Name
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.branch_name}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "branch_name",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Semester
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.semester}
                                onChange={(e) =>
                                  handleFilterChange("semester", e.target.value)
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Registed On
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.registration_time}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "registration_time",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Quiz Attempted?
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.isAttempted}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "isAttempted",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                            <th className="h6 text-gray-300">
                              Marks Obtained
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="e.g. >5, <10, =20"
                                value={columnFilters.obtained_marks}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "obtained_marks",
                                    e.target.value
                                  )
                                }
                              />
                              <small className="text-muted">{`Use >, <, >=, <=, or =`}</small>
                            </th>
                            <th className="h6 text-gray-300">
                              Attempted On
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="Filter..."
                                value={columnFilters.result_generated_on}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "result_generated_on",
                                    e.target.value
                                  )
                                }
                              />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isUserWithExamData ? (
                            <tr>
                              <td colSpan="14" className="text-center">
                                Loading...
                              </td>
                            </tr>
                          ) : paginatedData?.length > 0 ? (
                            paginatedData.map((user, index) => (
                              <tr key={user.id}>
                                <td>{indexOfFirstEntry + index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone_number}</td>
                                <td>{user.whatsapp_number}</td>
                                <td>{user.gender || "N/A"}</td>
                                <td>{user.enrollment_no || "N/A"}</td>
                                <td>{user.college_name || "N/A"}</td>
                                <td>{user.branch_name || "N/A"}</td>
                                <td>{user.semester || "N/A"}</td>
                                <td>
                                  {new Date(
                                    user.registration_time
                                  ).toLocaleString()}
                                </td>
                                <td className="text-center">
                                  <span
                                    className={`text-13 py-2 px-8 bg-${
                                      user.isAttempted === "Yes"
                                        ? "success"
                                        : "danger"
                                    }-50 text-${
                                      user.isAttempted === "Yes"
                                        ? "success"
                                        : "danger"
                                    }-600 d-inline-flex align-items-center gap-8 rounded-pill`}
                                  >
                                    {user.isAttempted}
                                  </span>
                                </td>
                                <td>
                                  {user.exam_data
                                    ? user.exam_data.obtained_marks
                                    : "N/A"}
                                </td>
                                <td>
                                  {user.exam_data
                                    ? new Date(
                                        user.exam_data.result_generated_on
                                      ).toLocaleString()
                                    : "N/A"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="14" className="text-center">
                                No data found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="card-footer flex-between flex-wrap">
                      <span className="text-gray-900">
                        Showing {indexOfFirstEntry + 1} to{" "}
                        {Math.min(indexOfLastEntry, filteredData.length)} of{" "}
                        {filteredData.length} entries
                      </span>
                      <ul className="pagination flex-align flex-wrap">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link h-44 w-44 flex-center text-18 rounded-8 fw-medium"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            «
                          </button>
                        </li>
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link h-44 w-44 flex-center text-18 rounded-8 fw-medium"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            ‹
                          </button>
                        </li>

                        {getPaginationItems().map((item, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              item === currentPage ? "active" : ""
                            } ${item === "..." ? "disabled" : ""}`}
                          >
                            {item === "..." ? (
                              <span className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium">
                                ...
                              </span>
                            ) : (
                              <button
                                className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                                onClick={() => setCurrentPage(item)}
                              >
                                {item}
                              </button>
                            )}
                          </li>
                        ))}

                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link h-44 w-44 flex-center text-18 rounded-8 fw-medium"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            ›
                          </button>
                        </li>
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link h-44 w-44 flex-center text-18 rounded-8 fw-medium "
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                          >
                            »
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewGivenExamData;
