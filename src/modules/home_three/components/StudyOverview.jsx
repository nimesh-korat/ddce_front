import React from "react";
import Chart from "../../../utils/Charts";

function StudyOverview() {
  const studyOverviewData = [
    {
      name: "Study",
      data: [3.6, 1.8, 3.8, 0, 2.4, 0.6, 8, 1.2, 2.8, 2.3, 4, 2],
    },
    {
      name: "Test",
      data: [0.2, 4, 0, 6, 0.6, 4, 4, 8, 2.1, 5.6, 1.8, 3.6],
    },
  ];

  const studyOverviewOptions = {
    chart: {
      type: "line",
      width: "100%",
      height: 350,
      sparkline: {
        enabled: false, // Remove whitespace
      },
      toolbar: {
        show: false,
      },
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    colors: ["#3D7FF9", "#27CFA7"], // Set the color of the series
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#3D7FF9", "#27CFA7"],
      lineCap: "round",
    },
    grid: {
      show: true,
      borderColor: "#E6E6E6",
      strokeDashArray: 3,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    // Customize the circle marker color on hover
    markers: {
      colors: ["#3D7FF9", "#27CFA7"],
      strokeWidth: 3,
      size: 0,
      hover: {
        size: 8,
      },
    },
    xaxis: {
      labels: {
        show: false,
        formatter: function (value) {
          return value;
        },
        style: {
          fontSize: "14px",
        },
      },
      categories: [
        `Jan`,
        `Feb`,
        `Mar`,
        `Apr`,
        `May`,
        `Jun`,
        `Jul`,
        `Aug`,
        `Sep`,
        `Oct`,
        `Nov`,
        `Dec`,
      ],
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "$" + value + "Hr";
        },
        style: {
          fontSize: "14px",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
      offsetY: -0,
    },
  };
  return (
    <>
      <div className="card h-100">
        <div className="card-body">
          <div className="mb-20 flex-between flex-wrap gap-8">
            <h4 className="mb-0">Study Overview</h4>
            <div className="flex-align gap-16 flex-wrap">
              <div className="flex-align flex-wrap gap-16">
                <div className="flex-align flex-wrap gap-8">
                  <span className="w-8 h-8 rounded-circle bg-main-600" />
                  <span className="text-13 text-gray-600">Design</span>
                </div>
                <div className="flex-align flex-wrap gap-8">
                  <span className="w-8 h-8 rounded-circle bg-main-two-600" />
                  <span className="text-13 text-gray-600">Development</span>
                </div>
              </div>
              <select className="form-select form-control text-13 px-8 pe-24 py-8 rounded-8 w-auto">
                <option value={1}>Yearly</option>
                <option value={1}>Monthly</option>
                <option value={1}>Weekly</option>
                <option value={1}>Today</option>
              </select>
            </div>
          </div>
          {/* remove position relative and lock-overlay div when unlocks */}
          <div className="position-relative">
            <div className="lock-overlay active">
                <i className="ph-fill ph-lock" />
              </div>
          <div class="content">
            <div className="tooltip-style y-value-lefte">
              

              <Chart
                options={studyOverviewOptions}
                series={studyOverviewData}
                type="line"
              />
            </div>
            </div>
          </div>
          {/* <img src="assets/images/thumbs/study_over.png" alt="" /> */}
        </div>
      </div>
    </>
  );
}

export default StudyOverview;
