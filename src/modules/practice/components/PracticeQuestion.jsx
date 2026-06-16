import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const mathConfig = {
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  messageStyle: "none",
};

function PracticeQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
  answerResult,
  onSubmit,
  onNext,
  isSubmitting,
}) {
  const answered = !!answerResult;
  const isCorrect = answerResult?.is_correct === "1";
  const correctAnswer = answerResult?.correct_answer;

  const options = [
    {
      label: "A",
      text: question.option_a_text,
      image: question.option_a_image,
    },
    {
      label: "B",
      text: question.option_b_text,
      image: question.option_b_image,
    },
    {
      label: "C",
      text: question.option_c_text,
      image: question.option_c_image,
    },
    {
      label: "D",
      text: question.option_d_text,
      image: question.option_d_image,
    },
  ];

  const getOptionStyle = (opt) => {
    const value = opt.text || opt.image;
    if (!answered) {
      // Before answer: highlight selected in blue
      return selectedAnswer === value
        ? "border-main-600 bg-main-50"
        : "border-gray-200 bg-white hover-bg-gray-50";
    }
    // After answer
    if (value === correctAnswer) return "border-success-600 bg-success-50"; // correct = green
    if (value === answerResult?.std_answer && value !== correctAnswer)
      return "border-danger-600 bg-danger-50"; // student's wrong = red
    return "border-gray-100 bg-gray-50"; // others = normal
  };

  const diffBadge = (d) => {
    const map = {
      Easy: "bg-success-50 text-success-600",
      Medium: "bg-info-50 text-info-600",
      Hard: "bg-warning-50 text-warning-600",
      "Time Consuming": "bg-danger-50 text-danger-600",
    };
    return map[d] || "bg-gray-50 text-gray-500";
  };

  return (
    <MathJaxContext config={mathConfig}>
      <div className="card border border-gray-100 shadow-sm">
        <div className="card-body p-28">
          {/* Question header */}
          {/* <div className="flex-between mb-16">
            <div className="flex-align gap-8">
              {question.subject_name && (
                <span className="text-12 bg-main-50 text-main-600 py-2 px-10 rounded-pill fw-medium">
                  {question.subject_name}
                </span>
              )}
              {question.question_difficulty && (
                <span className={`text-12 py-2 px-10 rounded-pill fw-medium ${diffBadge(question.question_difficulty)}`}>
                  {question.question_difficulty}
                </span>
              )}
            </div>
            <span className="text-12 text-gray-400 fw-medium">
              {question.assignment_title}
            </span>
          </div> */}

          {/* After-submit feedback banner */}
          {answered && (
            <div
              className={`p-12 rounded-10 mb-20 flex-align gap-10 ${isCorrect ? "bg-success-50 border border-success-200" : "bg-danger-50 border border-danger-200"}`}
            >
              <i
                className={`ph text-20 ${isCorrect ? "ph-check-circle text-success-600" : "ph-x-circle text-danger-600"}`}
              />
              <span
                className={`fw-semibold text-15 ${isCorrect ? "text-success-700" : "text-danger-700"}`}
              >
                {isCorrect
                  ? "Correct! Well done."
                  : "Incorrect. Don't worry, review the correct answer."}
              </span>
            </div>
          )}

          {/* Question text */}
          <div className="mb-20">
            <h6 className="fw-medium text-gray-800 text-16 mb-12 lh-base">
              <MathJax dynamic inline>
                {question.question_text}
              </MathJax>
            </h6>
            {question.question_image && (
              <img
                src={question.question_image}
                alt="question"
                style={{
                  maxHeight: "220px",
                  objectFit: "contain",
                  borderRadius: "10px",
                  marginTop: "8px",
                }}
              />
            )}
          </div>

          {/* Options */}
          <div className="d-flex flex-column gap-10 mb-24">
            {options.map((opt) => {
              const value = opt.text || opt.image;
              if (!value) return null;
              const style = getOptionStyle(opt);
              const isSelectedOpt = selectedAnswer === value;
              const isCorrectOpt = answered && value === correctAnswer;
              const isWrongOpt =
                answered &&
                value === answerResult?.std_answer &&
                value !== correctAnswer;

              return (
                <button
                  key={opt.label}
                  className={`d-flex align-items-center gap-14 p-14 rounded-10 border-2 w-100 text-start transition-2 ${style} ${answered ? "cursor-default" : "cursor-pointer"}`}
                  onClick={() => !answered && setSelectedAnswer(value)}
                  disabled={answered}
                  style={{ border: "2px solid", background: "none" }}
                >
                  {/* Option letter circle */}
                  <span
                    className={`w-32 h-32 rounded-circle d-flex align-items-center justify-content-center fw-semibold text-14 flex-shrink-0 ${
                      isCorrectOpt
                        ? "bg-success-600 text-white"
                        : isWrongOpt
                          ? "bg-danger-600 text-white"
                          : isSelectedOpt && !answered
                            ? "bg-main-600 text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </span>

                  {/* Option content */}
                  <span className="flex-grow-1 text-14 fw-medium">
                    {opt.text && (
                      <MathJax dynamic inline>
                        {opt.text}
                      </MathJax>
                    )}
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt={`option-${opt.label}`}
                        style={{
                          maxHeight: "80px",
                          objectFit: "contain",
                          display: "block",
                          marginTop: "4px",
                        }}
                      />
                    )}
                  </span>

                  {/* Result icon */}
                  {answered && isCorrectOpt && (
                    <i className="ph-fill ph-check-circle text-success-600 text-20 flex-shrink-0" />
                  )}
                  {answered && isWrongOpt && (
                    <i className="ph-fill ph-x-circle text-danger-600 text-20 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex-between">
            {/* <div>
              {!answered && (
                <p className="text-13 text-gray-400 mb-0">
                  <i className="ph ph-info me-4" />
                  Select an option and click Submit
                </p>
              )}
            </div> */}
            <div className="flex-align gap-12">
              {!answered ? (
                <button
                  className="btn btn-main rounded-pill py-10 px-32 flex-align gap-8"
                  onClick={onSubmit}
                  disabled={!selectedAnswer || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-6" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ph ph-paper-plane-tilt" />
                      Submit
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="btn btn-main rounded-pill py-10 px-32 flex-align gap-8"
                  onClick={onNext}
                >
                  Next Question <i className="ph ph-arrow-right" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default PracticeQuestion;
