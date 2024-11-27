import React from "react";

function Assignment({ img, title, due }) {
  return (
    <>
      <div className="p-xl-4 py-16 px-12 flex-between gap-8 rounded-8 border border-gray-100 hover-border-gray-200 transition-1 mb-16">
        <div className="flex-align flex-wrap gap-8">
          <span className="text-main-600 bg-main-50 w-44 h-44 rounded-circle flex-center text-2xl flex-shrink-0">
            <i className={img} />
          </span>
          <div>
            <h6 className="mb-0">{title}</h6>
            <span className="text-13 text-gray-400">{`Due in ${due} days`}</span>
          </div>
        </div>
        <a href="assignment.html" className="text-gray-900 hover-text-main-600">
          <i className="ph ph-caret-right" />
        </a>
      </div>
    </>
  );
}

export default Assignment;
