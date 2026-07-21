import axios from "axios";
import { toast } from "react-toastify";

const api = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

// Track if we've shown a session expired toast
let hasShownSessionExpiredToast = false;

const axiosInstance = axios.create({
  baseURL: `${api}/api`, // Add /api to all requests
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, return it
    return response;
  },
  (error) => {
    // If the error status is 401 (Unauthorized), handle it
    if (error.response && error.response.status === 401) {
      // Handle the 401 error (e.g., redirect to login)
      if (!hasShownSessionExpiredToast) {
        hasShownSessionExpiredToast = true;

        toast.error("Session Expired! Please login again.", {
          onClose: () => {
            localStorage.clear();
            window.location.href = "/signin";
          },
        });
      }

      // Optionally, you can clear the token from localStorage and redirect the user
      // Or use your preferred redirect method
    }

    // If the error is not a 401, reject it as usual
    return Promise.reject(error);
  },
);

// // Reset the flag when a new token is set (optional)
// export const resetSessionExpiredFlag = () => {
//   hasShownSessionExpiredToast = false;
// };

//?==================== AUTH CHECK API ====================
export async function checkSession() {
  try {
    await axiosInstance.get(`/session`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return true; // Session is valid
  } catch (error) {
    console.log("checkSession() Err: ", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      return false; // Session is not valid
    }
    return false; // Session is not valid
  }
}

//?==================== LOGIN API ====================
export async function login(data) {
  try {
    const response = await axiosInstance.post(`/login`, data);
    // localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.log("login() Err: ", error);
    throw error;
  }
}

//?==================== Signup 1 API ====================
export async function signup1(data) {
  try {
    const response = await axiosInstance.post(`/signup_s1`, data);
    return response.data;
  } catch (error) {
    console.log("signup1() Err: ", error);
    throw error;
  }
}

//?==================== RESEND MOBILE OTP API ====================
export async function resendMobileOtp(data) {
  try {
    const response = await axiosInstance.post(`/resend_mobile_otp`, data);
    return response.data;
  } catch (error) {
    console.log("resendMobileOtp() Err: ", error);
    throw error;
  }
}

//?==================== Signup 2 API ====================
export async function signup2(data) {
  try {
    const response = await axiosInstance.post(`/signup_s2`, data);
    return response.data;
  } catch (error) {
    console.log("signup2() Err: ", error);
    throw error;
  }
}

//?==================== SMS OTP VERIFICATION API ====================
export async function smsOtpVerification(data) {
  try {
    const response = await axiosInstance.post(`/verify_phone`, data);
    return response.data;
  } catch (error) {
    console.log("smsOtpVerification() Err: ", error);
    throw error;
  }
}

//?==================== LOGOUT API ====================
export async function logout(data) {
  try {
    const response = await axiosInstance.post(`/logout`, data);
    return response.data;
  } catch (error) {
    console.log("logout() Err: ", error);
    throw error;
  }
}

//?==================== FETCH RECENT REG. NOTIFICATION API ====================
export async function fetchRecentRegNotification() {
  try {
    const response = await axiosInstance.get(`/getRecentRegNotifications`);
    return response.data;
  } catch (error) {
    console.log("fetchRecentRegNotification() Err: ", error);
    throw error;
  }
}

//?==================== FETCH PROFILE DETAILS API ====================
export async function fetchProfileDetails() {
  try {
    const response = await axiosInstance.get(`/getProfileDetails`);
    return response.data;
  } catch (error) {
    console.log("fetchProfileDetails() Err: ", error);
    throw error;
  }
}

//?==================== UPDATE PROFILE DETAILS API ====================
export async function updatePersonalDetails(data) {
  try {
    const response = await axiosInstance.post(`/updatePersonalDetails`, data);
    return response.data;
  } catch (error) {
    console.log("updatePersonalDetails() Err: ", error);
    throw error;
  }
}

//?==================== UPDATE PROFILE PICTURE API ====================
export async function updateProfilePic(data) {
  try {
    const response = await axiosInstance.post(`/updateProfilePic`, data);
    return response.data;
  } catch (error) {
    console.log("updateProfilePic() Err: ", error);
    throw error;
  }
}

//?==================== UPDATE PROFILE PICTURE API ====================
export async function getProfileImage() {
  try {
    const response = await axiosInstance.get(`/getProfileImage`);
    return response.data;
  } catch (error) {
    console.log("updateProfilePic() Err: ", error);
    throw error;
  }
}

//?==================== UPDATE PROFILE DETAILS API ====================
export async function updateAcademicDetails(data) {
  try {
    const response = await axiosInstance.post(`/updateAcademicDetails`, data);
    return response.data;
  } catch (error) {
    console.log("updateAcademicDetails() Err: ", error);
    throw error;
  }
}

//?==================== CHANGE PASSWORD API ====================
export async function changePassword(data) {
  try {
    const response = await axiosInstance.post(`/change_password`, data);
    return response.data;
  } catch (error) {
    console.log("changePassword() Err: ", error);
    throw error;
  }
}

//?==================== SEND RESET PASSWORD OTP API ====================
export async function sendResetPasswordOtp(data) {
  try {
    const response = await axiosInstance.post(`/send_reset_pass_otp`, data);
    return response.data;
  } catch (error) {
    console.log("sendResetPasswordOtp() Err: ", error);
    throw error;
  }
}

//?==================== SEND RESET PASSWORD OTP VERIFICATION API ====================
export async function resetPasswordOtpVerification(data) {
  try {
    const response = await axiosInstance.post(`/verify_reset_pass_otp`, data);
    return response.data;
  } catch (error) {
    console.log("resetPasswordOtpVerification() Err: ", error);
    throw error;
  }
}

//?==================== RESET PASSWORD API ====================
export async function resetPassword(data) {
  try {
    const response = await axiosInstance.post(`/reset_password`, data);
    return response.data;
  } catch (error) {
    console.log("resetPassword() Err: ", error);
    throw error;
  }
}

//?==================== GET DASHBOARD COUNTS API ====================
export async function getDashboardCounts() {
  try {
    const response = await axiosInstance.get(`/getDashboardCounts`);
    return response.data;
  } catch (error) {
    console.log("getDashboardCounts() Err: ", error);
    throw error;
  }
}

//?==================== GET SUBJECT API ====================
export async function getSubjects() {
  try {
    const response = await axiosInstance.get(`/getSubjects`);
    return response.data;
  } catch (error) {
    console.log("getSubjects() Err: ", error);
    throw error;
  }
}

//?==================== GET TOPIC API ====================
export async function getTopics(data) {
  try {
    const response = await axiosInstance.post(`/getTopics`, data);
    return response.data;
  } catch (error) {
    console.log("getTopics() Err: ", error);
    throw error;
  }
}

//!=============================== ANALYTICS API ================================
//?==================== GET TOPICWISE QUESTION ANALYTICS API ====================
export async function getTopicWiseQuestionAnalytics(data) {
  try {
    const response = await axiosInstance.get(
      `/getTopicWiseQuestionAnalytics`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log("getTopicWiseQuestionAnalytics() Err: ", error);
    throw error;
  }
}

//?==================== GET SUBJECTWISE QUESTION ANALYTICS API ====================
export async function getSubjectWiseAnalysis() {
  try {
    const response = await axiosInstance.get(`/getSubjectWiseAnalysis`);
    return response.data.data;
  } catch (error) {
    console.log("getSubjectWiseAnalysis() Err: ", error);
    throw error;
  }
}

//?==================== GET SUB TOPIC API ====================
export async function getSubTopics(data) {
  try {
    const response = await axiosInstance.post(`/getSubTopics`, data);
    return response.data;
  } catch (error) {
    console.log("getSubTopics() Err: ", error);
    throw error;
  }
}

//?==================== GET SYLLABUS API ====================
export async function getSyllabus() {
  try {
    const response = await axiosInstance.get(`/getSyllabus`);
    return response.data;
  } catch (error) {
    console.log("getSyllabus() Err: ", error);
    throw error;
  }
}

//?==================== GET SYLLABUS WITH PAPER API ====================
export async function getSyllabusWithPaper() {
  try {
    const response = await axiosInstance.get(`/getSyllabusWithPaper`);
    return response.data;
  } catch (error) {
    console.log("getSyllabusWithPaper() Err: ", error);
    throw error;
  }
}

//?==================== GET QUESTIONS FOR ADDING IN QUIZ API ====================
export async function getQuestionsForTest(data) {
  try {
    const response = await axiosInstance.post(
      `/admin/getQuestionsForTest`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log("getQuestionsForTest() Err: ", error);
    throw error;
  }
}

//?==================== GET QUESTIONS FOR VERIFICATION API ====================
export async function getQuestionsForVerification(data) {
  try {
    const response = await axiosInstance.post(
      `/admin/getQuestionsForVerification`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log("getQuestionsForVerification() Err: ", error);
    throw error;
  }
}

//?==================== VERIFY QUESTION API ====================
export async function verifyQuestion(data) {
  try {
    const response = await axiosInstance.post(`/admin/verifyQuestion`, data);
    return response.data;
  } catch (error) {
    console.log("verifyQuestion() Err: ", error);
    throw error;
  }
}

//?==================== ADMIN LOGIN API ====================
export async function adminLogin(data) {
  try {
    const response = await axiosInstance.post(`/admin/login`, data);
    return response.data;
  } catch (error) {
    console.log("adminLogin() Err: ", error);
    throw error;
  }
}

//?==================== MENTOR LOGIN API ====================
export async function mentorLogin(data) {
  try {
    const response = await axiosInstance.post(`/mentor/login`, data);
    return response.data;
  } catch (error) {
    console.log("mentorLogin() Err: ", error);
    throw error;
  }
}

//?==================== ADD QUESTIONS API ====================
export async function adminAddQuestions(data) {
  try {
    const response = await axiosInstance.post(`/admin/addQuestion`, data);
    return response.data;
  } catch (error) {
    console.log("adminAddQuestions() Err: ", error);
    throw error;
  }
}

//?==================== ADD PARAGRAPH BASED QUESTIONS API ====================
export async function adminAddParagraph(data) {
  try {
    const response = await axiosInstance.post(`/admin/addParagraph`, data);
    return response.data;
  } catch (error) {
    console.log("adminAddParagraph() Err: ", error);
    throw error;
  }
}

//?==================== ADD PARAGRAPH BASED QUESTIONS API ====================
export async function adminGetParagraph(data) {
  try {
    const response = await axiosInstance.post(`/admin/getParagraph`, data);
    return response.data;
  } catch (error) {
    console.log("adminGetParagraph() Err: ", error);
    throw error;
  }
}

//?==================== GET QUESTIONS API ====================

export const adminGetQuestions = async ({ pageParam = 1 }) => {
  try {
    const response = await axiosInstance.get(`/admin/questions`, {
      params: {
        page: pageParam,
        limit: 10,
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response from server:", error.response);
      throw new Error(
        error.response.data.message || "Failed to fetch questions",
      );
    } else {
      console.error("Error setting up the request:", error.message);
      throw new Error("Error in the request setup");
    }
  }
};

//?==================== ADMIN ADD TEST API ====================
export async function adminAddTest(data) {
  try {
    const response = await axiosInstance.post(`/admin/addTest`, data);
    return response.data;
  } catch (error) {
    console.log("adminAddTest() Err: ", error);
    throw error;
  }
}

//?==================== ADMIN ADD TEST API ====================
export async function addTestQuestions(data) {
  try {
    const response = await axiosInstance.post(`/admin/addTestQuestions`, data);
    return response.data;
  } catch (error) {
    console.log("addTestQuestions() Err: ", error);
    throw error;
  }
}

//?==================== GET ALL BATCH API ====================
export async function getAllBatch() {
  try {
    const response = await axiosInstance.get(`/admin/getAllBatch`);
    return response.data.data;
  } catch (error) {
    console.error("getAllBatch() error", error);
    throw error;
  }
}

//?==================== GET ALL BATCH API ====================
export async function getAllPhase() {
  try {
    const response = await axiosInstance.get(`/admin/getPhase`);
    return response.data.data;
  } catch (error) {
    console.error("getAllBatch() error", error);
    throw error;
  }
}

//?==================== GET TEST WISE BATCH API ====================
export async function getTestWiseBatch(id) {
  try {
    const response = await axiosInstance.post(`/admin/getTestWiseBatch`, {
      test_id: id,
    });
    return response.data.data;
  } catch (error) {
    console.error("getTestWiseBatch() error", error);
    throw error;
  }
}

//?==================== ASSIGN TEST TO BATCH API ====================
export async function assignTestToBatch(data) {
  try {
    const response = await axiosInstance.post(`/admin/assignTestToBatch`, data);
    return response.data;
  } catch (error) {
    console.error("assignTestToBatch() error", error);
    throw error;
  }
}

//?==================== UPDATE IS FEATURED API ====================
export async function updateIsFeatured(data) {
  try {
    const response = await axiosInstance.post(`/admin/updateIsFeatured`, data);
    return response.data;
  } catch (error) {
    console.error("updateIsFeatured() error", error);
    throw error;
  }
}

//?==================== ADD SESSION API ====================
export async function addSession(data) {
  try {
    const response = await axiosInstance.post(`/admin/addSession`, data);
    return response.data;
  } catch (error) {
    console.error("addSession() error", error);
    throw error;
  }
}

//?==================== GET SESSION API ====================
export async function getSession() {
  try {
    const response = await axiosInstance.get(`/admin/getSession`);
    return response.data;
  } catch (error) {
    console.error("getSession() error", error);
    throw error;
  }
}

//?==================== ASSIGN TEST TO BATCH API ====================
export async function assignBatchToSession(data) {
  try {
    const response = await axiosInstance.post(
      `/admin/assignBatchToSession`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("assignBatchToSession() error", error);
    throw error;
  }
}

//?==================== GET SESSION WISE BATCH API ====================
export async function getSessionWiseBatch(id) {
  try {
    const response = await axiosInstance.post(`/admin/getSessionWiseBatch`, {
      session_id: id,
    });
    return response.data.data;
  } catch (error) {
    console.error("getSessionWiseBatch() error", error);
    throw error;
  }
}

//?==================== UPDATE IS FEATURED SESSION API ====================
export async function updateIsFeaturedSession(data) {
  try {
    const response = await axiosInstance.post(
      `/admin/updateIsFeaturedSession`,
      data,
    );
    return response.data.data;
  } catch (error) {
    console.error("updateIsFeaturedSession() error", error);
    throw error;
  }
}

//?==================== GET ACTIVE SCHEDULE API ====================
export async function getActiveScheduleForStudent() {
  try {
    const response = await axiosInstance.get(`/getActiveScheduleForStudent`);
    return response.data.data;
  } catch (error) {
    console.error("getActiveScheduleForStudent() error", error);
    throw error;
  }
}

//?==================== GET QUIZ API ====================
export async function getQuiz() {
  try {
    const response = await axiosInstance.get(`/admin/getTests`);
    return response.data;
  } catch (error) {
    console.error("getQuiz() error", error);
    throw error;
  }
}

//?==================== GET QUIZ QUESTIONS API ====================
export async function getQuizQuestions(data) {
  try {
    const response = await axiosInstance.post(`/getTestQuestions`, data);
    return response.data;
  } catch (error) {
    console.error("getQuizQuestions() error", error);
    throw error;
  }
}

//?==================== GET QUIZ FOR STUDENT API ====================
export async function getTestForStudent(data) {
  try {
    const response = await axiosInstance.post(`/getTest`, data);
    return response.data;
  } catch (error) {
    console.error("getTestForStudent() error", error);
    throw error;
  }
}

//?==================== SUBMIT QUIZ API ====================
export async function studentSubmitTest(data) {
  try {
    const response = await axiosInstance.post(`/addStudentAnswer`, data);
    return response.data;
  } catch (error) {
    console.error("studentSubmitTest() error", error);
    throw error;
  }
}

//?==================== STUDENT GET RESULT API ====================
export async function studentGetResult(data) {
  try {
    const response = await axiosInstance.post(`/getResultByStudent`, data);
    return response.data;
  } catch (error) {
    console.error("studentGetResult() error", error);
    throw error;
  }
}

//?==================== GET ACTIVE SCHEDULE API ====================
export async function getTestNames() {
  try {
    const response = await axiosInstance.get(`/admin/getTestNames`);
    return response.data.data;
  } catch (error) {
    console.error("getTestNames() error", error);
    throw error;
  }
}

//?==================== GET USER WITH EXAM DATA API ====================
export async function getUsersWithExamData(test_id) {
  try {
    const response = await axiosInstance.get(
      `/admin/getUsersWithExamData/${test_id}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("getUsersWithExamData() error", error);
    throw error;
  }
}

//?==================== GET USER WISE EXAM DATA API ====================
export async function getUsersWiseExamData() {
  try {
    const response = await axiosInstance.get(`/admin/getStudentWiseExamData`);
    return response.data.data;
  } catch (error) {
    console.error("getUsersWiseExamData() error", error);
    throw error;
  }
}

//?==================== DDCET College Prediction API ====================
export async function DdcetRankPredict(data) {
  try {
    const response = await axiosInstance.post(`/ddcetRankPredict`, data);
    return response.data;
  } catch (error) {
    console.log("DdcetRankPredict() Err: ", error);
    throw error;
  }
}

//?==================== ADMIN DASHBOARD STATS API ====================
export async function getAdminDashboardStats() {
  try {
    const response = await axiosInstance.get(`/admin/dashboardStats`);
    return response.data;
  } catch (error) {
    console.error("getAdminDashboardStats() error", error);
    throw error;
  }
}

//?==================== MATERIALS — ADMIN ====================
export async function adminAddMaterial(data) {
  try {
    const response = await axiosInstance.post(`/admin/materials`, data);
    return response.data;
  } catch (error) {
    console.error("adminAddMaterial() error", error);
    throw error;
  }
}

export async function adminGetMaterials() {
  try {
    const response = await axiosInstance.get(`/admin/materials`);
    return response.data;
  } catch (error) {
    console.error("adminGetMaterials() error", error);
    throw error;
  }
}

export async function adminUpdateMaterial(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/materials/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("adminUpdateMaterial() error", error);
    throw error;
  }
}

export async function adminDeleteMaterial(id) {
  try {
    const response = await axiosInstance.delete(`/admin/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error("adminDeleteMaterial() error", error);
    throw error;
  }
}

export async function adminToggleSolutionVisibility(id) {
  try {
    const response = await axiosInstance.put(
      `/admin/materials/${id}/toggleSolution`,
    );
    return response.data;
  } catch (error) {
    console.error("adminToggleSolutionVisibility() error", error);
    throw error;
  }
}

//?==================== MATERIALS — USER ====================
export async function getUserMaterials() {
  try {
    const response = await axiosInstance.get(`/materials`);
    return response.data;
  } catch (error) {
    console.error("getUserMaterials() error", error);
    throw error;
  }
}

//?==================== QUESTIONS — EDIT / DELETE ====================
export async function adminUpdateQuestion(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/questions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("adminUpdateQuestion() error", error);
    throw error;
  }
}

export async function adminDeleteQuestion(id) {
  try {
    const response = await axiosInstance.delete(`/admin/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("adminDeleteQuestion() error", error);
    throw error;
  }
}

export async function adminDeleteTestQuestion(test_id, question_id) {
  try {
    const response = await axiosInstance.delete(
      `/admin/tests/${test_id}/questions/${question_id}`,
    );
    return response.data;
  } catch (error) {
    console.error("adminDeleteTestQuestion() error", error);
    throw error;
  }
}

//?==================== TESTS — EDIT / DELETE ====================
export async function adminUpdateTest(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/tests/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("adminUpdateTest() error", error);
    throw error;
  }
}

export async function adminDeleteTest(id) {
  try {
    const response = await axiosInstance.delete(`/admin/tests/${id}`);
    return response.data;
  } catch (error) {
    console.error("adminDeleteTest() error", error);
    throw error;
  }
}

//?==================== BATCH — EDIT / DELETE ====================
export async function adminUpdateBatch(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/batch/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("adminUpdateBatch() error", error);
    throw error;
  }
}

export async function adminDeleteBatch(id) {
  try {
    const response = await axiosInstance.delete(`/admin/batch/${id}`);
    return response.data;
  } catch (error) {
    console.error("adminDeleteBatch() error", error);
    throw error;
  }
}

//?==================== SESSION — EDIT / DELETE ====================
export async function adminUpdateSession(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/session/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("adminUpdateSession() error", error);
    throw error;
  }
}

export async function adminDeleteSession(id) {
  try {
    const response = await axiosInstance.delete(`/admin/session/${id}`);
    return response.data;
  } catch (error) {
    console.error("adminDeleteSession() error", error);
    throw error;
  }
}

//?==================== EDIT ASSIGNED TEST TO BATCH ====================
export async function editAssignedTestToBatch(data) {
  try {
    const response = await axiosInstance.post(
      `/admin/editAssignedTestToBatch`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("editAssignedTestToBatch() error", error);
    throw error;
  }
}

//?==================== DELETE TEST BATCH ASSIGNMENT ====================
export async function deleteTestBatchAssignment(id) {
  try {
    const response = await axiosInstance.delete(
      `/admin/testBatchAssignment/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("deleteTestBatchAssignment() error", error);
    throw error;
  }
}

//?==================== EDIT SESSION BATCH ASSIGNMENT ====================
export async function editSessionBatchAssignment(data) {
  try {
    const response = await axiosInstance.post(
      `/admin/editSessionBatchAssignment`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("editSessionBatchAssignment() error", error);
    throw error;
  }
}

//?==================== MENTOR — QUESTIONS ====================
export async function mentorAddQuestion(data) {
  try {
    const response = await axiosInstance.post(`/mentor/addQuestion`, data);
    return response.data;
  } catch (error) {
    console.error("mentorAddQuestion() error", error);
    throw error;
  }
}

export async function mentorGetQuestions(params) {
  try {
    const response = await axiosInstance.get(`/mentor/questions`, { params });
    return response.data;
  } catch (error) {
    console.error("mentorGetQuestions() error", error);
    throw error;
  }
}

export async function mentorUpdateQuestion(id, data) {
  try {
    const response = await axiosInstance.put(`/mentor/questions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("mentorUpdateQuestion() error", error);
    throw error;
  }
}

export async function mentorDeleteQuestion(id) {
  try {
    const response = await axiosInstance.delete(`/mentor/questions/${id}`);
    return response.data;
  } catch (error) {
    console.error("mentorDeleteQuestion() error", error);
    throw error;
  }
}

//?==================== PRACTICE — ADMIN/MENTOR SIDE ====================
export async function createPracticeAssignment(data) {
  try {
    const response = await axiosInstance.post(`/practice/assign`, data);
    return response.data;
  } catch (error) {
    console.error("createPracticeAssignment() error", error);
    throw error;
  }
}

export async function getMyPracticeAssignments() {
  try {
    const response = await axiosInstance.get(`/practice/assignments`);
    return response.data;
  } catch (error) {
    console.error("getMyPracticeAssignments() error", error);
    throw error;
  }
}

export async function deletePracticeAssignment(id) {
  try {
    const response = await axiosInstance.delete(`/practice/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error("deletePracticeAssignment() error", error);
    throw error;
  }
}

export async function getQuestionsForPractice(params) {
  try {
    const response = await axiosInstance.get(`/practice/questions-pool`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("getQuestionsForPractice() error", error);
    throw error;
  }
}

export async function getMentorsList() {
  try {
    const response = await axiosInstance.get(`/practice/mentors`);
    return response.data;
  } catch (error) {
    console.error("getMentorsList() error", error);
    throw error;
  }
}

//?==================== PRACTICE — STUDENT SIDE ====================
export async function getStudentPracticeSets() {
  try {
    const response = await axiosInstance.get(`/practice/sets`);
    return response.data;
  } catch (error) {
    console.error("getStudentPracticeSets() error", error);
    throw error;
  }
}

export async function getNextPracticeQuestion(practice_assigned_id) {
  try {
    const response = await axiosInstance.get(`/practice/next`, {
      params: { practice_assigned_id },
    });
    return response.data;
  } catch (error) {
    console.error("getNextPracticeQuestion() error", error);
    throw error;
  }
}

export async function submitPracticeAnswer(data) {
  try {
    const response = await axiosInstance.post(`/practice/answer`, data);
    return response.data;
  } catch (error) {
    console.error("submitPracticeAnswer() error", error);
    throw error;
  }
}

export async function getWrongPracticeAnswers(practice_assigned_id) {
  try {
    const response = await axiosInstance.get(`/practice/wrong`, {
      params: { practice_assigned_id },
    });
    return response.data;
  } catch (error) {
    console.error("getWrongPracticeAnswers() error", error);
    throw error;
  }
}

export async function getPracticeStats() {
  try {
    const response = await axiosInstance.get(`/practice/stats`);
    return response.data;
  } catch (error) {
    console.error("getPracticeStats() error", error);
    throw error;
  }
}

export async function getPracticeAccuracy(mode = "merged") {
  try {
    const response = await axiosInstance.get(`/practice/accuracy`, {
      params: { mode },
    });
    return response.data;
  } catch (error) {
    console.error("getPracticeAccuracy() error", error);
    throw error;
  }
}

//?==================== PRACTICE — BATCH ASSIGNMENTS ====================
export async function assignPracticeToBatch(data) {
  try {
    const response = await axiosInstance.post(`/practice/batch-assign`, data);
    return response.data;
  } catch (error) {
    console.error("assignPracticeToBatch() error", error);
    throw error;
  }
}

export async function editPracticeBatchAssignment(id, data) {
  try {
    const response = await axiosInstance.put(
      `/practice/batch-assign/${id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("editPracticeBatchAssignment() error", error);
    throw error;
  }
}

export async function togglePracticeVisibility(id) {
  try {
    const response = await axiosInstance.put(
      `/practice/batch-assign/${id}/toggle-visible`,
    );
    return response.data;
  } catch (error) {
    console.error("togglePracticeVisibility() error", error);
    throw error;
  }
}

export async function deletePracticeBatchAssignment(id) {
  try {
    const response = await axiosInstance.delete(`/practice/batch-assign/${id}`);
    return response.data;
  } catch (error) {
    console.error("deletePracticeBatchAssignment() error", error);
    throw error;
  }
}

//?==================== PRACTICE MASTER — CRUD ====================
export async function createPractice(data) {
  try {
    const response = await axiosInstance.post(`/practice`, data);
    return response.data;
  } catch (error) {
    console.error("createPractice() error", error);
    throw error;
  }
}

export async function getPractices() {
  try {
    const response = await axiosInstance.get(`/practice/list`);
    return response.data;
  } catch (error) {
    console.error("getPractices() error", error);
    throw error;
  }
}

export async function updatePractice(id, data) {
  try {
    const response = await axiosInstance.put(`/practice/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("updatePractice() error", error);
    throw error;
  }
}

export async function deletePractice(id) {
  try {
    const response = await axiosInstance.delete(`/practice/${id}`);
    return response.data;
  } catch (error) {
    console.error("deletePractice() error", error);
    throw error;
  }
}

export async function addQuestionsToPractice(id, data) {
  try {
    const response = await axiosInstance.post(
      `/practice/${id}/questions`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("addQuestionsToPractice() error", error);
    throw error;
  }
}

export async function removeQuestionFromPractice(practiceId, questionId) {
  try {
    const response = await axiosInstance.delete(
      `/practice/${practiceId}/questions/${questionId}`,
    );
    return response.data;
  } catch (error) {
    console.error("removeQuestionFromPractice() error", error);
    throw error;
  }
}

export async function togglePracticeFeatured(id) {
  try {
    const response = await axiosInstance.put(
      `/practice/batch-assign/${id}/toggle-featured`,
    );
    return response.data;
  } catch (error) {
    console.error("togglePracticeFeatured() error", error);
    throw error;
  }
}

//?==================== BATCH ACCESS ====================
export async function getBatchAccess(batch_id, phase_id = 1) {
  try {
    const response = await axiosInstance.get(
      `/admin/batchAccess/${batch_id}?phase_id=${phase_id}`,
    );
    return response.data;
  } catch (error) {
    console.error("getBatchAccess() error", error);
    throw error;
  }
}

export async function updateBatchAccess(batch_id, phase_id = 1, features) {
  try {
    const response = await axiosInstance.put(
      `/admin/batchAccess/${batch_id}?phase_id=${phase_id}`,
      { features, phase_id },
    );
    return response.data;
  } catch (error) {
    console.error("updateBatchAccess() error", error);
    throw error;
  }
}

//?==================== STUDENT WISE EXAM DATA ====================
export async function getStudentWiseExamData(params) {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ),
    ).toString();
    const response = await axiosInstance.get(
      `/admin/getStudentWiseExamData?${query}`,
    );
    return response.data;
  } catch (error) {
    console.error("getStudentWiseExamData() error", error);
    throw error;
  }
}

//?==================== STUDENT PROFILE ====================
export async function getStudentProfile(student_id) {
  try {
    const response = await axiosInstance.get(
      `/admin/studentProfile/${student_id}`,
    );
    return response.data;
  } catch (error) {
    console.error("getStudentProfile() error", error);
    throw error;
  }
}

//?==================== STUDENT ANSWERS ====================
export async function getStudentAnswers(params) {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ),
    ).toString();
    const response = await axiosInstance.get(`/admin/studentAnswers?${query}`);
    return response.data;
  } catch (error) {
    console.error("getStudentAnswers() error", error);
    throw error;
  }
}

export async function getStudentSubjectAccuracy(params) {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ),
    ).toString();
    const response = await axiosInstance.get(
      `/admin/studentSubjectAccuracy?${query}`,
    );
    return response.data;
  } catch (error) {
    console.error("getStudentSubjectAccuracy() error", error);
    throw error;
  }
}

//?==================== DOUBT OTP ====================
export async function sendDoubtOtp() {
  try {
    const response = await axiosInstance.post(`/doubt/sendOtp`);
    return response.data;
  } catch (error) {
    console.error("sendDoubtOtp() error", error);
    throw error;
  }
}

export async function verifyDoubtOtp(data) {
  try {
    const response = await axiosInstance.post(`/doubt/verifyOtp`, data);
    return response.data;
  } catch (error) {
    console.error("verifyDoubtOtp() error", error);
    throw error;
  }
}

//?==================== MY ANSWERS (Student) ====================
export async function getMyAnswers(params) {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params || {}).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ),
    ).toString();
    const response = await axiosInstance.get(`/myAnswers?${query}`);
    return response.data;
  } catch (error) {
    console.error("getMyAnswers() error", error);
    throw error;
  }
}

