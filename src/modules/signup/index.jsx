import React, { useState } from "react";
import { Link } from "react-router-dom";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import { Step, StepLabel, Stepper } from "@mui/material";
import UnityLogo from "../../utils/UnityLogo";

function Signup() {
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(""); // Store phone number
  const steps = ["Personal Details", "Academic Details"];

  // Function to handle moving to step 2 and pass the phone number
  const handleStep1Next = (phone) => {
    setPhoneNumber(phone); // Set phone number from Step 1
    setActiveStep(1); // Move to Step 2
  };

  return (
    <section className="auth d-flex">
      <div className="auth-left bg-main-50 flex-center p-24">
        <img src="assets/images/thumbs/auth-img2.png" alt="a" />
      </div>
      <div className="auth-right py-40 px-24 flex-center flex-column">
        <div className="auth-right__inner w-100">
          <div className="d-flex align-items-center justify-content-center">
            <Link to={"/#"} className="auth-right__logo mb-0">
              {/* <img src="assets/images/logo/logo.png" alt="" /> */}
              <UnityLogo />
            </Link>
          </div>
          <h2 className="mb-8">Sign Up</h2>
          <p className="text-gray-600 text-15 mb-32">
            Your success starts here! Sign up now and take the first step toward
            acing your exams. 🚀📖
          </p>
          <div>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && <Step1 onNext={handleStep1Next} />}
            {activeStep === 1 && <Step2 phoneNumber={phoneNumber} />}
            <p className="mt-32 text-gray-600 text-center">
              Already have an account? &nbsp;
              <Link
                to={"/signin"}
                className="text-main-600 hover-text-decoration-underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
