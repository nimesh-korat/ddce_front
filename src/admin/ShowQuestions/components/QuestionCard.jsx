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

const AdminQuestionCard = forwardRef(
  (
    {
      index,
      question,
      questionImg,
      option1,
      option2,
      option3,
      option4,
      optionimg1,
      optionimg2,
      optionimg3,
      optionimg4,
      answer,
    },
    ref
  ) => {
    return (
      <MathJaxContext config={config}>
        <div className="card question-card shadow" ref={ref}>
          <div className="card-body">
            <h5 className="card-title">
              {index}. <MathJax inline>{question}</MathJax>
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
            <div className="container x">
              <div className="row question-row-gap align-items-stretch">
                <div className="col-6">
                  <div className="option-card h-100">
                    {" "}
                    <div className="question-bullet-icon">A</div>
                    {optionimg1 === null ? (
                      <MathJax inline>
                        <span>{option1}</span>
                      </MathJax>
                    ) : (
                      <img src={optionimg1} alt={option1} />
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <div className="option-card h-100">
                    {" "}
                    <div className="question-bullet-icon">B</div>
                    {optionimg2 === null ? (
                      <MathJax inline>
                        <span>{option2}</span>
                      </MathJax>
                    ) : (
                      <img src={optionimg2} alt={option2} />
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <div className="option-card h-100">
                    {" "}
                    <div className="question-bullet-icon">C</div>
                    {optionimg3 === null ? (
                      <MathJax inline>
                        <span>{option3}</span>
                      </MathJax>
                    ) : (
                      <img src={optionimg3} alt={option3} />
                    )}
                  </div>
                </div>
                <div className="col-6">
                  <div className="option-card h-100">
                    {" "}
                    <div className="question-bullet-icon">D</div>
                    {optionimg4 === null ? (
                      <MathJax inline>
                        <span>{option4}</span>
                      </MathJax>
                    ) : (
                      <img src={optionimg4} alt={option4} />
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
            </div>
          </div>
        </div>
      </MathJaxContext>
    );
  }
);

export default AdminQuestionCard;
