import React, { useState } from "react";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Sidebar from "../../common/sidebar";
import Swal from "sweetalert2";
import { getSubjects } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";

function Doubts() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  // eslint-disable-next-line
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  console.log("Subjects: ", subjects);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show SweetAlert2 popup asking for Unity ID
    Swal.fire({
      title: "Enter Unity ID",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async (unityId) => {
        if (!unityId || unityId.trim() === "") {
          Swal.showValidationMessage("Please enter a Unity ID."); // Error below Submit button
          return false; // Stops submission
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            if (unityId === "validUnityID") {
              resolve(true); // Proceed with submission
            } else {
              Swal.fire({
                title: "Error!",
                text: "Invalid Unity ID or ID is not associated with any paid membership.",
                icon: "error",
                confirmButtonText: "OK",
              });
              resolve(false); // Prevents submission but still allows Swal to close
            }
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: "Doubt Submitted!",
          text: "Your doubt has been successfully submitted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  return (
    <>
      <Sidebar isActive={isSidebarActive} closeSidebar={closeSidebar} />
      <div className="dashboard-main-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-body">
          <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
            <div className="breadcrumb mb-24">
              <ul className="flex-align gap-4">
                <li>
                  <Link
                    to={"/admin"}
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
                    Doubts
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row gy-20">
                  <div className="col-xxl-3 col-md-4 col-sm-5">
                    <label className="h5 fw-semibold font-heading mb-3">
                      Add Question / Screenshot (Optional)
                    </label>
                    <FilePond
                      name="test_img_path"
                      credits={false}
                      maxFiles={1}
                      labelIdle="Add Thumbnail Image"
                      maxFileSize="2MB"
                      allowFileSizeValidation={true}
                      labelMaxFileSizeExceeded="File is too large"
                      labelMaxFileSize="Maximum file size is {filesize}"
                      acceptedFileTypes={["image/*"]}
                    />
                  </div>
                  <div className="col-xxl-9 col-md-8 col-sm-7">
                    <div className="row g-20">
                      <div className="col-sm-12">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Subject
                        </label>
                        <select className="form-select py-9" required>
                          <option value="">Select Subject</option>
                          <option value="Maths">Physics</option>
                          <option value="Physics">Chemistry</option>
                          <option value="Chemistry">Computer Practice</option>
                          <option value="Environmenal_Science">
                            Environmental Sciences
                          </option>
                          <option value="Computer">Mathematics</option>
                          <option value="Computer">Soft Skills</option>
                        </select>
                      </div>
                      <div className="col-sm-12">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Detailed Description
                        </label>
                        <textarea
                          className="form-control py-11"
                          placeholder="Test Description"
                          rows={4}
                          maxLength={500}
                          required
                        />
                        <div className="text-gray-500 text-13 mt-1">
                          0/500 characters
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-align justify-content-end gap-8">
                    <button
                      type="submit"
                      className="btn btn-main rounded-pill py-9"
                    >
                      Submit Doubt
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Doubts;