//?==================== DOODLE / OCCASION ====================
export async function createDoodle(data) {
  try {
    const response = await axiosInstance.post(`/admin/doodle`, data);
    return response.data;
  } catch (error) {
    console.error("createDoodle() error", error);
    throw error;
  }
}
export async function getDoodles() {
  try {
    const response = await axiosInstance.get(`/admin/doodle`);
    return response.data;
  } catch (error) {
    console.error("getDoodles() error", error);
    throw error;
  }
}
export async function updateDoodle(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/doodle/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("updateDoodle() error", error);
    throw error;
  }
}
export async function deleteDoodle(id) {
  try {
    const response = await axiosInstance.delete(`/admin/doodle/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteDoodle() error", error);
    throw error;
  }
}
export async function assignDoodle(data) {
  try {
    const response = await axiosInstance.post(`/admin/doodle/assign`, data);
    return response.data;
  } catch (error) {
    console.error("assignDoodle() error", error);
    throw error;
  }
}
export async function removeAssignment(id) {
  try {
    const response = await axiosInstance.delete(`/admin/doodle/assign/${id}`);
    return response.data;
  } catch (error) {
    console.error("removeAssignment() error", error);
    throw error;
  }
}
export async function getActiveDoodle() {
  try {
    const response = await axiosInstance.get(`/activeDoodle`);
    return response.data;
  } catch (error) {
    console.error("getActiveDoodle() error", error);
    throw error;
  }
}
