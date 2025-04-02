import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProfileImage, logout } from "../../apis/apis";
import Notification from "./components/Notification";
import UserContext from "../../utils/UserContex";

function Header({ toggleSidebar }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  // Fetch Profile Picture
  //eslint-disable-next-line
  const { data: profilePic, isLoading: isProfilePicLoading } = useQuery({
    queryKey: ["profilePic", user?.Id],
    queryFn: getProfileImage,
    enabled: !!user?.Id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: false,
  });

  const logoutQuery = useMutation({
    mutationFn: (data) => logout(data),
    onSuccess: () => {
      toast.success("Logged out successfully", {
        autoClose: 1000,
        onClose: () => {
          localStorage.clear();
          navigate("/signin");
        },
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        onClose: () => localStorage.clear(),
      });
    },
  });

  const handleLogout = () => {
    const session = localStorage.getItem("session");
    if (session) {
      logoutQuery.mutate({ session });
    } else {
      toast.error("No active session found");
    }
  };

  return (
    <>
      <div className="top-navbar flex-between gap-16">
        <div className="flex-align gap-2">
          {/* Toggle Button Start */}
          <button
            type="button"
            className="toggle-btn d-xl-none d-flex text-26 text-gray-500"
            onClick={toggleSidebar}
          >
            <i className="ph ph-list" />
          </button>
          {/* Toggle Button End */}
          <div className="d-lg-none d-block">
            <img
              className="img-fluid"
              src="../assets/images/logo/logo6.png"
              alt="logo"
              style={{ width: "100%", height: "80px", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="flex-align gap-16">
          <div className="flex-align gap-8">
            {/* Notification Start */}
            <Notification />
            {/* Notification Start */}
            {/* Language Start */}
            {/* <div className="dropdown">
              <button
                className="text-gray-500 w-40 h-40 bg-main-50 hover-bg-main-100 transition-2 rounded-circle text-xl flex-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ph ph-globe" />
              </button>
              <div className="dropdown-menu dropdown-menu--md border-0 bg-transparent p-0">
                <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                  <div className="card-body">
                    <div className="max-h-270 overflow-y-auto scroll-sm pe-8">
                      <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0 mb-16">
                        <label
                          className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="arabic"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                            <img
                              src="assets/images/thumbs/flag1.png"
                              alt=""
                              className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                            />
                            <span className="text-15 fw-semibold mb-0">
                              Arabic
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="arabic"
                        />
                      </div>
                      <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0 mb-16">
                        <label
                          className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="germany"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                            <img
                              src="assets/images/thumbs/flag2.png"
                              alt=""
                              className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                            />
                            <span className="text-15 fw-semibold mb-0">
                              Germany
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="germany"
                        />
                      </div>
                      <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0 mb-16">
                        <label
                          className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="english"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                            <img
                              src="assets/images/thumbs/flag3.png"
                              alt=""
                              className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                            />
                            <span className="text-15 fw-semibold mb-0">
                              English
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="english"
                        />
                      </div>
                      <div className="form-check form-radio d-flex align-items-center justify-content-between ps-0">
                        <label
                          className="ps-0 form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="spanish"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-8">
                            <img
                              src="assets/images/thumbs/flag4.png"
                              alt=""
                              className="w-32-px h-32-px border borde border-gray-100 rounded-circle flex-shrink-0"
                            />
                            <span className="text-15 fw-semibold mb-0">
                              Spanish
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="language"
                          id="spanish"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Language Start */}
          </div>
          {/* User Profile Start */}
          <div className="dropdown">
            <button
              className="users arrow-down-icon border border-gray-200 rounded-pill p-4 d-inline-block pe-40 position-relative"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="position-relative">
                <img
                  src={
                    user?.User_DP
                      ? `${profilePic?.data}`
                      : "../assets/images/icons/nodp.webp"
                  }
                  alt="User Profile"
                  className="h-32 w-32 rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback fails
                    e.target.src = "../assets/images/icons/nodp.webp";
                  }}
                />
                <span className="activation-badge w-8 h-8 position-absolute inset-block-end-0 inset-inline-end-0" />
              </span>
            </button>
            <div className="dropdown-menu dropdown-menu--lg border-0 bg-transparent p-0">
              <div className="card border border-gray-100 rounded-12 box-shadow-custom">
                <div className="card-body">
                  <div className="flex-align gap-8 mb-20 pb-20 border-bottom border-gray-100">
                    <img
                      src={
                        user?.User_DP
                          ? `${profilePic?.data}`
                          : "../assets/images/icons/nodp.webp"
                      }
                      alt=""
                      className="w-54 h-54 rounded-circle"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if fallback fails
                        e.target.src = "../assets/images/icons/nodp.webp";
                      }}
                    />
                    <div>
                      <h4 className="mb-0">{user && user.Name}</h4>
                      <p className="fw-medium text-13 text-gray-200">
                        {user && (user.Email_Id || user.Email)}
                      </p>
                    </div>
                  </div>
                  <ul className="max-h-270 overflow-y-auto scroll-sm pe-4">
                    <li className="mb-4">
                      <Link
                        to={
                          user.Role === 1
                            ? `${window.location.pathname}#`
                            : "/profile"
                        }
                        className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                      >
                        <span className="text-2xl text-primary-600 d-flex">
                          <i className="ph ph-user" />
                        </span>
                        <span className="text">Profile</span>
                      </Link>
                    </li>
                    {/* <li className="mb-4">
                      <Link
                        to="/"
                        className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                      >
                        <span className="text-2xl text-primary-600 d-flex">
                          <i className="ph ph-chart-bar" />
                        </span>
                        <span className="text">Upgrade Plan</span>
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/"
                        className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                      >
                        <span className="text-2xl text-primary-600 d-flex">
                          <i className="ph ph-chart-line-up" />
                        </span>
                        <span className="text">Daily Activity</span>
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/"
                        className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                      >
                        <span className="text-2xl text-primary-600 d-flex">
                          <i className="ph ph-chats-teardrop" />
                        </span>
                        <span className="text">Inbox</span>
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link
                        to="/"
                        className="py-12 text-15 px-20 hover-bg-gray-50 text-gray-300 rounded-8 flex-align gap-8 fw-medium text-15"
                      >
                        <span className="text-2xl text-primary-600 d-flex">
                          <i className="ph ph-envelope-simple" />
                        </span>
                        <span className="text">Ask Doubts</span>
                      </Link>
                    </li> */}
                    <li className="pt-8 border-top border-gray-100">
                      <Link
                        onClick={handleLogout}
                        className="py-12 text-15 px-20 hover-bg-danger-50 text-gray-300 hover-text-danger-600 rounded-8 flex-align gap-8 fw-medium text-15"
                      >
                        <span className="text-2xl text-danger-600 d-flex">
                          <i className="ph ph-sign-out" />
                        </span>
                        <span className="text">Log Out</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* User Profile Start */}
        </div>
      </div>
    </>
  );
}

export default Header;
