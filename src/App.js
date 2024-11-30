import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./modules/home";
import HomeTwo from "./modules/home_two";
import HomeThree from "./modules/home_three";
import StudentCourse from "./modules/student_course";
import Students from "./modules/students";
import Mentor from "./modules/mentors";
import Resources from "./modules/resources";
import Messages from "./modules/messages";
import Analytics from "./modules/analytics";
import Events from "./modules/events";
import Library from "./modules/library";
import Pricing from "./modules/pricing";
import AccountSetting from "./modules/account_settings";
import SignIn from "./modules/signin";
import Signup from "./modules/signup";
import ForgetPassword from "./modules/forget_password";
import ResetPassword from "./modules/reset_password";
import TwoStepVerification from "./modules/two_step_verification";
import LiveClass from "./modules/live_class";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./utils/PrivateRoutes";
import ProtectedRoute from "./utils/ProtectedRoutes";
import Error404 from "./errorPages/Error404";
import TestTopicListing from "./modules/testTopicListing";
import AdminLogin from "./admin/login";
import AddQuestion from "./admin/AddQuestions";
import AdminRoutes from "./utils/AdminRoutes";
import ShowQuestions from "./admin/ShowQuestions";


function App() {

  return (
    <>
      <ToastContainer autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeThree />} />
          {/* <Route path="/home2" element={<HomeTwo />} />
          <Route path="/home3" element={<Home />} />
          <Route path="/student_course" element={<StudentCourse />} />
          <Route path="/mentor_course" element={<StudentCourse />} /> */}
          <Route path="/students" element={<Students />} />
          <Route path="/testTopicListing" element={<TestTopicListing />} />
          {/* <Route path="/mentors" element={<Mentor />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/events" element={<Events />} />
          <Route path="/library" element={<Library />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/account_setting" element={<AccountSetting />} /> */}

          {/* Protect signin and signup routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/forget_password" element={<ForgetPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          {/*<Route path="/two_step_verification" element={<TwoStepVerification />} />
          <Route path="/live_class" element={<LiveClass />} /> */}


          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/addQuestion" element={<AddQuestion />} />
          <Route path="/admin/showQuestions" element={<ShowQuestions />} />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
