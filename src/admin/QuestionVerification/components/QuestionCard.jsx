import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect, useMemo } from "react";
import { verifyQuestion } from "../../../apis/apis";
import { MathJax, MathJaxContext } from "better-react-mathjax";

function AdminVerifyQuestionCard({ questions = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  // Safeguard: Save currentIndex in localStorage to avoid resets
  useEffect(() => {
    const savedIndex = localStorage.getItem("currentIndex");
    if (savedIndex) setCurrentIndex(Number(savedIndex));
  }, []);

  useEffect(() => {
    localStorage.setItem("currentIndex", currentIndex);
  }, [currentIndex]);

  const isLastQuestion = currentIndex >= questions.length;

  const currentQuestion = useMemo(
    () => questions[currentIndex] || {},
    [questions, currentIndex]
  );

  console.log("Current Question:", currentQuestion);
  

  const verifyQuestionMutation = useMutation({
    mutationKey: ["verifyQuestion"],
    mutationFn: (data) => verifyQuestion(data),
    onSuccess: () => {
      console.log("Question verified successfully");

      setShowDropdown(false);
      setShowSubmit(false);
      setSelectedOption("");

      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < questions.length ? prevIndex + 1 : prevIndex
      );
    },
    onError: (error) => console.log("Error verifying question:", error),
  });

  const logAndProceed = (isCorrect) => {
    verifyQuestionMutation.mutate({
      question_id: currentQuestion.question_id,
      is_correct: isCorrect,
      correct_answer: selectedOption,
    });
  };

  if (isLastQuestion) {
    return (
      <div className="card question-card shadow">
        <div className="card-body">
          <div className="col-md-12">
            <div className="d-flex justify-content-center">
              <p className="text-center text-muted">
                No questions available for this subtopic
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <MathJaxContext config={config}>
      <div className="card question-card shadow">
        <div className="card-body">
          <h5 className="card-title d-flex">
           <MathJax inline> {currentIndex + 1}.{" "}
            {currentQuestion.question_text || "N/A"}</MathJax>
            {currentQuestion.question_marks !== undefined && (
              <span className="text-success-600 text-12 text-end ms-auto">
                ({currentQuestion.question_marks} marks)
              </span>
            )}
          </h5>
          <div className="container px-0">
            <div className="row question-row-gap">
              {["A", "B", "C", "D"].map((label) => {
                const optionKey = `option_${label.toLowerCase()}_text`;
                return (
                  <div className="col-6" key={label}>
                    <div className="option-card">
                      <div className="question-bullet-icon">{label}</div>

                      <MathJax inline>
                        {" "}
                        <span>{currentQuestion[optionKey] || "N/A"}</span>
                      </MathJax>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="row mt-5">
              <div className="col-12 text-end">
                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => setShowDropdown(true)}
                >
                  Incorrect
                </button>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => logAndProceed(true)}
                >
                  Correct
                </button>
              </div>
            </div>
            {showDropdown && (
              <div className="mt-5">
                <select
                  className="form-select"
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    setShowSubmit(true);
                  }}
                >
                  <option value="" disabled>
                    -- Select the Correct Option --
                  </option>
                  {["A", "B", "C", "D"].map((label) => {
                    const optionKey = `option_${label.toLowerCase()}_text`;
                    return (
                      <option key={label} value={currentQuestion[optionKey]}>
                        {label}. {currentQuestion[optionKey]}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {showSubmit && (
              <div className="mt-3 text-end">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => logAndProceed(false)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default AdminVerifyQuestionCard;
