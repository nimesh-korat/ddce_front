import React, { useEffect, useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import StudyOverview from "./components/StudyOverview";
import HomeWidgets from "./components/Widget";
import Greetings from "./components/Greetings";
import ProgressStatistics from "./components/ProgressStatistics";
import MostActivity from "./components/MostActivity";
import Preloader from "../../utils/Preloader";

function HomeThree() {
  const [isReady, setIsReady] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  useEffect(() => {
    setIsReady(true); // Ensure the DOM is ready before rendering the chart
  }, []);

  return (
    <>
      {!isReady && <Preloader />}
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />

      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="row gy-4">
            <div className="col-xxl-8">
              <Greetings />
            </div>
            <div className="col-xxl-4">
              {/* Widgets Start */}
              <div className="row gy-4">
                <HomeWidgets
                  bgColor={"bg-main-600"}
                  img="ph-fill ph-graduation-cap"
                  title="Total Questions"
                  count="10,000"
                />
                <HomeWidgets
                  bgColor={"bg-main-two-600 "}
                  img="ph-fill ph-graduation-cap"
                  title="Earned Certificate"
                  count="39"
                  isLocked={true}
                />
                <HomeWidgets
                  bgColor={"bg-purple-600"}
                  img="ph-fill ph-certificate"
                  title="Course in Progress"
                  count="25"
                  isLocked={true}
                />
                <HomeWidgets
                  bgColor="bg-warning-600 "
                  img="ph-fill ph-users-four"
                  title="Community Support"
                  count="18k"
                  isLocked={true}
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
        <Footer />
      </div>
    </>
  );
}

export default HomeThree;
