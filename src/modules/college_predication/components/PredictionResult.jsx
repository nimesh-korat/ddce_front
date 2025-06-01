import React, { useState } from "react";

function PredictionResult({ results, onBack, formData }) {
  const [activeCollege, setActiveCollege] = useState(null);

  return (
    <div
      className="d-flex justify-content-center"
      style={{
        width: "100%",
        padding: "1px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        className="dce-form-container"
        style={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Fixed Header */}
        <div
          className="card"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="dce-form-header">
            <img
              src="./assets/images/logo/logo7.png"
              alt="Unity Logo"
              style={{ width: "90%" }}
            />
          </div>
        </div>

        <div
          className="card-body"
          style={{
            // marginTop: "10px",
            maxHeight: "calc(100vh - 200px)",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <div className="row m-4">
            <div className="col-md-6">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Rank:</strong> {formData.ddcet_rank}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Category:</strong> {formData.category}
              </p>
              <p>
                <strong>Application No:</strong> {formData.applicationNo}
              </p>
            </div>
          </div>

          <div className="college-results">
            <div className="accordion" id="collegesAccordion">
              {results.map((college, collegeIndex) => (
                <div className="accordion-item" key={collegeIndex}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${
                        activeCollege === collegeIndex ? "" : "collapsed"
                      }`}
                      type="button"
                      onClick={() =>
                        setActiveCollege(
                          activeCollege === collegeIndex ? null : collegeIndex
                        )
                      }
                    >
                      <div className="d-flex justify-content-between w-100 align-items-center">
                        <div className="d-flex flex-column lh-sm">
                          <span className="fw-bold">
                            {college.college_name}
                          </span>
                          <span className="text-muted ms-2">
                            ({college.college_type})
                          </span>
                        </div>
                        <span className="badge bg-secondary">
                          {college.branches.length} branches
                        </span>
                      </div>
                    </button>
                  </h2>
                  <div
                    className={`accordion-collapse collapse ${
                      activeCollege === collegeIndex ? "show" : ""
                    }`}
                  >
                    <div className="accordion-body">
                      {college.branches.map((branch, branchIndex) => (
                        <div
                          key={branchIndex}
                          className="branch-details mb-10 p-3 border rounded"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">{branch.branch}</h5>
                            <span
                              className={`badge ${getAdmissionBadgeClass(
                                branch.admission_chance
                              )}`}
                            >
                              {branch.admission_chance.toUpperCase()}
                            </span>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <p>
                                <strong>Rank Range:</strong>{" "}
                                {branch.rank_range.min} -{" "}
                                {branch.rank_range.max}
                              </p>
                              <p>
                                <strong>Prev. Year Marks Range:</strong>{" "}
                                {branch.marks_range.min} -{" "}
                                {branch.marks_range.max}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>Quota:</strong> {branch.quota}
                              </p>
                              <p>
                                <strong>Category:</strong> {branch.category}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p
                              className={`text-${getAdmissionTextClass(
                                branch.admission_chance
                              )}`}
                            >
                              <strong>Your Chance:</strong> Based on your rank{" "}
                              {formData.ddcet_rank}, you have a{" "}
                              {branch.admission_chance} chance of admission.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions remain the same
const getAdmissionBadgeClass = (chance) => {
  switch (chance) {
    case "high":
      return "bg-success";
    case "medium":
      return "bg-warning text-dark";
    case "low":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

const getAdmissionTextClass = (chance) => {
  switch (chance) {
    case "high":
      return "success";
    case "medium":
      return "warning";
    case "low":
      return "danger";
    default:
      return "secondary";
  }
};

export default PredictionResult;
