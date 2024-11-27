import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchRecentRegNotification } from "../../../apis/apis";

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

  if (isLoading) {
    return <p className="text-gray-400">Loading Data...</p>;
  }

  if (isError) {
    return <p className="text-gray-400">Failed to fetch data.</p>;
  }

  const studentData = data?.success ? data.data : [];

  // Limit to first 20 records
  const limitedStudentData = studentData.slice(0, 20);

  // Log the fetched data to ensure it's correct
  console.log("Fetched student data:", limitedStudentData);

  return (
    <div className="card overflow-hidden">
      <div className="card-body p-0 overflow-x-auto">
        <table id="studentTable" className="table table-striped">
          <thead>
            <tr>
              <th className="h6 text-gray-300">#</th>
              <th className="h6 text-gray-300">Students</th>
              <th className="h6 text-gray-300">College Name</th>
              <th className="h6 text-gray-300">Minutes Ago</th>
            </tr>
          </thead>
          <tbody>
            {limitedStudentData.length > 0 ? (
              limitedStudentData.map((student, index) => (
                <tr key={index}>
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
                      {student.timeAgo + " Minutes Ago" || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
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
          Showing 1 to {limitedStudentData.length} of {studentData.length}{" "}
          entries
        </span>
        <ul className="pagination flex-align flex-wrap">
          {/* Pagination controls (add logic for actual pagination if needed) */}
          <li className="page-item active">
            <a
              className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
              href="/#"
            >
              1
            </a>
          </li>
          {/* Add more pagination items here */}
        </ul>
      </div>
    </div>
  );
}

export default StudentTable;
