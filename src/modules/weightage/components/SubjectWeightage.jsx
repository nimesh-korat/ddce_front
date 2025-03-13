import { useQuery } from "@tanstack/react-query";
import Chart from "../../../utils/Charts";
import Preloader from "../../../utils/preloader/Preloader";
import { getSyllabusWithPaper } from "../../../apis/apis";

function SubjectWeightage() {
  const pieBarOptions = {
    chart: {
      height: 250,
      type: "pie",
    },
    dataLabels: {
      enabled: false, //? bug that color is not changing for data labels on pie chart only
      style: {
        fontSize: "14px",
        colors: ["#ffffff"],
      },
      formatter: (val) => `${val}%`,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: "500",
    },
    tooltip: {
      enabled: false,
      y: {
        formatter: (val) => `${val}% Weightage`,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["syllabusWithPaper"],
    queryFn: getSyllabusWithPaper,
  });

  return (
    <div className="row">
      {/* Loop through each paper and create a chart */}
      {isLoading ? (
        <Preloader />
      ) : (
        data?.success &&
        data.data.map((paper, index) => (
          <div className="col-sm-12 col-md-6 mb-12" key={paper.PaperId}>
            <div className="card shadow">
              <div className="card-header border-bottom border-gray-100 fw-bold">
                {`Section ${index + 1}.  ${paper.PaperName} - (${paper.Paper})`}
              </div>
              <div className="card-body">
                <Chart
                  options={{
                    ...pieBarOptions,
                    labels: paper.Subjects.map(
                      (subject) =>
                        `${subject.Subject} -<strong> ${subject.SubjectWeightage}% </strong>`
                    ),
                  }}
                  series={[
                    ...paper.Subjects.map(
                      (subject) => subject.SubjectWeightage
                    ),
                  ]}
                  type="pie"
                  height={250}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SubjectWeightage;
