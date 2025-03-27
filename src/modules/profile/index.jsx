import React, { useEffect, useState } from "react";
import Sidebar from "../../common/sidebar";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import PersonalDetail from "./components/PersonalDetail";
import AcademicDetails from "./components/AcademicDetails";
import ProfileTab from "./components/ProfileTab";
import PasswordChange from "./components/PasswordChange";
import { useQuery } from "@tanstack/react-query";
import { fetchProfileDetails } from "../../apis/apis";
import Preloader from "../../utils/preloader/Preloader";

function Profile() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [profileDetail, setProfileDetail] = useState({
    Id: "",
    Name: "",
    Email_Id: "",
    Phone_Number: "",
    Whatsapp_Number: "",
    Address: "",
    DOB: "",
    Gender: "",
    Enrollment_No: "",
    College_Name: "",
    Branch_Name: "",
    Semester: null,
    registration_time: "",
  });

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const fetchProfileQuery = useQuery({
    queryKey: ["fetchProfile"],
    queryFn: fetchProfileDetails,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onSuccess: (data) => {
      setProfileDetail(data.data);
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
    },
  });

  useEffect(() => {
    if (fetchProfileQuery.data) {
      console.log(fetchProfileQuery.data.data);
      setProfileDetail(fetchProfileQuery.data.data);
    }
  }, [fetchProfileQuery.data]);

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        {fetchProfileQuery.isLoading ? (
          <Preloader />
        ) : (
          <div className="dashboard-body">
            <div className="breadcrumb mb-24">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to="/"
                    className="text-gray-200 fw-normal text-15 hover-text-main-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500 fw-normal d-flex">
                    <i className="ph ph-caret-right" />
                  </span>
                </li>
                <li>
                  <span className="text-main-600 fw-normal text-15">
                    Account Settings
                  </span>
                </li>
              </ul>
            </div>
            <ProfileTab data={profileDetail} />
            <div className="tab-content" id="pills-tabContent">
              <PersonalDetail data={profileDetail} setData={setProfileDetail} />
              <AcademicDetails
                data={profileDetail}
                setData={setProfileDetail}
              />
              <PasswordChange id={profileDetail.Id} />
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default Profile;
