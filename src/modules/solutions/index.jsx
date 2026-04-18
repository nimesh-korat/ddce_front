import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { useQuery } from "@tanstack/react-query";
import { getUserMaterials } from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Solutions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLabel, setPdfLabel] = useState(""); // "Material" or "Solution"
  const [numPages, setNumPages] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  // eslint-disable-next-line
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [search, setSearch] = useState("");

  const [isMobile, setIsMobile] = useState(false);
  const [actualScale, setActualScale] = useState(1.0);
  const [userFacingScale, setUserFacingScale] = useState(1.0);
  const [scale, setScale] = useState(() =>
    window.innerWidth <= 768 ? 0.5 : 1.0,
  );
  const pdfContainerRef = useRef(null);
  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // Fetch materials from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userMaterials"],
    queryFn: getUserMaterials,
    staleTime: 5 * 60 * 1000,
  });

  const allMaterials = data?.data || [];

  // Filter by search
  const filtered = allMaterials.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.description && m.description.toLowerCase().includes(q)) ||
      (m.material_type && m.material_type.toLowerCase().includes(q))
    );
  });

  // ── PDF Viewer logic (unchanged from original) ──────────────

  const zoomIn = () => {
    if (isMobile) {
      const n = Math.min(actualScale + 0.1, 1.0);
      setActualScale(n);
      setUserFacingScale(n * 2);
    } else {
      const n = Math.min(actualScale + 0.1, 3.0);
      setActualScale(n);
      setUserFacingScale(n);
    }
  };

  const zoomOut = () => {
    if (isMobile) {
      const n = Math.max(actualScale - 0.1, 0.25);
      setActualScale(n);
      setUserFacingScale(n * 2);
    } else {
      const n = Math.max(actualScale - 0.1, 0.5);
      setActualScale(n);
      setUserFacingScale(n);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setPdfError(`Failed to load PDF: ${error.message}. Please try again.`);
    setPdfLoading(false);
  };

  const openPdfViewer = (pdfUrl, label) => {
    setPdfLoading(true);
    setPdfError(null);
    setSelectedPdf(pdfUrl);
    setPdfLabel(label);
    setShowPdfModal(true);
    setScale(1.0);
  };

  const closePdfViewer = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
    setPdfLoading(false);
    setPdfError(null);
  };

  const disablePdfActions = (e) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.metaKey || e.shiftKey) {
        e.preventDefault();
        setScale((prev) =>
          e.deltaY < 0 ? Math.min(prev + 0.1, 3.0) : Math.max(prev - 0.1, 0.5),
        );
      }
    };
    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [selectedPdf]);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2)
      setTouchStartDistance(getDistance(e.touches[0], e.touches[1]));
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const cur = getDistance(e.touches[0], e.touches[1]);
      if (touchStartDistance)
        setScale((p) =>
          Math.min(Math.max(p * (cur / touchStartDistance), 0.5), 3.0),
        );
      setTouchStartDistance(cur);
    }
  };

  const handleTouchEnd = () => setTouchStartDistance(null);

  const getDistance = (t1, t2) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setScrollPos({
        left: pdfContainerRef.current.scrollLeft,
        top: pdfContainerRef.current.scrollTop,
      });
      pdfContainerRef.current.style.cursor = "grabbing";
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    pdfContainerRef.current.scrollLeft =
      scrollPos.left - (e.clientX - startPos.x);
    pdfContainerRef.current.scrollTop =
      scrollPos.top - (e.clientY - startPos.y);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (pdfContainerRef.current)
      pdfContainerRef.current.style.cursor = scale > 1 ? "grab" : "default";
  };

  useEffect(() => {
    if (pdfContainerRef.current)
      pdfContainerRef.current.style.cursor = scale > 1 ? "grab" : "default";
  }, [scale]);

  useEffect(() => {
    const c = pdfContainerRef.current;
    if (c) c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2;
  }, [scale, numPages]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setActualScale(0.5);
        setUserFacingScale(1.0);
      } else {
        setActualScale(1.0);
        setUserFacingScale(1.0);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Render ────────────────────────────────────────────────

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          {/* Breadcrumb + Search */}
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-0">
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
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Materials & Solutions
                  </span>
                </li>
              </ul>
            </div>
            {/* Search */}
            <div className="position-relative">
              <input
                type="text"
                className="form-control ps-40 py-10 border border-gray-100 rounded-pill text-14"
                placeholder="Search materials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: "220px" }}
              />
              <i
                className="ph ph-magnifying-glass position-absolute text-gray-400 text-18"
                style={{
                  top: "50%",
                  left: "14px",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading && <Preloader />}

          {/* Error */}
          {isError && (
            <div className="alert alert-danger rounded-8">
              Failed to load materials. Please try again later.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="card">
              <div className="card-body text-center py-48">
                <i className="ph ph-files text-64 text-gray-300 d-block mb-16" />
                <h5 className="text-gray-500 fw-medium">
                  {search
                    ? "No materials match your search"
                    : "No materials available yet"}
                </h5>
                {search && (
                  <button
                    className="btn btn-outline-main rounded-pill py-9 mt-12"
                    onClick={() => setSearch("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Materials grid — same card layout as the original */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="container-fluid dashboard-content">
              <div className="row g-2">
                <div className="col-lg-12">
                  <div className="card border border-gray-100">
                    <div className="card-header border-bottom border-gray-100 flex-between gap-8">
                      <h6 className="mb-0">
                        Materials & Solutions
                        <span className="text-gray-400 fw-normal text-14 ms-8">
                          ({filtered.length})
                        </span>
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        {filtered.map((item) => (
                          <div className="col-lg-6" key={item.id}>
                            <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                              <div className="flex-align align-items-start gap-16 col-12">
                                <div className="col-12">
                                  {/* Type badge */}
                                  {item.material_type && (
                                    <span className="text-12 bg-main-100 text-main-700 py-2 px-10 rounded-pill fw-medium d-inline-block mb-8">
                                      {item.material_type}
                                    </span>
                                  )}
                                  <h6 className="title mb-0">{item.title}</h6>
                                  {item.description && (
                                    <span className="d-block text-14 text-gray-600 mt-4">
                                      {item.description}
                                    </span>
                                  )}
                                  {/* Action buttons */}
                                  <div className="text-13 d-flex justify-content-between mt-12 pt-12 border-top border-gray-100">
                                    {/* Material button */}
                                    {item.material_url ? (
                                      <button
                                        onClick={() =>
                                          openPdfViewer(
                                            item.material_url,
                                            "Material",
                                          )
                                        }
                                        className="text-gray-900 hover-text-main-600 btn btn-link p-0"
                                      >
                                        <span>Material</span>
                                        <i className="ph ph-file-pdf ms-4" />
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 text-13">
                                        Material not available
                                      </span>
                                    )}

                                    {/* Solution button — only if visible */}
                                    {item.solution_available ? (
                                      <button
                                        onClick={() =>
                                          openPdfViewer(
                                            item.solution_url,
                                            "Solution",
                                          )
                                        }
                                        className="text-gray-900 hover-text-main-600 btn btn-link p-0"
                                      >
                                        <span>Solution</span>
                                        <i className="ph ph-file-pdf ms-4" />
                                      </button>
                                    ) : (
                                      <span className="text-gray-400 text-13">
                                        <i className="ph ph-lock me-4" />
                                        Solution not yet available
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal — identical to original */}
      {showPdfModal && (
        <div className="modal-overlay" onClick={closePdfViewer}>
          <div
            className="pdf-modal m-20"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={disablePdfActions}
          >
            <div className="pdf-modal-header">
              <span className="pdf-modal-title fw-semibold text-14">
                {pdfLabel}
              </span>
              <span className="zoom-level">
                {Math.round(userFacingScale * 100)}%
              </span>
              {isMobile ? null : (
                <>
                  <button onClick={zoomIn}>Zoom In</button>
                  <button onClick={zoomOut}>Zoom Out</button>
                </>
              )}
              <button onClick={closePdfViewer} className="close-button">
                <i className="ph ph-x" />
              </button>
            </div>
            <div
              className="pdf-modal-body"
              ref={pdfContainerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {pdfError && <div className="pdf-error">{pdfError}</div>}
              {!pdfError && (
                <Document
                  file={selectedPdf}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  error={<div>Failed to load PDF.</div>}
                >
                  <div className="pdf-pages-container p-20">
                    {Array.from(new Array(numPages), (el, index) => (
                      <div
                        key={`page-wrapper-${index + 1}`}
                        className="pdf-page-wrapper"
                      >
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          scale={actualScale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="pdf-page"
                          width={isMobile ? null : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </Document>
              )}
            </div>
          </div>
        </div>
      )}

      <style type="text/css">{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.7);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; overflow: hidden;
        }
        .pdf-modal {
          background: white; border-radius: 8px;
          width: 90%; max-width: 900px; height: 90vh;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .pdf-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 15px; background: #f8f9fa;
          border-bottom: 1px solid #dee2e6; flex-shrink: 0; gap: 12px;
        }
        .pdf-modal-title { flex: 1; }
        .zoom-level { font-size: 14px; color: #555; }
        .close-button { background: none; border: none; font-size: 20px; cursor: pointer; }
        .pdf-modal-body {
          flex: 1; overflow: auto; padding: 20px;
          user-select: none; width: 100%;
        }
        .pdf-pages-container {
          display: flex; flex-direction: column;
          align-items: center; width: fit-content; margin: 0 auto;
        }
        .pdf-page-wrapper { margin-bottom: 20px; display: flex; justify-content: center; }
        .pdf-error { color: red; padding: 20px; text-align: center; }
        .pdf-modal-body::-webkit-scrollbar { width: 6px; height: 6px; }
        .pdf-modal-body::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .pdf-modal-body::-webkit-scrollbar-thumb:hover { background: #555; }
        .react-pdf__Page { display: flex; justify-content: center; }
        @media (max-width: 768px) {
          .pdf-modal { width: 95%; height: 95vh; }
          .pdf-modal-body { padding: 10px; }
          .react-pdf__Page__canvas { max-width: 100%; height: auto !important; }
        }
      `}</style>
    </>
  );
}

export default Solutions;
