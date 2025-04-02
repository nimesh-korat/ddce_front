import { MathJax, MathJaxContext } from "better-react-mathjax";
import React, { useEffect } from "react";

function QuizQuestion({
  questions,
  currentQuestion,
  selectedOption,
  handleOptionSelect,
  handleSkipQuestion,
  handleNextQuestion,
  showSubmitButton,
  showPopUp,
  questionStatus,
  currentQuestionIndex,
  setSelectedOption,
}) {
  const config = {
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

  useEffect(() => {
    if (currentQuestion) {
      const currentStatus = questionStatus[currentQuestionIndex];
      if (currentStatus?.std_answer) {
        setSelectedOption({ key: "", text: currentStatus.std_answer });
      } else {
        setSelectedOption(null);
      }
    }
    // eslint-disable-next-line
  }, [currentQuestion, currentQuestionIndex, questionStatus]);

  console.log(currentQuestion);

  return (
    <MathJaxContext config={config}>
      <div className="col-md-8 order-md-1 order-2">
        <div className="card shadow-sm border-0">
          <div className="card-header border-bottom border-gray-100">
            <h5 className="mb-0">Quiz Questions</h5>
          </div>
          <div className="card-body">
            {currentQuestion ? (
              <form>
                {currentQuestion.paragraph_text && (
                  <>
                    <div className="mb-0">
                      <label
                        className="h5 mb-8 fw-semibold"
                        style={{ userSelect: "none" }}
                      >
                        Passage
                      </label>
                    </div>
                    <div className="mb-20">
                      <label
                        className="h5 mb-8 fw-semibold"
                        style={{ userSelect: "none" }}
                      >
                        {currentQuestion.paragraph_text}
                      </label>
                    </div>
                  </>
                )}
                <div className="mb-20">
                  <label
                    className="h5 mb-8 fw-semibold"
                    style={{ userSelect: "none" }}
                  >
                    <MathJax inline>{currentQuestion.question_text}</MathJax>
                  </label>
                </div>
                <div className="row g-20 " style={{ userSelect: "none" }}>
                  {["option_a", "option_b", "option_c", "option_d"].map(
                    (optionKey, index) => {
                      const optionText = currentQuestion[`${optionKey}_text`];
                      if (!optionText) return null;

                      const isSelected = selectedOption?.text === optionText;
                      return (
                        <div className="col-sm-6" key={index}>
                          <div
                            className={`py-15 px-16 rounded-8 border flex-align gap-8 cursor-pointer ${
                              isSelected
                                ? "bg-success-50 border-success"
                                : "bg-gray-50 border-main-200"
                            }`}
                            onClick={() =>
                              handleOptionSelect(optionKey, optionText)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <span className="w-24 h-24 bg-white rounded-circle flex-center text-capitalize text-14">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <MathJax inline>
                              <span className="text-gray-500">
                                {optionText}
                              </span>
                            </MathJax>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </form>
            ) : (
              <p>No more questions.</p>
            )}
            <div className="flex-align justify-content-end gap-8 mt-20">
              {!showSubmitButton && currentQuestionIndex < questions.length && (
                <>
                  <button
                    className="btn btn-warning rounded-pill py-9"
                    onClick={handleSkipQuestion}
                  >
                    Skip
                  </button>
                  <button
                    className="btn btn-main rounded-pill py-9"
                    onClick={handleNextQuestion}
                    disabled={
                      !selectedOption &&
                      questionStatus[currentQuestionIndex]?.attempt_status ===
                        "1"
                    }
                  >
                    Next
                  </button>
                </>
              )}
              {showSubmitButton && (
                <button
                  className="btn btn-danger rounded-pill py-9"
                  onClick={showPopUp}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default QuizQuestion;
