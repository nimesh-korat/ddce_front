import React, { useEffect, useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import StudyOverview from "./components/StudyOverview";
import HomeWidgets from "./components/Widget";
import Greetings from "./components/Greetings";
import ProgressStatistics from "./components/ProgressStatistics";
import MostActivity from "./components/MostActivity";
import Preloader from "../../utils/preloader/Preloader";
import { useQuery } from "@tanstack/react-query";
import { getDashboardCounts, getStudentAnswers } from "../../apis/apis";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Marquee from "react-fast-marquee";

const mathConfig = {
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

// ── Answers Modal ────────────────────────────────────────────
function MyAnswersModal({ onClose }) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("all");
  const [dir, setDir] = useState("desc");
  const limit = 25;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["studentAnswers", page, type, dir],
    queryFn: () => getStudentAnswers({ page, limit, type, dir }),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });

  const rows = data?.data || [];
  const pagination = data?.pagination || {};
  const { total = 0, totalPages = 1 } = pagination;

  const resultBadge = (r) =>
    r === "Correct"
      ? "bg-success-50 text-success-700"
      : r === "Incorrect"
        ? "bg-danger-50 text-danger-700"
        : "bg-gray-50 text-gray-500";

  const typeBadge = (t) =>
    t === "test"
      ? "bg-main-50 text-main-700"
      : "bg-warning-50 text-warning-700";

  const pageNums = () => {
    const pages = [],
      s = Math.max(1, page - 2),
      e = Math.min(totalPages, page + 2);
    for (let i = s; i <= e; i++) pages.push(i);
    return pages;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-between p-20 border-bottom border-gray-100">
          <div>
            <h5 className="fw-bold mb-2 text-gray-800">Student Answers</h5>
          </div>
          <div className="flex-align gap-10">
            {/* Type filter */}
            <select
              className="form-select form-select-sm rounded-pill"
              style={{ width: "130px" }}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All</option>
              <option value="test">Test Only</option>
              <option value="practice">Practice Only</option>
            </select>
            {/* Sort */}
            <button
              className="btn btn-sm btn-secondary rounded-pill px-12"
              onClick={() => {
                setDir((d) => (d === "desc" ? "asc" : "desc"));
                setPage(1);
              }}
            >
              <i
                className={`ph ph-arrow-${dir === "desc" ? "down" : "up"} me-4`}
              />
              {dir === "desc" ? "Newest" : "Oldest"}
            </button>
            <button
              className="btn btn-sm btn-secondary rounded-circle"
              style={{ width: "34px", height: "34px" }}
              onClick={onClose}
            >
              <i className="ph ph-x" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          <MathJaxContext config={mathConfig}>
            <table className="table table-hover mb-0">
              <thead
                className="bg-gray-50"
                style={{ position: "sticky", top: 0, zIndex: 1 }}
              >
                <tr>
                  <th
                    className="text-12 text-gray-500 fw-medium py-10 px-16"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    #
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Student Name
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Question ID
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Answer
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Type
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10 text-center">
                    Result
                  </th>
                  <th className="text-12 text-gray-500 fw-medium py-10">
                    Answered On
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 7 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="py-10 px-16">
                          <div
                            className="bg-gray-100 rounded"
                            style={{
                              height: "14px",
                              width: j === 0 ? "24px" : "75%",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}

                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-32">
                      <i className="ph ph-database text-40 d-block mb-8 text-gray-300" />
                      No answers yet
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  rows.map((row, i) => (
                    <tr
                      key={`${row.question_type}-${row.answer_id}`}
                      className={isFetching ? "opacity-50" : ""}
                    >
                      <td
                        className="text-13 text-gray-400 py-10 px-16 fw-medium"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {total - ((page - 1) * limit + i)}
                      </td>
                      <td className="text-13 fw-medium text-gray-800 py-10">
                        {row.student_name || "—"}
                      </td>
                      <td className="text-13 text-gray-600 py-10">
                        {row.question_id}
                      </td>
                      <td
                        className="text-13 text-gray-700 py-10"
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={row.std_answer}
                      >
                        {row.std_answer ? (
                          <MathJax dynamic inline>
                            {row.std_answer}
                          </MathJax>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="py-10 text-center">
                        <span
                          className={`text-11 py-2 px-8 rounded-pill fw-semibold ${typeBadge(row.question_type)}`}
                        >
                          {row.question_type === "test" ? "Test" : "Practice"}
                        </span>
                      </td>
                      <td className="py-10 text-center">
                        <span
                          className={`text-11 py-2 px-8 rounded-pill fw-semibold ${resultBadge(row.result)}`}
                        >
                          {row.result}
                        </span>
                      </td>
                      <td
                        className="text-12 text-gray-500 py-10"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {row.answered_on
                          ? new Date(row.answered_on).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </MathJaxContext>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex-between flex-wrap gap-8 p-16 border-top border-gray-100">
            <p className="text-13 text-gray-500 mb-0">
              Showing <strong>{(page - 1) * limit + 1}</strong>–
              <strong>{Math.min(page * limit, total)}</strong> of{" "}
              <strong>{total.toLocaleString()}</strong>
            </p>
            <div className="flex-align gap-4">
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <i className="ph ph-caret-double-left text-12" />
              </button>
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <i className="ph ph-caret-left text-12" />
              </button>
              {pageNums().map((n) => (
                <button
                  key={n}
                  className={`btn btn-sm rounded-pill px-12 py-4 ${n === page ? "btn-main" : "btn-secondary"}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                <i className="ph ph-caret-right text-12" />
              </button>
              <button
                className="btn btn-sm btn-secondary rounded-pill px-10 py-4"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                <i className="ph ph-caret-double-right text-12" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [isReady, setIsReady] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboardCounts"],
    queryFn: getDashboardCounts,
    staleTime: 60000, // cache for 60 seconds
  });

  if (isError) {
    // console.log(error);
  }

  useEffect(() => {
    setIsReady(true); // Ensure the DOM is ready before rendering the chart
  }, []);

  const marqueeContent = [
    // {
    //   title: "🟰 Mathematics - Integration Material Solution Added",
    // },
    // {
    //   title: "⚗️ Physics, English & Environmental Sciences Material Solution Added",
    // },
    // {
    //   title: "🧑‍🎓 Combined Quiz 2 Added",
    // },
    // {
    //   title: "⚖️ Mathematics - Integration Material Added",
    // },
    // {
    //   title: "🌴 Physics, English & Environmental Sciences Material Added",
    // },
    // {
    //   title: "📖 Computer Practice, Soft Skill & Chemistry Material Solution Added",
    // },
    // {
    //   title: "🌀 Combined Quiz 1 Added",
    // },
    // {
    //   title: "🧑‍🎓 Computer Practice, Soft Skill & Chemistry Material Added",
    // },
    // {
    //   title: "⚗️ Metals & Non-Metals Material Solution Added",
    // },
    // {
    //   title: "💀 Metals & Non-Metals Material Added",
    // },
    // {
    //   title: "⚖️ Metals & Non-Metals Quiz Added",
    // },
    // {
    //   title: "🟰 Units & Measurement Material Solution Added",
    // },
    // {
    //   title: "⚖️ Units & Measurement Quiz Added",
    // },
    // {
    //   title: "⚡ Units & Measurement Material Added",
    // },
    // {
    //   title: "📖 Function & Limit Material Solution Added",
    // },
    // {
    //   title: "🌀 Function & Limit Quiz Added",
    // },
    // {
    //   title: "🧑‍🎓 Function & Limit Material Added",
    // },
    // {
    //   title: "⚗️ Units & Measurement Material Solution Added",
    // },
    // {
    //   title: "💀 Units & Measurement Quiz Added",
    // },
    // {
    //   title: "➗ Units & Measurement Material Added",
    // },
    // {
    //   title: "🌴 Environmental Sciences Material Solution Added",
    // },
    // {
    //   title: "🎋 Environmental Sciences Material Added",
    // },
    // {
    //   title: "🌳 Environmental Sciences Quiz Added",
    // },
    // {
    //   title: "👨‍💻 Computer Practice Material Solution Added",
    // },
    // {
    //   title: "⚡ Chemistry - Acids, Bases & Salts Material Solution Added",
    // },
    // {
    //   title: "⚗️ Chemistry - Acids, Bases & Salts Material Added",
    // },
    // {
    //   title: "🧪 Chemistry - Acids, Bases & Salts Quiz Added",
    // },
    // {
    //   title: "📖 Determinant & Matrices Material Solution Added",
    // },
    // {
    //   title: "📑 Determinant & Matrices Material Added",
    // },
    // {
    //   title: "🗣️ Determinant & Matrices Quiz Added",
    // },
    //{
    //   title: "📖 Classical Mechanics Material Solution Added",
    // },
    // {
    //   title: "⚖️ Classical Mechanics Quiz Added",
    // },
    // {
    //   title: "⚡ Classical Mechanics Material Added",
    // },
    // {
    //   title: "⚖️ Trigonometry Material Solution Added",
    // },
    // {
    //   title: "🟰 Trigonometry Quiz Added",
    // },
    // {
    //   title: "⚡ Trigonometry Material Added",
    // },
    // {
    //   title: "😎 Soft Skill Grammer Material Solution Added",
    // },
    // {
    //   title: "🧑‍🎓 Soft Skill Material Solution Added",
    // },
    // {
    //   title: "🛠️ Electric Current Practice Set Solution Added",
    // },
    // {
    //   title: "⚡ Electric Current Practice Set Added",
    // },
    // {
    //   title: "🔌 Electric Current Quiz Added",
    // },
    // {
    //   title: "⚖️ Classical Mechanics Practice Set Solution Added",
    // },
    // {
    //   title: "⌨️ Computer Practice Quiz Added",
    // },
    // {
    //   title: "💻 Computer Practice Material Added",
    // },
    // {
    //   title: "⚡ Logarithm & Statistics Material Added",
    // },
    // {
    //   title: "➗ Logarithm & Statistics Quiz Added",
    // },
    // {
    //   title: "📖 Soft Skill - Word & Sentence Material Added",
    // },
    // {
    //   title: "🗣️ Soft Skill - Word & Sentence Quiz Added",
    // },
    // {
    //   title: "⭐ Soft Skill Grammer Material Added",
    // },
    // {
    //   title: "🌀 Soft Skill Grammer Quiz Added",
    // },
    // {
    //   title: "🏋️‍♂️ Classical Mechanics Practice Set Added",
    // },
    // {
    //   title: "🌀 Classical Mechanics Quiz Added",
    // },
  ];

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />

      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {!isReady || isLoading ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            <Marquee
              speed={60}
              pauseOnHover={true}
              gradient={false}
              className="pb-10"
            >
              {marqueeContent.map((item, index) => (
                <div className="ms-15 mt-0" key={index}>
                  {item.title}
                </div>
              ))}
            </Marquee>

            <div className="row gy-4">
              <div className="col-xxl-8">
                <Greetings
                  dashboardData={data?.data}
                  refetch={refetch}
                  onViewAnswers={() => setShowAnswers(true)}
                />
              </div>
              <div className="col-xxl-4">
                {/* Widgets Start */}
                <div className="row gy-4">
                  <HomeWidgets
                    bgColor={"bg-main-600"}
                    img="ph-fill ph-seal-question"
                    title="Total Questions"
                    count={data?.data?.total_questions || 0}
                  />
                  <HomeWidgets
                    bgColor={"bg-main-two-600 "}
                    img="ph-fill ph-graduation-cap"
                    title="Offline Students"
                    count="104"
                    isLocked={false}
                  />
                  <HomeWidgets
                    bgColor={"bg-purple-600"}
                    img="ph-fill ph-users-four"
                    title="Online Students"
                    // count={data?.data?.total_users || 0}
                    count={0}
                    isLocked={false}
                  />
                  <HomeWidgets
                    bgColor="bg-warning-600 "
                    img="ph-fill ph-certificate"
                    title="Quiz Completed"
                    // count={data?.data?.total_completed_quizzes || 0}
                    count={0}
                    isLocked={false}
                  />
                </div>
                {/* Widgets End */}
              </div>
            </div>
            <div className="mt-24">
              <div className="row gy-4">
                <div className="col-xxl-6">
                  {/* Top Course Start */}

                  {isReady && <StudyOverview />}
                  {/* Top Course End */}
                </div>
                <ProgressStatistics />
                <MostActivity />
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
      {showAnswers && <MyAnswersModal onClose={() => setShowAnswers(false)} />}
    </>
  );
}

export default Home;
