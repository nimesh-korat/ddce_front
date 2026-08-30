import React, { useState, useRef } from "react";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import Sidebar from "../../common/sidebar";
import Swal from "sweetalert2";
import { getSubjects, submitDoubt, getMyDoubts } from "../../apis/apis";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Helper: render image or PDF link from signed URL + stored key
const FileDisplay = ({ url, label = "View File", imgStyle = {} }) => {
  if (!url) return null;
  // Check if URL path contains .pdf (before the ? query string)
  const path = url.split("?")[0].toLowerCase();
  const isPdf = path.endsWith(".pdf");
  return isPdf ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="btn btn-main rounded-pill flex-align gap-4 d-inline-flex mt-6"
      style={{ fontSize: "11px", padding: "4px 12px" }}
    >
      <i className="ph ph-file-pdf text-12" /> {label}
    </a>
  ) : (
    <img
      src={url}
      alt={label}
      className="rounded-8 mt-6"
      style={{
        maxWidth: "100%",
        maxHeight: "220px",
        objectFit: "contain",
        display: "block",
        ...imgStyle,
      }}
    />
  );
};

function Doubts() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [doubtText, setDoubtText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tab, setTab] = useState("submit"); // "submit" | "my"
  const [expandedId, setExpandedId] = useState(null);
  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
  const { data: myDoubtsData, isLoading: doubtsLoading } = useQuery({
    queryKey: ["myDoubts"],
    queryFn: getMyDoubts,
    staleTime: 30 * 1000,
    enabled: tab === "my",
  });
  const myDoubts = myDoubtsData?.data || [];

  const submitMutation = useMutation({
    mutationFn: submitDoubt,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Doubt Submitted!",
        text: "Your doubt has been submitted successfully. The subject faculty has been notified and will respond soon.",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "View My Doubts",
      }).then(() => {
        setTab("my");
        queryClient.invalidateQueries(["myDoubts"]);
      });
      setSubjectId("");
      setDoubtText("");
      setImageFile(null);
      if (fileRef.current) fileRef.current.value = "";
    },
    onError: (e) =>
      toast.error(e?.response?.data?.message || "Failed to submit doubt"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectId) return toast.error("Please select a subject");
    if (!doubtText.trim()) return toast.error("Please describe your doubt");
    const fd = new FormData();
    fd.append("doubt_text", doubtText);
    if (subjectId) fd.append("subject_id", subjectId);
    if (imageFile) fd.append("doubt_image", imageFile);
    submitMutation.mutate(fd);
  };

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  return (
    <>
      <Sidebar
        isActive={isSidebarActive}
        closeSidebar={() => setIsSidebarActive(false)}
      />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={() => setIsSidebarActive((p) => !p)} />
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
                <span className="text-gray-500 d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">Doubts</span>
              </li>
            </ul>
          </div>

          {/* Tabs */}
          <div className="flex-align gap-8 mb-20">
            <button
              className={`btn rounded-pill px-20 py-8 text-14 fw-medium ${tab === "submit" ? "btn-main" : "btn-outline-main"}`}
              onClick={() => setTab("submit")}
            >
              <i className="ph ph-plus-circle me-6" /> Submit Doubt
            </button>
            <button
              className={`btn rounded-pill px-20 py-8 text-14 fw-medium ${tab === "my" ? "btn-main" : "btn-outline-main"}`}
              onClick={() => {
                setTab("my");
                queryClient.invalidateQueries(["myDoubts"]);
              }}
            >
              <i className="ph ph-list-bullets me-6" /> My Doubts
            </button>
          </div>

          {/* Submit Tab */}
          {tab === "submit" && (
            <div className="card border border-gray-100 shadow-sm">
              <div className="card-body p-24">
                <h6 className="fw-bold text-gray-800 mb-20">
                  <i className="ph ph-question text-main-600 me-8" /> Submit a
                  New Doubt
                </h6>
                <form onSubmit={handleSubmit}>
                  <div className="row g-20">
                    <div className="col-md-6">
                      <label className="h6 fw-semibold mb-8 d-block">
                        Subject
                      </label>
                      <select
                        className="form-select rounded-8 py-9"
                        required
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                      >
                        <option value="">Select Subject *</option>
                        {subjects?.data?.map((s) => (
                          <option key={s.Id} value={s.Id}>
                            {s.Sub_Name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="h6 fw-semibold mb-8 d-block">
                        Attach Image / PDF{" "}
                        <span className="text-gray-400 fw-normal text-13">
                          (Optional)
                        </span>
                      </label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="form-control rounded-8"
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f && f.size > 10 * 1024 * 1024) {
                            toast.error(
                              "File too large. Maximum allowed size is 10MB.",
                            );
                            e.target.value = "";
                            setImageFile(null);
                            return;
                          }
                          setImageFile(f || null);
                        }}
                      />
                      <p className="text-12 text-gray-400 mt-4 mb-0">
                        <i className="ph ph-info me-4" />
                        Max file size: 10MB. Accepted: Images, PDF
                      </p>
                    </div>

                    <div className="col-12">
                      <label className="h6 fw-semibold mb-8 d-block">
                        Describe Your Doubt *
                      </label>
                      <textarea
                        className="form-control rounded-8 py-11"
                        placeholder="Describe your doubt in detail..."
                        rows={5}
                        maxLength={1000}
                        required
                        value={doubtText}
                        onChange={(e) => setDoubtText(e.target.value)}
                      />
                      <div className="text-gray-400 text-12 mt-4 text-end">
                        {doubtText.length}/1000
                      </div>
                    </div>

                    <div className="col-12 flex-align justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-main rounded-pill px-24 py-10 flex-align gap-8"
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? (
                          <>
                            <span className="spinner-border spinner-border-sm" />{" "}
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="ph ph-paper-plane-tilt" /> Submit
                            Doubt
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* My Doubts Tab */}
          {tab === "my" && (
            <div>
              {doubtsLoading && (
                <div className="card">
                  <div className="card-body text-center py-56">
                    <span
                      className="spinner-border text-main-600 mb-12 d-block mx-auto"
                      style={{ width: "36px", height: "36px" }}
                    />
                    <p className="text-gray-400 text-14 mb-0">
                      Loading your doubts...
                    </p>
                  </div>
                </div>
              )}

              {!doubtsLoading && myDoubts.length === 0 && (
                <div className="card border border-gray-100">
                  <div className="card-body text-center py-64">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-main-50 mx-auto mb-20"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <i className="ph ph-chat-circle-dots text-40 text-main-300" />
                    </div>
                    <h6 className="fw-semibold text-gray-700 mb-8">
                      No Doubts Submitted Yet
                    </h6>
                    <p className="text-14 text-gray-400 mb-20">
                      Your submitted doubts and faculty responses will appear
                      here.
                    </p>
                    <button
                      className="btn btn-main rounded-pill px-24 py-10 flex-align gap-8"
                      onClick={() => setTab("submit")}
                    >
                      <i className="ph ph-plus-circle" /> Submit Your First
                      Doubt
                    </button>
                  </div>
                </div>
              )}

              {!doubtsLoading && myDoubts.length > 0 && (
                <div className="d-flex flex-column gap-16">
                  {myDoubts.map((d, idx) => (
                    <div
                      key={d.id}
                      className="card border border-gray-100 shadow-sm overflow-hidden"
                    >
                      {/* Colored top bar */}
                      <div
                        style={{
                          height: "4px",
                          background:
                            d.status === "solved" ? "#22c55e" : "#f59e0b",
                        }}
                      />

                      <div className="card-body p-0">
                        {/* Header */}
                        <div className="flex-between flex-wrap gap-8 px-20 py-14 border-bottom border-gray-100">
                          <div className="flex-align gap-10 flex-wrap">
                            <span className="text-13 text-gray-400 fw-medium">
                              #{myDoubts.length - idx}
                            </span>
                            <span
                              className={`text-12 fw-bold py-4 px-14 rounded-pill d-flex align-items-center gap-4 ${
                                d.status === "solved"
                                  ? "bg-success-50 text-success-600"
                                  : "bg-warning-50 text-warning-600"
                              }`}
                            >
                              <i
                                className={`ph ${d.status === "solved" ? "ph-check-circle" : "ph-clock"} text-13`}
                              />
                              {d.status === "solved" ? "Solved" : "Pending"}
                            </span>
                            {d.subject_name && (
                              <span className="text-12 bg-main-50 text-main-700 py-4 px-14 rounded-pill fw-semibold">
                                <i className="ph ph-book me-4" />
                                {d.subject_name}
                              </span>
                            )}
                          </div>
                          <span className="text-12 text-gray-400 flex-align gap-4">
                            <i className="ph ph-clock text-12" />{" "}
                            {fmtDate(d.created_at)}
                          </span>
                        </div>

                        {/* Doubt content */}
                        <div className="px-20 py-16">
                          <div className="flex-align gap-6 mb-10">
                            <i className="ph ph-question text-main-400 text-16" />
                            <span
                              className="text-12 fw-semibold text-main-500 text-uppercase"
                              style={{ letterSpacing: "0.5px" }}
                            >
                              Your Doubt
                            </span>
                          </div>
                          <p
                            className="text-14 text-gray-700 mb-12"
                            style={{
                              lineHeight: "1.7",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {d.doubt_text}
                          </p>
                          {d.doubt_image && (
                            <FileDisplay
                              url={d.doubt_image}
                              label="View Attached File"
                            />
                          )}
                        </div>

                        {/* Answer section */}
                        {d.status === "solved" && (
                          <div className="border-top border-gray-100">
                            <button
                              className="w-100 px-20 py-12 d-flex align-items-center justify-content-between bg-transparent border-0 text-start"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setExpandedId(expandedId === d.id ? null : d.id)
                              }
                            >
                              <div className="flex-align gap-8">
                                <div
                                  className="d-flex align-items-center justify-content-center rounded-circle bg-success-50"
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    flexShrink: 0,
                                  }}
                                >
                                  <i className="ph ph-check text-success-600 text-13" />
                                </div>
                                <div>
                                  <p className="text-13 fw-semibold text-gray-800 mb-0">
                                    Faculty Response
                                  </p>
                                  <p className="text-11 text-gray-400 mb-0">
                                    {fmtDate(d.answered_at)}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`d-flex align-items-center justify-content-center rounded-circle bg-main-600`}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  flexShrink: 0,
                                }}
                              >
                                <i
                                  className={`ph ph-caret-${expandedId === d.id ? "up" : "down"} text-white text-12`}
                                />
                              </div>
                            </button>

                            {expandedId === d.id && (
                              <div
                                className="px-20 pb-20"
                                style={{ background: "#f8fffe" }}
                              >
                                <div
                                  className="rounded-12 p-16 border border-success-100"
                                  style={{ background: "#fff" }}
                                >
                                  <p
                                    className="text-14 text-gray-700 mb-12"
                                    style={{
                                      lineHeight: "1.7",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {d.answer_text}
                                  </p>
                                  {d.answer_image && (
                                    <FileDisplay
                                      url={d.answer_image}
                                      label="View Answer File"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {d.status === "pending" && (
                          <div className="border-top border-gray-100 px-20 py-12 bg-warning-50">
                            <p className="text-12 text-warning-700 mb-0 flex-align gap-6">
                              <i className="ph ph-info text-14" />
                              Your doubt has been submitted. The subject faculty
                              has been notified and will respond soon.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Doubts;
