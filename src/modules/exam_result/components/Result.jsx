import React from "react";
import ApexCharts from "react-apexcharts";

const ResultOverview = ({
  testName,
  pieChartData,
  totalMarks,
  obtainedMarks,
  resultGenDateTime,
  setFilterType, // Function to allow manual filter change
}) => {
  return (
    <div className="col-md-4 order-md-2 order-1">
      <div className="card">
        {/* Card Header: Displays the test name */}
        <div className="card-header border-bottom border-gray-100">
          <h5 className="mb-0">Result Overview</h5>
          {testName}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 mb-3">
              <h6>Answer Distribution</h6>
              {/* ApexCharts Component: Displays pie chart with result data */}
              <ApexCharts
                options={{
                  // Spread existing pie chart options and add event handling for selection
                  ...pieChartData.options,
                  chart: {
                    ...pieChartData.options.chart,
                    events: {
                      // Event handler for selecting a section of the pie chart
                      dataPointSelection: (event, chartContext, config) => {
                        const selectedLabel =
                          config.w.globals.labels[config.dataPointIndex];
                        // Extract the label (e.g., "Correct", "Incorrect", or "Skipped")
                        const label = selectedLabel.split(" ")[2];
                        setFilterType(label.toLowerCase()); // Update the filter based on selection
                        console.log("Selected Label:", selectedLabel); // Debug log of selected label
                      },
                    },
                  },
                }}
                series={pieChartData.series} // Pie chart data
                type="pie" // Pie chart type
                height={250} // Chart height
              />
            </div>
          </div>
        </div>
        <div className="card-footer border-top border-gray-100">
          {/* Display result statistics in the footer */}
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-3 text-18 fw-semibold">Total Marks</h6>
            <span className="px-3">{totalMarks}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-3 text-18 fw-semibold">Obtained Marks</h6>
            <span className="px-3 py-2">{obtainedMarks}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h6 className="mb-3 text-18 fw-semibold">Submitted On</h6>
            <span className="px-3 py-2">
              {/* Format the result generation datetime */}
              {new Date(resultGenDateTime).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultOverview;
