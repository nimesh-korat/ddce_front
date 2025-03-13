import React from "react";

function QuestionSummary({
  questions,
  questionStatus,
  currentQuestionIndex,
  handleQuestionNavigation,
}) {
  return (
    <div className="col-md-4 order-md-2 order-1 ">
      <div className="card shadow-sm border-0" style={{ minHeight: "100%" }}>
        {/* Card Header */}
        <div className="card-header border-bottom border-gray-100">
          <h5 className="mb-0">Total Questions</h5>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column p-3">
          {/* Questions Grid */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="d-flex flex-wrap justify-content-start align-items-start justify-content-space-around"
              style={{ maxWidth: "92%" }}
            >
              {questions.map((_, index) => {
                const status = questionStatus[index]?.attempt_status;
                const bgColor =
                  index === currentQuestionIndex
                    ? "bg-info"
                    : status === "0"
                    ? "bg-secondary"
                    : status === "skipped"
                    ? "bg-warning"
                    : "bg-light";

                const textColor =
                  index === currentQuestionIndex || status !== "0"
                    ? "text-dark"
                    : "text-white";

                return (
                  <div
                    key={index}
                    className={`border text-center rounded-circle m-1 ${textColor} ${bgColor} shadow-sm`}
                    style={{
                      width: "50px",
                      height: "50px",
                      lineHeight: "50px",
                      fontSize: "16px",
                      cursor: "pointer",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    title={`Question ${index + 1}`}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => handleQuestionNavigation(index)}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend Section */}
          <div className="mt-auto border-top border-gray-100 p-3">
            <div className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle bg-info me-2 shadow-sm"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              ></div>
              <span className="text-muted">Current Question</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle bg-warning me-2 shadow-sm"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              ></div>
              <span className="text-muted">Skipped Question</span>
            </div>
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-secondary me-2 shadow-sm"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              ></div>
              <span className="text-muted">Attempted Question</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionSummary;
