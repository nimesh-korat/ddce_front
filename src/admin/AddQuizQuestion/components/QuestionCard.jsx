import React, { forwardRef } from "react";

const AdminAddQuizQuestionCard = forwardRef(
  (
    {
      question_id,
      index,
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      isAsked,
      question_marks,
      onAction,
      actionLabel,
    },
    ref
  ) => (
    <div className="card question-card shadow" ref={ref}>
      <div className="card-body">
        <h5 className="card-title d-flex ">
          <span style={{ fontSize: "16px" }}>
            {index}. {question}{" "}
          </span>
          <span className="text-warning-600 text-12">
            {isAsked ? "(asked)" : ""}
          </span>
          <span className="text-success-600 text-12 text-end ms-auto">
            {question_marks ? "(" + question_marks + " marks)" : ""}
          </span>
        </h5>
        <div className="container px-0">
          <div className="row question-row-gap">
            <div className="col-6">
              <div className="option-card">
                <div className="question-bullet-icon">A</div>
                <span>{option1}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="option-card">
                <div className="question-bullet-icon">B</div>
                <span>{option2}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="option-card">
                <div className="question-bullet-icon">C</div>
                <span>{option3}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="option-card">
                <div className="question-bullet-icon">D</div>
                <span>{option4}</span>
              </div>
            </div>
          </div>
          <div className="correct-answer-section">
            <div className="icon">✔</div>
            <div>
              The correct answer is <strong>{answer}</strong>.
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
  )
);

export default AdminAddQuizQuestionCard;
