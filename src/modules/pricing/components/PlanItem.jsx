import React from "react";

const PlanItem = ({
  iconClass,
  title,
  subtitle,
  price,
  priceDuration,
  features,
  buttonText,
  buttonLink,
  isRecommended,
  isButtonActive,
}) => {
  return (
    <div className="col-md-4 col-sm-6">
      <div
        className={`plan-item rounded-16 border border-gray-100 transition-2 position-relative d-flex flex-column h-100 ${
          isRecommended && "active"
        }`}
      >
        {isRecommended && (
          <span className="plan-badge py-4 px-16 bg-main-600 text-white position-absolute inset-inline-end-0 inset-block-start-0 mt-8 text-15">
            Your Plan
          </span>
        )}

        <span className="text-2xl d-flex mb-16 text-main-600">
          <i className={iconClass} />
        </span>
        <h3 className="mb-4">{title}</h3>
        <span className="text-gray-600">{subtitle}</span>
        <h2 className="h1 fw-medium text-main mb-32 mt-16 pb-32 border-bottom border-gray-100 d-flex gap-4">
          {price} <span className="text-md text-gray-600">{priceDuration}</span>
        </h2>
        <ul className="flex-grow-1">
          {features.map((feature, index) => (
            <li
              key={index}
              className={`flex-align gap-8 text-gray-600 mb-lg-4 mb-20`}
            >
              <span
                className={`text-24 d-flex ${
                  feature.available ? "text-main-600" : "text-danger-600"
                }`}
              >
                <i
                  className={`ph ${
                    feature.available ? "ph-check-circle" : "ph-x-circle"
                  }`}
                />
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
        <button
          to={buttonLink}
          className={`btn ${
            isButtonActive ? "custom-btn" : "btn-outline-main"
          } custom-btn w-100 rounded-pill py-16 border-main-300 text-17 fw-medium mt-32`}
          disabled={!isButtonActive}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PlanItem;
