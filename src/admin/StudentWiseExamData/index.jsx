import React, { useState, useMemo } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { getUsersWiseExamData } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

function StudentWiseExamData() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  // Filter state for dropdowns
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

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
    total_quiz_attempts: "",
    average_marks: "",
  });

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data: userWiseExamData, isLoading: isUserWiseExamDataLoading } =
    useQuery({
      queryKey: ["userWiseTestData"],
      queryFn: () => getUsersWiseExamData(),
    });

  // Unique filter options derived from data
  const batchOptions = useMemo(() => {
    if (!userWiseExamData) return [];

    const uniqueBatches = [
      ...new Set(userWiseExamData.map((user) => user.batch_title)),
    ];
    return uniqueBatches
      .filter((batch) => batch) // Filter out null or undefined
      .map((batch) => ({ value: batch, label: batch }));
  }, [userWiseExamData]);

  const phaseOptions = useMemo(() => {
    if (!userWiseExamData) return [];

    let filteredUsers = userWiseExamData;

    if (selectedBatch) {
      filteredUsers = filteredUsers.filter(
        (user) => user.batch_title === selectedBatch.value
      );
    }

    const uniquePhases = [
      ...new Set(filteredUsers.map((user) => user.phase_title)),
    ];
    return uniquePhases
      .filter((phase) => phase) // Filter out null or undefined
      .map((phase) => ({ value: phase, label: phase }));
  }, [userWiseExamData, selectedBatch]);

  const collegeOptions = useMemo(() => {
    if (!userWiseExamData) return [];

    let filteredUsers = userWiseExamData;

    if (selectedBatch) {
      filteredUsers = filteredUsers.filter(
        (user) => user.batch_title === selectedBatch.value
      );
    }

    if (selectedPhase) {
      filteredUsers = filteredUsers.filter(
        (user) => user.phase_title === selectedPhase.value
      );
    }

    const uniqueColleges = [
      ...new Set(filteredUsers.map((user) => user.college_name)),
    ];
    return uniqueColleges
      .filter((college) => college) // Filter out null or undefined
      .map((college) => ({ value: college, label: college }));
  }, [userWiseExamData, selectedBatch, selectedPhase]);

  const branchOptions = useMemo(() => {
    if (!userWiseExamData) return [];

    let filteredUsers = userWiseExamData;

    if (selectedBatch) {
      filteredUsers = filteredUsers.filter(
        (user) => user.batch_title === selectedBatch.value
      );
    }

    if (selectedPhase) {
      filteredUsers = filteredUsers.filter(
        (user) => user.phase_title === selectedPhase.value
      );
    }

    if (selectedCollege) {
      filteredUsers = filteredUsers.filter(
        (user) => user.college_name === selectedCollege.value
      );
    }

    const uniqueBranches = [
      ...new Set(filteredUsers.map((user) => user.branch_name)),
    ];
    return uniqueBranches
      .filter((branch) => branch) // Filter out null or undefined
      .map((branch) => {
        // Format branch name for display (convert snake_case to Title Case)
        const formattedBranch = branch
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return { value: branch, label: formattedBranch };
      });
  }, [userWiseExamData, selectedBatch, selectedPhase, selectedCollege]);

  const handleBatchChange = (selected) => {
    setSelectedBatch(selected);
    setSelectedPhase(null);
    setSelectedCollege(null);
    setSelectedBranch(null);
    setCurrentPage(1);
  };

  const handlePhaseChange = (selected) => {
    setSelectedPhase(selected);
    setSelectedCollege(null);
    setSelectedBranch(null);
    setCurrentPage(1);
  };

  const handleCollegeChange = (selected) => {
    setSelectedCollege(selected);
    setSelectedBranch(null);
    setCurrentPage(1);
  };

  const handleBranchChange = (selected) => {
    setSelectedBranch(selected);
    setCurrentPage(1);
  };

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

  // Combined filtering logic
  const filteredData = useMemo(() => {
    if (!userWiseExamData) return [];

    return userWiseExamData.filter((user) => {
      // Apply dropdown filters
      if (selectedBatch && user.batch_title !== selectedBatch.value)
        return false;
      if (selectedPhase && user.phase_title !== selectedPhase.value)
        return false;
      if (selectedCollege && user.college_name !== selectedCollege.value)
        return false;
      if (selectedBranch && user.branch_name !== selectedBranch.value)
        return false;

      // Apply column filters
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;

        const userValue = user[key];

        if (userValue === undefined || userValue === null) return false;

        // Handle date fields
        if (key === "registration_time") {
          return new Date(userValue)
            .toLocaleString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }

        // Handle numeric fields
        if (key === "average_marks" || key === "total_quiz_attempts") {
          if (!filterValue) return true;

          const { operator, value } = parseMarksFilter(filterValue);
          const userNumber = parseFloat(userValue);

          if (isNaN(value)) return true;
          if (isNaN(userNumber)) return false;

          switch (operator) {
            case ">":
              return userNumber > value;
            case ">=":
              return userNumber >= value;
            case "<":
              return userNumber < value;
            case "<=":
              return userNumber <= value;
            case "=":
              return userNumber === value;
            default:
              return true;
          }
        }

        // Default string comparison
        return String(userValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    });
  }, [
    userWiseExamData,
    selectedBatch,
    selectedPhase,
    selectedCollege,
    selectedBranch,
    columnFilters,
  ]);

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

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      marginBottom: "15px",
      borderRadius: "8px",
    }),
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
                  Student Wise Given Exam Data
                </span>
              </li>
            </ul>
          </div>

          <div className="dashboard-body">
            <div className="container-fluid dashboard-content">
              <div className="row g-4">
                <div className="container mt-5">
                  {/* Advanced filter section */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="mb-0">Advanced Filters</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <label className="form-label">Batch</label>
                          <Select
                            isClearable
                            options={batchOptions}
                            value={selectedBatch}
                            onChange={handleBatchChange}
                            placeholder="Select Batch"
                            styles={selectStyles}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Phase</label>
                          <Select
                            isClearable
                            options={phaseOptions}
                            value={selectedPhase}
                            onChange={handlePhaseChange}
                            placeholder="Select Phase"
                            styles={selectStyles}
                            isDisabled={!selectedBatch}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">College</label>
                          <Select
                            isClearable
                            options={collegeOptions}
                            value={selectedCollege}
                            onChange={handleCollegeChange}
                            placeholder="Select College"
                            styles={selectStyles}
                            isDisabled={!selectedBatch && !selectedPhase}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Branch</label>
                          <Select
                            isClearable
                            options={branchOptions}
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            placeholder="Select Branch"
                            styles={selectStyles}
                            isDisabled={!selectedCollege}
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-600">
                          <strong>Filtered:</strong> {filteredData.length}{" "}
                          students
                        </span>
                      </div>
                    </div>
                  </div>

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
                              Quiz Attempts
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="e.g. >1, <5, =3"
                                value={columnFilters.total_quiz_attempts}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "total_quiz_attempts",
                                    e.target.value
                                  )
                                }
                              />
                              <small className="text-muted">{`Use >, <, >=, <=, or =`}</small>
                            </th>
                            <th className="h6 text-gray-300">
                              Average Marks
                              <input
                                type="text"
                                className="form-control form-control-sm mt-1"
                                placeholder="e.g. >5, <10, =20"
                                value={columnFilters.average_marks}
                                onChange={(e) =>
                                  handleFilterChange(
                                    "average_marks",
                                    e.target.value
                                  )
                                }
                              />
                              <small className="text-muted">{`Use >, <, >=, <=, or =`}</small>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isUserWiseExamDataLoading ? (
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
                                      user.total_quiz_attempts > 0
                                        ? "success"
                                        : "danger"
                                    }-50 text-${
                                      user.total_quiz_attempts > 0
                                        ? "success"
                                        : "danger"
                                    }-600 d-inline-flex align-items-center gap-8 rounded-pill`}
                                  >
                                    {user.total_quiz_attempts}
                                  </span>
                                </td>
                                <td>{user.average_marks}</td>
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
                        Showing{" "}
                        {filteredData.length > 0 ? indexOfFirstEntry + 1 : 0} to{" "}
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
                            currentPage === totalPages || totalPages === 0
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link h-44 w-44 flex-center text-18 rounded-8 fw-medium"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={
                              currentPage === totalPages || totalPages === 0
                            }
                          >
                            ›
                          </button>
                        </li>
                        <li
                          className={`page-item ${
                            currentPage === totalPages || totalPages === 0
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link h-44 w-44 flex-center text-18 rounded-8 fw-medium "
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={
                              currentPage === totalPages || totalPages === 0
                            }
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

export default StudentWiseExamData;
