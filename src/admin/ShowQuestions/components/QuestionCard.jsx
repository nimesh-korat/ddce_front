import React, { forwardRef } from "react";

const AdminQuestionCard = forwardRef(
  ({ index, question, option1, option2, option3, option4, answer }, ref) => (
    <div className="card question-card shadow" ref={ref}>
      <div className="card-body">
        <h5 className="card-title">
          {index}. {question}
        </h5>
        <p className="card-text"></p>
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
        </div>
      </div>
    </div>
  )
);

export default AdminQuestionCard;
