import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { DdcetRankPredict } from "../../apis/apis";
import { toast } from "react-toastify";
import PredictionResult from "./components/PredictionResult";
// import { Helmet } from "react-helmet";

function CollgePredication() {
  const colleges = [
    {
      College_Name: "A.V. Parekh Technical Institute, Rajkot",
    },
    {
      College_Name: "S. S. Agrawal College, Navsari",
    },
    {
      College_Name: "Apollo institute of technology engineering ",
    },
    {
      College_Name: "Bhailalbhai & Bhikhabhai Institute of Technology (BBIT)",
    },
    {
      College_Name: "Bhagwan Mahavir Polytechnic",
    },
    {
      College_Name: "Bhavnagar Polytechnic Institute ",
    },
    {
      College_Name: "C.U. Shah Polytechnic, Surendranagar",
    },
    {
      College_Name: "Dharmsinh Desai University ",
    },
    {
      College_Name: "Dr. BBA polytechnic College karad ",
    },
    {
      College_Name: "Dr. S.&S.S.Gandhi",
    },
    {
      College_Name: "Dr. Subhash University",
    },
    {
      College_Name: "Gandhinagar Institute of Technology",
    },
    {
      College_Name: "Government Polytechnic for Girls, Ahmedabad",
    },
    {
      College_Name: "Government Polytechnic, Ahmedabad",
    },
    {
      College_Name: "Government Polytechnic, Bhuj",
    },
    {
      College_Name: "Government Polytechnic, Dahod",
    },
    {
      College_Name: "Government Polytechnic, Daman",
    },
    {
      College_Name: "Government Polytechnic, Darbhanga",
    },
    {
      College_Name: "Government Polytechnic, Gandhinagar",
    },
    {
      College_Name: "Government Polytechnic, Himmatnagar",
    },
    {
      College_Name: "Government Polytechnic, Jamnagar",
    },
    {
      College_Name: "Government Polytechnic, Kheda",
    },
    {
      College_Name: "Government Polytechnic, Porbandar",
    },
    {
      College_Name: "Government Polytechnic, Rajkot",
    },
    {
      College_Name: "Gujarat Technological University ",
    },
    {
      College_Name: "Gyanmanjari Institute of Technology",
    },
    {
      College_Name: "Kalyan Polytechnic, Jamnagar",
    },
    {
      College_Name: "KD Polytechnic, Patan",
    },
    {
      College_Name: "LDRP",
    },
    {
      College_Name: "LE College, Morbi",
    },
    {
      College_Name: "LJ Polytechnic",
    },
    {
      College_Name: "Lok Jagruti University",
    },
    {
      College_Name: "Monark University",
    },
    {
      College_Name: "MSU Polytechnic",
    },
    {
      College_Name: "Nirma University",
    },
    {
      College_Name: "Parul University",
    },
    {
      College_Name: "PP SAVANI",
    },
    {
      College_Name: "Prime College of Diploma",
    },
    {
      College_Name: "RC Technical Institute",
    },
    {
      College_Name: "Sal Institute of Diploma Studies",
    },
    {
      College_Name: "Shree Swaminarayan Polytechnic",
    },
    {
      College_Name: "Sigma Institute of Engineering",
    },
    {
      College_Name: "Silver Oak University",
    },
    {
      College_Name: "Sir Bhavsinhji Polytechnic Institute, Bhavnagar",
    },
    {
      College_Name: "SPB Patel Engineering College",
    },
    {
      College_Name: "Tapi Diploma Engineering College",
    },
    {
      College_Name: "Tolani Polytechnic",
    },
    {
      College_Name: "UPL University of Sustainable Technology",
    },
    {
      College_Name: "VPMP Polytechnic",
    },
  ];

  const branchOptions = [
    { value: "aeronautical_engineering", label: "Aeronautical Engineering" },
    { value: "architecture", label: "Architecture" },
    {
      value: "architectural_assistantship",
      label: "Architectural Assistantship",
    },
    {
      value: "ai_ml",
      label: "Artificial Intelligence (AI) & Machine Learning",
    },
    { value: "automobile_engineering", label: "Automobile Engineering" },
    { value: "automation_robotics", label: "Automation & Robotics" },
    { value: "bio_medical_engineering", label: "Bio-Medical Engineering" },
    { value: "cadcam", label: "CADCAM" },
    { value: "ceramic_technology", label: "Ceramic Technology" },
    { value: "chemical_engineering", label: "Chemical Technology" },
    { value: "civil_engineering", label: "Civil Engineering" },
    { value: "cloud_computing", label: "Cloud Computing & Big Data" },
    { value: "computer_engineering", label: "Computer Engineering" },
    {
      value: "computer_aided_costume_design_dress_making",
      label: "Computer Aided Costume Design & Dress Making",
    },
    { value: "computer_science", label: "Computer Science & Engineering" },
    { value: "electrical_engineering", label: "Electrical Engineering" },
    {
      value: "electronics_communication",
      label: "Electronics & Communication Engineering",
    },
    {
      value: "envirenvirenvirenvironmental_engineering",
      label: "Environmental Engineering",
    },
    { value: "fabrication_technology", label: "Fabrication Technology" },
    { value: "gaming_animation", label: "Gaming & Animation" },
    { value: "ict", label: "Information & Communication Technology" },
    { value: "information_technology", label: "Information Technology" },
    {
      value: "instrumentation_control",
      label: "Instrumentation & Control Engineering",
    },
    { value: "mechanical_cadcam", label: "Mechanical Engg (CAD/CAM)" },
    { value: "mechanical_engineering", label: "Mechanical Engineering" },
    { value: "mechatronics", label: "Mechatronics" },
    { value: "metallurgy", label: "Metallurgy" },
    { value: "mining_engineering", label: "Mining Engineering" },
    { value: "petro_chemical", label: "Petro Chemical Engineering" },
    {
      value: "plastic_engineering",
      label: "Plastic Engineering",
    },
    { value: "power_electronics", label: "Power Electronics" },
    { value: "printing_technology", label: "Printing Technology" },
    { value: "renewable_energy", label: "Renewable Energy" },
    { value: "textile_chemistry", label: "Textile Chemistry" },
    { value: "textile_design", label: "Textile Design" },
    {
      value: "textile_manufacturing",
      label: "Textile MaTextile Manufacturing Technology",
    },
    { value: "textile_processing", label: "Textile Processing Technology" },
    { value: "textile_technology", label: "Textile Technology" },
  ];

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    college: "",
    branch: "",
    applicationNo: "",
    ddcet_rank: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    college: "",
    branch: "",
    applicationNo: "",
    ddcet_rank: "",
  });

  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      category: "",
      college: "",
      branch: "",
      applicationNo: "",
      ddcet_rank: "",
    };

    if (!data.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    } else if (data.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    const phoneRegex = /^[6789]\d{9}$/;
    if (!data.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number.";
      isValid = false;
    }

    if (!data.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }

    if (!data.college) {
      newErrors.college = "Please select a college";
      isValid = false;
    }

    if (!data.branch) {
      newErrors.branch = "Please select a branch";
      isValid = false;
    }

    const appNoRegex = /^\d{12}$/;
    if (!data.applicationNo) {
      newErrors.applicationNo = "Application number is required";
      isValid = false;
    } else if (!appNoRegex.test(data.applicationNo)) {
      newErrors.applicationNo = "Application number must be exactly 12 digits";
      isValid = false;
    }

    const rankRegex = /^\d{1,6}$/;
    if (!data.ddcet_rank) {
      newErrors.ddcet_rank = "Rank is required";
      isValid = false;
    } else if (!rankRegex.test(data.ddcet_rank)) {
      newErrors.ddcet_rank = "Rank must be a number with maximum 6 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "applicationNo" || name === "ddcet_rank") {
      if (value === "" || /^\d+$/.test(value)) {
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  const ddcetRankPredictQuery = useMutation({
    mutationFn: DdcetRankPredict,
    onSuccess: (response) => {
      setResults(response.data);
      setShowResults(true);
      toast.success("Prediction results loaded successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      ddcetRankPredictQuery.mutate(data);
    } else {
      toast.error("Please correct the errors in the form");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: `
      url('./assets/images/bg/cpbg.jpeg')
    `,
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "multiply",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* <Helmet>
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://unityexams.com/college-prediction"
        />
        <meta
          property="og:title"
          content="College Prediction Tool | UnityExams"
        />
        <meta
          property="og:description"
          content="Predict your best-fit colleges based on your exam scores and preferences."
        />
        <meta
          property="og:image"
          content="https://unityexams.com/path-to-your-preview-image.jpg"
        />
      </Helmet> */}

      {showResults ? (
        <PredictionResult
          results={results}
          onBack={handleBackToForm}
          formData={data}
        />
      ) : (
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
            <div className="dce-form-header">
              <img
                src="./assets/images/logo/logo7.png"
                alt="Unity Logo"
                style={{ width: "90%" }}
              />
              {/* <h3 className="mt-5 mb-0">Possible College Allocation</h3> */}
            </div>
            <form
              className="dce-form-body"
              id="dceMainForm"
              onSubmit={handleSubmit}
            >
              <div className="dce-form-section">
                <div className="dce-section-title">
                  DDCET Merit Rank Based College Allocation Probability (2025)
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="dceName" className="dce-form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="dceName"
                      className={`form-control dce-form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your full name"
                      name="name"
                      value={data.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dceEmail" className="dce-form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="dceEmail"
                      name="email"
                      value={data.email}
                      onChange={handleInputChange}
                      className={`form-control dce-form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="dcePhone" className="dce-form-label">
                      Phone Number
                    </label>
                    <div className="dce-phone-group">
                      <input
                        type="tel"
                        id="dcePhone"
                        name="phone"
                        value={data.phone}
                        onChange={handleInputChange}
                        className={`form-control dce-form-control dce-phone-input ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dceCategory" className="dce-form-label">
                      Category
                    </label>
                    <div className="dce-select-wrapper">
                      <select
                        id="dceCategory"
                        className={`form-select dce-form-control ${
                          errors.category ? "is-invalid" : ""
                        }`}
                        name="category"
                        value={data.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select category</option>
                        <option value="EW">EWS</option>
                        <option value="EWPH">
                          EWS (Physically Handicapped)
                        </option>
                        <option value="EX">EX - Servicemen</option>
                        <option value="OP">OPEN</option>
                        <option value="OPPH">
                          OPEN (Physically Handicapped)
                        </option>
                        <option value="SC">SC</option>
                        <option value="SE">SE</option>
                        <option value="SEPH">
                          SE (Physically Handicapped)
                        </option>
                        <option value="ST">ST</option>
                        <option value="TF">TFWS</option>
                      </select>
                    </div>
                    {errors.category && (
                      <div className="invalid-feedback">{errors.category}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="dce-form-section">
                <div className="dce-section-title">Academic Details</div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="dceCollege" className="dce-form-label">
                      College
                    </label>
                    <div className="dce-select-wrapper">
                      <select
                        id="dceCollege"
                        className={`form-select dce-form-control ${
                          errors.college ? "is-invalid" : ""
                        }`}
                        name="college"
                        value={data.college}
                        onChange={handleInputChange}
                      >
                        <option value="">Select college</option>
                        {colleges.map((college, index) => (
                          <option key={index} value={college.College_Name}>
                            {college.College_Name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.college && (
                      <div className="invalid-feedback">{errors.college}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dceBranch" className="dce-form-label">
                      Branch
                    </label>
                    <div className="dce-select-wrapper">
                      <select
                        id="dceBranch"
                        className={`form-select dce-form-control ${
                          errors.branch ? "is-invalid" : ""
                        }`}
                        name="branch"
                        value={data.branch}
                        onChange={handleInputChange}
                      >
                        <option value="">Select branch</option>
                        {branchOptions.map((branch, index) => (
                          <option key={index} value={branch.value}>
                            {branch.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.branch && (
                      <div className="invalid-feedback">{errors.branch}</div>
                    )}
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="dceApplicationNo"
                      className="dce-form-label"
                    >
                      Application No. of DDCET
                    </label>
                    <input
                      type="text"
                      id="dceApplicationNo"
                      className={`form-control dce-form-control ${
                        errors.applicationNo ? "is-invalid" : ""
                      }`}
                      name="applicationNo"
                      value={data.applicationNo}
                      onChange={handleInputChange}
                      placeholder="Enter 12-digit application number"
                      maxLength={12}
                    />
                    {errors.applicationNo && (
                      <div className="invalid-feedback">
                        {errors.applicationNo}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="dceRankNo" className="dce-form-label">
                      Rank No. in DDCET
                    </label>
                    <input
                      type="text"
                      name="ddcet_rank"
                      value={data.ddcet_rank}
                      onChange={handleInputChange}
                      id="dceRankNo"
                      className={`form-control dce-form-control ${
                        errors.ddcet_rank ? "is-invalid" : ""
                      }`}
                      placeholder="Enter rank number (max 6 digits)"
                      maxLength={6}
                    />
                    {errors.ddcet_rank && (
                      <div className="invalid-feedback">
                        {errors.ddcet_rank}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="dce-btn dce-submit-btn"
                id="dceSubmitBtn"
                disabled={ddcetRankPredictQuery.isLoading}
              >
                {ddcetRankPredictQuery.isLoading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" /> Submit Application
                  </>
                )}
              </button>
            </form>
            <div className="dce-form-instructions mt-2">
              <div
                className="mt-4"
                style={{
                  color: "#000",
                  padding: "15px",
                  background: "rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
              >
                <h5 style={{ marginBottom: "15px" }}>Important Notes:</h5>
                <ul style={{ paddingLeft: "20px", marginBottom: "0" }}>
                  <li style={{ marginBottom: "8px", listStyleType: "disc" }}>
                    Results are generated using AI models based on DDCET
                    previous year cutoff trends and projected cutoff for the
                    current year.
                  </li>
                  <li style={{ marginBottom: "8px", listStyleType: "disc" }}>
                    All predictions are estimates and actual allocation may
                    vary.
                  </li>
                  <li style={{ marginBottom: "8px", listStyleType: "disc" }}>
                    Cutoff ranks may change based on actual applicant numbers
                    and seat availability.
                  </li>
                  <li style={{ marginBottom: "8px", listStyleType: "disc" }}>
                    For official confirmation, refer to the final merit list
                    published by the ACPC, Gujarat.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollgePredication;
