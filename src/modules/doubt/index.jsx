import React, { useState } from "react";
import Footer from "../../common/footer";
import Header from "../../common/header/Header";
import { Link } from "react-router-dom";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Sidebar from "../../common/sidebar";
import Swal from "sweetalert2";
import { getSubjects, sendDoubtOtp } from "../../apis/apis";
import { useQuery } from "@tanstack/react-query";

function Doubts() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const toggleSidebar = () => setIsSidebarActive((p) => !p);
  const closeSidebar = () => setIsSidebarActive(false);

  // eslint-disable-next-line
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: "Submitting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await sendDoubtOtp();
      Swal.close();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Doubt Submitted!",
      text: "Your doubt has been successfully submitted. Our team will get back to you soon.",
      confirmButtonColor: "#6366f1",
      confirmButtonText: "OK",
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
                    to={"/"}
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
                          {subjects?.data?.map((s) => (
                            <option key={s.Id} value={s.Id}>
                              {s.Sub_Name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-sm-12">
                        <label className="h5 mb-8 fw-semibold font-heading">
                          Detailed Description
                        </label>
                        <textarea
                          className="form-control py-11"
                          placeholder="Describe your doubt in detail..."
                          rows={4}
                          maxLength={500}
                          required
                          onChange={(e) => setCharCount(e.target.value.length)}
                        />
                        <div className="text-gray-500 text-13 mt-1">
                          {charCount}/500 characters
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
