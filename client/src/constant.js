export const MAIN_URL = 'http://localhost:8080'
/* ---------------------------- ALL Auth API ---------------------------- */
export const LOGIN_API = '/login'
export const SEND_OTP_API = '/checkEmailId'
export const VERIFY_OTP_API = '/verifyOtp'
export const CHANGE_PASSWORD_API = '/changePassword'
export const REGISTER_API = '/signup'
export const CHANGE_PASSWORD = '/resetPassword'

/* ---------------------------- END Auth API ---------------------------- */
/* ---------------------------- ALL Permission API ---------------------------- */

export const GET_ALL_ROLE = '/role/getAllRole'
export const CHANGE_PERMISSION = '/role/changePermission'
export const GET_ROLE = '/role/getRolle'
export const ADD_ROLE = '/role/addRole'

/* ---------------------------- END Permission API ---------------------------- */
export const GET_USER = '/user/getUser'
export const ADD_USER = '/user/addUser'
export const DELETE_USER = '/user/deleteUser'
export const UPDATE_USER = '/user/updateUser'
