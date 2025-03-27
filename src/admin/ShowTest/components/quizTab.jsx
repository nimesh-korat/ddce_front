import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import QuizCard from "./quiz";
import "./QuizTab.css";

function QuizTab({ quizes }) {
  const currentDate = new Date();

  // Determine test status based on start and end dates
  const determineTestStatus = (quiz) => {
    const startDate = new Date(quiz.test_start_date);
    const endDate = new Date(quiz.test_end_date);

    if (quiz.isAssigned === 0) {
      return "batch_not_assigned";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "ongoing";
    } else if (currentDate > endDate) {
      return "completed";
    } else {
      return "upcoming";
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Add test status to each quiz for display
  const quizesWithStatus = quizes.map((quiz) => ({
    ...quiz,
    testStatus: determineTestStatus(quiz),
  }));

  // Paginate all tests
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageQuizes = quizesWithStatus.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(quizesWithStatus.length / itemsPerPage);

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="mb-4">All Tests</h3>
        <div className="row g-20">
          {currentPageQuizes.map((quiz, index) => (
            <QuizCard key={index} test={quiz} testStatus={quiz.testStatus} />
          ))}
          {quizesWithStatus.length === 0 && <p>No tests available.</p>}
        </div>

        {quizesWithStatus.length > 0 && (
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
  );
}

export default QuizTab;
