import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { getSubjectWiseAnalysis } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import Preloader from "../../utils/preloader/Preloader";
import Footer from "../../common/footer";

function MasteryMatrix() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Use React Query to fetch mastery matrix data
  const { data, error, isFetching } = useQuery({
    queryKey: ["accuracyMatrixData"],
    queryFn: getSubjectWiseAnalysis,
    // total corrected questions (subject-wise) / (total corrected questions (subject-wise) + total incorrect questions (subject-wise)) * 100
    refetchOnWindowFocus: false,
  });

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link
                  to={"/"}
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
                  Accuracy Matrix
                </span>
              </li>
            </ul>
          </div>
          <div className="container-fluid dashboard-content">
            {isFetching ? (
              <Preloader />
            ) : (
              <>
                <div className="row text-center mb-4 mt-4">
                  <div className="col-12">
                    <div className="card p-4 rounded shadow">
                      <div className="row g-3">
                        <div className="col-6 col-md-4 col-lg-2 mb-8">
                          <div className="mastery-stat-box">
                            <p className="mastery-stat-number text-primary">
                              {data?.OverallAnalytics?.TotalQuestionsAsked}
                            </p>
                            <p className="mastery-stat-text">Asked</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 mb-8">
                          <div className="mastery-stat-box">
                            <p className="mastery-stat-number text-info">
                              {data?.OverallAnalytics?.TotalAttempted}
                            </p>
                            <p className="mastery-stat-text">Attempted</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 mb-8">
                          <div className="mastery-stat-box">
                            <p className="mastery-stat-number text-success">
                              {data?.OverallAnalytics?.TotalCorrect}
                            </p>
                            <p className="mastery-stat-text">Correct</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 mb-8">
                          <div className="mastery-stat-box">
                            <p className="mastery-stat-number text-danger">
                              {data?.OverallAnalytics?.TotalIncorrect}
                            </p>
                            <p className="mastery-stat-text">Incorrect</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 mb-8">
                          <div className="mastery-stat-box">
                            <p className="mastery-stat-number text-warning">
                              {data?.OverallAnalytics?.TotalSkipped}
                            </p>
                            <p className="mastery-stat-text">Skipped</p>
                          </div>
                        </div>
                        <div className="col-6 col-md-4 col-lg-2 mb-8">
                          <div className="mastery-stat-box">
                            <p className="mastery-stat-number text-success">
                              {data?.OverallAnalytics?.Accuracy}%
                            </p>
                            <p className="mastery-stat-text">Accuracy</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-12 g-3">
                  {data?.SubjectWiseAnalytics.map((subject, index) => {
                    if (subject.TotalAttempted === "0") {
                      return null;
                    }

                    // Set background image based on subject
                    let backgroundImage;
                    if (subject.Accuracy >= 90) {
                      backgroundImage =
                        "url(https://example.com/high-accuracy-background.jpg)";
                    } else if (subject.Accuracy >= 70) {
                      backgroundImage =
                        "url(https://example.com/medium-accuracy-background.jpg)";
                    } else if (subject.Accuracy >= 50) {
                      backgroundImage =
                        "url(https://example.com/low-accuracy-background.jpg)";
                    } else {
                      //eslint-disable-next-line
                      backgroundImage =
                        "url(https://example.com/very-low-accuracy-background.jpg)";
                    }

                    return (
                      <div className="col-md-6" key={index}>
                        <div
                          className="card shadow rounded"
                          style={{
                            backgroundImage:
                              "url(https://t3.ftcdn.net/jpg/04/12/82/16/360_F_412821610_95RpjzPXCE2LiWGVShIUCGJSktkJQh6P.jpg)",
                            backgroundSize: "cover",
                            backgroundColor: "rgba(255, 255, 255, 0.45)",
                            backgroundPosition: "center",
                            backgroundBlendMode: "overlay",
                          }}
                        >
                          <div className="card-body">
                            {/* <div className="d-flex justify-content-between align-items-center mb-3"> */}
                            {/* <img
                                src="../assets/images/icons/gold_trophy.png"
                                alt="Placeholder"
                                className="trophy-icon unselectable"
                              /> */}

                            {/* </div> */}
                            <div className="row mastery-subject-name">
                              <div className="col-7">
                                <p className="font-weight-bold">
                                  {subject.Subject}
                                </p>
                              </div>
                              <div className="col-5">
                                <h1 className="mastery-percentage text-sm-end ">
                                  {subject.Accuracy}%
                                </h1>
                              </div>
                            </div>
                            <div>
                              <div className="row text-center justify-content-between g-3">
                                <div className="col-6 col-md-4 col-lg-2">
                                  <div className="mastery-stat-box">
                                    <p className="mastery-stat-number text-primary">
                                      {subject.TotalQuestionsAsked}
                                    </p>
                                    <p className="mastery-stat-text fw-bold">
                                      Asked
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                  <div className="mastery-stat-box">
                                    <p className="mastery-stat-number text-info">
                                      {subject.TotalAttempted}
                                    </p>
                                    <p className="mastery-stat-text fw-bold">
                                      Attempted
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                  <div className="mastery-stat-box">
                                    <p className="mastery-stat-number text-success">
                                      {subject.TotalCorrect}
                                    </p>
                                    <p className="mastery-stat-text fw-bold">
                                      Correct
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                  <div className="mastery-stat-box">
                                    <p className="mastery-stat-number text-danger">
                                      {subject.TotalIncorrect}
                                    </p>
                                    <p className="mastery-stat-text fw-bold">
                                      Incorrect
                                    </p>
                                  </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2">
                                  <div className="mastery-stat-box">
                                    <p className="mastery-stat-number text-warning">
                                      {subject.TotalSkipped}
                                    </p>
                                    <p className="mastery-stat-text fw-bold">
                                      Skipped
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MasteryMatrix;
