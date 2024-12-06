import React from "react";

function QuestionSummary({ questions, questionStatus, currentQuestionIndex }) {
  return (
    <div className="col-md-4">
      <div className="card">
        {/* Full height card */}
        <div className="card-header border-bottom border-gray-100">
          <h5 className="mb-0">Total Questions</h5>
        </div>
        <div className="card-body d-flex justify-content-center">
          <div className="d-flex flex-wrap justify-content-start">
            {questions.map((_, index) => {
              const status = questionStatus[index]?.attempt_status;
              const bgColor =
                index === currentQuestionIndex
                  ? "bg-info-300"
                  : status === "attempted"
                  ? "bg-success-300"
                  : status === "skipped"
                  ? "bg-warning-300"
                  : "bg-gray-50";
              return (
                <div
                  key={index}
                  className={`border text-center rounded-8 m-2 ${bgColor}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    lineHeight: "50px",
                  }}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionSummary;
