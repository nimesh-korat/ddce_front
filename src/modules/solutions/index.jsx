import React, { useState, useEffect, useRef } from "react";
// import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Solutions() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  //eslint-disable-next-line
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [actualScale, setActualScale] = useState(1.0); // Real PDF scale
  const [userFacingScale, setUserFacingScale] = useState(1.0); // Displayed scale
  const [scale, setScale] = useState(() => {
    return window.innerWidth <= 768 ? 0.5 : 1.0;
  });
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

  // Usage in your zoom functions:
  const zoomIn = () => {
    if (isMobile) {
      const newActual = Math.min(actualScale + 0.1, 1.0); // Max 100% actual scale
      setActualScale(newActual);
      setUserFacingScale(newActual * 2); // Display as 200% max
    } else {
      const newScale = Math.min(actualScale + 0.1, 3.0);
      setActualScale(newScale);
      setUserFacingScale(newScale);
    }
  };

  const zoomOut = () => {
    if (isMobile) {
      const newActual = Math.max(actualScale - 0.1, 0.25); // Can zoom out to 0.25 (displays as 50%)
      setActualScale(newActual);
      setUserFacingScale(newActual * 2);
    } else {
      const newScale = Math.max(actualScale - 0.1, 0.5);
      setActualScale(newScale);
      setUserFacingScale(newScale);
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
      setIsDragging(true);
      setStartPos({
        x: e.clientX,
        y: e.clientY,
      });
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

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    pdfContainerRef.current.scrollLeft = scrollPos.left - dx;
    pdfContainerRef.current.scrollTop = scrollPos.top - dy;

    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (pdfContainerRef.current) {
      pdfContainerRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }
  };

  // Update cursor style based on zoom level
  useEffect(() => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }
  }, [scale]);

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (container) {
      // Center the content when scale changes
      container.scrollLeft =
        (container.scrollWidth - container.clientWidth) / 2;
    }
  }, [scale, numPages]);

  // Mobile detection and initial scale setup
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile) {
        setActualScale(0.5); // Start at half size for mobile
        setUserFacingScale(1.0); // Display as 100%
      } else {
        setActualScale(1.0);
        setUserFacingScale(1.0);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // const handleDownload = (fileUrl, fileName) => {
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.setAttribute("download", fileName); // Forces download
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const solutions = [
    {
      title: "MATHEMATICS - INTEGRATION SET 1",
      description:
        "Concept of Integration, Working rules and Integral of standard functions, Method of substitution & Integration by parts (simple examples), Definite Integral (simple examples)",
      material: "./assets/materials/MIMS1.pdf",
      solution: "./assets/materials/MIMSS1.pdf",
    },
    {
      title:
        "COMBINED MATERIAL 2 (PHYSICS, SOFT SKILL AND ENVIRONMENTAL SCIENCES) SET 1",
      description:
        "Modes of heat transfer, Various temperature scale, conversion of temperature, Kelvin – Celsius, Kelvin – Fahrenheit, Fahrenheit – Celsius and vice versa, Parts of Speech, Tenses, Subject Verb Agreement, Ecosystem, Pollution and its types, Climate Change, Renewable Sources of Energy such as Hydro, Solar, Wind, Bio-mass, Tidal and Geothermal - their availability and limitations.",
      material: "./assets/materials/PEEMS1.pdf",
      solution: "./assets/materials/PEEMSS1.pdf",
    },
    {
      title:
        "COMBINED MATERIAL 2 (PHYSICS, SOFT SKILL AND ENVIRONMENTAL SCIENCES) SET 2",
      description:
        "Modes of heat transfer, Various temperature scale, conversion of temperature, Kelvin – Celsius, Kelvin – Fahrenheit, Fahrenheit – Celsius and vice versa, Parts of Speech, Tenses, Subject Verb Agreement, Ecosystem, Pollution and its types, Climate Change, Renewable Sources of Energy such as Hydro, Solar, Wind, Bio-mass, Tidal and Geothermal - their availability and limitations.",
      material: "./assets/materials/PEEMS2.pdf",
      solution: "./assets/materials/PEEMSS2.pdf",
    },
    {
      title:
        "COMBINED MATERIAL 2 (PHYSICS, SOFT SKILL AND ENVIRONMENTAL SCIENCES) SET 3",
      description:
        "Modes of heat transfer, Various temperature scale, conversion of temperature, Kelvin – Celsius, Kelvin – Fahrenheit, Fahrenheit – Celsius and vice versa, Parts of Speech, Tenses, Subject Verb Agreement, Ecosystem, Pollution and its types, Climate Change, Renewable Sources of Energy such as Hydro, Solar, Wind, Bio-mass, Tidal and Geothermal - their availability and limitations.",
      material: "./assets/materials/PEEMS3.pdf",
      solution: "./assets/materials/PEEMSS3.pdf",
    },
    {
      title:
        "COMBINED MATERIAL (COMPUTER PRACTICE, SOFT SKILL AND CHEMISTRY) SET 1",
      description:
        "Chemical Equations: Writing a Chemical Equation, Balanced Chemical Equations, Types of Chemical Reactions: Combination Reaction, Decomposition Reaction, Displacement Reaction, Double Displacement Reaction, Correction of Incorrect Words and Sentences, Basics of Computer System, Introduction to Internet HTML, Using MS - Word/MS-Excel/MS-Power Point",
      material: "./assets/materials/CECMS1.pdf",
      solution: "./assets/materials/CECMSS1.pdf",
    },
    {
      title:
        "COMBINED MATERIAL (COMPUTER PRACTICE, SOFT SKILL AND CHEMISTRY) SET 2",
      description:
        "Chemical Equations: Writing a Chemical Equation, Balanced Chemical Equations, Types of Chemical Reactions: Combination Reaction, Decomposition Reaction, Displacement Reaction, Double Displacement Reaction, Correction of Incorrect Words and Sentences, Basics of Computer System, Introduction to Internet HTML, Using MS - Word/MS-Excel/MS-Power Point",
      material: "./assets/materials/CECMS2.pdf",
      solution: "./assets/materials/CECMSS2.pdf",
    },
    {
      title:
        "COMBINED MATERIAL (COMPUTER PRACTICE, SOFT SKILL AND CHEMISTRY) SET 3",
      description:
        "Chemical Equations: Writing a Chemical Equation, Balanced Chemical Equations, Types of Chemical Reactions: Combination Reaction, Decomposition Reaction, Displacement Reaction, Double Displacement Reaction, Correction of Incorrect Words and Sentences, Basics of Computer System, Introduction to Internet HTML, Using MS - Word/MS-Excel/MS-Power Point",
      material: "./assets/materials/CECMS3.pdf",
      solution: "./assets/materials/CECMSS3.pdf",
    },
    {
      title: "METALS AND NON-METALS MATERIAL SET 5",
      description:
        "Physical properties of Metals and Non-metals, Chemical Properties of Metals, How do Metals and Non-metals React? : Properties of Ionic compounds, Corrosion of Metals.",
      material: "./assets/materials/MNMS5.pdf",
      solution: "./assets/materials/MNMSS5.pdf",
    },
    {
      title: "METALS AND NON-METALS MATERIAL SET 6",
      description:
        "Physical properties of Metals and Non-metals, Chemical Properties of Metals, How do Metals and Non-metals React? : Properties of Ionic compounds, Corrosion of Metals.",
      material: "./assets/materials/MNMS6.pdf",
      solution: "./assets/materials/MNMSS6.pdf",
    },
    {
      title: "UNITS AND MEASUREMENT MATERIAL SET 3",
      description:
        "Errors, Estimation of error, relative error, percentage error, propagation of errors. Measurement with Vernier caliper and micrometer screw gauge.",
      material: "./assets/materials/UMMS3.pdf",
      solution: "./assets/materials/UMMSS3.pdf",
    },
    {
      title: "UNITS AND MEASUREMENT MATERIAL SET 4",
      description:
        "Errors, Estimation of error, relative error, percentage error, propagation of errors. Measurement with Vernier caliper and micrometer screw gauge.",
      material: "./assets/materials/UMMS4.pdf",
      solution: "./assets/materials/UMMSS4.pdf",
    },
    {
      title: "FUNCTION AND LIMIT MATERIAL SET 3",
      description:
        "Function and simple examples, Limit of a Function, Standard formulae of Limit and related simple examples",
      material: "./assets/materials/FALS3.pdf",
      solution: "./assets/materials/FALSS3.pdf",
    },
    {
      title: "FUNCTION AND LIMIT MATERIAL SET 4",
      description:
        "Function and simple examples, Limit of a Function, Standard formulae of Limit and related simple examples",
      material: "./assets/materials/FALS4.pdf",
      solution: "./assets/materials/FALSS4.pdf",
    },
    {
      title: "UNITS AND MEASUREMENT MATERIAL SET 5",
      description:
        "Physical quantities and units, Interconversion of units MKS (SI) to CGS and vice versa.",
      material: "./assets/materials/UMMS5.pdf",
      solution: "./assets/materials/UMMSS5.pdf",
    },
    {
      title: "UNITS AND MEASUREMENT MATERIAL SET 6",
      description:
        "Physical quantities and units, Interconversion of units MKS (SI) to CGS and vice versa.",
      material: "./assets/materials/UMMS6.pdf",
      solution: "./assets/materials/UMMSS6.pdf",
    },
    {
      title: "ENVIRONMENTAL SCIENCES MATERIAL SET 2",
      description: "Ecosystem, Pollution and its types",
      material: "./assets/materials/ESMS2.pdf",
      solution: "./assets/materials/ESMSS2.pdf",
    },
    {
      title: "ENVIRONMENTAL SCIENCES MATERIAL SET 3",
      description: "Ecosystem, Pollution and its types",
      material: "./assets/materials/ESMS3.pdf",
      solution: "./assets/materials/ESMSS3.pdf",
    },
    {
      title: "TRIGONOMETRY MATERIAL SET 3",
      description:
        "Units of Angles (degree and radian), Trigonometric Functions, Periods of Trigonometric functions, Allied & Compound Angles, Multiple –Submultiples angles, Sum and factor formula",
      material: "./assets/materials/TMS3.pdf",
      solution: "./assets/materials/TMSS3.pdf",
    },
    {
      title: "TRIGONOMETRY MATERIAL SET 4",
      description:
        "Units of Angles (degree and radian), Trigonometric Functions, Periods of Trigonometric functions, Allied & Compound Angles, Multiple –Submultiples angles, Sum and factor formula",
      material: "./assets/materials/TMS4.pdf",
      solution: "./assets/materials/TMSS4.pdf",
    },
    {
      title: "CLASSICAL MECHANICS MATERIAL SET 4",
      description:
        "Circular motion, angular velocity, angular acceleration, centripetal and centrifugal force, Work, energy, kinetic energy, potential energy, power.",
      material: "./assets/materials/CMMS4.pdf",
      solution: "./assets/materials/CMMSS4.pdf",
    },
    {
      title: "CLASSICAL MECHANICS MATERIAL SET 5",
      description:
        "Circular motion, angular velocity, angular acceleration, centripetal and centrifugal force, Work, energy, kinetic energy, potential energy, power.",
      material: "./assets/materials/CMMS5.pdf",
      solution: "./assets/materials/CMMSS5.pdf",
    },
    {
      title: "COMPUTER PRACTICE MATERIAL SET 3",
      description:
        "Basics of Computer System, Introduction to Internet HTML, Using MS - Word/MS-Excel/MS-Power Point",
      material: "./assets/materials/CPMS3.pdf",
      solution: "./assets/materials/CPMSS3.pdf",
    },
    {
      title: "COMPUTER PRACTICE MATERIAL SET 4",
      description:
        "Basics of Computer System, Introduction to Internet HTML, Using MS - Word/MS-Excel/MS-Power Point",
      material: "./assets/materials/CPMS4.pdf",
      solution: "./assets/materials/CPMSS4.pdf",
    },
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
        <div className="modal-overlay " onClick={closePdfViewer}>
          <div
            className="pdf-modal m-20"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={disablePdfActions}
          >
            <div className="pdf-modal-header">
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
                          scale={actualScale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="pdf-page"
                          width={isMobile ? null : undefined} // Let PDF determine width on mobile
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
  overflow: hidden;
}

      .pdf-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding: 20px;
  user-select: none;
  width: 100%;
}

      .pdf-pages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
}

      .pdf-page-wrapper {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

      ..pdf-page {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

  @media (max-width: 768px) {
  .pdf-modal {
    width: 95%;
    height: 95vh;
  }
  
  .pdf-modal-body {
    padding: 10px;
  }
  
  .react-pdf__Page__canvas {
    max-width: 100%;
    height: auto !important;
  }
}
    `}</style>
    </>
  );
}

export default Solutions;
