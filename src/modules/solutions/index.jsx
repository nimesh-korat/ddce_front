import React, { useState } from "react";
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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const solutions = [
    {
      title: "DETERMINANT & MATRICES PRACTICE SET 1",
      description:
        "Determinant and its value up to 3rd order (Without properties). Concept of a Matrix. Types of Matrices. Addition, Subtraction and multiplication by scalar of matrices. Product of two matrices. Adjoint and Inverse of a matrix of order 2X2. Solution of Simultaneous linear equations of two variables",
      material: "./assets/materials/MDMS1.pdf",
      solution: null,
    },
    {
      title: "DETERMINANT & MATRICES PRACTICE SET 2",
      description:
        "Determinant and its value up to 3rd order (Without properties). Concept of a Matrix. Types of Matrices. Addition, Subtraction and multiplication by scalar of matrices. Product of two matrices. Adjoint and Inverse of a matrix of order 2X2. Solution of Simultaneous linear equations of two variables",
      material: "./assets/materials/MDMS2.pdf",
      solution: null,
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
  };

  const closePdfViewer = () => {
    setShowPdfModal(false);
    setSelectedPdf(null);
    setPdfLoading(false);
    setPdfError(null);
  };

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
                                    <span>View Material</span>
                                    <i className="ph ph-file-pdf ms-4" />
                                  </button>
                                  {item.solution && (
                                    <button
                                      onClick={() =>
                                        openPdfViewer(item.solution)
                                      }
                                      className="text-gray-900 hover-text-main-600 btn btn-link p-0"
                                    >
                                      <span>View Solution</span>
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
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <button onClick={closePdfViewer} className="close-button">
                <i className="ph ph-x" />
              </button>
            </div>
            <div className="pdf-modal-body">
              {/* {pdfLoading && <div className="pdf-loading">Loading PDF...</div>} */}
              {pdfError && <div className="pdf-error">{pdfError}</div>}
              {!pdfError && (
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  // loading={<div>Loading PDF...</div>}
                  error={<div>Failed to load PDF.</div>}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={Math.min(window.innerWidth * 0.8, 800)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
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
          overflow: auto;
          padding: 20px;
        }

        .pdf-modal-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }

        .pdf-modal-body {
          height: calc(90vh - 60px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pdf-loading,
        .pdf-error {
          padding: 20px;
          text-align: center;
        }

        .pdf-error {
          color: red;
        }
      `}</style>
    </>
  );
}

export default Solutions;
