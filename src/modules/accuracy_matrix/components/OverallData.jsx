function OverallData({ data }) {
  return (
    <div className="analytics-overview row text-center mb-10">
      {[
        {
          title: "Asked",
          value: data?.OverallAnalytics?.TotalQuestionsAsked,
          color: "text-primary",
        },
        {
          title: "Attempted",
          value: data?.OverallAnalytics?.TotalAttempted,
          color: "text-info",
        },
        {
          title: "Correct",
          value: data?.OverallAnalytics?.TotalCorrect,
          color: "text-success",
        },
        {
          title: "Incorrect",
          value: data?.OverallAnalytics?.TotalIncorrect,
          color: "text-danger",
        },
        {
          title: "Skipped",
          value: data?.OverallAnalytics?.TotalSkipped,
          color: "text-warning",
        },
        {
          title: "Accuracy",
          value: `${data?.OverallAnalytics?.Accuracy}%`,
          color: "text-success",
        },
      ].map((stat, index) => (
        <div className="col-6 col-md-4 col-lg-2 g-2" key={index}>
          <div className={`analytics-box shadow-sm rounded ${stat.color}`}>
            <p className="analytics-value">{stat.value}</p>
            <p className="analytics-label">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OverallData;
