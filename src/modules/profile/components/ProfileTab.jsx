import React, { useContext, useRef, useState } from "react";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileImage, updateProfilePic } from "../../../apis/apis";
import { toast } from "react-toastify";
import UserContext from "../../../utils/UserContex";

function ProfileTab({ data }) {
  const fileInputRef = useRef(null); // Create a reference for the file input
  const [User_DP, setUser_DP] = useState(null); // State to store the selected file
  const { user, setUser } = useContext(UserContext);
  const queryClient = useQueryClient();

  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined dates
    return format(new Date(isoDate), "dd MMM yyyy");
  };

  // Fetch Profile Picture
  //eslint-disable-next-line
  const { data: profilePic, isLoading: isProfilePicLoading } = useQuery({
    queryKey: ["profilePic", user?.Id],
    queryFn: getProfileImage,
    enabled: !!user?.Id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: false,
  });

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2 MB");
      event.target.value = ""; // Clear the input
      return;
    }

    if (file) {
      setUser_DP(file);
    } else {
      setUser_DP(null);
    }
  };

  // Trigger the file input on icon click
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicUpdload = useMutation({
    mutationFn: (data) => updateProfilePic(data),
    onSuccess: (data) => {
      setUser_DP(null);
      const updatedUser = { ...user, User_DP: data.data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Invalidate the profilePic query to refetch the profile picture
      queryClient.invalidateQueries(["profilePic", user?.Id]);

      toast.success("Profile Picture Updated!", {
        autoClose: 500,
      });
    },
    onError: (error) => {
      toast.error("Something went wrong", {
        autoClose: 1000,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!User_DP) {
      toast.error("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("User_DP", User_DP);

    handleProfilePicUpdload.mutate(formData);
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-body p-0">
        <div className="cover-img position-relative">
          <div className="avatar-upload">
            <div className="avatar-preview">
              <div
                id="coverImagePreview"
                style={{
                  backgroundImage:
                    'url("assets/images/thumbs/setting-cover-img.png")',
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="setting-profile px-24">
          <div className="flex-between">
            <div className="d-flex align-items-end flex-wrap mb-32 gap-24">
              <div className="flex-shrink-0">
                <div
                  className="profile-image-container"
                  style={{ position: "relative", display: "inline-block" }}
                >
                  <img
                    src={
                      User_DP
                        ? URL.createObjectURL(User_DP)
                        : // : isProfilePicLoading
                          // ? "../assets/images/loading.gif" // Show loading spinner
                          `${profilePic?.data}`
                    }
                    alt="Profile"
                    className="w-120 h-120 rounded-circle border border-white"
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop if fallback fails
                      e.target.src = "../assets/images/thumbs/user-img.png";
                    }}
                  />
                  <div
                    className="upload-icon flex-center text-white"
                    onClick={handleIconClick} // Trigger file input on click
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      backgroundImage:
                        "linear-gradient(to right,rgb(62, 128, 249),rgb(101, 76, 242))",
                      borderRadius: "80%",
                      padding: "8px",
                      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    <i className="ph ph-camera"></i>
                  </div>
                  {/* Hidden file input with 'accept' attribute for images only */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }} // Hide the input
                    accept="image/*" // Restrict file selection to images only
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div>
                <h4 className="mb-8">{data?.Name}</h4>
                <div className="setting-profile__infos flex-align flex-wrap gap-16">
                  <div className="flex-align gap-6">
                    <span className="text-gray-600 d-flex text-lg">
                      <i className="ph ph-student" />
                    </span>
                    <span className="text-gray-600 d-flex text-15">
                      {data?.College_Name || "N/A"}
                    </span>
                  </div>
                  <div className="flex-align gap-6">
                    <span className="text-gray-600 d-flex text-lg">
                      <i className="ph ph-calendar-dots" />
                    </span>
                    <span className="text-gray-600 d-flex text-15">
                      {`Member Since: ${formatDate(data?.registration_time)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {User_DP && (
            <label
              className="btn border-gray-200 text-gray-200 fw-normal hover-bg-gray-400 rounded-pill py-4 px-14 mb-24"
              onClick={handleSubmit}
            >
              Upload Image
            </label>
          )}
          <ul
            className="nav common-tab style-two nav-pills mb-0"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-details-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-details"
                type="button"
                role="tab"
                aria-controls="pills-details"
                aria-selected="true"
              >
                Personal Details
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Academic Details
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-password-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-password"
                type="button"
                role="tab"
                aria-controls="pills-password"
                aria-selected="false"
              >
                Password Settings
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
