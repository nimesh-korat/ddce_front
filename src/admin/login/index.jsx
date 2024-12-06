import React, { useEffect, useState, useContext } from "react";
import Preloader from "../../utils/Preloader";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { adminLogin } from "../../apis/apis";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../utils/UserContex";
import ReCAPTCHA from "react-google-recaptcha";

function AdminLogin() {
  const [data, setData] = useState({
    Email: "",
    Password: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate(); // To navigate to another page
  const { setUser } = useContext(UserContext); // Access setUser from the context
  const captchaKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY_V2;

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("admin") ||
      localStorage.getItem("session");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginQuery = useMutation({
    mutationFn: adminLogin,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        autoClose: 1500,
        onClose: () => {
          setUser(data.data);
          localStorage.setItem("admin", JSON.stringify(data.data));
          localStorage.setItem("token", data.auth.token);
          localStorage.setItem("session", data.auth.session);
          navigate("/admin/addQuestion");
        },
      });
    },
  });

  const handleRecaptchaChange = (value) => {
    // console.log("Captcha value:", value);
    setCaptcha(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginQuery.mutate(data); // Call the login API with the user data
  };

  return (
    <>
      {loginQuery.isLoading && <Preloader />}
      <section className="auth d-flex">
        <div className="auth-left bg-main-50 flex-center p-24">
          <img src="../assets/images/thumbs/auth-img1.png" alt="" />
        </div>
        <div className="auth-right py-40 px-24 flex-center flex-column">
          <div className="auth-right__inner mx-auto w-100">
            <Link to={"/#"} className="auth-right__logo">
              <img src="../assets/images/logo/logo.png" alt="" />
            </Link>
            <h2 className="mb-8">Welcome Back! 👋</h2>
            <p className="text-gray-600 text-15 mb-32">
              Please sign in to your account and start the adventure
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-24">
                <label htmlFor="fname" className="form-label mb-8 h6">
                  Email
                </label>
                <div className="position-relative">
                  <input
                    type="email"
                    name="Email"
                    onChange={handleChange}
                    value={data.Email}
                    className="form-control py-11 ps-40"
                    id="Email"
                    placeholder="Type your email"
                    required
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-user" />
                  </span>
                </div>
              </div>
              <div className="mb-24">
                <label
                  htmlFor="current-password"
                  className="form-label mb-8 h6"
                >
                  Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between text and password input type
                    className="form-control py-11 ps-40"
                    id="current-password"
                    placeholder="Enter Password"
                    name="Password"
                    onChange={handleChange}
                    value={data.Password}
                    required
                  />
                  <span
                    className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y"
                    onClick={() => setShowPassword(!showPassword)} // Toggle the visibility
                  >
                    <i
                      className={showPassword ? "ph ph-eye" : "ph ph-eye-slash"}
                    />
                  </span>
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock" />
                  </span>
                </div>
              </div>

              {data.Email && data.Password && (
                <ReCAPTCHA
                  sitekey={captchaKey}
                  onChange={handleRecaptchaChange}
                  onExpired={() => setCaptcha("")}
                  onError={(error) => console.error("reCAPTCHA error:", error)}
                />
              )}

              <button
                type="submit"
                className="btn btn-main rounded-pill w-100 mt-10"
                disabled={!captcha}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLogin;
