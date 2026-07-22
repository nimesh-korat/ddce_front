import { MathJax, MathJaxContext } from "better-react-mathjax";
import React, { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import confettiAnim from "./confetti.json";
import Preloader from "../../../utils/preloader/Preloader";

// ── Lottie Cracker Animation ────────────────────────────────
const SEEN_KEY = "ddcet_seen_prevyear";
const getSeen = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SEEN_KEY) || "{}");
  } catch {
    return {};
  }
};
const markSeen = (id) => {
  try {
    const s = getSeen();
    s[id] = 1;
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(s));
  } catch {}
};

function CardCracker({ trigger }) {
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    if (getSeen()[trigger]) return; // already shown this attempt
    markSeen(trigger);
    setShow(true);
    setKey((k) => k + 1);
    const t = setTimeout(() => setShow(false), 5200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      <Lottie
        key={key}
        animationData={confettiAnim}
        loop={false}
        autoplay={true}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

function PrevYearBadge({ year }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
        border: "1.5px solid #f59e0b",
        borderRadius: "20px",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: 700,
        color: "#92400e",
        marginBottom: "10px",
        boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
      }}
    >
      <span style={{ fontSize: "14px" }}>🎯</span>
      Asked in DDCET {year}
    </div>
  );
}

const QuizQuestion = React.memo(
  ({
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
  }) => {
    const [loading, setLoading] = useState(false);
    const config = {
      loader: { load: ["input/asciimath", "output/chtml"] },
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
      asciimath2jax: {
        delimiters: [["`", "`"]],
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

    useEffect(() => {
      setLoading(true);
      let cancelled = false;
      const timer = setTimeout(() => {
        if (cancelled) return;
        try {
          if (window.MathJax && window.MathJax.typesetPromise) {
            const container = document.querySelector(".quiz-question-card");
            if (!container) {
              setLoading(false);
              return;
            }
            if (window.MathJax.typesetClear)
              window.MathJax.typesetClear([container]);
            window.MathJax.typesetPromise([container])
              .then(() => {
                if (!cancelled) setLoading(false);
              })
              .catch(() => {
                if (!cancelled) setLoading(false);
              });
          } else {
            setLoading(false);
          }
        } catch {
          setLoading(false);
        }
      }, 100);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }, [currentQuestion]);

    return (
      <>
        <MathJaxContext config={config}>
          <div className="col-md-8 order-md-1 order-2">
            <div
              className="card shadow-sm border-0 quiz-question-card"
              style={{ position: "relative", overflow: "visible" }}
            >
              {/* Pop burst from both bottom corners covering whole card */}
              {currentQuestion?.prevAskedYear && (
                <CardCracker trigger={currentQuestion.question_id} />
              )}
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
                      {currentQuestion.prevAskedYear && (
                        <PrevYearBadge year={currentQuestion.prevAskedYear} />
                      )}
                      <label
                        className="h5 mb-8 fw-semibold"
                        style={{ userSelect: "none" }}
                      >
                        {loading ? (
                          <Preloader />
                        ) : (
                          <MathJax inline>
                            {currentQuestion.question_text}
                          </MathJax>
                        )}
                      </label>
                    </div>
                    <div className="row g-20 " style={{ userSelect: "none" }}>
                      {["option_a", "option_b", "option_c", "option_d"].map(
                        (optionKey, index) => {
                          const optionText =
                            currentQuestion[`${optionKey}_text`];
                          if (!optionText) return null;

                          const isSelected =
                            selectedOption?.text === optionText;
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
                        },
                      )}
                    </div>
                  </form>
                ) : (
                  <p>No more questions.</p>
                )}
                <div className="flex-align justify-content-end gap-8 mt-20">
                  {!showSubmitButton &&
                    currentQuestionIndex < questions.length && (
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
                            questionStatus[currentQuestionIndex]
                              ?.attempt_status === "1"
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
      </>
    );
  },
);

export default QuizQuestion;
