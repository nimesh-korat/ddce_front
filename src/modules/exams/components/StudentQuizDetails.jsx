import React, { useState } from "react";
import Sidebar from "../../../common/sidebar";
import Header from "../../../common/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";

function StudentQuizDetails() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const testDetail = location.state?.test;
  if (!location?.state?.test) {
    window.location.href = "/exams";
  }

  const startDate = testDetail?.start_date;
  const endDate = testDetail?.end_date;

  const formattedStartDate = format(
    new Date(startDate),
    "dd/MM/yyyy 'at' hh:mm a"
  );
  const formattedEndDate = format(new Date(endDate), "dd/MM/yyyy 'at' hh:mm a");

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />

      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="quiz-detail-container">
            <div className="row mb-4 ">
              <div className="col-md-4 d-flex justify-content-center">
                <img
                  src={testDetail?.test_img_path}
                  alt="Quiz"
                  className="img-fluid rounded object-fit-cover max-h-250 unselectable"
                />
              </div>
              <div className="col-md-8" style={{ margin: "10px 0px" }}>
                <div className="">
                  <h1 id="quiz-detail-quizName">
                    {testDetail?.test_name}
                    <span
                      className={`quiz-detail-quiz-tag ms-5 ${
                        testDetail?.test_difficulty === "0"
                          ? "easy"
                          : testDetail?.test_difficulty === "1"
                          ? "medium"
                          : testDetail?.test_difficulty === "2"
                          ? "hard"
                          : testDetail?.test_difficulty === "3"
                          ? "time-consuming"
                          : ""
                      }`}
                      id="quiz-detail-quizTag"
                    >
                      {testDetail?.test_difficulty === "0"
                        ? "easy"
                        : testDetail?.test_difficulty === "1"
                        ? "medium"
                        : testDetail?.test_difficulty === "2"
                        ? "hard"
                        : testDetail?.test_difficulty === "3"
                        ? "time-consuming"
                        : ""}
                    </span>
                  </h1>
                  <p
                    id="quiz-detail-quizDescription"
                    className="quiz-detail-description"
                  >
                    {testDetail?.test_desc}
                  </p>
                </div>
              </div>
            </div>
            {/* Info Section */}
            <div className="row mb-4">
              {/* Start Time */}
              <div className="col-sm-6" style={{ margin: "10px 0px" }}>
                <div className="quiz-detail-info-item">
                  <h4>
                    {/* <span className="icon">⏰</span> */}
                    Quiz Starts At
                  </h4>
                  <p id="quiz-detail-quizStartTime">{formattedStartDate}</p>
                </div>
              </div>
              {/* End Time */}
              <div className="col-sm-6" style={{ margin: "10px 0px" }}>
                <div className="quiz-detail-info-item">
                  <h4>
                    {/* <span className="icon">⏳</span> */}
                    Quiz Ends At
                  </h4>
                  <p id="quiz-detail-quizEndTime">{formattedEndDate}</p>
                </div>
              </div>
              {/* Negative Mark */}
              <div className="col-sm-6" style={{ margin: "10px 0px" }}>
                <div className="quiz-detail-info-item">
                  <h4>
                    {/* <span className="icon">➖</span> */}
                    Negative Mark
                  </h4>
                  <p id="quiz-detail-negativeMark">
                    -{testDetail?.test_neg_marks}
                  </p>
                </div>
              </div>
              {/* Duration */}
              <div className="col-sm-6" style={{ margin: "10px 0px" }}>
                <div className="quiz-detail-info-item">
                  <h4>
                    {/* <span className="icon">📑</span> */}
                    Total Marks
                  </h4>
                  <p id="quiz-detail-testDuration">{testDetail?.total_marks}</p>
                </div>
              </div>
            </div>
            {/* Buttons Section */}
            <div className="row justify-content-center mb-4 mt-4">
              <div className="col-auto quiz-detail-buttons">
                <button
                  onClick={() => navigate(-1)}
                  className="btn quiz-detail-go-back-btn"
                >
                  Go Back
                </button>
                {/* <button
                  className="btn quiz-detail-attempt-exam-btn"
                  onclick="attemptExam()"
                >
                  Attempt Exam
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentQuizDetails;
