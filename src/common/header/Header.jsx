import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef } from "react";
import { useNetworkState } from "react-use";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProfileImage, logout } from "../../apis/apis";
import Notification from "./components/Notification";
import UserContext from "../../utils/UserContex";

function Header({ toggleSidebar }) {
  const { user } = useContext(UserContext);

  // Network status via react-use
  const network = useNetworkState();
  const [showOnline, setShowOnline] = React.useState(false);
  const wasOfflineRef = useRef(false);

  // Vibrate on network changes
  const prevTypeRef = useRef(network.type);
  const prevOnlineRef = useRef(network.online);

  useEffect(() => {
    const prevType = prevTypeRef.current;
    const prevOnline = prevOnlineRef.current;
    prevTypeRef.current = network.type;
    prevOnlineRef.current = network.online;

    if (!("vibrate" in navigator)) return;

    if (prevOnline !== network.online) {
      navigator.vibrate(network.online ? [100, 50, 100] : [300]);
      return;
    }
    if (
      network.online &&
      prevType &&
      network.type &&
      prevType !== network.type &&
      (prevType === "wifi" || prevType === "cellular") &&
      (network.type === "wifi" || network.type === "cellular")
    ) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [network.type, network.online]); // eslint-disable-line

  useEffect(() => {
    if (!network.online) {
      wasOfflineRef.current = true;
    } else if (wasOfflineRef.current) {
      // Just came back online
      wasOfflineRef.current = false;
      setShowOnline(true);
      const t = setTimeout(() => setShowOnline(false), 2000);
      return () => clearTimeout(t);
    }
  }, [network.online]);

  const netIcon = !network.online
    ? { icon: "ph-wifi-x", color: "#ef4444", label: "YOU ARE OFFLINE" }
    : network.type === "wifi"
      ? { icon: "ph-wifi-high", color: "#22c55e", label: "CONNECTED TO WIFI" }
      : network.type === "cellular"
        ? {
            icon: "ph-sim-card",
            color: "#22c55e",
            label: "CONNECTED TO MOBILE DATA",
          }
        : {
            icon: "ph-wifi-high",
            color: "#22c55e",
            label: "CONNECTED TO WIFI",
          };
  const navigate = useNavigate();
  // Fetch Profile Picture
  const { data: profilePic } = useQuery({
    queryKey: ["profilePic", user?.Id],
    queryFn: getProfileImage,
    enabled: !!user?.Id && !!user?.User_DP, // only fetch if user has a profile pic
    staleTime: 24 * 60 * 60 * 1000, // cache for 24 hours (signed URL validity)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false, // don't retry on 404
  });

  const logoutQuery = useMutation({
    mutationFn: (data) => logout(data),
    onSuccess: () => {
      toast.success("Logged out successfully", {
        autoClose: 1000,
        onClose: () => {
          // Clear only auth keys — preserve stud_notify_seen_* so notifications don't repeat
          ["user", "token", "session", "activeDoodle"].forEach((k) =>
            localStorage.removeItem(k),
          );
          navigate("/signin");
        },
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message, {
        onClose: () =>
          ["user", "token", "session", "activeDoodle"].forEach((k) =>
            localStorage.removeItem(k),
          ),
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
        <div className="flex-align gap-3">
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
            {/* <img
              className="img-fluid"
              src="../assets/images/logo/logo6.png"
              alt="logo"
              style={{ width: "100%", height: "80px", objectFit: "contain" }}
            /> */}
            <h2 className="mb-0" style={{ lineHeight: 1 }}>
              AIM4RANK
            </h2>
          </div>
        </div>
        <div className="flex-align gap-16">
          <div className="flex-align gap-8">
            {/* Notification Start */}
            {/* <Notification /> */}
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
          {/* Network status indicator */}
          <div
            className="d-inline-flex align-items-center me-8 position-relative net-icon-wrap"
            style={{ alignSelf: "center" }}
          >
            <i
              className={`ph ${netIcon.icon}`}
              style={{
                fontSize: "20px",
                color: netIcon.color,
                cursor: "default",
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: "-32px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#1e293b",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 9999,
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
              className="net-tooltip"
            >
              {netIcon.label}
            </span>
            <style>{`.net-icon-wrap:hover .net-tooltip { opacity: 1 !important; }`}</style>
          </div>

          {/* Offline toast */}
          {!network.online && (
            <div
              style={{
                position: "fixed",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#ef4444",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
                zIndex: 99999,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation:
                  "toast_in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
              }}
            >
              <i className="ph ph-wifi-x" style={{ fontSize: "16px" }} />
              You are offline
            </div>
          )}

          {/* Back online toast */}
          {showOnline && (
            <div
              style={{
                position: "fixed",
                bottom: "24px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#22c55e",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
                zIndex: 99999,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation:
                  "toast_in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards, toast_out 0.4s ease-in 1.6s forwards",
              }}
            >
              <i className="ph ph-wifi-high" style={{ fontSize: "16px" }} />
              You are back online!
            </div>
          )}

          <style>{`
                @keyframes toast_in {
                  from { opacity: 0; transform: translateX(-50%) translateY(40px); }
                  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes toast_out {
                  from { opacity: 1; transform: translateX(-50%) translateY(0); }
                  to   { opacity: 0; transform: translateX(-50%) translateY(40px); }
                }
              `}</style>
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
                      : "../../../../../assets/images/icons/nodp.webp"
                  }
                  alt="User Profile"
                  className="h-32 w-32 rounded-circle"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "../../../../../assets/images/icons/nodp.webp";
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
                          : "../../../../../assets/images/icons/nodp.webp"
                      }
                      alt=""
                      className="w-54 h-54 rounded-circle"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if fallback fails
                        e.target.src =
                          "../../../../../assets/images/icons/nodp.webp";
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
