// import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./modules/home_three";
import Students from "./modules/students";
import SignIn from "./modules/signin";
import Signup from "./modules/signup";
import ForgetPassword from "./modules/forget_password";
import ResetPassword from "./modules/reset_password";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./utils/PrivateRoutes";
import ProtectedRoute from "./utils/ProtectedRoutes";
import Error404 from "./errorPages/Error404";
import TestTopicListing from "./modules/testTopicListing";
import AdminLogin from "./admin/login";
import AddQuestion from "./admin/AddQuestions";
import AdminRoutes from "./utils/AdminRoutes";
import ShowQuestions from "./admin/ShowQuestions";
import CreateTest from "./admin/CreateTest";
import ShowTests from "./admin/ShowTest";
import AddQuizQuestions from "./admin/AddQuizQuestion";
import Exam from "./modules/exams";
import GiveExam from "./modules/give_exam";
import ExamResult from "./modules/exam_result";
import Profile from "./modules/profile";
import Weightage from "./modules/weightage";
import Syllabus from "./modules/syllabus";
import QuestionVerification from "./admin/QuestionVerification";
import Analytics from "./modules/analytics";
import StudentQuizDetails from "./modules/exams/components/StudentQuizDetails";
import MasteryMatrix from "./modules/accuracy_matrix";
import ViewQuizQuestions from "./admin/ViewQuizQuestion";
import Pricing from "./modules/pricing";
import Doubts from "./modules/doubt";
import Schedule from "./modules/schedule";
import AssignBatchToTest from "./admin/AssignBatchToTest";
import AddSession from "./admin/AddSessions";
import ShowSession from "./admin/ShowSession";
import AssignSessionToBatch from "./admin/AssignSessionToBatch";
import Solutions from "./modules/solutions";

function App() {
  return (
    <>
      <ToastContainer autoClose={1000} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/home2" element={<HomeTwo />} />
          <Route path="/home3" element={<Home />} />*/}
          <Route path="/schedule" element={<Schedule />} />
          {/* <Route path="/mentor_course" element={<StudentCourse />} />  */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-result"
            element={
              <ProtectedRoute>
                <ExamResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <GiveExam />
              </ProtectedRoute>
            }
          />
          <Route path="/testTopicListing" element={<TestTopicListing />} />
          <Route
            path="/syllabus"
            element={
              <ProtectedRoute>
                <Syllabus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weightage"
            element={
              <ProtectedRoute>
                <Weightage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accuracyMatrix"
            element={
              <ProtectedRoute>
                <MasteryMatrix />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doubts"
            element={
              <ProtectedRoute>
                <Doubts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solutions"
            element={
              <ProtectedRoute>
                <Solutions />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/mentors" element={<Mentor />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/events" element={<Events />} />
          <Route path="/library" element={<Library />} />*/}
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizdetail"
            element={
              <ProtectedRoute>
                <StudentQuizDetails />
              </ProtectedRoute>
            }
          />

          {/* Protect signin and signup routes */}
          <Route
            path="/signin"
            element={
              <PrivateRoute>
                <SignIn />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PrivateRoute>
                <Signup />
              </PrivateRoute>
            }
          />

          <Route
            path="/forget_password"
            element={
              <PrivateRoute>
                <ForgetPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/reset_password"
            element={
              <PrivateRoute>
                <ResetPassword />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/two_step_verification"
            element={<TwoStepVerification />}
          /> */}
          {/* <Route path="/live_class" element={<LiveClass />} /> */}

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              <PrivateRoute>
                <AdminLogin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/addQuestion"
            element={
              <AdminRoutes>
                <AddQuestion />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/showQuestions"
            element={
              <AdminRoutes>
                <ShowQuestions />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/createTest"
            element={
              <AdminRoutes>
                <CreateTest />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/showTests"
            element={
              <AdminRoutes>
                <ShowTests />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/addQuizQuestions"
            element={
              <AdminRoutes>
                <AddQuizQuestions />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/viewQuizQuestions"
            element={
              <AdminRoutes>
                <ViewQuizQuestions />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/questionVerification"
            element={
              <AdminRoutes>
                <QuestionVerification />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/assignBatch"
            element={
              <AdminRoutes>
                <AssignBatchToTest />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/addSession"
            element={
              <AdminRoutes>
                <AddSession />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/showSession"
            element={
              <AdminRoutes>
                <ShowSession />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/assignSessionToBatch"
            element={
              <AdminRoutes>
                <AssignSessionToBatch />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/test/:slug"
            element={
              <AdminRoutes>
                <ShowTests />
              </AdminRoutes>
            }
          />

          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
