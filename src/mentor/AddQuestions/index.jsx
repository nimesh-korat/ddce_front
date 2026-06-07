import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  mentorAddQuestion,
  adminGetParagraph,
  adminAddParagraph,
  getSubjects,
  getTopics,
  getSubTopics,
} from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { toast } from "react-toastify";
import MentorSidebar from "../../common/MentorSidebar";
import { Link } from "react-router-dom";
// Reuse admin components directly
import Question from "../../../src/admin/AddQuestions/components/Question";
import ParagraphBasedQuestion from "../../../src/admin/AddQuestions/components/ParagraphBasedQuestion";

function MentorAddQuestion() {
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
    isImageOption: false,
  });

  const queryClient = useQueryClient();
  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 10 * 60 * 1000,
  });
  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => getTopics({ subject_id: subjectId }),
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000,
  });
  const { data: subTopicsData, isLoading: subTopicsLoading } = useQuery({
    queryKey: ["subtopics", topicId],
    queryFn: () => getSubTopics({ topic_id: topicId }),
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000,
  });
  const { data: paragraphsData } = useQuery({
    queryKey: ["paragraphs", subTopicId],
    queryFn: () => adminGetParagraph({ subtopic_id: subTopicId }),
    enabled: !!subTopicId,
    staleTime: 5 * 60 * 1000,
  });

  const addParagraphMutation = useMutation({
    mutationFn: (formData) => adminAddParagraph(formData),
    onSuccess: (res) => {
      setParagraphId(res.data?.paragraph_id);
      queryClient.invalidateQueries(["paragraphs", subTopicId]);
      toast.success("Paragraph added successfully!");
    },
    onError: () => toast.error("Failed to add paragraph"),
  });

  const addQuestionMutation = useMutation({
    mutationFn: (formData) => mentorAddQuestion(formData),
    onSuccess: () => {
      toast.success("Question added successfully!");
      queryClient.invalidateQueries(["mentorQuestions"]);
      setData({
        tbl_subtopic: subTopicId,
        isParagraph: false, tbl_paragraph: null,
        question_text: "", question_image: null,
        option_a_text: "", option_a_image: null,
        option_b_text: "", option_b_image: null,
        option_c_text: "", option_c_image: null,
        option_d_text: "", option_d_image: null,
        answer_text: "", answer_image: null,
        question_marks: "", question_difficulty: "Easy",
        prevAskedPaper: "", prevAskedYear: "", fromBook: "",
        isImageOption: false,
      });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to add question"),
  });

  const handleSave = () => {
    if (!subTopicId) { toast.error("Please select a subtopic first"); return; }
    const formData = new FormData();
    formData.append("tbl_subtopic", subTopicId);
    formData.append("tbl_paragraph", paragraphId || "null");
    formData.append("question_text", data.question_text);
    formData.append("option_a_text", data.option_a_text || "");
    formData.append("option_b_text", data.option_b_text || "");
    formData.append("option_c_text", data.option_c_text || "");
    formData.append("option_d_text", data.option_d_text || "");
    formData.append("answer_text", data.answer_text);
    formData.append("question_marks", data.question_marks);
    formData.append("question_difficulty", data.question_difficulty);
    formData.append("prevAskedPaper", data.prevAskedPaper || "");
    formData.append("prevAskedYear", data.prevAskedYear || "");
    formData.append("fromBook", data.fromBook || "");
    if (data.question_image) formData.append("question_image", data.question_image);
    if (data.option_a_image) formData.append("option_a_image", data.option_a_image);
    if (data.option_b_image) formData.append("option_b_image", data.option_b_image);
    if (data.option_c_image) formData.append("option_c_image", data.option_c_image);
    if (data.option_d_image) formData.append("option_d_image", data.option_d_image);
    if (data.answer_image) formData.append("answer_image", data.answer_image);
    addQuestionMutation.mutate(formData);
  };

  const subjects = subjectsData?.data || [];
  const topics = topicsData?.data || [];
  const subTopics = subTopicsData?.data || [];
  const paragraphs = paragraphsData?.data || [];

  return (
    <>
      {(subjectsLoading || topicsLoading || subTopicsLoading) && <Preloader />}
      <MentorSidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <Link to="/mentor/dashboard" className="text-gray-200 fw-normal text-15 hover-text-main-600">Home</Link>
              </li>
              <li><span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right" /></span></li>
              <li><span className="text-main-600 fw-normal text-15">Add Question</span></li>
            </ul>
          </div>

          {/* Subject / Topic / Subtopic selectors */}
          <div className="card mb-20">
            <div className="card-body">
              <div className="row g-16">
                <div className="col-md-4">
                  <label className="form-label fw-medium text-14 mb-6">Subject</label>
                  <select className="form-control" value={subjectId || ""}
                    onChange={(e) => { setSubjectId(e.target.value); setTopicId(null); setSubTopicId(null); }}>
                    <option value="">Select Subject</option>
                    {subjects.map((s) => <option key={s.Id} value={s.Id}>{s.Sub_Name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium text-14 mb-6">Topic</label>
                  <select className="form-control" value={topicId || ""} disabled={!subjectId}
                    onChange={(e) => { setTopicId(e.target.value); setSubTopicId(null); }}>
                    <option value="">Select Topic</option>
                    {topics.map((t) => <option key={t.Id} value={t.Id}>{t.Topic_Name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium text-14 mb-6">Subtopic</label>
                  <select className="form-control" value={subTopicId || ""} disabled={!topicId}
                    onChange={(e) => { setSubTopicId(e.target.value); setData((d) => ({ ...d, tbl_subtopic: e.target.value })); }}>
                    <option value="">Select Subtopic</option>
                    {subTopics.map((st) => <option key={st.Id} value={st.Id}>{st.Sub_Topic_Name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {subTopicId && (
            <div className="card mb-20">
              <div className="card-body">
                <div className="mb-12">
                  <label className="form-check-label fw-medium">
                    <input type="checkbox" className="form-check-input me-8"
                      checked={data.isParagraph}
                      onChange={(e) => setData((d) => ({ ...d, isParagraph: e.target.checked }))} />
                    Paragraph-based question
                  </label>
                </div>

                {data.isParagraph ? (
                  <ParagraphBasedQuestion
                    data={data} setData={setData}
                    paragraphId={paragraphId} setParagraphId={setParagraphId}
                    paragraphData={paragraphData} setParagraphData={setParagraphData}
                    paragraphs={paragraphs}
                    addParagraphMutation={addParagraphMutation}
                    handleSave={handleSave}
                  />
                ) : (
                  <Question
                    data={data} setData={setData}
                    setParagraphId={setParagraphId}
                    paragraphId={paragraphId}
                    paragraphData={paragraphData}
                    handleSave={handleSave}
                  />
                )}

                <div className="mt-20">
                  <button
                    className="btn btn-main rounded-pill py-9 px-32"
                    onClick={handleSave}
                    disabled={addQuestionMutation.isPending}
                  >
                    {addQuestionMutation.isPending
                      ? <><span className="spinner-border spinner-border-sm me-6" />Saving...</>
                      : "Save Question"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default MentorAddQuestion;
