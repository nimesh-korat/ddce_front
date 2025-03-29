import React from "react";
import { toZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentRegNotification } from "../../../apis/apis";
import Preloader from "../../../utils/preloader/Preloader";
import { Link } from "react-router-dom";

// Static student data
// const studentData = [
//   {
//     name: "Jignesh Patel",
//     collegeName: "IIT Gandhinagar",
//     timeAgo: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
//   },
//   {
//     name: "Dhruv Joshi",
//     collegeName: "LD College of Engineering",
//     timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 3 hours ago
//   },
//   {
//     name: "Ravi Mehta",
//     collegeName: "Nirma University",
//     timeAgo: new Date(Date.now() - 3 * 60 * 60 * 1000), // 2 hours ago
//   },
//   {
//     name: "Hetal Trivedi",
//     collegeName: "Sardar Vallabhbhai National Institute of Technology",
//     timeAgo: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
//   },
//   {
//     name: "Priyanshi Shah",
//     collegeName: "Gujarat Technological University",
//     timeAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
//   },
// ];

function timeAgo(date) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateInUserTimeZone = toZonedTime(date, userTimeZone);
  return formatDistanceToNow(dateInUserTimeZone, { addSuffix: true });
}

const randomImage = [
  "assets/images/thumbs/mentor-cover-img1.png",
  "assets/images/thumbs/mentor-cover-img2.png",
  "assets/images/thumbs/mentor-cover-img3.png",
  "assets/images/thumbs/mentor-cover-img4.png",
  "assets/images/thumbs/mentor-cover-img5.png",
  "assets/images/thumbs/mentor-cover-img6.png",
  "assets/images/thumbs/mentor-cover-img7.png",
  "assets/images/thumbs/mentor-cover-img8.png",
  "assets/images/thumbs/mentor-cover-img9.png",
  "assets/images/thumbs/mentor-cover-img10.png",
  "assets/images/thumbs/mentor-cover-img11.png",
  "assets/images/thumbs/mentor-cover-img12.png",
];

function StudentTable() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["getNotification"],
    queryFn: fetchRecentRegNotification,
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching data:", error.message);
    },
  });

  if (isError) {
    return <p className="text-gray-400">Failed to fetch data.</p>;
  }

  const studentData = data?.success ? data.data : [];

  // Limit to first 20 records
  const limitedStudentData = studentData.slice(0, 20);
  function getDeterministicImage(name) {
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return randomImage[hash % randomImage.length];
  }

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <div className="card mt-24">
            <div className="card-body">
              <h4 className="mb-20">
                Recent {limitedStudentData.length} Students of {data.totalUsers}{" "}
                Students
              </h4>
              <div className="row g-20">
                {limitedStudentData.length > 0 ? (
                  limitedStudentData.map((student, index) => {
                    // Format the "timeAgo" field
                    const formattedTimeAgo = timeAgo(new Date(student.timeAgo));
                    const coverImage = getDeterministicImage(student.name);

                    return (
                      <div className="col-xl-3 col-md-4 col-sm-6">
                        <div className="mentor-card rounded-8 overflow-hidden">
                          <div className="mentor-card__cover position-relative">
                            <img
                              src={coverImage}
                              alt=""
                              className="cover-img unselectable"
                            />
                            <button
                              type="button"
                              className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                            >
                              <span className="text">
                                {/* {formattedTimeAgo || "N/A"} */}
                                recently joined
                              </span>
                            </button>
                          </div>
                          <div className="mentor-card__content text-center">
                            <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                              <img
                                src={
                                  student.userDp ||
                                  "../assets/images/icons/nodp.webp"
                                }
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                                className="mentor-card__img cover-img unselectable"
                              />
                            </div>
                            <h5 className="mb-0">
                              <Link to={`#`}> {student.name}</Link>
                            </h5>
                            <span className="text-13 text-gray-500">
                              {student.collegeName || "N/A"}
                            </span>
                            <p className="mt-20 text-gray-600 text-14 text-line-3">
                              Hi, I am {student.name}, A student at{" "}
                              {student.collegeName || "N/A"}. I am happy to join
                              this platform.
                            </p>
                            {/* <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex-between flex-wrap">
                              <div className="flex-align gap-4">
                                <span className="text-15 fw-normal text-main-600 d-flex">
                                  <i className="ph-fill ph-book-open" />
                                </span>
                                <span className="text-13 fw-normal text-gray-600">
                                  45 Tasks
                                </span>
                              </div>
                              <div className="flex-align gap-4">
                                <span className="text-15 fw-normal text-warning-600 d-flex">
                                  <i className="ph-fill ph-star" />
                                </span>
                                <span className="text-13 fw-normal text-gray-600">
                                  4.8
                                </span>
                                <span className="text-13 fw-normal text-gray-600">
                                  (750 Reviews)
                                </span>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="card mt-24">
                    <div className="card-body">
                      <h4>No data found</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default StudentTable;
