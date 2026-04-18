import React from "react";
import { Link } from "react-router-dom";

function StatCard({ icon, label, value, color, link }) {
  return (
    <div className="col-xxl-3 col-xl-3 col-sm-6">
      <div className="card">
        <div className="card-body p-20">
          <div className="flex-align gap-16">
            <div
              className={`w-48 h-48 d-flex align-items-center justify-content-center rounded-circle ${color} text-white flex-shrink-0`}
            >
              <i className={`ph ${icon} text-22`} />
            </div>
            <div className="flex-grow-1">
              <p className="text-gray-500 text-13 mb-2">{label}</p>
              <h4 className="fw-semibold text-gray-800 mb-0">
                {value.toLocaleString()}
              </h4>
            </div>
          </div>
          {link && (
            <div className="mt-12 pt-12 border-top border-gray-100">
              <Link
                to={link}
                className="text-13 text-main-600 hover-text-main-800 flex-align gap-4"
              >
                View Details
                <i className="ph ph-arrow-right text-14" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
