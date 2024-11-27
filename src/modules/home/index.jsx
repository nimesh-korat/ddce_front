import React from "react";
import Sidebar from "../../common/sidebar";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";
import Statestics from "./components/statistics";
import StudyStatisticsChart from "./components/studyStatistics";
import TopCourses from "./components/topCourses";
import Calendar from "./components/calender";
import Assignment from "./components/assignments";
import MyProgress from "./components/myProgress";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/*==================== Preloader Start ====================*/}
      <div className="preloader">
        <div className="loader" />
      </div>
      {/*==================== Preloader End ====================*/}
      <Sidebar />
      <div className="dashboard-main-wrapper">
        <Header />
        <div className="dashboard-body">
          <div className="row gy-4">
            <div className="col-lg-9">
              {/* Widgets Start */}
              <div className="row gy-4">
                <Statestics
                  numbers="155"
                  text="Completed Courses"
                  icon="ph-book-open"
                  chart="complete-course"
                />
                <Statestics
                  numbers="39"
                  text="Earned Certificate"
                  icon="ph-certificate"
                  chart="earned-certificate"
                />
                <Statestics
                  numbers="25"
                  text="Course in Progress"
                  icon="ph-graduation-cap"
                  chart="course-progress"
                />
                <Statestics
                  numbers="18k"
                  text="Community Support"
                  icon="ph-users-three"
                  chart="community-support"
                />
              </div>

              <StudyStatisticsChart />
              {/* Top Course End */}
              {/* Top Course Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="mb-20 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Top Courses Pick for You</h4>
                    <Link
                      to="/student_course"
                      className="text-13 fw-medium text-main-600 hover-text-decoration-underline"
                    >
                      See All
                    </Link>
                  </div>
                  <div className="row g-20">
                    <TopCourses
                      img="assets/images/thumbs/course-img5.png"
                      tag="Design 2"
                      title="Design Management"
                      author="abc"
                      lessons="12"
                      time="2h"
                      rating="4.9"
                      page="course-details1.html"
                    />
                    <TopCourses
                      img="assets/images/thumbs/course-img5.png"
                      tag="Design"
                      title="Design"
                      author="John Doe"
                      lessons="12"
                      time="2h"
                      rating="4.9"
                      page="course-details2.html"
                    />
                    <TopCourses
                      img="assets/images/thumbs/course-img5.png"
                      tag="Design"
                      title="Design"
                      author="John Doe"
                      lessons="12"
                      time="2h"
                      rating="4.9"
                      page="course-details3.html"
                    />
                  </div>
                </div>
              </div>
              {/* Top Course End */}
            </div>
            <div className="col-lg-3">
              {/* Calendar Start */}
              <div className="card">
                <div className="card-body">
                  <Calendar />
                </div>
              </div>
              {/* Calendar End */}
              {/* Assignment Start */}
              <div className="card mt-24">
                <div className="card-body">
                  <div className="mb-20 flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Assignments</h4>
                    <Link
                      to="/assignment"
                      className="text-13 fw-medium text-main-600 hover-text-decoration-underline"
                    >
                      See All
                    </Link>
                  </div>
                  <Assignment
                    img="ph-fill ph-graduation-cap"
                    title="Do The Research"
                    due="9"
                  />
                  <Assignment img="ph ph-code" title="PHP Dvelopment" due="2" />
                  <Assignment
                    img="ph ph-bezier-curve"
                    title="Graphic Design"
                    due="5"
                  />
                </div>
              </div>
              {/* Assignment End */}
              {/* Progress Bar Start */}
              <div className="card mt-24">
                <div className="card-header border-bottom border-gray-100">
                  <h5 className="mb-0">My Progress</h5>
                </div>
                <div className="card-body">
                  <MyProgress />
                </div>
              </div>
              {/* Progress bar end */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
