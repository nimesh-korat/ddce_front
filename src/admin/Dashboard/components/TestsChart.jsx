import React from "react";
import ReactApexChart from "react-apexcharts";

function TestsChart({ breakdown }) {
  const upcoming = Number(breakdown?.upcoming) || 0;
  const ongoing = Number(breakdown?.ongoing) || 0;
  const completed = Number(breakdown?.completed) || 0;
  const total = upcoming + ongoing + completed;

  const options = {
    chart: { type: "donut" },
    labels: ["Upcoming", "Ongoing", "Completed"],
    colors: ["#3b82f6", "#f59e0b", "#22c55e"],
    legend: { position: "bottom" },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Tests",
              formatter: () => total,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
  };

  const series = [upcoming, ongoing, completed];

  return (
    <div className="card h-100">
      <div className="card-body">
        <h6 className="fw-semibold mb-16 text-main-600">
          <i className="ph ph-chart-donut me-2" />
          Test Status Breakdown
        </h6>
        {total > 0 ? (
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={260}
          />
        ) : (
          <div className="d-flex flex-column gap-12 mt-8">
            {[
              { label: "Upcoming", val: upcoming, cls: "bg-info-50 text-info-600" },
              { label: "Ongoing", val: ongoing, cls: "bg-warning-50 text-warning-600" },
              { label: "Completed", val: completed, cls: "bg-success-50 text-success-600" },
            ].map((item, i) => (
              <div key={i} className="flex-between p-12 rounded-8 bg-gray-50">
                <span className={`text-13 py-2 px-12 rounded-pill fw-medium ${item.cls}`}>
                  {item.label}
                </span>
                <span className="text-15 fw-semibold text-gray-700">{item.val}</span>
              </div>
            ))}
            <p className="text-gray-400 text-13 text-center mt-8">
              No assigned tests yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestsChart;
