import React, { useEffect, useState, useContext } from "react";
import Preloader from "../../utils/Preloader";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { login } from "../../apis/apis";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../utils/UserContex";

function SignIn() {
  const [data, setData] = useState({
    Phone_Number: "",
    Password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate(); // To navigate to another page
  const { setUser } = useContext(UserContext); // Access setUser from the context

  useEffect(() => {
    // Check if the user is already logged in (by checking for a token)
    const token =
      localStorage.getItem("token") ||
      document.cookie.split(";").find((c) => c.trim().startsWith("token_id="));
    if (token) {
      navigate("/"); // Redirect if already logged in
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
    mutationFn: login,
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message, {
        onClose: () => {
          // Update the context with the logged-in user's data
          setUser(data.user); // Set user data in the context
          localStorage.setItem("user", JSON.stringify(data.user)); // Store user in localStorage (for persistence)
          localStorage.setItem("token", data.token); // Store the token
          navigate("/"); // Redirect to the home page after successful login
        },
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginQuery.mutate(data); // Call the login API with the user data
  };

  return (
    <>
      <Preloader />
      <section className="auth d-flex">
        <div className="auth-left bg-main-50 flex-center p-24">
          <img src="assets/images/thumbs/auth-img1.png" alt="" />
        </div>
        <div className="auth-right py-40 px-24 flex-center flex-column">
          <div className="auth-right__inner mx-auto w-100">
            <a href="index.html" className="auth-right__logo">
              <img src="assets/images/logo/logo.png" alt="" />
            </a>
            <h2 className="mb-8">Welcome to Back! 👋</h2>
            <p className="text-gray-600 text-15 mb-32">
              Please sign in to your account and start the adventure
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-24">
                <label htmlFor="fname" className="form-label mb-8 h6">
                  Phone No
                </label>
                <div className="position-relative">
                  <input
                    type="tel"
                    name="Phone_Number"
                    onChange={handleChange}
                    value={data.Phone_Number}
                    className="form-control py-11 ps-40"
                    id="fname"
                    maxLength={10}
                    placeholder="Type your phone number"
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
              <div className="mb-32 flex-between flex-wrap gap-8">
                <div className="form-check mb-0 flex-shrink-0">
                  <input
                    className="form-check-input flex-shrink-0 rounded-4"
                    type="checkbox"
                    defaultValue
                    id="remember"
                  />
                  <label
                    className="form-check-label text-15 flex-grow-1"
                    htmlFor="remember"
                  >
                    Remember Me
                  </label>
                </div>
                <a
                  href="forgot-password.html"
                  className="text-main-600 hover-text-decoration-underline text-15 fw-medium"
                >
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="btn btn-main rounded-pill w-100">
                Sign In
              </button>
              <p className="mt-32 text-gray-600 text-center">
                New on our platform? &nbsp;
                <Link
                  to={"/signup"}
                  className="text-main-600 hover-text-decoration-underline"
                >
                  Create an account
                </Link>
              </p>
              <div className="divider my-32 position-relative text-center">
                <span className="divider__text text-gray-600 text-13 fw-medium px-26 bg-white">
                  or
                </span>
              </div>
              <ul className="flex-align gap-10 flex-wrap justify-content-center">
                <li>
                  <a
                    href="https://www.facebook.com"
                    className="w-38 h-38 flex-center rounded-6 text-facebook-600 bg-facebook-50 hover-bg-facebook-600 hover-text-white text-lg"
                  >
                    <i className="ph-fill ph-facebook-logo" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitter.com"
                    className="w-38 h-38 flex-center rounded-6 text-twitter-600 bg-twitter-50 hover-bg-twitter-600 hover-text-white text-lg"
                  >
                    <i className="ph-fill ph-twitter-logo" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.google.com"
                    className="w-38 h-38 flex-center rounded-6 text-google-600 bg-google-50 hover-bg-google-600 hover-text-white text-lg"
                  >
                    <i className="ph ph-google-logo" />
                  </a>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignIn;