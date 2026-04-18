import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import { useQuery } from "@tanstack/react-query";
import { getUserMaterials } from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";
import { Link } from "react-router-dom";
import { format } from "date-fns";

function Resources() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const toggleSidebar = () => setIsSidebarActive((prev) => !prev);
  const closeSidebar = () => setIsSidebarActive(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userMaterials"],
    queryFn: getUserMaterials,
    staleTime: 5 * 60 * 1000,
  });

  const allMaterials = data?.data || [];

  const filteredMaterials = allMaterials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase())) ||
      (m.subject_name && m.subject_name.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === "All" || m.file_type === filterType;
    return matchesSearch && matchesType;
  });

  const fileTypeIcon = (type) => {
    const icons = {
      pdf: "ph-file-pdf",
      video: "ph-video",
      image: "ph-image",
      link: "ph-link",
      doc: "ph-file-doc",
    };
    return icons[type] || "ph-file";
  };

  const fileTypeBadge = (type) => {
    const map = {
      pdf: "bg-danger-50 text-danger-600",
      video: "bg-warning-50 text-warning-600",
      image: "bg-info-50 text-info-600",
      link: "bg-main-50 text-main-600",
      doc: "bg-success-50 text-success-600",
    };
    return map[type] || "bg-gray-50 text-gray-600";
  };

  const fileTypeColor = (type) => {
    const map = {
      pdf: "text-danger-600",
      video: "text-warning-600",
      image: "text-info-600",
      link: "text-main-600",
      doc: "text-success-600",
    };
    return map[type] || "text-gray-500";
  };

  const uniqueTypes = ["All", ...new Set(allMaterials.map((m) => m.file_type))];

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />

        {isLoading ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            {/* Breadcrumb + Search */}
            <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
              <div className="breadcrumb mb-0">
                <ul className="flex-align gap-4">
                  <li>
                    <Link to="/" className="text-gray-200 fw-normal text-15 hover-text-main-600">
                      Home
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-500 fw-normal d-flex">
                      <i className="ph ph-caret-right" />
                    </span>
                  </li>
                  <li>
                    <span className="text-main-600 fw-normal text-15">Files & Resources</span>
                  </li>
                </ul>
              </div>

              {/* Search */}
              <div className="flex-align gap-8 flex-wrap">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control ps-40 py-10 border border-gray-100 rounded-pill text-14"
                    placeholder="Search materials..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ minWidth: "220px" }}
                  />
                  <i className="ph ph-magnifying-glass position-absolute text-gray-400 text-18"
                    style={{ top: "50%", left: "14px", transform: "translateY(-50%)" }} />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            {uniqueTypes.length > 1 && (
              <div className="flex-align gap-8 flex-wrap mb-20">
                {uniqueTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`btn rounded-pill py-6 px-16 text-13 fw-medium ${
                      filterType === type
                        ? "btn-main"
                        : "btn-outline-gray"
                    }`}
                  >
                    {type === "All" ? "All" : type.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="alert alert-danger rounded-8">
                Failed to load materials. Please try again later.
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && filteredMaterials.length === 0 && (
              <div className="card">
                <div className="card-body text-center py-48">
                  <i className="ph ph-files text-64 text-gray-300 d-block mb-16" />
                  <h5 className="text-gray-500 fw-medium mb-8">
                    {search || filterType !== "All"
                      ? "No materials match your search"
                      : "No materials available yet"}
                  </h5>
                  {(search || filterType !== "All") && (
                    <button
                      className="btn btn-outline-main rounded-pill py-9 mt-8"
                      onClick={() => { setSearch(""); setFilterType("All"); }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Materials Grid */}
            {filteredMaterials.length > 0 && (
              <>
                <p className="text-14 text-gray-500 mb-16">
                  Showing <strong>{filteredMaterials.length}</strong> material{filteredMaterials.length !== 1 ? "s" : ""}
                </p>
                <div className="row g-20">
                  {filteredMaterials.map((material) => (
                    <div key={material.id} className="col-xxl-3 col-xl-4 col-sm-6">
                      <div className="card border border-gray-100 h-100 hover-shadow-lg transition">
                        <div className="card-body p-20 d-flex flex-column">
                          {/* Icon + Type badge */}
                          <div className="flex-between mb-12">
                            <div className="w-52 h-52 d-flex align-items-center justify-content-center rounded-12 bg-gray-50">
                              <i className={`ph ${fileTypeIcon(material.file_type)} text-32 ${fileTypeColor(material.file_type)}`} />
                            </div>
                            <span className={`text-12 py-2 px-10 rounded-pill fw-medium ${fileTypeBadge(material.file_type)}`}>
                              {material.file_type?.toUpperCase()}
                            </span>
                          </div>

                          {/* Title */}
                          <h6 className="fw-semibold text-gray-800 mb-6 text-truncate" title={material.title}>
                            {material.title}
                          </h6>

                          {/* Description */}
                          {material.description && (
                            <p className="text-13 text-gray-500 mb-8 flex-grow-1"
                              style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {material.description}
                            </p>
                          )}

                          {/* Subject tag */}
                          {material.subject_name && (
                            <span className="text-12 bg-main-50 text-main-600 py-2 px-10 rounded-pill d-inline-block mb-10">
                              <i className="ph ph-book-open me-4" />{material.subject_name}
                            </span>
                          )}

                          {/* Date */}
                          <p className="text-12 text-gray-400 mb-12">
                            <i className="ph ph-calendar me-4" />
                            {material.added_on
                              ? format(new Date(material.added_on), "dd MMM yyyy")
                              : ""}
                          </p>

                          {/* Action button */}
                          {material.file_url ? (
                            <a
                              href={material.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-main rounded-pill py-9 w-100 flex-align justify-content-center gap-8 mt-auto"
                            >
                              {material.file_type === "video" ? (
                                <><i className="ph ph-play-circle" />Watch</>
                              ) : material.file_type === "link" ? (
                                <><i className="ph ph-arrow-square-out" />Open Link</>
                              ) : (
                                <><i className="ph ph-download-simple" />Download</>
                              )}
                            </a>
                          ) : (
                            <button className="btn btn-outline-secondary rounded-pill py-9 w-100 mt-auto" disabled>
                              Not Available
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default Resources;
