import { useQuery } from "@tanstack/react-query";
import Chart from "../../../utils/Charts";
import Preloader from "../../../utils/Preloader";
import { getSyllabusWithPaper } from "../../../apis/apis";

function SubjectWeightage() {
  const radialBarOptions = {
    chart: {
      height: 250,
      type: "pie",
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "14px",
        color: "#fff",
      },
      formatter: (val) => `${val}%`,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: "500",
      labels: {
        colors: "#333",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}% Weightage`,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
  };

  // Fetch the syllabus data using react-query
  const { data, isLoading } = useQuery({
    queryKey: ["syllabusWithPaper"],
    queryFn: getSyllabusWithPaper,
  });

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="row">
      {/* Loop through each paper and create a chart */}
      {data?.success &&
        data.data.map((paper, index) => (
          <div className="col-sm-12 col-md-6 mb-12" key={paper.PaperId}>
            <div className="card shadow">
              <div className="card-header border-bottom border-gray-100 fw-bold">
                {`${index + 1}.  ${paper.PaperName} - (${paper.Paper})`}
              </div>
              <div className="card-body">
                <Chart
                  options={{
                    ...radialBarOptions,
                    labels: paper.Subjects.map((subject) => subject.Subject), // Set labels as subject names
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
        ))}
    </div>
  );
}

export default SubjectWeightage;
