import React, { useState } from "react";
import Sidebar from "../../common/sidebar";
import Header from "../../common/header/Header";
import Footer from "../../common/footer";
import PlanItem from "./components/PlanItem";

function Pricing() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const plans = [
    {
      iconClass: "ph ph-package",
      title: "Standard Plan",
      subtitle: "Perfect for all students",
      price: "₹499",
      priceDuration: "/month",
      features: [
        { text: "Unlimited Material", available: true },
        { text: "Unlimited Quizzes", available: true },
        { text: "AI Based Analytics Tool Access", available: true },
        { text: "Online Mock Tests Series", available: true },
        { text: "Online Lectures", available: false },
        { text: "Access to Online Crash Course Batch", available: false },
        { text: "Hardcopy Material", available: false },
        { text: "Offline Lectures", available: false },
        { text: "Offline Mock Tests", available: false },
      ],
      buttonText: " Activated",
      isButtonActive: true,
      buttonLink: "/#",
      isRecommended: true, // Highlight this plan as recommended
    },
    {
      iconClass: "ph ph-planet",
      title: "Advanced Plan",
      subtitle: "Suitable to DDCET aspirants",
      price: "₹3999",
      priceDuration: "/ for 10 months",
      features: [
        { text: "Unlimited Material", available: true },
        { text: "Unlimited Quizzes", available: true },
        { text: "AI Based Analytics tool Access", available: true },
        { text: "Online Mock Tests Series", available: true },
        { text: "Online Lectures", available: true },
        { text: "Access to Online Crash Course Batch", available: true },
        { text: "Hardcopy Material", available: false },
        { text: "Offline Lectures", available: false },
        { text: "Offline Mock Tests", available: false },
      ],
      buttonText: "All (1000 seats) full",
      buttonLink: "/#",
      isButtonActive: false,
    },
    {
      iconClass: "ph ph-trophy",
      title: "Offline Batch",
      subtitle: "For students who prefers offline studies",
      price: "₹2000",
      priceDuration: "/month",
      features: [
        { text: "Unlimited Material", available: true },
        { text: "Unlimited Quizzes", available: true },
        { text: "AI Based Analytics tool Access", available: true },
        { text: "Online Mock Tests Series", available: true },
        { text: "Online Lectures", available: true },
        { text: "Access to Online Crash Course Batch", available: true },
        { text: "Hardcopy Material", available: true },
        { text: "Offline Lectures", available: true },
        { text: "Offline Mock Tests", available: true },
      ],
      buttonText: "All (200 seats) full",
      isButtonActive: false,
      buttonLink: "/#",
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
                <a
                  href="index.html"
                  className="text-gray-200 fw-normal text-15 hover-text-main-600"
                >
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-500 fw-normal d-flex">
                  <i className="ph ph-caret-right" />
                </span>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Pricing Plan
                </span>
              </li>
            </ul>
          </div>

          <div className="card mt-24">
            <div className="card-body">
              <div className="row gy-4">
                {plans.map((plan, index) => (
                  <PlanItem
                    key={index}
                    iconClass={plan.iconClass}
                    title={plan.title}
                    subtitle={plan.subtitle}
                    price={plan.price}
                    priceDuration={plan.priceDuration}
                    features={plan.features}
                    buttonText={plan.buttonText}
                    buttonLink={plan.buttonLink}
                    isRecommended={plan.isRecommended}
                    isButtonActive={plan.isButtonActive}
                  />
                ))}
                {/* <div className="col-12">
                  <label className="form-label mb-8 h6 mt-32">
                    Terms &amp; Policy
                  </label>
                  <ul className="list-inside">
                    <li className="text-gray-600 mb-4">
                      1. Set up multiple pricing levels with different features
                      and functionalities to maximize revenue
                    </li>
                    <li className="text-gray-600 mb-4">
                      2. Continuously test different price points and discounts
                      to find the sweet spot that resonates with your target
                      audience
                    </li>
                    <li className="text-gray-600 mb-4">
                      3. Price your course based on the perceived value it
                      provides to students, considering factors
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="btn btn-main text-sm btn-sm px-24 rounded-pill py-12 d-flex align-items-center gap-2 mt-24"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <i className="ph ph-plus me-4" />
                    Add New Plan
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Pricing;
