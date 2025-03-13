import React, { useContext } from "react";
import { UserContext } from "../../../utils/UserContex";

function Greetings() {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="card h-500">
        <div className="card-body grettings-box-two position-relative z-1 p-0">
          <div className="row align-items-center h-100">
            <div className="col-lg-6">
              <div className="grettings-box-two__content">
                <h2 className="fw-medium mb-0 flex-align gap-10">
                  Hi, {user?.Name}
                  <img src="assets/images/icons/wave-hand.png" alt="" />
                </h2>
                <h2 className="fw-medium mb-16 unity-animatted-text">
                  What do you want to learn today with your <b>Unity</b>{" "}
                  partner?
                </h2>
                <p className="text-15 text-gray-400">
                  Discover unique questions, track progress, and achieve your
                  learning goods seamlessly.
                </p>
                {/* <a
                  href="student-courses.html"
                  className="btn btn-main rounded-pill mt-32"
                >
                  Explore Courses
                </a> */}
              </div>
            </div>
            <div className="col-lg-6 d-md-block d-none mt-auto">
              <img src="assets/images/thumbs/gretting-thumb.png" alt="" />
            </div>
          </div>
          <img
            src="assets/images/bg/star-shape.png"
            className="position-absolute start-0 top-0 w-100 h-100 z-n1 object-fit-contain"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default Greetings;
