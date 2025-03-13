import { AnimatedCounter } from "./AccuracyCounter";

function SubjectWiseData({ data }) {
  return (
    <div className="subject-wise-analysis row">
      {data?.SubjectWiseAnalytics.map((subject, index) => {
        if (subject.TotalAttempted === 0) return null;

        const bgImage = `url(../assets/images/bg/star-shape.png)`;

        return (
          <div className="col-md-6 mb-4 g-2" key={index}>
            <div
              className="subject-card shadow rounded"
              style={{
                backgroundImage: bgImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="subject-header ms-15 mt-15"
                style={{
                  backgroundImage: `url(../assets/images/bg/celeb-bg.gif)`,
                }}
              >
                <AnimatedCounter value={subject.Accuracy} />
                <img
                  src="../assets/images/icons/gold_trophy.png"
                  alt="Trophy"
                  className="trophy-icon unselectable "
                />
              </div>
              <h2 className="subject-name ms-15">{subject.Subject}</h2>
              <div className="subject-stats row g-2">
                {[
                  {
                    title: "Questions Asked",
                    value: subject.TotalQuestionsAsked,
                  },
                  {
                    title: "Attempted",
                    value: subject.TotalAttempted,
                  },
                  { title: "Correct", value: subject.TotalCorrect },
                  {
                    title: "Incorrect",
                    value: subject.TotalIncorrect,
                  },
                  { title: "Skipped", value: subject.TotalSkipped },
                ].map((stat, idx) => (
                  <div className="col-6 col-md-6 g-2" key={idx}>
                    <div className="d-flex justify-content-center h-100">
                      <div className="subject-stat-box">
                        <p className="stat-value">{stat.value}</p>
                        <p className="stat-label">{stat.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SubjectWiseData;
