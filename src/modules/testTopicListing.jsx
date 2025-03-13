import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query"; // Importing React Query
import Preloader from "../utils/preloader/Preloader";
import Sidebar from "../common/sidebar";
import Header from "../common/header/Header";
import Footer from "../common/footer";
import { getSubjects, getTopics, getSubTopics } from "../apis/apis"; // Import API functions

function TestTopicListing() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [subTopicId, setSubTopicId] = useState(null); // Add subTopicId state

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  // Fetching subjects using React Query
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    error: subjectError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  // Fetching topics based on selected subject
  const {
    data: topics,
    isLoading: isLoadingTopics,
    error: topicError,
  } = useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => getTopics({ subjectId }),
    enabled: !!subjectId, // Only fetch topics when subjectId is selected
  });

  // Fetching subtopics based on selected topic
  const {
    data: subTopics,
    isLoading: isLoadingSubTopics,
    error: subTopicError,
  } = useQuery({
    queryKey: ["subtopics", topicId],
    queryFn: () => getSubTopics({ topicId }),
    enabled: !!topicId, // Only fetch subtopics when topicId is selected
  });

  // Handling errors
  if (subjectError || topicError || subTopicError) {
    return <div>Error fetching data</div>;
  }

  // Reset topic and subtopic when subject changes
  const handleSubjectChange = (e) => {
    const newSubjectId = e.target.value;
    setSubjectId(newSubjectId);
    setTopicId(null); // Reset topic
    setSubTopicId(null); // Reset subtopic
  };

  return (
    <>
      {isLoadingSubTopics ||
        isLoadingTopics ||
        (isLoadingSubjects && <Preloader />)}
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="container-fluid dashboard-content">
            <div className="row">
              {/* Subject Dropdown */}
              <div className="col-md-4">
                <select
                  className="form-select"
                  aria-label="Select subject"
                  onChange={handleSubjectChange} // Use handleSubjectChange function
                  disabled={isLoadingSubjects}
                  value={subjectId || ""}
                >
                  <option value="">Select Subject</option>
                  {subjects?.data?.map((subject) => (
                    <option key={subject.Id} value={subject.Id}>
                      {subject.Sub_Name}
                    </option>
                  ))}
                </select>
                {isLoadingSubjects && <p>Loading subjects...</p>}
              </div>

              {/* Topic Dropdown */}
              {subjectId && (
                <div className="col-md-4">
                  <select
                    className="form-select"
                    aria-label="Select Topic"
                    onChange={(e) => setTopicId(e.target.value)}
                    disabled={isLoadingTopics}
                    value={topicId || ""}
                  >
                    <option value="">Select Topic</option>
                    {topics?.data?.map((topic) => (
                      <option key={topic.Id} value={topic.Id}>
                        {topic.topic_name}
                      </option>
                    ))}
                  </select>
                  {isLoadingTopics && <p>Loading topics...</p>}
                </div>
              )}

              {/* Subtopic Dropdown */}
              {topicId && (
                <div className="col-md-4">
                  <select
                    className="form-select"
                    aria-label="Select Subtopic"
                    onChange={(e) => setSubTopicId(e.target.value)}
                    disabled={isLoadingSubTopics}
                    value={subTopicId || ""}
                  >
                    <option value="">Select Subtopic</option>
                    {subTopics?.data?.map((subTopic) => (
                      <option key={subTopic.Id} value={subTopic.Id}>
                        {subTopic.SubTopicName}
                      </option>
                    ))}
                  </select>
                  {isLoadingSubTopics && <p>Loading subtopics...</p>}
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

export default TestTopicListing;
