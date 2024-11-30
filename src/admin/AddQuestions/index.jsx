import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  adminAddQuestions,
  getSubjects,
  getSubTopics,
  getTopics,
} from "../../apis/apis";
import Sidebar from "../../common/sidebar";
import Preloader from "../../utils/Preloader";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import Question from "./components/Question";
import QuestionList from "./components/QuestionList";
import { toast } from "react-toastify";
import AdminSidebar from "../../common/AdminSidebar";

function AddQuestion() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [subTopicId, setSubTopicId] = useState(null);
  const [questionList, setQuestionList] = useState([]); // Array to store questions
  const [editingIndex, setEditingIndex] = useState(null); // New state to track which question is being edited

  const admin = JSON.parse(localStorage.getItem("admin"));
  const [data, setData] = useState({
    tbl_subtopic: null,
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
    added_by: admin ? admin.id : null,
    isImageQuestion: false,
    isImageOption: false,
    isAskedPreviously: false,
    isFromBook: false,
  });

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

  const addQuestion = () => {
    if (editingIndex !== null) {
      // Update the existing question in the list
      setQuestionList((prevList) =>
        prevList.map(
          (question, index) => (index === editingIndex ? { ...data } : question) // Update the question at the editingIndex
        )
      );
      setEditingIndex(null); // Reset editing index after updating
    } else {
      // Add new question to the list
      setQuestionList((prevList) => [...prevList, { ...data }]);
    }

    // Reset form fields
    setData({
      ...data,
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
      isImageQuestion: false,
      isImageOption: false,
      isAskedPreviously: false,
      isFromBook: false,
    });
  };
  const [isEditing, setIsEditing] = useState(false);

  const addQuestionQuary = useMutation({
    mutationFn: (payload) => adminAddQuestions(payload), // Call the function with the payload
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add questions");
    },
    onSuccess: (data) => {
      toast.success(data.message || "Questions added successfully");
      setQuestionList([]); // Clear the list if needed
    },
  });

  const handleAddQuestionToDB = () => {
    if (questionList.length === 0) {
      toast.error("No questions to add!");
      return;
    }

    // Create a new FormData object
    const formData = new FormData();
    questionList.forEach((question, index) => {
      // Add non-file data
      formData.append(
        `questions[${index}][tbl_subtopic]`,
        question.tbl_subtopic
      );
      formData.append(
        `questions[${index}][question_text]`,
        question.question_text
      );

      // Add file fields
      if (question.question_image) {
        formData.append(
          `questions[${index}][question_image]`,
          question.question_image
        );
      }
      if (question.option_a_image) {
        formData.append(
          `questions[${index}][option_a_image]`,
          question.option_a_image
        );
      }
      if (question.option_b_image) {
        formData.append(
          `questions[${index}][option_b_image]`,
          question.option_b_image
        );
      }
      if (question.option_c_image) {
        formData.append(
          `questions[${index}][option_c_image]`,
          question.option_c_image
        );
      }
      if (question.option_d_image) {
        formData.append(
          `questions[${index}][option_d_image]`,
          question.option_d_image
        );
      }
      if (question.answer_image) {
        formData.append(
          `questions[${index}][answer_image]`,
          question.answer_image
        );
      }

      // Add other text data
      formData.append(
        `questions[${index}][option_a_text]`,
        question.option_a_text
      );
      formData.append(
        `questions[${index}][option_b_text]`,
        question.option_b_text
      );
      formData.append(
        `questions[${index}][option_c_text]`,
        question.option_c_text
      );
      formData.append(
        `questions[${index}][option_d_text]`,
        question.option_d_text
      );
      formData.append(`questions[${index}][answer_text]`, question.answer_text);
      formData.append(
        `questions[${index}][isImageQuestion]`,
        question.isImageQuestion
      );
      formData.append(
        `questions[${index}][isImageOption]`,
        question.isImageOption
      );
    });
    console.log(formData);

    // Now send this FormData in the API request
    // addQuestionQuary.mutate(formData);
  };

  const onEdit = (index) => {
    const questionToEdit = questionList[index];
    setData(questionToEdit);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const onDelete = (index) => {
    // If deleting the currently editing question, reset editing index
    if (editingIndex === index) {
      setEditingIndex(null);
    }

    setQuestionList((prevList) => prevList.filter((_, i) => i !== index));
  };
  return (
    <>
      <Preloader />
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
                      setSubTopicId(selectedSubTopicId); // Update subtopic ID state
                      setData((prevData) => ({
                        ...prevData,
                        tbl_subtopic: selectedSubTopicId, // Update tbl_subtopic in data state
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
                <Question
                  data={data}
                  setData={setData}
                  handleSave={addQuestion}
                  isEditing={isEditing}
                />
                <QuestionList
                  questionList={questionList}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSubmit={handleAddQuestionToDB}
                  editingIndex={editingIndex} // Pass the editingIndex down to QuestionList
                />
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
