import React, { useEffect, useState, useContext } from "react";
import Chart from "../../../utils/Charts";
import { getSyllabus } from "../../../apis/apis";
import { useQuery } from "@tanstack/react-query";
import Preloader from "../../../utils/preloader/Preloader";
import UserContext from "../../../utils/UserContex";

function TopicWeightage() {
  const { user } = useContext(UserContext);
  const isJEE = user?.exam_type_id === 2;

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [yearRange, setYearRange] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["syllabus"],
    queryFn: getSyllabus,
  });

  // Filter subjects relevant to the student's exam type
  // Backend already filters by exam_type_id, so just show all returned subjects
  // For DDCET: only show subjects with TopicWeightage > 0 to avoid empty charts
  const availableSubjects = React.useMemo(() => {
    if (!data?.data) return [];
    if (isJEE) {
      // JEE: show all subjects returned by API (already filtered by backend)
      return data.data;
    }
    // DDCET: show subjects that have at least one topic with TopicWeightage > 0
    return data.data.filter((s) =>
      s.Topics?.some((t) => parseFloat(t.TopicWeightage) > 0),
    );
  }, [data, isJEE]);

  useEffect(() => {
    if (availableSubjects.length > 0) {
      setSelectedSubject(availableSubjects[0].Subject);
      setSelectedGroup(null);
    }
  }, [availableSubjects]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedGroup(null);
  };

  const selectedSubjectData = selectedSubject
    ? availableSubjects.find((s) => s.Subject === selectedSubject)
    : null;

  const hasGroups = selectedSubjectData?.Groups?.length > 0;

  const getTopics = () => {
    if (!selectedSubjectData) return [];
    if (hasGroups) {
      const groups = selectedSubjectData.Groups;
      const activeGroup = selectedGroup
        ? groups.find((g) => String(g.GroupId) === String(selectedGroup))
        : groups[0];
      return activeGroup?.Topics || [];
    }
    return selectedSubjectData.Topics || [];
  };

  const topics = getTopics();

  const getTopicWeightage = (topic) => {
    if (isJEE) {
      const now = new Date().getFullYear();
      const yw = topic.YearWeightage || [];
      const filtered =
        yearRange === "all"
          ? yw
          : yw.filter((w) => w.year >= now - parseInt(yearRange) + 1);
      return parseFloat(
        filtered.reduce((s, w) => s + (w.weightage || 0), 0).toFixed(2),
      );
    }
    return parseFloat(topic.TopicWeightage) || 0;
  };

  const chartOptions = {
    chart: { id: "topic-weightage-chart", toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "60%", distributed: true },
    },
    xaxis: { categories: topics.map((t) => t.Topic), labels: { show: false } },
    legend: { show: false },
    yaxis: {
      min: 0,
      max: Math.max(...topics.map((t) => getTopicWeightage(t)), 1) + 2,
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", colors: ["#333"] },
      formatter: (val) => `${val}%`,
    },
  };

  if (isError) return <div>Error loading data</div>;

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
              <div className="col-md-6 d-flex gap-8 flex-wrap align-items-center">
                {/* JEE year range */}
                {isJEE && (
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={yearRange}
                    onChange={(e) => setYearRange(e.target.value)}
                  >
                    <option value="1">Last Year</option>
                    <option value="3">Last 3 Years</option>
                    <option value="5">Last 5 Years</option>
                    <option value="10">Last 10 Years</option>
                    <option value="all">All Years</option>
                  </select>
                )}

                {/* Subject dropdown */}
                <select
                  className="form-select"
                  value={selectedSubject || ""}
                  onChange={handleSubjectChange}
                >
                  {availableSubjects.map((s, i) => (
                    <option key={i} value={s.Subject}>
                      {s.Subject}
                    </option>
                  ))}
                </select>

                {/* Group dropdown — only for subjects with groups (e.g. Chemistry) */}
                {hasGroups && (
                  <select
                    className="form-select"
                    value={
                      selectedGroup ||
                      selectedSubjectData.Groups[0]?.GroupId ||
                      ""
                    }
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    {selectedSubjectData.Groups.map((g) => (
                      <option key={g.GroupId} value={g.GroupId}>
                        {g.GroupName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {topics.length > 0 ? (
              <div className="col-md-12 mt-4">
                <Chart
                  type="bar"
                  options={chartOptions}
                  series={[
                    {
                      name: "Weightage",
                      data: topics.map((t) => getTopicWeightage(t)),
                    },
                  ]}
                  width={600}
                  height={400}
                />
              </div>
            ) : (
              <div className="text-center py-32 text-gray-400">
                No weightage data available for selected subject.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TopicWeightage;
