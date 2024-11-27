import React from "react";
import Chart from "../../../utils/Charts";

function MyProgress() {
  // RadialBar Chart Configuration
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
      <Chart
        options={radialBarOptions}
        series={radialBarSeries}
        type="radialBar"
        height={172}
      />
      <div>
        <h6 className="text-lg mb-16 text-center">
          <span className="text-gray-400">Total hour:</span> 6h 32 min
        </h6>
        <div className="flex-between gap-8 flex-wrap">
          <div className="flex-align flex-column">
            <h6 className="mb-6">60/60</h6>
            <span className="w-30 h-3 rounded-pill bg-main-600" />
            <span className="text-13 mt-6 text-gray-600">Completed</span>
          </div>
          <div className="flex-align flex-column">
            <h6 className="mb-6">60/60</h6>
            <span className="w-30 h-3 rounded-pill bg-main-two-600" />
            <span className="text-13 mt-6 text-gray-600">Completed</span>
          </div>
          <div className="flex-align flex-column">
            <h6 className="mb-6">60/60</h6>
            <span className="w-30 h-3 rounded-pill bg-gray-500" />
            <span className="text-13 mt-6 text-gray-600">Completed</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProgress;
