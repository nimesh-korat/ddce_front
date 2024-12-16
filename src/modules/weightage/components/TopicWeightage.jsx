import React, { useEffect, useState } from "react";
import Chart from "../../../utils/Charts";
import { getSyllabus } from "../../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import Preloader from "../../../utils/Preloader";
function TopicWeightage() {
  const [selectedSubject, setSelectedSubject] = useState(null); // Selected subject

  // Use React Query's `useQuery` hook to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["syllabus"],
    queryFn: getSyllabus,
  });
  useEffect(() => {
    if (data && data.data.length > 0) {
      // Find the "Mathematics" subject in the data
      const mathematicsSubject = data.data.find(
        (subject) => subject.Subject === "Mathematics"
      );

      if (mathematicsSubject) {
        setSelectedSubject(mathematicsSubject.Subject); // Set "Mathematics" as the selected subject
      } else {
        // Fallback if "Mathematics" is not found (optional)
        setSelectedSubject(data.data[0].Subject);
      }
    }
  }, [data]); // Run only when `data` is updated
  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    console.log(error);
    return <div>Error loading data</div>;
  }

  // Handle selecting a subject
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  // Find the subject data for the selected subject
  const selectedSubjectData = selectedSubject
    ? data.data.find((subject) => subject.Subject === selectedSubject)
    : null;

  // If there's a selected subject, we want to display topics and their weightages
  const topics = selectedSubjectData ? selectedSubjectData.Topics : [];

  const chartOptions = {
    chart: {
      id: "topic-weightage-chart",
      toolbar: {
        show: false, // Disable the toolbar (which includes download options)
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4, // Optionally round the corners of the bars
        horizontal: false, // Set to true if you want a horizontal bar chart
        // columnWidth: "80%", // Controls the width of the bars relative to the available space
        distributed: true, // Ensures the bars are evenly distributed
      },
    },
    xaxis: {
      categories: topics.map((topic) => topic.Topic), // Topics as X-axis labels
    },
    yaxis: {
      min: 0,
      max: Math.max(...topics.map((topic) => topic.TopicWeightage)) + 2, // Ensure Y-axis is dynamic
    },
    title: {
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
      formatter: (val) => `${val}%`,
    },
  };

  return (
    <>
      <div className="row mt-12">
        <div className="card shadow mt-4 p-20">
          <div className="col-md-12 d-flex justify-between">
            <div className="col-md-6">
              <h4>Topic Weightage</h4>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedSubject || ""}
                onChange={handleSubjectChange}
              >
                <option value="">Select a Subject</option>
                {data.data.map((subject, index) => (
                  <option key={index} value={subject.Subject}>
                    {subject.Subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedSubject && (
            <div className="col-md-12 mt-4 ">
              <Chart
                type="bar"
                options={chartOptions}
                series={[
                  {
                    name: "Weightage",
                    data: topics.map((topic) => topic.TopicWeightage), // Weightages of the topics
                  },
                ]}
                width={600}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TopicWeightage;
