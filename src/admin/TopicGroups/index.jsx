import React, { useState } from "react";
import AdminSidebar from "../../common/AdminSidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTopicGroups,
  createTopicGroup,
  updateTopicGroup,
  deleteTopicGroup,
  assignTopicToGroup,
  getSubjects,
  getTopics,
} from "../../apis/apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TopicGroups() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const queryClient = useQueryClient();

  // Group form
  const [groupForm, setGroupForm] = useState({ name: "", tbl_subject: "" });
  const [editGroupId, setEditGroupId] = useState(null);

  // Assign topic panel
  const [assignSubject, setAssignSubject] = useState("");
  const [assignGroup, setAssignGroup] = useState("");
  const [assignTopic, setAssignTopic] = useState("");

  const { data: subjectData } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
  const subjects = subjectData?.data || [];

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ["topicGroups", groupForm.tbl_subject],
    queryFn: () => getTopicGroups(groupForm.tbl_subject || null),
    staleTime: 30000,
  });
  const allGroups = groupsData?.data || [];

  // Topics for assign panel
  const { data: topicsData } = useQuery({
    queryKey: ["topics", assignSubject],
    queryFn: () => getTopics({ subject_id: assignSubject }),
    enabled: !!assignSubject,
    staleTime: 30000,
  });
  const topics = topicsData?.data || [];

  // Groups filtered by assign subject
  const { data: assignGroupsData } = useQuery({
    queryKey: ["topicGroups", assignSubject],
    queryFn: () => getTopicGroups(assignSubject),
    enabled: !!assignSubject,
    staleTime: 30000,
  });
  const assignGroups = assignGroupsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (d) =>
      editGroupId ? updateTopicGroup(editGroupId, d) : createTopicGroup(d),
    onSuccess: () => {
      toast.success(editGroupId ? "Updated!" : "Group created!");
      queryClient.invalidateQueries(["topicGroups"]);
      setGroupForm({ name: "", tbl_subject: groupForm.tbl_subject });
      setEditGroupId(null);
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopicGroup,
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries(["topicGroups"]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const assignMutation = useMutation({
    mutationFn: assignTopicToGroup,
    onSuccess: () => {
      toast.success("Topic assigned!");
      setAssignTopic("");
    },
    onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
  });

  const handleSaveGroup = () => {
    if (!groupForm.name.trim()) return toast.error("Group name required");
    if (!editGroupId && !groupForm.tbl_subject)
      return toast.error("Select subject");
    createMutation.mutate({
      name: groupForm.name,
      tbl_subject: groupForm.tbl_subject,
    });
  };

  const handleDelete = (g) => {
    Swal.fire({
      title: `Delete "${g.name}"?`,
      text: `${g.topic_count} topics will be unlinked from this group.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (r.isConfirmed) deleteMutation.mutate(g.id);
    });
  };

  const handleAssign = () => {
    if (!assignTopic) return toast.error("Select a topic");
    assignMutation.mutate({
      topic_id: assignTopic,
      group_id: assignGroup || null,
    });
  };

  return (
    <>
      <AdminSidebar
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
                  to="/admin/dashboard"
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
                <span className="text-main-600 fw-normal text-15">
                  Topic Groups
                </span>
              </li>
            </ul>
          </div>

          <div className="row g-20">
            {/* ── Left: Create/Edit Group ── */}
            <div className="col-lg-4">
              <div className="card border border-gray-100 shadow-sm mb-16">
                <div className="card-body p-20">
                  <h6 className="fw-bold text-gray-800 mb-16 flex-align gap-8">
                    <i
                      className={`ph ${editGroupId ? "ph-pencil" : "ph-folders"} text-main-600`}
                    />
                    {editGroupId ? "Edit Group" : "Create Group"}
                  </h6>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Subject *
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={groupForm.tbl_subject}
                      onChange={(e) =>
                        setGroupForm((f) => ({
                          ...f,
                          tbl_subject: e.target.value,
                        }))
                      }
                      disabled={!!editGroupId}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.Id} value={s.Id}>
                          {s.Sub_Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-16">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Group Name *
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-8"
                      placeholder="e.g. Physical Chemistry, Organic Chemistry"
                      value={groupForm.name}
                      onChange={(e) =>
                        setGroupForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex-align gap-8">
                    <button
                      className="btn btn-main rounded-8 flex-1 justify-content-center flex-align gap-6"
                      onClick={handleSaveGroup}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <i className="ph ph-floppy-disk" />
                      )}
                      {editGroupId ? "Update" : "Create"}
                    </button>
                    {editGroupId && (
                      <button
                        className="btn btn-outline-secondary rounded-8"
                        onClick={() => {
                          setEditGroupId(null);
                          setGroupForm({
                            name: "",
                            tbl_subject: groupForm.tbl_subject,
                          });
                        }}
                      >
                        <i className="ph ph-x" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Assign Topic to Group ── */}
              <div className="card border border-gray-100 shadow-sm">
                <div className="card-body p-20">
                  <h6 className="fw-bold text-gray-800 mb-16 flex-align gap-8">
                    <i className="ph ph-link text-main-600" /> Assign Topic to
                    Group
                  </h6>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Subject
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={assignSubject}
                      onChange={(e) => {
                        setAssignSubject(e.target.value);
                        setAssignTopic("");
                        setAssignGroup("");
                      }}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((s) => (
                        <option key={s.Id} value={s.Id}>
                          {s.Sub_Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-12">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Group
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={assignGroup}
                      onChange={(e) => setAssignGroup(e.target.value)}
                      disabled={!assignSubject}
                    >
                      <option value="">No Group (DDCET flow)</option>
                      {assignGroups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-16">
                    <label
                      className="text-12 fw-semibold text-gray-500 text-uppercase mb-6 d-block"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Topic *
                    </label>
                    <select
                      className="form-select rounded-8"
                      value={assignTopic}
                      onChange={(e) => setAssignTopic(e.target.value)}
                      disabled={!assignSubject}
                    >
                      <option value="">Select Topic</option>
                      {topics.map((t) => (
                        <option key={t.Id} value={t.Id}>
                          {t.topic_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="btn btn-main rounded-8 w-100 flex-align gap-6 justify-content-center"
                    onClick={handleAssign}
                    disabled={assignMutation.isPending}
                  >
                    {assignMutation.isPending ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="ph ph-link" />
                    )}
                    Assign
                  </button>
                  <p className="text-12 text-gray-400 mt-8 mb-0">
                    <i className="ph ph-info me-4" />
                    Set group to "No Group" to revert to DDCET flow.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Groups Table ── */}
            <div className="col-lg-8">
              <div className="card border border-gray-100 shadow-sm">
                <div className="flex-between px-20 py-14 border-bottom border-gray-100">
                  <h6 className="fw-bold text-gray-800 mb-0">
                    All Topic Groups
                  </h6>
                  <div className="flex-align gap-10">
                    <select
                      className="form-select form-select-sm rounded-8"
                      style={{ width: "180px" }}
                      value={groupForm.tbl_subject}
                      onChange={(e) =>
                        setGroupForm((f) => ({
                          ...f,
                          tbl_subject: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Subjects</option>
                      {subjects.map((s) => (
                        <option key={s.Id} value={s.Id}>
                          {s.Sub_Name}
                        </option>
                      ))}
                    </select>
                    <span className="text-13 text-gray-400">
                      {allGroups.length} groups
                    </span>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="table table-hover mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-12 text-gray-500 fw-medium py-12 px-16">
                          #
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Group Name
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12">
                          Subject
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Topics
                        </th>
                        <th className="text-12 text-gray-500 fw-medium py-12 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupsLoading &&
                        Array.from({ length: 4 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 5 }).map((__, j) => (
                              <td key={j} className="py-12 px-16">
                                <div
                                  className="bg-gray-100 rounded"
                                  style={{ height: "13px", width: "80%" }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      {!groupsLoading && allGroups.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center text-gray-400 py-40"
                          >
                            <i className="ph ph-folders text-48 d-block mb-12 text-gray-300" />
                            No groups yet. Create one above.
                          </td>
                        </tr>
                      )}
                      {allGroups.map((g, i) => (
                        <tr
                          key={g.id}
                          className={editGroupId === g.id ? "bg-main-50" : ""}
                        >
                          <td className="text-13 text-gray-400 py-12 px-16">
                            {i + 1}
                          </td>
                          <td className="py-12">
                            <span className="text-13 fw-semibold text-gray-800">
                              {g.name}
                            </span>
                          </td>
                          <td className="py-12">
                            <span className="text-12 bg-main-50 text-main-700 py-2 px-10 rounded-pill fw-medium">
                              {g.subject_name}
                            </span>
                          </td>
                          <td className="py-12 text-center">
                            <span className="text-13 fw-bold text-main-600">
                              {g.topic_count}
                            </span>
                          </td>
                          <td className="py-12 text-center">
                            <div className="flex-align gap-6 justify-content-center">
                              <button
                                className="btn btn-sm btn-outline-info-600 rounded-pill"
                                onClick={() => {
                                  setEditGroupId(g.id);
                                  setGroupForm({
                                    name: g.name,
                                    tbl_subject: String(g.tbl_subject),
                                  });
                                }}
                              >
                                <i className="ph ph-pencil text-12" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                onClick={() => handleDelete(g)}
                                disabled={deleteMutation.isPending}
                              >
                                <i className="ph ph-trash text-12" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
