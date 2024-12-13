import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { updateProfileDetails } from "../../../apis/apis";
import { toast } from "react-toastify";

function PersonalDetails({ data, setData }) {
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle null/undefined dates
    return format(new Date(isoDate), "yyyy-MM-dd");
  };
  const formattedDOB = formatDate(data?.DOB);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updateProfileDetails(data),
    onSuccess: () => {
      toast.success("Profile Details Updated!");
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
      className="tab-pane fade show active"
      id="pills-details"
      role="tabpanel"
      aria-labelledby="pills-details-tab"
      tabIndex={0}
    >
      <div className="card mt-24">
        <div className="card-header border-bottom">
          <h4 className="mb-4">My Details</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="row gy-4">
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="name" className="form-label mb-8 h6">
                  {data?.Name ? "Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  className="form-control py-11"
                  id="name"
                  name="Name"
                  value={data?.Name}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="email" className="form-label mb-8 h6">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control py-11"
                  id="email"
                  name="Email_Id"
                  onChange={handleInputChange}
                  value={data?.Email_Id}
                  placeholder="Enter Email"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="phone" className="form-label mb-8 h6">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="form-control py-11"
                  id="phone"
                  name="Phone_Number"
                  onChange={handleInputChange}
                  value={data?.Phone_Number}
                  placeholder="Enter Phone Number"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="whatsapp" className="form-label mb-8 h6">
                  WhatsApp Number
                </label>
                <input
                  type="number"
                  className="form-control py-11"
                  id="whatsapp"
                  value={data?.Whatsapp_Number}
                  name="Whatsapp_Number"
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp Number"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="datepicker" className="form-label mb-8 h6">
                  Date of Birth
                </label>
                <input
                  id="datepicker"
                  data-provide="datepicker"
                  type="date"
                  value={formattedDOB}
                  name="DOB"
                  onChange={handleInputChange}
                  className="form-control py-11"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="gender" className="form-label mb-8 h6">
                  Gender
                </label>
                <select
                  id="gender"
                  className="form-select py-11"
                  value={data?.Gender || ""}
                  name="Gender"
                  onChange={handleInputChange}
                  aria-label="Default select example"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-12">
                <label htmlFor="address" className="form-label mb-8 h6">
                  Address
                </label>
                <textarea
                  className="form-control py-11"
                  id="address"
                  rows="4"
                  value={data?.Address}
                  name="Address"
                  onChange={handleInputChange}
                  placeholder="Enter Address"
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

export default PersonalDetails;
