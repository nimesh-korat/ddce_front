import React from "react";

function Statestics({numbers, text, icon, chart}) {
  return (
    <div className="col-xxl-3 col-sm-6">
      <div className="card">
        <div className="card-body">
          <h4 className="mb-2">{numbers}+</h4>
          <span className="text-gray-600">{text}</span>
          <div className="flex-between gap-8 mt-16">
            <span className="flex-shrink-0 w-48 h-48 flex-center rounded-circle bg-main-600 text-white text-2xl">
              <i className={`ph-fill ${icon}`} />
            </span>
            <div
              id={chart}
              className="remove-tooltip-title rounded-tooltip-value"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statestics;
