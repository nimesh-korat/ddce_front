import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addTestQuestions,
  getQuestionsForTest,
  getSubjects,
  getSubTopics,
  getTopics,
} from "../../apis/apis";
import AdminAddQuizQuestionCard from "./components/QuestionCard";
import Preloader from "../../utils/Preloader";
import Footer from "../../common/footer";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddQuizQuestions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {}; // Safely destructuring

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [subTopicId, setSubTopicId] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("All");

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

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", subTopicId],
    queryFn: () => getQuestionsForTest({ subtopic_id: subTopicId }),
    enabled: !!subTopicId,
  });

  const addTestQuestionQuery = useMutation({
    mutationFn: addTestQuestions,
    onSuccess: (data) => {
      toast.success(data.message, {
        onClose: () => {
          localStorage.removeItem("selectedQuestions");
          navigate("/admin/showTests", { replace: true });
        },
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  // Update available questions once fetched
  useEffect(() => {
    if (questions?.data) {
      setAvailableQuestions(questions.data);

      // Reset selected questions when subtopic changes
      const storedSelectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions') || '[]');
      setSelectedQuestions(storedSelectedQuestions);
    }
  }, [questions]);

  useEffect(() => {
    // Store selected questions in local storage whenever they change
    localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
  }, [selectedQuestions]);

  if (!test) {
    return <div>Test not found</div>;
  }

  const handleAddQuestion = (question) => {
    setAvailableQuestions((prev) =>
      prev.filter((q) => q.question_id !== question.question_id)
    );
    setSelectedQuestions((prev) => [...prev, question]);
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.question_id !== question.question_id)
    );
    setAvailableQuestions((prev) => [...prev, question]);
  };

  const handleSaveQuestions = () => {
    const formattedData = {
      test_id: test.test_id,
      q_id: selectedQuestions.map((question) => ({
        q_id: question.question_id,
      })),
      added_by: 1,
    };

    addTestQuestionQuery.mutate(formattedData);
  };

  // Filter logic
  const filteredQuestions =
    difficultyFilter === "All"
      ? availableQuestions
      : availableQuestions.filter(
          (question) => question.question_difficulty === difficultyFilter
        );

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
  };

  if (
    isLoadingSubjects ||
    isLoadingTopics ||
    isLoadingSubTopics ||
    isLoadingQuestions
  ) {
    return <Preloader />;
  }

  // Handle case when no questions are available
  if (questions?.data?.length === 0) {
    return <div>No questions available for the selected subtopic.</div>;
  }

  const handleSubjectChange = (e) => {
    const newSubjectId = e.target.value;
    setSubjectId(newSubjectId);
    setTopicId(null);
    setSubTopicId(null);
  };

  const totalMarks = selectedQuestions.reduce(
    (sum, question) => sum + (question.question_marks || 0),
    0
  );

  return (
    <>
      <AdminSidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive(!isSidebarActive)} />
        <div className="dashboard-body">
          <div className="container-fluid dashboard-content">
            <div className="row gy-2">
              <p className="fw-bold h5">Test Name: {test?.test_name}</p>
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
                </div>
              )}
            </div>

            {subTopicId && (
              <>
                <div className="col-md-3 mt-12">
                  <label className="form-label">Select Difficulty</label>
                  <select
                    className="form-select"
                    onChange={handleDifficultyChange}
                    value={difficultyFilter}
                  >
                    <option value="All">All</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Time Consuming">Time Consuming</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="mt-12">Available Questions:</h5>
                    {filteredQuestions.map((question, index) => (
                      <AdminAddQuizQuestionCard
                        key={index}
                        index={index + 1}
                        question={question.question_text}
                        option1={question.option_a_text}
                        option2={question.option_b_text}
                        option3={question.option_c_text}
                        option4={question.option_d_text}
                        answer={question.answer_text}
                        isAsked={question.isAsked}
                        question_marks={question.question_marks}
                        question_difficulty={question.question_difficulty}
                        onAction={() => handleAddQuestion(question)}
                        actionLabel="Add"
                      />
                    ))}
                  </div>
                  <div className="col-md-6">
                    <h5 className="mt-12">Selected Questions:</h5>
                    {selectedQuestions.map((question, index) => (
                      <AdminAddQuizQuestionCard
                        key={index}
                        index={index + 1}
                        question={question.question_text}
                        option1={question.option_a_text}
                        option2={question.option_b_text}
                        option3={question.option_c_text}
                        option4={question.option_d_text}
                        answer={question.answer_text}
                        isAsked={question.is_asked}
                        question_marks={question.question_marks}
                        question_difficulty={question.question_difficulty}
                        onAction={() => handleRemoveQuestion(question)}
                        actionLabel="Remove"
                      />
                    ))}
                    {selectedQuestions.length > 0 && (
                      <>
                        <p>Total Marks: {totalMarks}</p>
                        <button
                          className="btn btn-primary"
                          onClick={handleSaveQuestions}
                        >
                          Save Questions
                        </button>
                      </>
                    )}
                    {selectedQuestions.length === 0 && (
                      <p>No questions selected.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AddQuizQuestions;
