import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminAddParagraph,
  adminAddQuestions,
  adminGetParagraph,
  getSubjects,
  getSubTopics,
  getTopics,
} from "../../apis/apis";
import Preloader from "../../utils/Preloader";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import Question from "./components/Question";
import { toast } from "react-toastify";
import AdminSidebar from "../../common/AdminSidebar";
import ParagraphBasedQuestion from "./components/ParagraphBasedQuestion";

function AddQuestion() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [subTopicId, setSubTopicId] = useState(null);
  const [paragraphId, setParagraphId] = useState(null);
  const [paragraphData, setParagraphData] = useState({
    paragraph_title: "",
    paragraph_text: "",
    paragraph_img: null,
    tbl_subtopic: null,
  });
  const [data, setData] = useState({
    tbl_subtopic: null,
    isParagraph: false,
    tbl_paragraph: null,
    question_text: "",
    question_image: null,
    option_a_text: "",
    option_a_image: null,
    option_b_text: "",
    option_b_image: null,
    option_c_text: "",
    option_c_image: null,
    option_d_text: "",
    option_d_image: null,
    answer_text: "",
    answer_image: null,
    question_marks: "",
    question_difficulty: "Easy",
    prevAskedPaper: "",
    prevAskedYear: "",
    fromBook: "",
    isImageQuestion: false,
    isImageOption: false,
    isAskedPreviously: false,
    isFromBook: false,
  });
  const queryClient = useQueryClient();

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

  const { data: paragraphs } = useQuery({
    queryKey: ["paragraphs", subTopicId],
    queryFn: () => adminGetParagraph({ subtopic_id: subTopicId }),
    enabled: !!subTopicId,
  });

  const handleSubjectChange = (e) => {
    const newSubjectId = e.target.value;
    setSubjectId(newSubjectId);
    setTopicId(null);
    setSubTopicId(null);
  };

  const addQuestionMutation = useMutation({
    mutationFn: (formData) => adminAddQuestions(formData),
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add question");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Question added successfully");
      resetForm();
    },
  });

  const addParagraphMutation = useMutation({
    mutationFn: (formData) => adminAddParagraph(formData),
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add question");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["paragraphs", subTopicId]);
      toast.success(data.message || "Paragraph added successfully", {
        autoClose: 1500,
      });
      setParagraphData({
        ...paragraphData,
        paragraph_title: "",
        paragraph_text: "",
        paragraph_img: null,
      });
    },
  });

  const resetForm = () => {
    setData({
      ...data,
      question_text: "",
      isParagraph: false,
      tbl_paragraph: null,
      question_image: null,
      option_a_text: "",
      option_a_image: null,
      option_b_text: "",
      option_b_image: null,
      option_c_text: "",
      option_c_image: null,
      option_d_text: "",
      option_d_image: null,
      answer_text: "",
      answer_image: null,
      question_marks: "",
      question_difficulty: "Easy",
      isImageQuestion: false,
      isImageOption: false,
      isAskedPreviously: false,
      isFromBook: false,
    });
  };

  const addQuestion = () => {
    if (
      !data.tbl_subtopic ||
      !data.question_text ||
      !data.answer_text ||
      !data.question_marks
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const formData = new FormData();

    // Append all data fields
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    addQuestionMutation.mutate(formData);
  };

  const addParagraphBasedQuestion = () => {
    const formData = new FormData();

    // Append all data fields
    Object.keys(paragraphData).forEach((key) => {
      formData.append(key, paragraphData[key]);
    });
    console.log([...formData]);

    addParagraphMutation.mutate(formData);
  };

  return (
    <>
      {addQuestionMutation.isLoading ||
        isLoadingSubTopics ||
        isLoadingTopics ||
        (isLoadingSubjects && <Preloader />)}
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
                    onChange={(e) => {
                      setTopicId(e.target.value); 
                      setSubTopicId(null);
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
                    onChange={(e) => {
                      const selectedSubTopicId = e.target.value;
                      setSubTopicId(selectedSubTopicId);
                      setData((prevData) => ({
                        ...prevData,
                        tbl_subtopic: selectedSubTopicId,
                      }));
                      setParagraphData((prevData) => ({
                        ...prevData,
                        tbl_subtopic: selectedSubTopicId,
                      }));
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
            </div>

            {subTopicId && (
              <div className="row pt-10">
                <div className="container mt-5">
                  {/* Navigation Bar for Tabs */}
                  <ul className="nav nav-tabs" id="questionTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        className="nav-link active"
                        id="simple-question-tab"
                        data-bs-toggle="tab"
                        href="#simple-question"
                        role="tab"
                        aria-controls="simple-question"
                        aria-selected="true"
                      >
                        Add Question
                      </a>
                    </li>
                    {subTopicId === "83" && topicId === "20" && (
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link"
                          id="paragraph-question-tab"
                          data-bs-toggle="tab"
                          href="#paragraph-question"
                          role="tab"
                          aria-controls="paragraph-question"
                          aria-selected="false"
                        >
                          Add Paragraph
                        </a>
                      </li>
                    )}
                  </ul>
                  {/* Tab Content */}
                  <div className="tab-content mt-3" id="questionTabsContent">
                    {/* Simple Question Tab */}
                    <div
                      className="tab-pane fade show active"
                      id="simple-question"
                      role="tabpanel"
                      aria-labelledby="simple-question-tab"
                    >
                      <Question
                        data={data}
                        setData={setData}
                        setParagraphId={setParagraphId}
                        paragraphId={paragraphId}
                        paragraphData={paragraphs}
                        handleSave={addQuestion}
                      />
                    </div>
                    {/* Paragraph-Based Question Tab */}
                    {subTopicId === "83" && topicId === "20" && (
                      <div
                        className="tab-pane fade"
                        id="paragraph-question"
                        role="tabpanel"
                        aria-labelledby="paragraph-question-tab"
                      >
                        <ParagraphBasedQuestion
                          data={paragraphData}
                          setData={setParagraphData}
                          handleSave={addParagraphBasedQuestion}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AddQuestion;
