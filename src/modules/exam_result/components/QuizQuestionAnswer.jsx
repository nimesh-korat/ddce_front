import React from "react";

const QuizQuestionsAnswer = ({ questionData, filterType }) => {
  // Filter the questions based on the filterType (all, correct, incorrect, or skipped)
  const filteredQuestions = questionData.filter((question) => {
    if (filterType === "all") return true;
    if (filterType === "correct" && question.is_correct === "1") return true;
    if (filterType === "incorrect" && question.is_correct === "0") return true;
    if (filterType === "skipped" && question.is_correct === "2") return true;
    return false;
  });

  return (
    <div className="col-md-8 order-md-1 order-2">
      <div className="card">
        <div className="card-header border-bottom border-gray-100">
          <h5 className="mb-0">Quiz Questions</h5>
        </div>
        <div className="card-body">
          {/* Loop through the filtered questions and display each one */}
          {filteredQuestions.map((question, index) => (
            <div key={index} className="mb-20">
              <label className="h5 mb-8 fw-semibold">
                {index + 1}. {question.question_text}
              </label>
              {/* Show "Skipped" if the question was skipped */}
              {question.is_correct === "2" && (
                <span className="text-warning-600 text-15 fw-semibold">
                  &nbsp;(Skipped)
                </span>
              )}
              <div className="row g-20">
                {/* Loop through the options (a, b, c, d) and display them */}
                {["a", "b", "c", "d"].map((option, i) => {
                  const optionText = question[`option_${option}_text`];
                  const isCorrect = question.answer_text === optionText;
                  const isSelected = question.std_answer === optionText;
                  return (
                    <div className="col-sm-6" key={i}>
                      <div
                        className={`py-15 px-16 rounded-8 border flex-align gap-8 cursor-pointer ${
                          // Highlight the option as correct or selected (incorrect)
                          isCorrect
                            ? "bg-success-200" // Correct answer is highlighted in green
                            : isSelected
                            ? "bg-danger-200" // Incorrect answer is highlighted in red
                            : ""
                        } border-main-200`}
                      >
                        {/* Display the option label (A, B, C, D) */}
                        <span className="w-24 h-24 bg-white rounded-circle flex-center text-capitalize text-14">
                          {option.toUpperCase()}
                        </span>
                        <span className="text-gray-500">{optionText}</span>
                        {/* Show a check icon for the correct answer */}
                        {isCorrect && (
                          <i className="ph-fill ph-check-circle text-success-600 text-xl ms-auto d-flex"></i>
                        )}
                        {/* Show an "X" icon for the selected incorrect answer */}
                        {isSelected && !isCorrect && (
                          <i className="ph-fill ph-x-circle text-danger-600 text-xl ms-auto d-flex"></i>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionsAnswer;
