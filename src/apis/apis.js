import axios from "axios";

const api = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//?==================== AUTH CHECK API ====================
export async function checkSession() {
    try {
        await axios.get(`${api}/session`, {
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
        const response = await axios.post(`${api}/login`, data);
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
        const response = await axios.post(`${api}/signup_s1`, data);
        return response.data;
    } catch (error) {
        console.log("signup1() Err: ", error);
        throw error;
    }
}

//?==================== RESEND MOBILE OTP API ====================
export async function resendMobileOtp(data) {
    try {
        const response = await axios.post(`${api}/resend_mobile_otp`, data);
        return response.data;
    } catch (error) {
        console.log("resendMobileOtp() Err: ", error);
        throw error;
    }
}

//?==================== Signup 2 API ====================
export async function signup2(data) {
    try {
        const response = await axios.post(`${api}/signup_s2`, data);
        return response.data;
    } catch (error) {
        console.log("signup2() Err: ", error);
        throw error;
    }
}

//?==================== SMS OTP VERIFICATION API ====================
export async function smsOtpVerification(data) {
    try {
        const response = await axios.post(`${api}/verify_phone`, data);
        return response.data;
    } catch (error) {
        console.log("smsOtpVerification() Err: ", error);
        throw error;
    }
}

//?==================== LOGOUT API ====================
export async function logout(data) {
    try {
        const response = await axios.post(`${api}/logout`, data);
        return response.data;
    } catch (error) {
        console.log("logout() Err: ", error);
        throw error;
    }
}

//?==================== FETCH RECENT REG. NOTIFICATION API ====================
export async function fetchRecentRegNotification() {
    try {
        const response = await axios.get(`${api}/getRecentRegNotifications`);
        return response.data;
    } catch (error) {
        console.log("fetchRecentRegNotification() Err: ", error);
        throw error;
    }
}

//?==================== FETCH PROFILE DETAILS API ====================
export async function fetchProfileDetails() {
    try {
        const response = await axios.get(`${api}/getProfileDetails`);
        return response.data;
    } catch (error) {
        console.log("fetchProfileDetails() Err: ", error);
        throw error;
    }
}

//?==================== UPDATE PROFILE DETAILS API ====================
export async function updatePersonalDetails(data) {
    try {
        const response = await axios.post(`${api}/updatePersonalDetails`, data);
        return response.data;
    } catch (error) {
        console.log("updatePersonalDetails() Err: ", error);
        throw error;
    }
}

//?==================== UPDATE PROFILE DETAILS API ====================
export async function updateAcademicDetails(data) {
    try {
        const response = await axios.post(`${api}/updateAcademicDetails`, data);
        return response.data;
    } catch (error) {
        console.log("updateAcademicDetails() Err: ", error);
        throw error;
    }
}

//?==================== CHANGE PASSWORD API ====================
export async function changePassword(data) {
    try {
        const response = await axios.post(`${api}/change_password`, data);
        return response.data;
    } catch (error) {
        console.log("changePassword() Err: ", error);
        throw error;
    }
}

//?==================== SEND RESET PASSWORD OTP API ====================
export async function sendResetPasswordOtp(data) {
    try {
        const response = await axios.post(`${api}/send_reset_pass_otp`, data);
        return response.data;
    } catch (error) {
        console.log("sendResetPasswordOtp() Err: ", error);
        throw error;
    }
}

//?==================== SEND RESET PASSWORD OTP VERIFICATION API ====================
export async function resetPasswordOtpVerification(data) {
    try {
        const response = await axios.post(`${api}/verify_reset_pass_otp`, data);
        return response.data;
    } catch (error) {
        console.log("resetPasswordOtpVerification() Err: ", error);
        throw error;
    }
}

//?==================== RESET PASSWORD API ====================
export async function resetPassword(data) {
    try {
        const response = await axios.post(`${api}/reset_password`, data);
        return response.data;
    } catch (error) {
        console.log("resetPassword() Err: ", error);
        throw error;
    }
}

//?==================== GET SUBJECT API ====================
export async function getSubjects() {
    try {
        const response = await axios.get(`${api}/getSubjects`);
        return response.data;
    } catch (error) {
        console.log("getSubjects() Err: ", error);
        throw error;
    }
}

//?==================== GET TOPIC API ====================
export async function getTopics(data) {
    try {
        const response = await axios.post(`${api}/getTopics`, data);
        return response.data;
    } catch (error) {
        console.log("getTopics() Err: ", error);
        throw error;
    }
}

//?==================== GET SUB TOPIC API ====================
export async function getSubTopics(data) {
    try {
        const response = await axios.post(`${api}/getSubTopics`, data);
        return response.data;
    } catch (error) {
        console.log("getSubTopics() Err: ", error);
        throw error;
    }
}

//?==================== GET QUESTIONS FOR ADDING IN QUIZ API ====================
export async function getQuestionsForTest(data) {
    try {
        const response = await axios.post(`${api}/admin/getQuestionsForTest`, data);
        return response.data;
    } catch (error) {
        console.log("getQuestionsForTest() Err: ", error);
        throw error;
    }
}

//?==================== ADMIN LOGIN API ====================
export async function adminLogin(data) {
    try {
        const response = await axios.post(`${api}/admin/login`, data);
        return response.data;
    } catch (error) {
        console.log("adminLogin() Err: ", error);
        throw error;
    }
}

//?==================== ADD QUESTIONS API ====================
export async function adminAddQuestions(data) {
    try {
        const response = await axios.post(`${api}/admin/addQuestion`, data);
        return response.data;
    } catch (error) {
        console.log("adminAddQuestions() Err: ", error);
        throw error;
    }
}

//?==================== ADD PARAGRAPH BASED QUESTIONS API ====================
export async function adminAddParagraph(data) {
    try {
        const response = await axios.post(`${api}/admin/addParagraph`, data);
        return response.data;
    } catch (error) {
        console.log("adminAddParagraph() Err: ", error);
        throw error;
    }
}

//?==================== ADD PARAGRAPH BASED QUESTIONS API ====================
export async function adminGetParagraph(data) {
    try {
        const response = await axios.post(`${api}/admin/getParagraph`, data);
        return response.data;
    } catch (error) {
        console.log("adminGetParagraph() Err: ", error);
        throw error;
    }
}

//?==================== GET QUESTIONS API ====================

export const adminGetQuestions = async ({ pageParam = 1 }) => {
    try {
        const response = await axios.get(`${api}/admin/questions`, {
            params: {
                page: pageParam,
                limit: 10,
            },
        });

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format');
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response from server:', error.response);
            throw new Error(error.response.data.message || 'Failed to fetch questions');
        } else {
            console.error('Error setting up the request:', error.message);
            throw new Error('Error in the request setup');
        }
    }
};

//?==================== ADMIN ADD TEST API ====================
export async function adminAddTest(data) {
    try {
        const response = await axios.post(`${api}/admin/addTest`, data);
        return response.data;
    } catch (error) {
        console.log("adminAddTest() Err: ", error);
        throw error;
    }
}

//?==================== ADMIN ADD TEST API ====================
export async function addTestQuestions(data) {
    try {
        const response = await axios.post(`${api}/admin/addTestQuestions`, data);
        return response.data;
    } catch (error) {
        console.log("addTestQuestions() Err: ", error);
        throw error;
    }
}

//?==================== GET QUIZ API ====================
export async function getQuiz() {
    try {
        const response = await axios.get(`${api}/admin/getTests`);
        return response.data;
    } catch (error) {
        console.error("getQuiz() error", error);
        throw error;
    }
}

//?==================== GET QUIZ QUESTIONS API ====================
export async function getQuizQuestions(data) {
    try {
        const response = await axios.post(`${api}/getTestQuestions`, data);
        return response.data;
    } catch (error) {
        console.error("getQuizQuestions() error", error);
        throw error;
    }
}

//?==================== GET QUIZ FOR STUDENT API ====================
export async function getTestForStudent(data) {
    try {
        const response = await axios.post(`${api}/getTest`, data);
        return response.data;
    } catch (error) {
        console.error("getTestForStudent() error", error);
        throw error;
    }
}

//?==================== SUBMIT QUIZ API ====================
export async function studentSubmitTest(data) {
    try {
        const response = await axios.post(`${api}/addStudentAnswer`, data);
        return response.data;
    } catch (error) {
        console.error("studentSubmitTest() error", error);
        throw error;
    }
}

//?==================== STUDENT GET RESULT API ====================
export async function studentGetResult(data) {
    try {
        const response = await axios.post(`${api}/getResultByStudent`, data);
        return response.data;
    } catch (error) {
        console.error("studentGetResult() error", error);
        throw error;
    }
}