import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import StudentQuizCard from "./StudentQuizCard";

function StudentQuizTab({ activeTab, setActiveTab, quizes }) {
  const currentDate = new Date(new Date().toISOString()); // UTC current time
  const determineTestStatus = (quiz) => {
    const startDate = new Date(quiz.start_date);
    const endDate = new Date(quiz.end_date);

    if (currentDate >= startDate && currentDate <= endDate) {
      return "current";
    } else if (currentDate > endDate) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of items to display per page

  // Filter quizzes based on the active tab and status
  const filterQuizesByStatus = (status) => {
    const filtered = quizes.filter(
      (quiz) => determineTestStatus(quiz) === status
    );

    // Sort filtered quizzes
    if (status === "upcoming" || status === "current") {
      return filtered.sort(
        (a, b) => new Date(a.start_date) - new Date(b.start_date)
      ); // Ascending order by start date
    } else if (status === "completed") {
      return filtered.sort(
        (a, b) => new Date(b.end_date) - new Date(a.end_date)
      ); // Descending order by end date
    }

    return filtered;
  };

  // Get quizzes for the current page
  const getCurrentPageQuizes = (filteredQuizes) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuizes.slice(startIndex, endIndex);
  };

  const filteredQuizes = filterQuizesByStatus(activeTab);
  const totalPages = Math.ceil(filteredQuizes.length / itemsPerPage);

  // Reset pagination to page 1 when activeTab changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when tab changes
  }, [activeTab]);

  // Check if there are any quizzes for the active tab
  const hasQuizes = filteredQuizes.length > 0;

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-24 flex-between gap-16 flex-wrap-reverse">
          {activeTab === "upcoming" ? (
            <h4 className="mb-0">Upcoming Quizzes</h4>
          ) : activeTab === "current" ? (
            <h4 className="mb-0">Current Quizzes</h4>
          ) : (
            <h4 className="mb-0">Completed Quizzes</h4>
          )}
        </div>
        <div className="tab-content">
          <div className="row g-20">
            {getCurrentPageQuizes(filteredQuizes)
              .reverse()
              .map((quiz, index) => (
                <StudentQuizCard
                  key={index}
                  test={quiz}
                  testStatus={determineTestStatus(quiz)}
                />
              ))}
            {!hasQuizes && <p>No quizzes found.</p>}
          </div>

          {/* Show Pagination only if there are quizzes to display */}
          {hasQuizes && (
            <div className="pagination-controls">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                variant="outlined"
                color="primary"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentQuizTab;
