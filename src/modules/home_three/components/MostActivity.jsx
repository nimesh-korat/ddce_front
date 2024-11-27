import React from "react";
import Chart from "../../../utils/Charts";
import { Link } from "react-router-dom";

function MostActivity() {
  const radialBarOptions = {
    chart: {
      height: 172,
      type: "radialBar",
    },
    colors: ["#3D7FF9", "#27CFA7", "#020203"],
    stroke: { lineCap: "round" },
    plotOptions: {
      radialBar: {
        hollow: { size: "30%" },
        dataLabels: {
          name: { fontSize: "16px" },
          value: { fontSize: "16px" },
          total: {
            show: true,
            formatter: () => "82%",
          },
        },
      },
    },
    labels: ["Completed", "In Progress", "Not Started"],
  };

  const radialBarSeries = [100, 60, 25];
  return (
    <>
      <div className="col-xxl-3 col-sm-6">
        {/* Donut Chart Start */}
        <div className="card h-100">
          <div className="card-header border-bottom border-gray-100 flex-between gap-8 flex-wrap">
            <h5 className="mb-0">Most Activity</h5>
            <div className="dropdown flex-shrink-0">
              <button
                className="text-gray-400 text-xl d-flex rounded-4"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ph-fill ph-dots-three-outline" />
              </button>
              <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                  <div className="card-body p-12">
                    <div className="max-h-200 overflow-y-auto scroll-sm pe-8">
                      <ul>
                        <li className="mb-0">
                          <Link
                            to={"/"}
                            className="py-6 text-15 px-8 hover-bg-gray-50 text-gray-300 w-100 rounded-8 fw-normal text-xs d-block text-start"
                          >
                            <span className="text">
                              <i className="ph ph-user me-4" /> View
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* remove position relative and lock-overlay div when unlocks */}
          <div className="card-body position-relative">
            <div className="lock-overlay active">
              <i className="ph-fill ph-lock" />
            </div>
            <div class="content">
              <div className="flex-center mb-20">
                <Chart
                  options={radialBarOptions}
                  series={radialBarSeries}
                  type="radialBar"
                />
              </div>
              <div className="flex-between gap-8 flex-wrap mt-20">
                <div className="flex-align flex-column">
                  <span className="w-12 h-12 bg-white border border-3 border-main-600 rounded-circle" />
                  <span className="text-13 my-4 text-main-600">Mentoring</span>
                  <h6 className="mb-0">65.2%</h6>
                </div>
                <div className="flex-align flex-column">
                  <span className="w-12 h-12 bg-white border border-3 border-main-two-600 rounded-circle" />
                  <span className="text-13 my-4 text-main-two-600">
                    Organization
                  </span>
                  <h6 className="mb-0">25.0%</h6>
                </div>
                <div className="flex-align flex-column">
                  <span className="w-12 h-12 bg-white border border-3 border-danger-600 rounded-circle" />
                  <span className="text-13 my-4 text-danger-600">Planning</span>
                  <h6 className="mb-0">9.8%</h6>
                </div>
              </div>
            </div>
          </div>

          {/* <img className="card-body " src="/assets/images/thumbs/most_activity.png" alt="" /> */}
        </div>
        {/* Donut Chart End */}
      </div>
    </>
  );
}

export default MostActivity;
