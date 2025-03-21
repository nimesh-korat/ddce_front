import React, { useEffect, useState } from "react";
import Chart from "../../../utils/Charts";
import { getSyllabus } from "../../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import Preloader from "../../../utils/preloader/Preloader";
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

  // Calculate the column width based on the number of categories
  const calculateColumnWidth = () => {
    const numCategories = topics.length;
    if (numCategories === 1) {
      return "20%"; // Smaller width when there is only one bar
    } else if (numCategories <= 3) {
      return "40%"; // Wider columns when there are fewer categories
    } else {
      return "60%"; // Default width for more categories
    }
  };

  const chartOptions = {
    chart: {
      id: "topic-weightage-chart",
      toolbar: {
        show: false, // Disable the toolbar (which includes download options)
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: calculateColumnWidth(), // Dynamically set column widthrelative to the available space
        distributed: true,
      },
    },
    xaxis: {
      categories: topics.map((topic) => topic.Topic),
      labels: {
        show: false,
        style: {
          colors: "#333",
          fontSize: "12px",
        },
      },
    },
    // xaxis: {
    //   labels: {
    //     show: false,
    //     style: {
    //       colors: "#333",
    //       fontSize: "12px",
    //     },
    //   },
    // },
    legend: {
      show: false, // Hide the legend
    },
    yaxis: {
      min: 0,
      max: Math.max(...topics.map((topic) => topic.TopicWeightage)) + 2,
    },
    title: {
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#ff44ffff",
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
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="row mt-12 mx-0">
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
      )}
    </>
  );
}

export default TopicWeightage;
