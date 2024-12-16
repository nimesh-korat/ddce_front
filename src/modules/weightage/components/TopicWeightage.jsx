import React, { useState } from "react";
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
    xaxis: {
      categories: topics.map((topic) => topic.Topic), // Topics as X-axis labels
    },
    yaxis: {
      min: 0,
      max: Math.max(...topics.map((topic) => topic.TopicWeightage)) + 2, // Ensure Y-axis is dynamic
    },
    title: {
      text: "Topic Weightage",
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
    </>
  );
}

export default TopicWeightage;
