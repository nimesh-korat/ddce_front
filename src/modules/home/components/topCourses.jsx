import React from "react";

function TopCourses({ img, tag, title, author, lessons, time, rating, page }) {
  return (
    <>
      <div className="col-lg-4 col-sm-6">
        <div className="card border border-gray-100">
          <div className="card-body p-8">
            <a
              href="course-details.html"
              className="bg-main-100 rounded-8 overflow-hidden text-center mb-8 h-164 flex-center p-8"
            >
              <img src={img} alt="a" />
            </a>
            <div className="p-8">
              <span className="text-13 py-2 px-10 rounded-pill bg-success-50 text-success-600 mb-16">
                {tag}
              </span>
              <h5 className="mb-0">
                <a href="course-details.html" className="hover-text-main-600">
                  {title}
                </a>
              </h5>
              <div className="flex-align gap-8 flex-wrap mt-16">
                <img
                  src="assets/images/thumbs/user-img1.png"
                  className="w-28 h-28 rounded-circle object-fit-cover"
                  alt="User"
                />
                <div>
                  <span className="text-gray-600 text-13">
                    Created by &nbsp;
                    <a
                      href="profile.html"
                      className="fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                    >
                      {author}
                    </a>
                  </span>
                </div>
              </div>
              <div className="flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                <div className="flex-align gap-4">
                  <span className="text-sm text-main-600 d-flex">
                    <i className="ph ph-video-camera" />
                  </span>
                  <span className="text-13 text-gray-600">
                    {lessons} lessons
                  </span>
                </div>
                <div className="flex-align gap-4">
                  <span className="text-sm text-main-600 d-flex">
                    <i className="ph ph-clock" />
                  </span>
                  <span className="text-13 text-gray-600">{time} hours</span>
                </div>
              </div>
              <div className="flex-between gap-4 flex-wrap mt-24">
                <div className="flex-align gap-4">
                  <span className="text-15 fw-bold text-warning-600 d-flex">
                    <i className="ph-fill ph-star" />
                  </span>
                  <span className="text-13 fw-bold text-gray-600">
                    {rating}
                  </span>
                  <span className="text-13 fw-bold text-gray-600">(12k)</span>
                </div>
                <a
                  href={page}
                  className="btn btn-outline-main rounded-pill py-9"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopCourses;
