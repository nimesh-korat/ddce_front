import axios from "axios";

const api = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

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
      data
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
      data
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
      data
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
        error.response.data.message || "Failed to fetch questions"
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
      data
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
