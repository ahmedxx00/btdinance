import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: String,
  otp: String,
  created_at: Date,
  expires_at: Date,
});

export const OTP = mongoose.model("otp", OTPSchema);

// =============================================================
