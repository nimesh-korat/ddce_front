import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import animationData from "../no_graph.json"; // Import your animation data
import { getTopicWiseQuestionAnalytics } from "../../../apis/apis";
import Preloader from "../../../utils/preloader/Preloader";
import Chart from "../../../utils/Charts";

function TopicTracker() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["topicWiseAnalytics"],
    queryFn: getTopicWiseQuestionAnalytics,
    // (total obtained marks (topic-wise)/ total marks (topic-wise)) * 100
  });

  useEffect(() => {
    if (data && data.data.subjects.length > 0) {
      // Automatically set the first subject as selected
      const firstSubject = Object.keys(data.data.subjects[0])[0];
      setSelectedSubject(firstSubject);
    }
  }, [data]);

  if (isError) {
    console.error(error);
    return <div>Error loading analytics data</div>;
  }

  // Handle selecting a subject
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  // Find the data for the selected subject
  const selectedSubjectData = selectedSubject
    ? data.data.subjects.find(
        (subject) => Object.keys(subject)[0] === selectedSubject
      )
    : null;

  // Extract topics and their analytics
  const topics = selectedSubjectData
    ? selectedSubjectData[selectedSubject]
        .map((topic) => ({
          name: topic.topicName,
          accuracy:
            parseFloat(topic.accuracyPercentage) < 0
              ? 0
              : parseFloat(topic.accuracyPercentage), // Ensure accuracy is not negative
        }))
        .filter((topic) => topic.accuracy > 0) // Exclude topics with 0 accuracy
    : [];

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

  // Filter subjects to include only those with topics having accuracy > 0
  const filteredSubjects = data?.data?.subjects.filter((subject) => {
    const subjectTopics = Object.values(subject)[0];
    return subjectTopics.some(
      (topic) => parseFloat(topic.accuracyPercentage) > 0
    );
  });

  const chartOptions = {
    chart: {
      id: "topic-tracker-chart",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        columnWidth: calculateColumnWidth(), // Adjust column width based on screen size
      },
    },
    xaxis: {
      categories: topics.map((topic) => topic.name), // Topic names as X-axis labels
    },
    yaxis: {
      min: 0,
      max: 100,
      title: {
        text: "Accuracy (%)",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,

      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
  };

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="row gy-4">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                {data.data.subjects.length > 0 ? (
                  <>
                    <div className="mb-20 flex-between flex-wrap gap-8">
                      <h4 className="mb-0">Topic Tracker</h4>

                      <div className="flex-align gap-16 flex-wrap">
                        <select
                          className="form-select rounded-10"
                          value={selectedSubject || ""}
                          onChange={handleSubjectChange}
                        >
                          {filteredSubjects.map((subject, index) => {
                            const subjectName = Object.keys(subject)[0];
                            return (
                              <option key={index} value={subjectName}>
                                {subjectName}
                              </option>
                            );
                          })}
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
                              name: "Accuracy",
                              data: topics.map((topic) => topic.accuracy),
                            },
                          ]}
                          width={600}
                          height={400}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-center align-items-center">
                      <Lottie
                        animationData={animationData}
                        loop={true}
                        autoplay={true}
                        style={{
                          width: 500,
                          height: 500,
                          paddingTop: -150,
                          marginTop: -150,
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-center">
                        Attempt some tests to view analytics
                      </h4>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopicTracker;
