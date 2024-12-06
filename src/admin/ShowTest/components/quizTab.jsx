import React, { useState, useEffect } from "react";
import QuizCard from "./quiz";
import "./QuizTab.css"; // Make sure to import the CSS file

function QuizTab({ activeTab, setActiveTab, children, quizes }) {
  const currentDate = new Date(); // Get the current date

  const determineTestStatus = (quiz) => {
    const startDate = new Date(quiz.test_start_date);
    const endDate = new Date(quiz.test_end_date);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "ongoing"; // Ongoing if current date is between start and end
    } else if (currentDate > endDate) {
      return "completed"; // Completed if current date is past end date
    } else {
      return "upcoming"; // Default to upcoming
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page

  // Filter quizes based on the active tab and status
  const filterQuizesByStatus = (status) => {
    return quizes.filter((quiz) => determineTestStatus(quiz) === status);
  };

  // Calculate the total number of pages
  const getTotalPages = (filteredQuizes) => {
    return Math.ceil(filteredQuizes.length / itemsPerPage);
  };

  // Get the quizes for the current page
  const getCurrentPageQuizes = (filteredQuizes) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuizes.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredQuizes = filterQuizesByStatus(activeTab);
  const totalPages = getTotalPages(filteredQuizes);

  // Check if there are any quizes for the active tab
  const hasQuizes = filteredQuizes.length > 0;

  // Reset pagination to page 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when tab changes
  }, [activeTab]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-24 flex-between gap-16 flex-wrap-reverse">
          <ul
            className="nav nav-pills common-tab gap-20"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "upcoming" ? "active" : ""
                }`}
                onClick={() => setActiveTab("upcoming")}
                type="button"
                role="tab"
              >
                Up Coming
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "ongoing" ? "active" : ""
                }`}
                onClick={() => setActiveTab("ongoing")}
                type="button"
                role="tab"
              >
                Ongoing
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "completed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("completed")}
                type="button"
                role="tab"
              >
                Completed
              </button>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div className="row g-20">
            {getCurrentPageQuizes(filteredQuizes).map((quiz, index) => (
              <QuizCard
                key={index}
                test={quiz}
                testStatus={determineTestStatus(quiz)}
              />
            ))}
            {!hasQuizes && <p>No quizzes found.</p>}
          </div>

          {/* Show Pagination only if there are quizes to display */}
          {hasQuizes && (
            <div className="pagination-controls">
              <button
                className="pagination-button btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt; Prev
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-button btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizTab;
