import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNextPracticeQuestion,
  submitPracticeAnswer,
  getWrongPracticeAnswers,
  getPracticeStats,
  getSubjects,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Preloader from "../../utils/preloader/Preloader";
import PracticeQuestion from "./components/PracticeQuestion";
import WrongAnswers from "./components/WrongAnswers";

function Practice() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeTab, setActiveTab] = useState("practice"); // "practice" | "wrong"
  const [subjectFilter, setSubjectFilter] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null); // { is_correct, correct_answer, std_answer }
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // Practice stats (subjects available + counts)
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["practiceStats"],
    queryFn: getPracticeStats,
    staleTime: 30 * 1000, // refresh often since it changes after each answer
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 10 * 60 * 1000,
  });

  // Fetch next question
  const {
    data: questionData,
    isLoading: questionLoading,
    refetch: refetchQuestion,
  } = useQuery({
    queryKey: ["nextPracticeQuestion", subjectFilter],
    queryFn: () =>
      getNextPracticeQuestion(
        subjectFilter ? { subject_id: subjectFilter } : {},
      ),
    staleTime: 0, // always fresh
    refetchOnWindowFocus: false,
  });

  // Wrong answers
  const { data: wrongData, isLoading: wrongLoading } = useQuery({
    queryKey: ["wrongPracticeAnswers", subjectFilter],
    queryFn: () =>
      getWrongPracticeAnswers(
        subjectFilter ? { subject_id: subjectFilter } : {},
      ),
    enabled: activeTab === "wrong",
    staleTime: 30 * 1000,
  });

  const submitMutation = useMutation({
    mutationFn: (data) => submitPracticeAnswer(data),
    onSuccess: (res) => {
      setAnswerResult(res.data);
      // Invalidate stats so counts update
      queryClient.invalidateQueries(["practiceStats"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit answer");
    },
  });

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

  const stats = statsData?.data;
  const question = questionData?.data;
  const allCompleted =
    questionData?.message === "all_completed" && !questionLoading;
  const subjects = subjectsData?.data || [];

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* Breadcrumb */}
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-0">
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
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Practice
                  </span>
                </li>
              </ul>
            </div>
            {/* Subject filter */}
            <div className="flex-align gap-8">
              <select
                className="form-control form-control-sm rounded-pill"
                style={{ minWidth: "160px" }}
                value={subjectFilter}
                onChange={(e) => {
                  setSubjectFilter(e.target.value);
                  setSelectedAnswer(null);
                  setAnswerResult(null);
                }}
              >
                <option value="">All Subjects</option>
                {(stats?.subjects || []).map((s) => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_name} ({s.remaining} left)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats bar
          {!statsLoading && stats && (
            <div className="row g-12 mb-20">
              {[
                {
                  label: "Total",
                  value: stats.totals.total,
                  icon: "ph-list-numbers",
                  color: "text-main-600",
                },
                {
                  label: "Correct",
                  value: stats.totals.correct,
                  icon: "ph-check-circle",
                  color: "text-success-600",
                },
                {
                  label: "Wrong",
                  value: stats.totals.wrong,
                  icon: "ph-x-circle",
                  color: "text-danger-600",
                },
                {
                  label: "Remaining",
                  value: stats.totals.remaining,
                  icon: "ph-hourglass",
                  color: "text-warning-600",
                },
              ].map((s, i) => (
                <div className="col-6 col-md-3" key={i}>
                  <div className="card py-14 px-16">
                    <div className="flex-align gap-10">
                      <i className={`ph ${s.icon} text-22 ${s.color}`} />
                      <div>
                        <p className="text-12 text-gray-500 mb-0">{s.label}</p>
                        <h5 className="fw-semibold mb-0">{s.value}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )} */}

          {/* Tabs */}
          <div className="flex-align gap-0 mb-20 border-bottom border-gray-100">
            <button
              className={`btn px-20 py-12 fw-medium text-14 rounded-0 ${activeTab === "practice" ? "border-main-600 text-main-600" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("practice")}
            >
              <i className="ph ph-barbell me-6" />
              Practice
            </button>
            <button
              className={`btn px-20 py-12 fw-medium text-14 rounded-0 ${activeTab === "wrong" ? "border-main-600 text-main-600" : "border-transparent text-gray-500"}`}
              onClick={() => setActiveTab("wrong")}
            >
              <i className="ph ph-x-circle me-6 text-danger-600" />
              Wrong Answers
              {stats?.totals?.wrong > 0 && (
                <span className="ms-6 text-12 bg-danger-600 text-white rounded-pill px-8 py-2">
                  {stats.totals.wrong}
                </span>
              )}
            </button>
          </div>

          {/* PRACTICE TAB */}
          {activeTab === "practice" && (
            <>
              {(questionLoading || statsLoading) && <Preloader />}

              {/* All completed */}
              {allCompleted && (
                <div className="card">
                  <div className="card-body text-center py-48">
                    <i className="ph ph-check-circle text-64 text-success-600 d-block mb-16" />
                    <h5 className="fw-semibold mb-8">
                      {subjectFilter
                        ? "All questions for this subject completed!"
                        : "You have completed all practice questions!"}
                    </h5>
                    <p className="text-gray-500 text-14 mb-20">
                      {subjectFilter
                        ? "Try another subject or check wrong answers."
                        : "Check your wrong answers to review what you missed."}
                    </p>
                    <div className="flex-align gap-12 justify-content-center">
                      {subjectFilter && (
                        <button
                          className="btn btn-outline-main rounded-pill py-9"
                          onClick={() => setSubjectFilter("")}
                        >
                          All Subjects
                        </button>
                      )}
                      <button
                        className="btn btn-main rounded-pill py-9"
                        onClick={() => setActiveTab("wrong")}
                      >
                        View Wrong Answers
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Question card */}
              {!questionLoading && !allCompleted && question && (
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

          {/* WRONG ANSWERS TAB */}
          {activeTab === "wrong" && (
            <WrongAnswers
              data={wrongData?.data || []}
              isLoading={wrongLoading}
              subjects={subjects}
              subjectFilter={subjectFilter}
              setSubjectFilter={setSubjectFilter}
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Practice;
