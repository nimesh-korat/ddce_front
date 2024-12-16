import React from "react";
import ReactApexChart from "react-apexcharts";

const Chart = ({ options, series, type, height }) => {
  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type={type}
        height={height}
      />
    </div>
  );
};

export default Chart;
