import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentRegNotification } from "../../../apis/apis";
import { Link } from "react-router-dom";
import { toZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";

// Helper function to calculate time ago

//!old code
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

function Notification() {
  const { data } = useQuery({
    queryKey: ["getNotification"],
    queryFn: fetchRecentRegNotification,
    staleTime: 1 * 60 * 1000,
    cacheTime: 1 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching notifications:", error.message);
    },
  });

  const notifications = data?.success ? data.data : [];

  // Limit notifications to first 5
  const notificationsToShow = notifications.slice(0, 5);

  return (
    <div className="dropdown">
      <button
        className={`dropdown-btn  text-gray-500 w-40 h-40 bg-main-50 hover-bg-main-100  rounded-circle text-xl flex-center ${
          notifications.length > 0 ? "shaking-animation transition-2" : null
        } `}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="position-relative">
          <i className="ph ph-bell" />

          {notifications.length > 0 ? (
            <span className="alarm-notify position-absolute end-0" />
          ) : null}
        </span>
      </button>
      <div className="dropdown-menu dropdown-menu--lg border-0 bg-transparent p-0">
        <div className="card border border-gray-100 rounded-12 box-shadow-custom p-0 overflow-hidden">
          <div className="card-body p-0">
            <div className="py-8 px-24 bg-main-600">
              <div className="flex-between">
                <h5 className="text-xl fw-semibold text-white mb-0">
                  Notifications
                </h5>
              </div>
            </div>
            <div className="p-24 max-h-270 overflow-y-auto scroll-sm">
              <div>
                {notificationsToShow.length > 0 ? (
                  notificationsToShow.map((item, index) => {
                    // Parse the timeAgo string to a Date object
                    const timeAgoFormatted = timeAgo(new Date(item.timeAgo));

                    return (
                      <div key={index}>
                        {/* Notification Content */}
                        <div className="d-flex align-items-start gap-12 mb-3">
                          <div>
                            <p className="fw-medium text-15 mb-0 text-gray-300 hover-text-main-600 text-line-3">
                              {item.name} from{" "}
                              {item.collegeName || "an unknown institution"} has
                              registered in this portal.
                            </p>
                            <span className="text-gray-200 text-13">
                              {timeAgoFormatted}
                            </span>
                          </div>
                        </div>

                        {/* Divider between notifications */}
                        {index !== notificationsToShow.length - 1 && (
                          <hr
                            style={{
                              borderColor: "#2D2D2D",
                              borderWidth: "1px",
                            }}
                          />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400">No notifications available.</p>
                )}
              </div>
            </div>
            <Link
              to={"/students"}
              className="py-13 px-24 fw-bold text-center d-block text-primary-600 border-top border-gray-100 hover-text-decoration-underline"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
