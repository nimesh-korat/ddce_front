import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../../apis/apis";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const validationSchema = yup.object().shape({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

function PasswordChange(id) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const Id = id.id;

  const changePasswordMuation = useMutation({
    mutationFn: (data) => changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully!", {
        autoClose: 1000,
      });
      reset();
    },
    onError: (error) => {
      toast.error(error.response.data.message, { autoClose: 3000 });
      console.log(error);
    },
  });

  const handleOnSubmit = (data) => {
    if (data.newPassword === data.oldPassword) {
      toast.error("New password cannot be same as old password");
      return;
    }
    changePasswordMuation.mutate({
      ...data,
      Id: Id,
    });
  };

  return (
    <div
      className="tab-pane fade"
      id="pills-password"
      role="tabpanel"
      aria-labelledby="pills-password-tab"
      tabIndex={0}
    >
      <div className="card mt-24">
        <div className="card-header border-bottom">
          <h4 className="mb-4">Change Password</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="row gy-4">
                  <div className="col-md-7">
                    <div className="col-12">
                      <label
                        htmlFor="oldPassword"
                        className="form-label mb-8 h6"
                      >
                        Current Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="form-control py-11"
                          id="oldPassword"
                          placeholder="Enter Current Password"
                          {...register("oldPassword")}
                        />
                        <span
                          className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ${
                            showCurrentPassword
                              ? "ph ph-eye"
                              : "ph ph-eye-slash"
                          }`}
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        />
                      </div>
                      {/* Error message directly under input */}
                      {errors.oldPassword && (
                        <span
                          className="text-danger mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.oldPassword?.message}
                        </span>
                      )}
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="newPassword"
                        className="form-label mb-8 h6"
                      >
                        New Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control py-11"
                          id="newPassword"
                          placeholder="Enter New Password"
                          {...register("newPassword")}
                        />
                        <span
                          className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ${
                            showPassword ? "ph ph-eye" : "ph ph-eye-slash"
                          }`}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>
                      {/* Error message directly under input */}
                      {errors.newPassword && (
                        <span
                          className="text-danger mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.newPassword?.message}
                        </span>
                      )}
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label mb-8 h6"
                      >
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control py-11"
                          id="confirmPassword"
                          placeholder="Enter Confirm Password"
                          {...register("confirmPassword")}
                        />
                        <span
                          className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ${
                            showConfirmPassword
                              ? "ph ph-eye"
                              : "ph ph-eye-slash"
                          }`}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        />
                      </div>
                      {/* Error message directly under input */}
                      {errors.confirmPassword && (
                        <span
                          className="text-danger mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.confirmPassword?.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5">
                    <label
                      className="form-label mb-3 h5"
                      style={{ fontWeight: "600" }}
                    >
                      Password Security Requirements:
                    </label>
                    <ul
                      className="list-inside"
                      style={{ padding: "0px 15px", fontSize: "16px" }}
                    >
                      <li
                        className="text-gray-600 mb-4"
                        style={{ textAlign: "justify" }}
                      >
                        Use at least one lowercase letter to enhance password
                        strength.
                      </li>
                      <li
                        className="text-gray-600 mb-4"
                        style={{ textAlign: "justify" }}
                      >
                        Your password should be a minimum of 8 characters in
                        length. Longer passwords are more secure.
                      </li>
                      <li
                        className="text-gray-600 mb-4"
                        style={{ textAlign: "justify" }}
                      >
                        Include at least one uppercase letter, one number, and
                        one special character (e.g., !, @, #, $) for a strong
                        password.
                      </li>
                    </ul>
                  </div>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordChange;
