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
import Pagination from "@mui/material/Pagination";
// import { Tooltip } from "@mui/material";
import PopupComponent from "./components/Summary";

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

  // Filters state
  const [showFilter, setShowFilter] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [rangeFilter, setRangeFilter] = useState("All");
  const [isToggled, setIsToggled] = useState(false);

  // Subject-wise and Topic-wise counts
  const [subjectWiseCount, setSubjectWiseCount] = useState({});
  const [topicWiseCount, setTopicWiseCount] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [openModal, setOpenModal] = useState(false); // Modal open state

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
      const storedSelectedQuestions = JSON.parse(
        localStorage.getItem("selectedQuestions") || "[]"
      );
      setSelectedQuestions(storedSelectedQuestions);
    }
  }, [questions]);

  useEffect(() => {
    // Store selected questions in local storage whenever they change
    localStorage.setItem(
      "selectedQuestions",
      JSON.stringify(selectedQuestions)
    );
  }, [selectedQuestions]);

  if (!test) {
    return <div>Test not found</div>;
  }

  const handleAddQuestion = (question) => {
    setAvailableQuestions((prev) =>
      prev.filter((q) => q.question_id !== question.question_id)
    );
    setSelectedQuestions((prev) => [...prev, question]);

    // Update subject-wise count
    setSubjectWiseCount((prevCount) => {
      const newCount = { ...prevCount };
      const subject = subjects?.data?.find(
        (s) => s.Id.toString() === subjectId?.toString()
      );
      if (subject) {
        const subjectName = subject.Sub_Name;
        newCount[subjectName] = (newCount[subjectName] || 0) + 1;
      }
      return newCount;
    });

    // Update topic-wise count
    setTopicWiseCount((prevCount) => {
      const newCount = { ...prevCount };
      const topic = topics?.data?.find(
        (t) => t.Id.toString() === topicId?.toString()
      );
      if (topic) {
        const topicName = topic.topic_name;
        newCount[topicName] = (newCount[topicName] || 0) + 1;
      }
      return newCount;
    });
  };

  const handleRemoveQuestion = (question) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.question_id !== question.question_id)
    );
    setAvailableQuestions((prev) => [...prev, question]);

    // Update subject-wise count
    setSubjectWiseCount((prevCount) => {
      const newCount = { ...prevCount };
      const subject = subjects?.data?.find(
        (s) => s.Id.toString() === subjectId?.toString()
      );
      if (subject) {
        const subjectName = subject.Sub_Name;
        newCount[subjectName] = Math.max((newCount[subjectName] || 1) - 1, 0);
      }
      return newCount;
    });

    // Update topic-wise count
    setTopicWiseCount((prevCount) => {
      const newCount = { ...prevCount };
      const topic = topics?.data?.find(
        (t) => t.Id.toString() === topicId?.toString()
      );
      if (topic) {
        const topicName = topic.topic_name;
        newCount[topicName] = Math.max((newCount[topicName] || 1) - 1, 0);
      }
      return newCount;
    });
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
  // Filter questions based on selected filters
  const filteredQuestions = availableQuestions
    .filter(
      (question) =>
        difficultyFilter === "All" ||
        question.question_difficulty === difficultyFilter
    )
    .filter(
      (question) => !isToggled || !question.isAsked // Show "Never Asked" if toggled
    );

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
  };

  const itemsPerPage =
    rangeFilter === "All" ? filteredQuestions.length : Number(rangeFilter);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const getCurrentPageQuestions = (filteredQuestions) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  };

  const getAdjustedIndex = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  const handleRangeChange = (e) => {
    setRangeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when range filter changes
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
    setAvailableQuestions([]);
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
                    onChange={(e) => {
                      setTopicId(e.target.value);
                      setSubTopicId(null);
                      setAvailableQuestions([]);
                    }}
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
                <div className="col-md-6 mt-12 text-end">
                  <button
                    className={`btn-outline-custom`}
                    onClick={() => {
                      setShowFilter(!showFilter);
                      setRangeFilter("All");
                      setDifficultyFilter("All");
                      setIsToggled(false);
                      setCurrentPage(1);
                    }}
                  >
                    <i className="ph ph-funnel"></i>
                    {/* <span className="text-25">Filter</span> */}
                  </button>
                </div>

                <div
                  className={`filter-content ${showFilter ? "show" : ""} col-6`}
                >
                  <div className="row d-flex justify-content-between mt-12">
                    <div className="w-auto d-flex align-items-center">
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
                    <div className="w-auto d-flex align-items-center">
                      <div className="toggle-wrapper">
                        <span className="toggle-label">All</span>
                        <div
                          className={`toggle-button ${
                            isToggled ? "toggled" : ""
                          }`}
                          onClick={() => setIsToggled(!isToggled)}
                        >
                          <div className="toggle-circle"></div>
                        </div>
                        <span className="toggle-label">Never Asked</span>
                      </div>
                    </div>
                    <div className="w-auto d-flex align-items-center">
                      <select
                        className="form-select"
                        onChange={handleRangeChange}
                        value={rangeFilter}
                      >
                        <option value="All">All</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mt-12">
                  <div className="col-md-6">
                    <h5 className="mt-12">Available Questions:</h5>
                    <div className="col-12 scrollable-column">
                      {getCurrentPageQuestions(filteredQuestions).length > 0 ? (
                        getCurrentPageQuestions(filteredQuestions).map(
                          (question, index) => (
                            <AdminAddQuizQuestionCard
                              key={index}
                              index={getAdjustedIndex(index)} // Adjusted index
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
                          )
                        )
                      ) : (
                        <p>No questions available for the selected subtopic.</p>
                      )}
                    </div>
                    {/* Pagination */}
                    <div className="pagination-controls">
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                        variant="outlined"
                        color="primary"
                        siblingCount={1} // Controls the number of pages before and after the current page
                        boundaryCount={1}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mt-12">Selected Questions:</h5>
                      {/* <Tooltip title="View Summary" arrow>
                        <i
                          className="ph-fill ph-info "
                          style={{ fontSize: "25px", cursor: "pointer" }}
                          onClick={() => setOpenModal(true)}
                        />
                      </Tooltip> */}
                    </div>
                    <div className="col-12 scrollable-column">
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
                    </div>
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

      <PopupComponent
        subjectWiseCount={subjectWiseCount}
        topicWiseCount={topicWiseCount}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
}

export default AddQuizQuestions;
