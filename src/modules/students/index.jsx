import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../utils/UserContex";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Import React Query hook
import { getSyllabus } from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";

function Syllabus() {
  const { user } = useContext(UserContext);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeSubTopic, setActiveSubTopic] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  //eslint-disable-next-line
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [yearRange, setYearRange] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };
  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const toggleCourse = (index) => {
    setActiveSubTopic((prevIndex) => (prevIndex === index ? null : index));
  };

  // eslint-disable-next-line no-unused-vars
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["syllabus"],
    queryFn: getSyllabus,
  });

  // exam_type_id 2 = JEE (from tbl_exam_type)
  const isJEE = user?.exam_type_id === 2;

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setActiveSubTopic(null);
    setSelectedTopic(null);
    setSelectedGroup(null);
  };

  const filteredSubjects = selectedSubject
    ? data?.data.filter((subject) => subject.Subject === selectedSubject)
    : data?.data;

  useEffect(() => {
    if (filteredSubjects?.length > 0) {
      setSelectedSubject(filteredSubjects[0].Subject);
    }
  }, [filteredSubjects]);

  const getWeightageLabel = (topic) => {
    if (isJEE) {
      const now = new Date().getFullYear();
      const yw = topic.YearWeightage || [];
      const filtered =
        yearRange === "all"
          ? yw
          : yw.filter((w) => w.year >= now - parseInt(yearRange) + 1);
      const total = filtered.reduce((s, w) => s + (w.weightage || 0), 0);
      return total > 0 ? `Weightage: ${total.toFixed(1)}%` : "";
    }
    // DDCET — show weightage from tbl_topic.weightage
    const w = parseFloat(topic.TopicWeightage);
    return !isNaN(w) && w > 0 ? `Weightage: ${w}%` : "";
  };

  // Original topic renderer — exact same original UI
  const renderTopics = (topics, keyPrefix = "") =>
    topics.map((topic, topicIndex) => {
      const key = `${keyPrefix}${topicIndex}`;
      return (
        <div className="card mb-5" key={key}>
          <div className="card-body p-0 ">
            <div>
              <button
                type="button"
                className={`course-item__button flex-align gap-4 w-100 p-16  ${
                  activeSubTopic === key ? "active" : ""
                }`}
                onClick={() => toggleCourse(key)}
              >
                <span className="d-block text-start">
                  <span className="d-block h5 mb-0 text-line-1">
                    {topic.Topic}
                  </span>{" "}
                  <span className="d-block text-15 text-gray-300">
                    {getWeightageLabel(topic)}
                  </span>
                </span>
                <span className="ms-auto text-20 text-gray-500">
                  <i
                    className={`ph ${activeSubTopic === key ? "ph-caret-up" : "ph-caret-down"}`}
                  />
                </span>
              </button>
              {/* Dropdown content for subtopics */}
              <div
                className={`course-item-dropdown border-bottom border-gray-100 ${activeSubTopic === key ? "d-block" : "d-none"}`}
              >
                <ul className="course-list p-16 pb-0">
                  {topic.Subtopics.map((subtopic, subIndex) => (
                    <li
                      className="course-list__item flex-align gap-8 mb-16"
                      key={subIndex}
                    >
                      <div className="w-100">
                        <Link className="text-gray-300 fw-medium d-block hover-text-main-600 d-lg-block">
                          {subIndex + 1}. {subtopic.Subtopic}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    });

  if (isError) {
    // console.log(error);
  }

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {isLoading ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            <div className="breadcrumb mb-24">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to="/"
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
                    Syllabus
                  </span>
                </li>
              </ul>
            </div>
            <div className="container-fluid dashboard-content">
              <div className="row g-2">
                <select
                  className="form-select "
                  value={selectedSubject || ""}
                  onChange={handleSubjectChange}
                >
                  {data.data.map((subject, index) => (
                    <option key={index} value={subject.Subject}>
                      {subject.Subject}
                    </option>
                  ))}
                </select>

                {/* JEE Year Range Filter — only for JEE students */}
                {isJEE && (
                  <div className="col-md-12 pt-12 pb-4">
                    <div className="flex-align gap-8 flex-wrap">
                      <span className="text-13 fw-semibold text-gray-600">
                        JEE Weightage Range:
                      </span>
                      {[
                        { label: "Last Year", value: "1" },
                        { label: "Last 3 Years", value: "3" },
                        { label: "Last 5 Years", value: "5" },
                        { label: "Last 10 Years", value: "10" },
                        { label: "All Years", value: "all" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          className={`btn btn-sm rounded-pill px-14 py-5 text-13 ${yearRange === opt.value ? "btn-main" : "btn-outline-secondary"}`}
                          onClick={() => setYearRange(opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics */}
                {selectedSubject && (
                  <div className="col-md-12 pt-12">
                    {filteredSubjects.map((subject, index) => (
                      <div className="course-item" key={index}>
                        {/* JEE: Group dropdown + topics */}
                        {subject.Groups &&
                          subject.Groups.length > 0 &&
                          (() => {
                            const groups = subject.Groups;
                            const activeGroup = selectedGroup
                              ? groups.find(
                                  (g) =>
                                    String(g.GroupId) === String(selectedGroup),
                                )
                              : groups[0];
                            return (
                              <div>
                                <select
                                  className="form-select mb-16"
                                  value={activeGroup?.GroupId || ""}
                                  onChange={(e) => {
                                    setSelectedGroup(e.target.value);
                                    setActiveSubTopic(null);
                                  }}
                                >
                                  {groups.map((g) => (
                                    <option key={g.GroupId} value={g.GroupId}>
                                      {g.GroupName}
                                    </option>
                                  ))}
                                </select>
                                {activeGroup &&
                                  renderTopics(
                                    activeGroup.Topics,
                                    `g${activeGroup.GroupId}-`,
                                  )}
                              </div>
                            );
                          })()}

                        {/* DDCET: Ungrouped topics (original flow) */}
                        {subject.Topics &&
                          subject.Topics.length > 0 &&
                          renderTopics(subject.Topics)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default Syllabus;
