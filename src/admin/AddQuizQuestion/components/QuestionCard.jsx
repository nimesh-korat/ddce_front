import { MathJax, MathJaxContext } from "better-react-mathjax";
import React, { forwardRef } from "react";

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

const AdminAddQuizQuestionCard = forwardRef(
  (
    {
      index,
      question,
      questionImg,
      option1,
      option2,
      option3,
      option4,
      optionImg1,
      optionImg2,
      optionImg3,
      optionImg4,
      answer,
      isAsked,
      question_marks,
      onAction,
      actionLabel,
    },
    ref
  ) => (
    <MathJaxContext config={config}>
      <div className="card question-card shadow" ref={ref}>
        <div className="card-body">
          <h5 className="card-title d-flex ">
            <span style={{ fontSize: "16px" }}>
              {index}. <MathJax inline>{question}</MathJax>
            </span>
            <span className="text-warning-600 text-12">
              {isAsked ? "(asked)" : ""}
            </span>
            <span className="text-success-600 text-12 text-end ms-auto">
              {question_marks ? "(" + question_marks + " marks)" : ""}
            </span>
          </h5>
          {questionImg && (
            <img
              className="question-image"
              style={{
                width: "auto",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
              src={questionImg}
              alt="question"
            />
          )}
          <div className="container px-0">
            <div className="row question-row-gap">
              <div className="col-6">
                <div className="option-card">
                  <div className="question-bullet-icon">A</div>
                  {optionImg1 === null ? (
                    <MathJax inline>
                      <span>{option1}</span>
                    </MathJax>
                  ) : (
                    <img src={optionImg1} alt={option1} />
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="option-card">
                  <div className="question-bullet-icon">B</div>
                  {optionImg2 === null ? (
                    <MathJax inline>
                      <span>{option2}</span>
                    </MathJax>
                  ) : (
                    <img src={optionImg2} alt={option2} />
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="option-card">
                  <div className="question-bullet-icon">C</div>
                  {optionImg3 === null ? (
                    <MathJax inline>
                      <span>{option3}</span>
                    </MathJax>
                  ) : (
                    <img src={optionImg3} alt={option3} />
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="option-card">
                  <div className="question-bullet-icon">D</div>
                  {optionImg4 === null ? (
                    <MathJax inline>
                      <span>{option4}</span>
                    </MathJax>
                  ) : (
                    <img src={optionImg4} alt={option4} />
                  )}
                </div>
              </div>
            </div>
            <div className="correct-answer-section">
              <div className="icon">✔</div>
              <div>
                The correct answer is{" "}
                <MathJax inline>
                  <strong>{answer}</strong>
                </MathJax>
                .
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-12 text-end">
                <button
                  className={`btn btn-sm ${
                    actionLabel === "Remove" ? "btn-danger" : "btn-primary"
                  }`}
                  onClick={onAction}
                >
                  {actionLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  )
);

export default AdminAddQuizQuestionCard;
