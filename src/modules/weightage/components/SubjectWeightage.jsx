import Chart from "../../../utils/Charts";

function SubjectWeightage({ data, radialBarOptions }) {
  return (
    <div className="row">
      {/* Loop through each paper and create a chart */}
      {data?.success &&
        data.data.map((paper, index) => (
          <div className="col-sm-12 col-md-6 mb-3" key={paper.PaperId}>
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
