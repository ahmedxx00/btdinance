import { RESET_PASS_OTP_LENGTH } from '../Constants/API_DB_Constants.js'

const start = 1 * Math.pow(10,RESET_PASS_OTP_LENGTH-1);
const end = 9 * Math.pow(10,RESET_PASS_OTP_LENGTH-1);

export const generateOTP = async () => {
  return `${Math.floor(start + Math.random() * end)}`;
};
