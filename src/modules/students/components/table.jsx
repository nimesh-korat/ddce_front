import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchRecentRegNotification } from "../../../apis/apis";
import { Link } from "react-router-dom";
import Preloader from "../../../utils/preloader/Preloader";
import { toZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";

// Helper function to calculate time ago
//! OLD CODE
// function timeAgo(date) {
//   const now = new Date();

//   // Convert the input date to a Date object
//   let dateUTC = new Date(date);

//   // Adjust the date by adding 5 hours and 30 minutes (19800 seconds)
//   dateUTC = new Date(dateUTC.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);

//   const diffInSeconds = Math.floor((now - dateUTC) / 1000); // difference in seconds

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"} ago`;
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 30) {
//     return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
//   }

//   const diffInMonths = Math.floor(diffInDays / 30);
//   if (diffInMonths < 12) {
//     return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
//   }

//   const diffInYears = Math.floor(diffInMonths / 12);
//   return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
// }

function timeAgo(date) {
  // Get the user's current timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Parse the UTC date into a Date object
  const dateUTC = new Date(date);

  // Convert UTC date to user's local timezone
  const dateInUserTimeZone = toZonedTime(dateUTC, userTimeZone);

  // Calculate the time ago
  const timeAgoText = formatDistanceToNow(dateInUserTimeZone, {
    addSuffix: true,
  });

  return timeAgoText;
}

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

  console.log(isLoading);
  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="card overflow-hidden">
          <div className="card-body p-0 overflow-x-auto p-16">
            <table
              id="studentTable"
              className="table table-striped  table-hover "
            >
              <thead>
                <tr className="border-bottom">
                  <th className="h6 text-gray-300">#</th>
                  <th className="h6 text-gray-300">Students</th>
                  <th className="h6 text-gray-300">College Name</th>
                  <th className="h6 text-gray-300">Joining Info</th>
                </tr>
              </thead>
              <tbody>
                {limitedStudentData.length > 0 ? (
                  limitedStudentData.map((student, index) => {
                    // Format the "timeAgo" field
                    const formattedTimeAgo = timeAgo(new Date(student.timeAgo));

                    return (
                      <tr className="border-bottom" key={index}>
                        <td className="h6 mb-0 fw-medium text-gray-300">
                          {index + 1}
                        </td>
                        <td>
                          <div className="flex-align gap-8">
                            <span className="h6 mb-0 fw-medium text-gray-300">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            {student.collegeName || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className="h6 mb-0 fw-medium text-gray-300">
                            {formattedTimeAgo || "N/A"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-400">
                      No student data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="card-footer flex-between flex-wrap">
            <span className="text-gray-900">
              Showing recent 1 to {limitedStudentData.length + 1000} of{" "}
              {studentData.length} students
            </span>
            <ul className="pagination flex-align flex-wrap">
              {/* Pagination controls (add logic for actual pagination if needed) */}
              <li className="page-item active">
                <Link
                  className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                  to={"/#"}
                >
                  1
                </Link>
              </li>
              {/* Add more pagination items here */}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentTable;
