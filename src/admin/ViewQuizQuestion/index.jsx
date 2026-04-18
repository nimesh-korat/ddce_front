import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../common/footer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminDeleteTestQuestion } from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Preloader from "../../utils/preloader/Preloader";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import axios from "axios";

const mathJaxConfig = {
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

function ViewQuizQuestions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const location = useLocation();
  const { test } = location.state || {};
  const queryClient = useQueryClient();

  const toggleSidebar = () => setIsSidebarActive((prev) => !prev);
  const closeSidebar = () => setIsSidebarActive(false);

  // Fetch questions for this test
  const { data, isLoading, isError } = useQuery({
    queryKey: ["viewQuizQuestions", test?.test_id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const api = process.env.REACT_APP_API_URL;
      const res = await axios.post(
        `${api}/api/admin/getAddedQuestionsInTest`,
        { test_id: test?.test_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    enabled: !!test?.test_id,
    staleTime: 2 * 60 * 1000,
  });

  const questions = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: ({ test_id, question_id }) =>
      adminDeleteTestQuestion(test_id, question_id),
    onSuccess: () => {
      toast.success("Question removed from test!");
      queryClient.invalidateQueries(["viewQuizQuestions", test?.test_id]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to remove question");
    },
  });

  const handleDelete = (question_id, question_text) => {
    Swal.fire({
      title: "Remove Question?",
      text: `Remove this question from the test? (The question itself won't be deleted.)`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Remove",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate({ test_id: test?.test_id, question_id });
      }
    });
  };

  const difficultyLabel = (val) => {
    const map = { 0: "Easy", 1: "Medium", 2: "Hard", 3: "Time Consuming" };
    return map[val] || val;
  };

  const difficultyBadge = (val) => {
    const map = {
      0: "bg-success-50 text-success-600",
      1: "bg-info-50 text-info-600",
      2: "bg-warning-50 text-warning-600",
      3: "bg-danger-50 text-danger-600",
    };
    return map[val] || "bg-gray-50 text-gray-600";
  };

  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* Breadcrumb */}
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-0">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to="/admin/showTests"
                    className="text-gray-200 fw-normal text-15 hover-text-main-600"
                  >
                    Tests
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    {test?.test_name || "Quiz Questions"}
                  </span>
                </li>
              </ul>
            </div>
            <Link
              to="/admin/addQuizQuestions"
              state={{ test }}
              className="btn btn-main rounded-pill py-9 flex-align gap-8"
            >
              <i className="ph ph-plus" />
              Add Questions
            </Link>
          </div>

          {isLoading ? (
            <Preloader />
          ) : isError ? (
            <div className="card">
              <div className="card-body text-center py-32">
                <p className="text-danger">
                  Failed to load questions. Please try again.
                </p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-48">
                <i className="ph ph-question text-64 text-gray-300 d-block mb-16" />
                <h5 className="text-gray-500 fw-medium">
                  No questions added yet
                </h5>
                <Link
                  to="/admin/addQuizQuestions"
                  state={{ test }}
                  className="btn btn-main rounded-pill py-9 mt-12"
                >
                  Add Questions
                </Link>
              </div>
            </div>
          ) : (
            <MathJaxContext config={mathJaxConfig}>
              <div className="d-flex flex-column gap-16">
                {/* Summary bar */}
                <div className="card">
                  <div className="card-body p-16 flex-align gap-20 flex-wrap">
                    <span className="text-14 fw-medium text-gray-700">
                      <i className="ph ph-list-numbers me-6 text-main-600" />
                      Total Questions: <strong>{questions.length}</strong>
                    </span>
                    <span className="text-14 fw-medium text-gray-700">
                      <i className="ph ph-star me-6 text-warning-600" />
                      Total Marks:{" "}
                      <strong>
                        {questions.reduce(
                          (sum, q) => sum + parseFloat(q.question_marks || 0),
                          0,
                        )}
                      </strong>
                    </span>
                  </div>
                </div>

                {questions.map((q, index) => (
                  <div
                    key={q.question_id}
                    className="card border border-gray-100"
                  >
                    <div className="card-body p-20">
                      {/* Question header */}
                      <div className="flex-between mb-12">
                        <div className="flex-align gap-8">
                          <span className="w-28 h-28 rounded-circle bg-main-600 text-white d-flex align-items-center justify-content-center text-13 fw-semibold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span
                            className={`text-12 py-2 px-10 rounded-pill fw-medium ${difficultyBadge(q.question_difficulty)}`}
                          >
                            {difficultyLabel(q.question_difficulty)}
                          </span>
                          <span className="text-13 text-gray-600">
                            <i className="ph ph-star me-4 text-warning-600" />
                            {q.question_marks} mark
                            {q.question_marks !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleDelete(q.question_id, q.question_text)
                          }
                          className="btn btn-sm btn-danger rounded-pill flex-align gap-4"
                          disabled={deleteMutation.isPending}
                          title="Remove from test"
                        >
                          <i className="ph ph-trash text-14" />
                          Remove
                        </button>
                      </div>

                      {/* Question text */}
                      <div className="mb-12">
                        <MathJax inline>{q.question_text}</MathJax>
                        {q.question_image && (
                          <img
                            src={q.question_image}
                            alt="question"
                            style={{
                              maxHeight: "180px",
                              objectFit: "contain",
                              marginTop: "8px",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </div>

                      {/* Options */}
                      <div className="row g-8 mb-12">
                        {[
                          {
                            label: "A",
                            text: q.option_a_text,
                            img: q.option_a_image,
                          },
                          {
                            label: "B",
                            text: q.option_b_text,
                            img: q.option_b_image,
                          },
                          {
                            label: "C",
                            text: q.option_c_text,
                            img: q.option_c_image,
                          },
                          {
                            label: "D",
                            text: q.option_d_text,
                            img: q.option_d_image,
                          },
                        ].map((opt) => (
                          <div key={opt.label} className="col-md-6">
                            <div
                              className={`p-10 rounded-8 border ${
                                q.answer_text && q.answer_text === opt.text
                                  ? "border-success-600 bg-success-50"
                                  : "border-gray-100 bg-gray-50"
                              }`}
                            >
                              <span className="text-13 fw-semibold me-6 text-main-600">
                                {opt.label}.
                              </span>
                              <span className="text-13">
                                {opt.text && (
                                  <MathJax inline>{opt.text}</MathJax>
                                )}
                                {opt.img && (
                                  <img
                                    src={opt.img}
                                    alt={`opt-${opt.label}`}
                                    style={{
                                      maxHeight: "80px",
                                      objectFit: "contain",
                                      display: "block",
                                      marginTop: "4px",
                                    }}
                                  />
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Correct Answer */}
                      <div className="p-10 bg-success-50 rounded-8 border border-success-200">
                        <span className="text-13 fw-semibold text-success-700">
                          <i className="ph ph-check-circle me-6" />
                          Correct Answer:{" "}
                          <MathJax inline>{q.answer_text || "—"}</MathJax>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MathJaxContext>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ViewQuizQuestions;
