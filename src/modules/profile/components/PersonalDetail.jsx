import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import UserContext from "../../../utils/UserContex";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updatePersonalDetails } from "../../../apis/apis";

// Validation schema using yup
const validationSchema = yup.object().shape({
  Name: yup.string().required("Name is required"),
  Email_Id: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  Phone_Number: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  Whatsapp_Number: yup
    .string()
    .matches(/^\d{10}$/, "WhatsApp number must be 10 digits")
    .required("WhatsApp number is required"),
  DOB: yup.date().required("Date of Birth is required"),
  Gender: yup.string().required("Gender is required"),
  Address: yup.string().required("Address is required"),
});

function PersonalDetails({ data, setData }) {
  const { user, setUser } = useContext(UserContext);

  const formatDate = (isoDate) => {
    if (!isoDate || isNaN(Date.parse(isoDate))) {
      return ""; // Handle invalid or missing date
    }

    // Convert UTC date to local time zone
    const localDate = fromZonedTime(
      isoDate,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    // Return formatted date in "yyyy-MM-dd" format
    return format(localDate, "yyyy-MM-dd");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Use this to reset form values
  } = useForm({
    defaultValues: {
      Name: data?.Name || "",
      Email_Id: data?.Email_Id || "",
      Phone_Number: data?.Phone_Number || "",
      Whatsapp_Number: data?.Whatsapp_Number || "",
      DOB: "",
      Gender: data?.Gender || "",
      Address: data?.Address || "",
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        Name: data?.Name || "",
        Email_Id: data?.Email_Id || "",
        Phone_Number: data?.Phone_Number || "",
        Whatsapp_Number: data?.Whatsapp_Number || "",
        DOB: formatDate(data?.DOB) || "",
        Gender: data?.Gender || "",
        Address: data?.Address || "",
      });
    }
  }, [data, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => updatePersonalDetails(data),
    onSuccess: () => {
      toast.success("Profile Details Updated!", {
        autoClose: 1500,
      });
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    onError: () => {
      toast.error("Error updating profile details!", {
        autoClose: 1500,
      });
    },
  });

  const onSubmit = (formData) => {
    const { DOB } = formData;

    // Convert the date back to UTC format before submitting
    const utcDate = toZonedTime(
      DOB,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const isoDate = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss.SSSX"); // ISO string with UTC time
    setData({
      ...data,
      ...formData,
      DOB: isoDate,
    });

    // Send the isoDate (UTC formatted date) to the server
    updateProfileMutation.mutate({
      ...formData,
      DOB: isoDate, // Use UTC date in form data
      Id: user?.Id,
    });
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row gy-4">
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="name" className="form-label mb-8 h6">
                  {data?.Name ? "Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  className="form-control py-11"
                  id="name"
                  {...register("Name")}
                  placeholder="Enter Name"
                />
                {errors.Name && (
                  <span className="text-danger">{errors.Name.message}</span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="email" className="form-label mb-8 h6">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control py-11"
                  id="email"
                  {...register("Email_Id")}
                  placeholder="Enter Email"
                />
                {errors.Email_Id && (
                  <span className="text-danger">{errors.Email_Id.message}</span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="phone" className="form-label mb-8 h6">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="form-control py-11"
                  id="phone"
                  {...register("Phone_Number")}
                  placeholder="Enter Phone Number"
                />
                {errors.Phone_Number && (
                  <span className="text-danger">
                    {errors.Phone_Number.message}
                  </span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="whatsapp" className="form-label mb-8 h6">
                  WhatsApp Number
                </label>
                <input
                  type="number"
                  className="form-control py-11"
                  id="whatsapp"
                  {...register("Whatsapp_Number")}
                  placeholder="Enter WhatsApp Number"
                />
                {errors.Whatsapp_Number && (
                  <span className="text-danger">
                    {errors.Whatsapp_Number.message}
                  </span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="datepicker" className="form-label mb-8 h6">
                  Date of Birth
                </label>
                <input
                  id="datepicker"
                  type="date"
                  className="form-control py-11"
                  {...register("DOB")}
                />
                {errors.DOB && (
                  <span className="text-danger">{errors.DOB.message}</span>
                )}
              </div>
              <div className="col-sm-6 col-xs-6">
                <label htmlFor="gender" className="form-label mb-8 h6">
                  Gender
                </label>
                <select
                  id="gender"
                  className="form-select py-11"
                  {...register("Gender")}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.Gender && (
                  <span className="text-danger">{errors.Gender.message}</span>
                )}
              </div>
              <div className="col-12">
                <label htmlFor="address" className="form-label mb-8 h6">
                  Address
                </label>
                <textarea
                  className="form-control py-11"
                  id="address"
                  rows="4"
                  {...register("Address")}
                  placeholder="Enter Address"
                />
                {errors.Address && (
                  <span className="text-danger">{errors.Address.message}</span>
                )}
              </div>
              <div className="col-12">
                <div className="flex-align justify-content-end gap-8">
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
