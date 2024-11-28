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