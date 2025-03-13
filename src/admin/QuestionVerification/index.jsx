import React, { useEffect, useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { useQuery } from "@tanstack/react-query";
import {
  getQuestionsForVerification,
  getSubjects,
  getSubTopics,
  getTopics,
} from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";
import AdminVerifyQuestionCard from "./components/QuestionCard";

function QuestionVerification() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [subTopicId, setSubTopicId] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };
  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => getTopics({ subjectId }),
    enabled: !!subjectId,
  });

  const { data: subTopics, isLoading: isLoadingSubTopics } = useQuery({
    queryKey: ["subtopics", topicId],
    queryFn: () => getSubTopics({ topicId }),
    enabled: !!topicId,
  });

  const handleSubjectChange = (e) => {
    const newSubjectId = e.target.value;
    setSubjectId(newSubjectId);
    setTopicId(null);
    setSubTopicId(null);
  };
  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", subTopicId],
    queryFn: () => getQuestionsForVerification({ subtopic_id: subTopicId }),
    enabled: !!subTopicId,
  });

  useEffect(() => {
    if (questions?.data) {
      setAvailableQuestions(questions.data);
      console.log(availableQuestions);
    }
  }, [questions, availableQuestions]);

  if (
    isLoadingSubjects ||
    isLoadingTopics ||
    isLoadingSubTopics ||
    isLoadingQuestions
  ) {
    return <Preloader />;
  }
  return (
    <>
      <AdminSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="container-fluid dashboard-content">
            <div className="row gy-2 ">
              <div className="col-md-4">
                <select
                  className="form-select"
                  onChange={handleSubjectChange}
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
              </div>

              {subjectId && (
                <div className="col-md-4">
                  <select
                    className="form-select"
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
                </div>
              )}

              {topicId && (
                <div className="col-md-4">
                  <select
                    className="form-select"
                    onChange={(e) => {
                      const selectedSubTopicId = e.target.value;
                      setSubTopicId(selectedSubTopicId);
                      setAvailableQuestions([]);
                    }}
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
                </div>
              )}

              {questions?.success === false ? (
                <div className="col-md-12">
                  <div className="d-flex justify-content-center">
                    <p className="text-center text-muted">
                      No questions available for this subtopic
                    </p>
                  </div>
                </div>
              ) : (
                subTopicId &&
                availableQuestions.length > 0 && (
                  <AdminVerifyQuestionCard questions={availableQuestions} />
                )
              )}

              {/* {subTopicId && availableQuestions.length > 0 && (
                <AdminVerifyQuestionCard questions={availableQuestions} />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionVerification;
