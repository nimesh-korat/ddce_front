import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudentPracticeSets,
  getNextPracticeQuestion,
  submitPracticeAnswer,
  getWrongPracticeAnswers,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Preloader from "../../utils/preloader/Preloader";
import PracticeSetCard from "./components/PracticeSetCard";
import PracticeQuestion from "./components/PracticeQuestion";
import WrongAnswers from "./components/WrongAnswers";

// view = "sets" | "attempt" | "wrong"
function Practice() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [view, setView] = useState("sets");
  const [activeSet, setActiveSet] = useState(null); // full set object
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // ── Sets listing ────────────────────────────────────────────
  const {
    data: setsData,
    isLoading: setsLoading,
    isError: setsError,
  } = useQuery({
    queryKey: ["studentPracticeSets"],
    queryFn: getStudentPracticeSets,
    staleTime: 30 * 1000,
  });

  // ── Next question (only active when in attempt view) ────────
  const {
    data: questionData,
    isLoading: questionLoading,
    refetch: refetchQuestion,
  } = useQuery({
    queryKey: ["nextPracticeQuestion", activeSet?.id],
    queryFn: () => getNextPracticeQuestion(activeSet?.id),
    enabled: view === "attempt" && !!activeSet?.id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // ── Wrong answers (only active when in wrong view) ──────────
  const { data: wrongData, isLoading: wrongLoading } = useQuery({
    queryKey: ["wrongPracticeAnswers", activeSet?.id],
    queryFn: () => getWrongPracticeAnswers(activeSet?.id),
    enabled: view === "wrong" && !!activeSet?.id,
    staleTime: 30 * 1000,
  });

  // ── Submit answer mutation ───────────────────────────────────
  const submitMutation = useMutation({
    mutationFn: (data) => submitPracticeAnswer(data),
    onSuccess: (res) => {
      setAnswerResult(res.data);
      queryClient.invalidateQueries(["studentPracticeSets"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit answer");
    },
  });

  // ── Handlers ────────────────────────────────────────────────
  const handleAttempt = (set) => {
    setActiveSet(set);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setView("attempt");
  };

  const handleViewWrong = (set) => {
    setActiveSet(set);
    setView("wrong");
  };

  const handleBack = () => {
    setView("sets");
    setActiveSet(null);
    setSelectedAnswer(null);
    setAnswerResult(null);
    queryClient.invalidateQueries(["studentPracticeSets"]);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      toast.warning("Please select an answer");
      return;
    }
    const q = questionData?.data;
    if (!q) return;
    submitMutation.mutate({
      practice_assigned_id: q.practice_assigned_id,
      question_id: q.question_id,
      std_answer: selectedAnswer,
    });
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setAnswerResult(null);
    refetchQuestion();
  };

  const sets = setsData?.data.reverse() || [];
  const question = questionData?.data;
  const setCompleted =
    questionData?.message === "all_completed" && !questionLoading;

  // ── Progress summary for header when in attempt/wrong view ──
  const viewingSet = activeSet;

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* ── Breadcrumb ── */}
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-200 fw-normal text-15 hover-text-main-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-500 fw-normal d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              {view === "sets" ? (
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Practice
                  </span>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      className="btn btn-link p-0 text-gray-200 fw-normal text-15 hover-text-main-600"
                      onClick={handleBack}
                    >
                      Practice
                    </button>
                  </li>
                  <li>
                    <span className="text-gray-500 fw-normal d-flex">
                      <i className="ph ph-caret-right" />
                    </span>
                  </li>
                  <li>
                    <span
                      className="text-main-600 fw-normal text-15 text-truncate"
                      style={{ maxWidth: "200px", display: "inline-block" }}
                    >
                      {viewingSet?.title}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* ══════════════════════════════════════════════════════ */}
          {/* VIEW: SETS                                             */}
          {/* ══════════════════════════════════════════════════════ */}
          {view === "sets" && (
            <>
              {setsLoading && <Preloader />}

              {setsError && (
                <div className="alert alert-danger rounded-8">
                  Failed to load practice sets. Please try again.
                </div>
              )}

              {!setsLoading && sets.length === 0 && (
                <div className="card">
                  <div className="card-body text-center py-64">
                    <i className="ph ph-barbell text-72 text-gray-200 d-block mb-20" />
                    <h5 className="fw-semibold text-gray-600 mb-8">
                      No Practice Assigned Yet
                    </h5>
                    <p className="text-gray-400 text-14 mb-0">
                      Your mentor hasn't assigned any practice sets to your
                      batch yet. Check back later!
                    </p>
                  </div>
                </div>
              )}

              {!setsLoading && sets.length > 0 && (
                <>
                  {/* <div className="row g-12 mb-24">
                    {(() => {
                      const totals = sets.reduce(
                        (acc, s) => ({
                          total: acc.total + s.total_questions,
                          attempted: acc.attempted + s.attempted,
                          correct: acc.correct + s.correct,
                          wrong: acc.wrong + s.wrong,
                          remaining: acc.remaining + s.remaining,
                        }),
                        {
                          total: 0,
                          attempted: 0,
                          correct: 0,
                          wrong: 0,
                          remaining: 0,
                        },
                      );
                      return [
                        {
                          label: "Total Sets",
                          value: sets.length,
                          icon: "ph-stack",
                          color: "text-main-600",
                          bg: "bg-50",
                        },
                        {
                          label: "Remaining",
                          value: totals.remaining,
                          icon: "ph-hourglass",
                          color: "text-warning-600",
                          bg: "bg-warning-50",
                        },
                        {
                          label: "Correct",
                          value: totals.correct,
                          icon: "ph-check-circle",
                          color: "text-success-600",
                          bg: "bg-success-50",
                        },
                        {
                          label: "Wrong",
                          value: totals.wrong,
                          icon: "ph-x-circle",
                          color: "text-danger-600",
                          bg: "bg-danger-50",
                        },
                      ].map((s, i) => (
                        <div className="col-6 col-md-3" key={i}>
                          <div className={`card py-16 px-20 border-0 ${s.bg}`}>
                            <div className="flex-align gap-12">
                              <i
                                className={`ph ${s.icon} text-24 ${s.color}`}
                              />
                              <div>
                                <p className="text-12 text-gray-500 mb-2">
                                  {s.label}
                                </p>
                                <h4 className="fw-bold mb-0 text-gray-800">
                                  {s.value}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div> */}

                  <div className="row g-20">
                    {sets.map((set) => (
                      <div className="col-xl-4 col-md-6" key={set.id}>
                        <PracticeSetCard
                          set={set}
                          onAttempt={handleAttempt}
                          onViewWrong={handleViewWrong}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════════════ */}
          {/* VIEW: ATTEMPT                                          */}
          {/* ══════════════════════════════════════════════════════ */}
          {view === "attempt" && (
            <>
              {/* Back + set info bar */}
              <div className="flex-between flex-wrap gap-12 mb-20 p-16 bg-main-50 rounded-12">
                <div className="flex-align gap-12">
                  <button
                    className="btn btn-sm btn-outline-main rounded-pill flex-align gap-6"
                    onClick={handleBack}
                  >
                    <i className="ph ph-arrow-left text-14" />
                    Back
                  </button>
                  <div>
                    <h6 className="fw-semibold mb-0 text-gray-800">
                      {viewingSet?.title}
                    </h6>
                    {/* <span className="text-12 text-gray-500">
                      {viewingSet?.attempted} attempted ·{" "}
                      {viewingSet?.remaining} remaining
                    </span> */}
                  </div>
                </div>
                {viewingSet?.wrong > 0 && (
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill flex-align gap-6"
                    onClick={() => handleViewWrong(viewingSet)}
                  >
                    <i className="ph ph-x-circle text-14" />
                    {viewingSet.wrong} Wrong Answers
                  </button>
                )}
              </div>

              {/* Question or completed state */}
              {questionLoading && <Preloader />}

              {!questionLoading && setCompleted && (
                <div className="card">
                  <div className="card-body text-center py-56">
                    <i className="ph ph-check-circle text-72 text-success-500 d-block mb-20" />
                    <h5 className="fw-semibold mb-8 text-gray-700">
                      All Questions Completed!
                    </h5>
                    <p className="text-gray-400 text-14 mb-24">
                      You have attempted all questions in{" "}
                      <strong>{viewingSet?.title}</strong>.
                    </p>
                    <div className="flex-align gap-12 justify-content-center">
                      <button
                        className="btn btn-outline-main rounded-pill py-9"
                        onClick={handleBack}
                      >
                        Back to Sets
                      </button>
                      {viewingSet?.wrong > 0 && (
                        <button
                          className="btn btn-main rounded-pill py-9"
                          onClick={() => handleViewWrong(viewingSet)}
                        >
                          Review {viewingSet.wrong} Wrong Answers
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!questionLoading && !setCompleted && question && (
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <PracticeQuestion
                      question={question}
                      selectedAnswer={selectedAnswer}
                      setSelectedAnswer={setSelectedAnswer}
                      answerResult={answerResult}
                      onSubmit={handleSubmitAnswer}
                      onNext={handleNext}
                      isSubmitting={submitMutation.isPending}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════════════════════════════════════════════ */}
          {/* VIEW: WRONG ANSWERS                                    */}
          {/* ══════════════════════════════════════════════════════ */}
          {view === "wrong" && (
            <>
              {/* Back bar */}
              <div className="flex-between flex-wrap gap-12 mb-20 p-16 bg-danger-50 rounded-12">
                <div className="flex-align gap-12">
                  <button
                    className="btn btn-sm btn-danger rounded-pill flex-align gap-6"
                    onClick={handleBack}
                  >
                    <i className="ph ph-arrow-left text-14" />
                    Back
                  </button>
                  <div>
                    <h6 className="fw-semibold mb-0 text-gray-800">
                      {viewingSet?.title}
                    </h6>
                    <span className="text-12 text-danger-600 fw-medium">
                      Reviewing {viewingSet?.wrong} wrong answer
                      {viewingSet?.wrong !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {viewingSet?.remaining > 0 && (
                  <button
                    className="btn btn-sm btn-main rounded-pill flex-align gap-6"
                    onClick={() => handleAttempt(viewingSet)}
                  >
                    <i className="ph ph-barbell text-14" />
                    Continue ({viewingSet.remaining} left)
                  </button>
                )}
              </div>

              <WrongAnswers
                data={wrongData?.data || []}
                isLoading={wrongLoading}
                subjects={[]}
                subjectFilter=""
                setSubjectFilter={() => {}}
              />
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Practice;
