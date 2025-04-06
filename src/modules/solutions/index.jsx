import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function Solutions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  //eslint-disable-next-line
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const [scale, setScale] = useState(1.0);
  const pdfContainerRef = useRef(null);
  const [touchStartDistance, setTouchStartDistance] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3.0)); // Max scale of 3.0
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min scale of 0.5
  };

  const solutions = [
    {
      title: "CHEMISTRY - ACID BASES & SALTS PRACTICE SET 4",
      description:
        "Understanding the Chemical Properties of Acids and Bases. Reaction of Metallic Oxides with Acids, Reactions of an Acid or a Base in Water Solutions. Importance of pH in Everyday life. Salts: Family of salts, pH of salts",
      material: "./assets/materials/CABS4.pdf",
      solution: "./assets/materials/CABSS4.pdf",
    },
    {
      title: "CHEMISTRY - ACID BASES & SALTS PRACTICE SET 5",
      description:
        "Understanding the Chemical Properties of Acids and Bases. Reaction of Metallic Oxides with Acids, Reactions of an Acid or a Base in Water Solutions. Importance of pH in Everyday life. Salts: Family of salts, pH of salts",
      material: "./assets/materials/CABS5.pdf",
      solution: "./assets/materials/CABSS5.pdf",
    },
    {
      title: "DETERMINANT & MATRICES PRACTICE SET 1",
      description:
        "Determinant and its value up to 3rd order (Without properties). Concept of a Matrix. Types of Matrices. Addition, Subtraction and multiplication by scalar of matrices. Product of two matrices. Adjoint and Inverse of a matrix of order 2X2. Solution of Simultaneous linear equations of two variables",
      material: "./assets/materials/MDMS1.pdf",
      solution: "./assets/materials/MDMSS1.pdf",
    },
    {
      title: "DETERMINANT & MATRICES PRACTICE SET 2",
      description:
        "Determinant and its value up to 3rd order (Without properties). Concept of a Matrix. Types of Matrices. Addition, Subtraction and multiplication by scalar of matrices. Product of two matrices. Adjoint and Inverse of a matrix of order 2X2. Solution of Simultaneous linear equations of two variables",
      material: "./assets/materials/MDMS2.pdf",
      solution: "./assets/materials/MDMSS2.pdf",
    },
    {
      title: "LOGARITHM - STATISTICS PRACTICE SET 1",
      description:
        "Logarithm as a function, Laws of Logarithm and related Simple examples, Mean, Median and Mode for ungrouped data",
      material: "./assets/materials/MLS1.pdf",
      solution: "./assets/materials/MLSS1.pdf",
    },
    {
      title: "LOGARITHM - STATISTICS PRACTICE SET 2",
      description:
        "Logarithm as a function, Laws of Logarithm and related Simple examples, Mean, Median and Mode for ungrouped data",
      material: "./assets/materials/MLS2.pdf",
      solution: "./assets/materials/MLSS2.pdf",
    },
    {
      title: "SOFT SKILLS - GRAMMER PRACTICE SET 1",
      description:
        "Parts of Speech (A) Noun (B) Pronoun (C) Adjective (D) Adverb (E) Verb (F) Preposition (G) Connectors (H) Interjection, Tenses, Subject Verb Agreement.",
      material: "./assets/materials/SKGS1.pdf",
      solution: "./assets/materials/SKGSS1.pdf",
    },
    {
      title: "SOFT SKILLS - GRAMMER PRACTICE SET 2",
      description:
        "Parts of Speech (A) Noun (B) Pronoun (C) Adjective (D) Adverb (E) Verb (F) Preposition (G) Connectors (H) Interjection, Tenses, Subject Verb Agreement.",
      material: "./assets/materials/SKGS2.pdf",
      solution: "./assets/materials/SKGSS2.pdf",
    },
    {
      title: "SOFT SKILS - WORDS & SENTENCES PRACTICE SET 1",
      description: "Word Correction, Sentence Correction.",
      material: "./assets/materials/SKWS1.pdf",
      solution: "./assets/materials/SKWSS1.pdf",
    },
    {
      title: "SOFT SKILLS - WORDS & SENTENCES PRACTICE SET 2",
      description: "Word Correction, Sentence Correction.",
      material: "./assets/materials/SKWS2.pdf",
      solution: "./assets/materials/SKWSS2.pdf",
    },
    {
      title: "ELECTRIC CUREENT PRACTICE SET 1",
      description:
        "Ohm’s Law and application. Charge, interaction of charges, Coulomb’s force. Electric field, electric potential, electric flux, electric current.",
      material: "./assets/materials/ECS1.pdf",
      solution: "./assets/materials/ECSS1.pdf",
    },
    {
      title: "ELECTRIC CUREENT PRACTICE SET 2",
      description:
        "Ohm’s Law and application. Charge, interaction of charges, Coulomb’s force. Electric field, electric potential, electric flux, electric current.",
      material: "./assets/materials/ECS2.pdf",
      solution: "./assets/materials/ECSS2.pdf",
    },
    {
      title: "CLASSICAL MECHANICS SET 1",
      description:
        "Linear motion, velocity, acceleration, force, Newton’s laws of motion, linear momentum and impulse of force.",
      material: "./assets/materials/CMS1.pdf",
      solution: "./assets/materials/CMSS1.pdf",
    },
    {
      title: "CLASSICAL MECHANICS SET 2",
      description:
        "Linear motion, velocity, acceleration, force, Newton’s laws of motion, linear momentum and impulse of force.",
      material: "./assets/materials/CMS2.pdf",
      solution: "./assets/materials/CMSS2.pdf",
    },
    {
      title: "CLASSICAL MECHANICS SET 3",
      description:
        "Linear motion, velocity, acceleration, force, Newton’s laws of motion, linear momentum and impulse of force.",
      material: "./assets/materials/CMS3.pdf",
      solution: "./assets/materials/CMSS3.pdf",
    },
  ];

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

  const openPdfViewer = (pdfUrl) => {
    setPdfLoading(true);
    setPdfError(null);
    setSelectedPdf(pdfUrl);
    setShowPdfModal(true);
    setScale(1.0); // Reset zoom when opening new PDF
  };

  const closePdfViewer = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
    setPdfLoading(false);
    setPdfError(null);
  };
  // Disable right-click and text selection
  const disablePdfActions = (e) => {
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.metaKey || e.shiftKey) {
        e.preventDefault();
        const delta = e.deltaY;
        setScale((prevScale) => {
          const newScale =
            delta < 0
              ? Math.min(prevScale + 0.1, 3.0)
              : Math.max(prevScale - 0.1, 0.5);
          return newScale;
        });
      }
    };

    const container = pdfContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [selectedPdf]);

  // Handle pinch-to-zoom on mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setTouchStartDistance(getDistance(e.touches[0], e.touches[1]));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      if (touchStartDistance) {
        setScale((prevScale) => {
          const newScale = prevScale * (currentDistance / touchStartDistance);
          return Math.min(Math.max(newScale, 0.5), 3.0);
        });
      }
      setTouchStartDistance(currentDistance);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartDistance(null);
  };

  const getDistance = (touch1, touch2) => {
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };
  const handleMouseDown = (e) => {
    if (scale > 1) {
      // Only enable drag when zoomed in
      setIsDragging(true);
      setStartPos({
        x: e.clientX,
        y: e.clientY,
      });
      setScrollPos({
        left: e.currentTarget.scrollLeft,
        top: e.currentTarget.scrollTop,
      });
      e.currentTarget.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    const container = pdfContainerRef.current;
    container.scrollLeft = scrollPos.left - dx;
    container.scrollTop = scrollPos.top - dy;

    // Log the current scroll position
    console.log("Current scroll position:", {
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    });

    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (pdfContainerRef.current) {
      pdfContainerRef.current.style.cursor = "grab";
    }
  };

  // Update cursor style based on zoom level
  useEffect(() => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }

    console.log("Current scale:", scale);
  }, [scale]);

  useEffect(() => {
    if (pdfContainerRef.current) {
      const pages = pdfContainerRef.current.querySelectorAll(".pdf-page");
      pages.forEach((page, index) => {
        console.log(`Page ${index + 1} dimensions:`, {
          width: page.clientWidth,
          height: page.clientHeight,
        });
      });
    }
  }, [numPages, scale]);
  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
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

          <div className="container-fluid dashboard-content">
            <div className="row g-2">
              <div className="col-lg-12">
                <div className="card border border-gray-100">
                  <div className="card-header border-bottom border-gray-100 flex-between gap-8">
                    <h6 className="mb-0">Materials & Solutions</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-2">
                      {solutions.map((item, index) => (
                        <div className="col-lg-6" key={index}>
                          <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                            <div className="flex-align align-items-start gap-16 col-12">
                              <div className="col-12">
                                <h6 className="title mb-0 ">{item.title}</h6>
                                <span className="d-block">
                                  {item.description}
                                </span>
                                <div className="text-13 d-flex justify-content-between mt-12 pt-12 border-top border-gray-100 ">
                                  <button
                                    onClick={() => openPdfViewer(item.material)}
                                    className="text-gray-900 hover-text-main-600 btn btn-link p-0"
                                  >
                                    <span>Material</span>
                                    <i className="ph ph-file-pdf ms-4" />
                                  </button>
                                  {item.solution && (
                                    <button
                                      onClick={() =>
                                        openPdfViewer(item.solution)
                                      }
                                      className="text-gray-900 hover-text-main-600 btn btn-link p-0"
                                    >
                                      <span>Solution</span>
                                      <i className="ph ph-file-pdf ms-4" />
                                    </button>
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
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfModal && (
        <div className="modal-overlay" onClick={closePdfViewer}>
          <div
            className="pdf-modal"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={disablePdfActions}
          >
            <div className="pdf-modal-header">
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn}>Zoom In</button>
              <button onClick={zoomOut}>Zoom Out</button>
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
              onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves
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
                          scale={scale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="pdf-page"
                          width={Math.min(window.innerWidth * scale * 1, 800)} // Adjust width based on scale
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
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .pdf-modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          touch-action: none;
        }

        .pdf-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          flex-shrink: 0;
        }

        .zoom-level {
          font-size: 14px;
          color: #555;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

       .pdf-modal-body {
    flex: 1;
    overflow: auto;
    padding: 15px;
    display: flex;
    // justify-content: center; /* Center content horizontally */
    align-items: flex-start; /* Align to top vertically */
    user-select: none;
    width: 100%;
    min-height: 100%;
  }

        .pdf-pages-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content; /* Let content determine width */
    min-width: 100%; /* Ensure it fills container when not zoomed */
  }

        .pdf-page-wrapper {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content; /* Let content determine width */
    max-width: 100%; /* Prevent overflow when not zoomed */
  }

        .pdf-page {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: auto;
    display: block;
  }


        .pdf-error {
          color: red;
          padding: 20px;
          text-align: center;
        }

        /* Scrollbar styling */
        .pdf-modal-body::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .pdf-modal-body::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .pdf-modal-body::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

         .react-pdf__Page {
    display: flex;
    justify-content: center;
  }
      `}</style>
    </>
  );
}

export default Solutions;
