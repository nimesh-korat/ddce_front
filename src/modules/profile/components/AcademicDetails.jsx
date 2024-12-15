import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { updateProfileDetails } from "../../../apis/apis";
import UserContext from "../../../utils/UserContex";

function AcademicDetails({ data, setData }) {
  const { user, setUser } = useContext(UserContext);
  const branchOptions = [
    { value: "aeronautical_engineering", label: "Aeronautical Engineering" },
    { value: "architecture", label: "Architecture" },
    {
      value: "ai_ml",
      label: "Artificial Intelligence (AI) & Machine Learning",
    },
    { value: "automobile_engineering", label: "Automobile Engineering" },
    { value: "automation_robotics", label: "Automation & Robotics" },
    { value: "bio_medical_engineering", label: "Bio-Medical Engineering" },
    { value: "cadcam", label: "CADCAM" },
    { value: "ceramic_technology", label: "Ceramic Technology" },
    { value: "civil_engineering", label: "Civil Engineering" },
    { value: "cloud_computing", label: "Cloud Computing & Big Data" },
    { value: "computer_engineering", label: "Computer Engineering" },
    { value: "computer_science", label: "Computer Science & Engineering" },
    { value: "electrical_engineering", label: "Electrical Engineering" },
    {
      value: "electronics_communication",
      label: "Electronics & Communication Engineering",
    },
    { value: "environmental_engineering", label: "Environmental Engineering" },
    { value: "fabrication_technology", label: "Fabrication Technology" },
    { value: "gaming_animation", label: "Gaming & Animation" },
    { value: "ict", label: "Information & Communication Technology" },
    { value: "information_technology", label: "Information Technology" },
    {
      value: "instrumentation_control",
      label: "Instrumentation & Control Engineering",
    },
    { value: "mechanical_cadcam", label: "Mechanical Engg (CAD/CAM)" },
    { value: "mechanical_engineering", label: "Mechanical Engineering" },
    { value: "mechatronics", label: "Mechatronics" },
    { value: "metallurgy", label: "Metallurgy" },
    { value: "mining_engineering", label: "Mining Engineering" },
    { value: "petro_chemical", label: "Petro Chemical Engineering" },
    {
      value: "plastic_engineering",
      label: "Plastic Engineering (Sandwitch Pattern)",
    },
    { value: "power_electronics", label: "Power Electronics" },
    { value: "printing_technology", label: "Printing Technology" },
    { value: "renewable_energy", label: "Renewable Energy" },
    { value: "textile_chemistry", label: "Textile Chemistry" },
    { value: "textile_design", label: "Textile Design" },
    {
      value: "textile_manufacturing",
      label: "Textile Manufacturing Technology",
    },
    { value: "textile_processing", label: "Textile Processing Technology" },
    { value: "textile_technology", label: "Textile Technology" },
  ];
  const semesterOptions = [
    { value: 1, label: "1st Semester" },
    { value: 2, label: "2nd Semester" },
    { value: 3, label: "3rd Semester" },
    { value: 4, label: "4th Semester" },
    { value: 5, label: "5th Semester" },
    { value: 6, label: "6th Semester" },
  ];
  const handleInputChange = (e) => {
    // Check if e is an object (which happens for react-select)
    if (e && e.value) {
      // It's a react-select change, so update accordingly
      setData((prevData) => ({
        ...prevData,
        [e.name]: e.value, // Update using name and value from react-select
      }));
    } else {
      // For standard inputs, use e.target.name and e.target.value
      const { name, value } = e.target;
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfileDetails(data),
    onSuccess: () => {
      toast.success("Profile Details Updated!");
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    onError: (error) => {
      toast.error("Error updating profile details!");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(data);
  };

  return (
    <div
      className="tab-pane fade"
      id="pills-profile"
      role="tabpanel"
      aria-labelledby="pills-profile-tab"
      tabIndex={0}
    >
      <div className="card mt-24">
        <div className="card-header border-bottom">
          <h4 className="mb-4">Academic Details</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="row gy-4">
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="enrollment" className="form-label mb-8 h6">
                  Enrollment Number
                </label>
                <input
                  type="number"
                  maxLength={15}
                  className="form-control py-11"
                  value={data?.Enrollment_No}
                  id="enrollment"
                  name="Enrollment_No"
                  onChange={handleInputChange}
                  placeholder="Enter Enrollment Number"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="collegename" className="form-label mb-8 h6">
                  College Name
                </label>
                <input
                  type="text"
                  className="form-control py-11"
                  id="collegename"
                  name="College_Name"
                  onChange={handleInputChange}
                  value={data?.College_Name}
                  placeholder="Enter College Name"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="branch" className="form-label mb-8 h6">
                  Branch Name
                </label>
                <Select
                  id="branch"
                  name="Branch_Name"
                  options={branchOptions}
                  placeholder="Select Branch"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPosition="absolute"
                  onChange={(selectedOption) =>
                    handleInputChange({
                      ...selectedOption,
                      name: "Branch_Name",
                    })
                  }
                  value={
                    branchOptions.find(
                      (option) => option.value === data?.Branch_Name
                    ) || null
                  }
                  menuPortalTarget={null}
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 10 }),
                  }}
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="semester" className="form-label mb-8 h6">
                  Semester
                </label>
                <Select
                  id="semester"
                  name="Semester"
                  options={semesterOptions}
                  placeholder="Select Semester"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  menuPosition="absolute"
                  onChange={(selectedOption) =>
                    handleInputChange({ ...selectedOption, name: "Semester" })
                  }
                  value={
                    semesterOptions.find(
                      (option) => option.value === data?.Semester
                    ) || null
                  }
                  menuPortalTarget={null}
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 10 }),
                  }}
                />
              </div>
              <div className="col-12">
                <div className="flex-align justify-content-end gap-8">
                  {/* <button
                    type="reset"
                    className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                  >
                    Cancel
                  </button> */}
                  <button
                    type="submit"
                    className="btn btn-main rounded-pill py-9"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AcademicDetails;
