import React from "react";
import ApexCharts from "react-apexcharts";

const Chart = ({ options, series, type, height }) => {
  return (
    <div>
      <ApexCharts
        options={options}
        series={series}
        type={type}
        height={height}
      />
    </div>
  );
};

export default Chart;
