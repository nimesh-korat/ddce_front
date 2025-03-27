import React, { useContext, useEffect, useState } from "react";
import Footer from "../../common/footer";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { useMutation } from "@tanstack/react-query";
import { studentGetResult } from "../../apis/apis";
import { useLocation } from "react-router-dom";
import UserContext from "../../utils/UserContex";
import Preloader from "../../utils/preloader/Preloader";
import QuizQuestionsAnswer from "./components/QuizQuestionAnswer";
import ResultOverview from "./components/Result";

function ExamResult() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [filterType, setFilterType] = useState("all"); // State for filter type
  const location = useLocation();
  const { test } = location.state || {};
  const { user } = useContext(UserContext);
  const std_id = user.id;

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const fetchStudentResult = useMutation({
    mutationFn: (data) => studentGetResult(data),
    onSuccess: (data) => {
      setResultData(data.data);
    },
    onError: (error) => {
      console.error("Error fetching student result:", error.message);
    },
  });

  useEffect(() => {
    if (test && test.test_id) {
      fetchStudentResult.mutate({ std_id: std_id, test_id: test.test_id });
    }
    // eslint-disable-next-line
  }, [test]);

  if (fetchStudentResult.isLoading) {
    return <Preloader />;
  }

  if (!resultData) {
    return <Preloader />;
  }

  const {
    total_correct,
    total_incorrect,
    total_skipped,
    question_data,
    total_marks,
    obtained_marks,
    result_gen_datetime,
  } = resultData;

  const pieChartData = {
    series: [total_correct, total_incorrect, total_skipped],
    options: {
      chart: { type: "pie", width: "100%", height: "250px" },
      dataLabels: { enabled: false },
      labels: [
        `&nbsp; ${total_correct} Correct`,
        `&nbsp; ${total_incorrect} Incorrect`,
        `&nbsp; ${total_skipped} Skipped`,
      ],
      colors: ["#28a745", "#dc3545", "#ffc107"],
      tooltip: {
        y: {
          formatter: (val) =>
            `${val} (${(
              (val / (total_correct + total_incorrect + total_skipped)) *
              100
            ).toFixed(2)}%)`,
        },
      },
      // events: {
      //   dataPointSelection: (event, chartContext, config) => {
      //     const selectedLabel = config.w.globals.labels[config.dataPointIndex];
      //     const label = selectedLabel.split(" ")[2]; // Extract "Correct", "Incorrect", or "Skipped"
      //     setFilterType(label.toLowerCase()); // Update filter based on the label (correct, incorrect, skipped)
      //     console.log("Selected Label:", label); // Log the selected label only
      //   },
      // },
    },
  };

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="row gy-4">
            <QuizQuestionsAnswer
              questionData={question_data}
              filterType={filterType} // Pass the filterType prop
            />
            <ResultOverview
              testName={test?.test_name}
              pieChartData={pieChartData}
              totalMarks={total_marks}
              obtainedMarks={obtained_marks}
              resultGenDateTime={result_gen_datetime}
              setFilterType={setFilterType} // Pass the setFilterType function to allow manual filter change
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ExamResult;
