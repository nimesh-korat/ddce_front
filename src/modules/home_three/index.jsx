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
import { getDashboardCounts } from "../../apis/apis";
import Marquee from "react-fast-marquee";

function Home() {
  const [isReady, setIsReady] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardCounts"],
    queryFn: getDashboardCounts,
  });

  if (isError) {
    console.log(error);
  }

  useEffect(() => {
    setIsReady(true); // Ensure the DOM is ready before rendering the chart
  }, []);

  const marqueeContent = [
    {
      title: "⚡ Chemistry - Acids, Bases & Salts Material Solution Added",
    },
    {
      title: "⚗️ Chemistry - Acids, Bases & Salts Material Added",
    },
    {
      title: "🧪 Chemistry - Acids, Bases & Salts Quiz Added",
    },
    {
      title: "📖 Determinant & Matrices Material Solution Added",
    },
    {
      title: "📑 Determinant & Matrices Material Added",
    },
    {
      title: "🗣️ Determinant & Matrices Quiz Added",
    },
    {
      title: "⚖️ Logarithm & Statistics Material Solution Added",
    },
    {
      title: "⚡ Logarithm & Statistics Material Added",
    },
    {
      title: "➗ Logarithm & Statistics Quiz Added",
    },
    {
      title: "😎 Soft Skill Grammer Material Solution Added",
    },
    // {
    //   title: "⭐ Soft Skill Grammer Material Added",
    // },
    // {
    //   title: "🌀 Soft Skill Grammer Quiz Added",
    // },
    // {
    //   title: "🧑‍🎓 Soft Skill Material Solution Added",
    // },
    // {
    //   title: "📖 New Soft Skill Material Added",
    // },
    // {
    //   title: "🗣️ Soft Skill - Word & Sentence Quiz Added",
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
                <Greetings />
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
                    count="200"
                    isLocked={false}
                  />
                  <HomeWidgets
                    bgColor={"bg-purple-600"}
                    img="ph-fill ph-users-four"
                    title="Online Students"
                    count={data?.data?.total_users || 0}
                    isLocked={false}
                  />
                  <HomeWidgets
                    bgColor="bg-warning-600 "
                    img="ph-fill ph-certificate"
                    title="Quiz Completed"
                    count={data?.data?.total_completed_quizzes || 0}
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
    </>
  );
}

export default Home;
