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
export async function logout() {
    try {
        const response = await axios.post(`${api}/logout`);
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

//?==================== GET QUESTIONS API ====================

export const adminGetQuestions = async ({ pageParam = 1 }) => {
    try {
        // Make the API request using axios
        const response = await axios.get(`${api}/api/questions`, {
            params: {
                page: pageParam,
                limit: 10,
            },
        });

        // Ensure the response includes the necessary data
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format');
        }

        return response.data; // Returns the data from the response
    } catch (error) {
        // Handle error properly
        if (error.response) {
            // Request was made, but server responded with a status outside of the 2xx range
            console.error('Error response from server:', error.response);
            throw new Error(error.response.data.message || 'Failed to fetch questions');
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
            throw new Error('No response from server');
        } else {
            // Something else caused the error
            console.error('Error setting up the request:', error.message);
            throw new Error('Error in the request setup');
        }
    }
};
