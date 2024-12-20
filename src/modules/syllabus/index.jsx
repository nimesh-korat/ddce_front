import React, { useEffect, useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Import React Query hook
import { getSyllabus } from "../../apis/apis";
import Preloader from "../../utils/Preloader";

function Syllabus() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeSubTopic, setActiveSubTopic] = useState(null); // Active course dropdown index
  const [selectedSubject, setSelectedSubject] = useState(null); // Selected subject
  //eslint-disable-next-line
  const [selectedTopic, setSelectedTopic] = useState(null); // Selected topic

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const toggleCourse = (index) => {
    setActiveSubTopic((prevIndex) => (prevIndex === index ? null : index));
  };

  // Use React Query's `useQuery` hook to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["syllabus"],
    queryFn: getSyllabus,
  });

  // Handle selecting a subject
  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setActiveSubTopic(null);
    setSelectedTopic(null); // Reset topic when changing subject
  };

  // Filter subjects based on selected subject
  const filteredSubjects = selectedSubject
    ? data?.data.filter((subject) => subject.Subject === selectedSubject)
    : data?.data;

  useEffect(() => {
    if (filteredSubjects?.length > 0) {
      setSelectedSubject(filteredSubjects[0].Subject);
    }
  }, [filteredSubjects]);

  if (isLoading) {
    return <Preloader />;
  }

  if (isError) {
    console.log(error);
  }
  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
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

              {/* Only show topics and buttons when a subject is selected */}
              {selectedSubject && (
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body p-0">
                      {/* Loop through the filtered subjects */}
                      {filteredSubjects.map((subject, index) => (
                        <div className="course-item" key={index}>
                          {/* Button to toggle dropdown for topics */}
                          {subject.Topics.map((topic, topicIndex) => (
                            <div key={topicIndex}>
                              <button
                                type="button"
                                className={`course-item__button flex-align gap-4 w-100 p-16 border-bottom border-gray-100 ${
                                  activeSubTopic === topicIndex ? "active" : ""
                                }`}
                                onClick={() => toggleCourse(topicIndex)}
                              >
                                <span className="d-block text-start">
                                  <span className="d-block h5 mb-0 text-line-1">
                                    {topic.Topic}
                                  </span>{" "}
                                  <span className="d-block text-15 text-gray-300">
                                    {`Weightage: ${topic.TopicWeightage}%`}
                                  </span>
                                </span>
                                <span className="ms-auto text-20 text-gray-500">
                                  <i
                                    className={`ph ${
                                      activeSubTopic === topicIndex
                                        ? "ph-caret-up"
                                        : "ph-caret-down"
                                    }`}
                                  />
                                </span>
                              </button>
                              {/* Dropdown content for subtopics */}
                              <div
                                className={`course-item-dropdown border-bottom border-gray-100 ${
                                  activeSubTopic === topicIndex
                                    ? "d-block"
                                    : "d-none"
                                }`}
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
                                          {/* <span className="text-gray-300 fw-normal d-block">
                                            {`Total Questions: ${subtopic.TotalQuestions}`}
                                          </span> */}
                                        </Link>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Syllabus;
