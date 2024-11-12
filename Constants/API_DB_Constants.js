// const DB_URI = "mongodb://localhost:27017/BTCDINANCE_DB";

//------------------------------------------------
export const DB_URI = "mongodb://127.0.0.1:27017/BTCDINANCE_DB";
//------------------------------------------------
export const BASIC_AUTH_NAME = "vegasnerva";
export const BASIC_AUTH_PASS = "@l#i$f%e";
//----------------------[PORT]--------------------------
export const PORT = 3001;
export const HOST = "127.0.0.1";
export const CRYPTO_ID = "vegasnerva";
export const CRYPTO_CUR = [
  // ['BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT','LTCUSDT','DOGEUSDT','TRXUSDT','USDCUSDT']
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "LTCUSDT",
  "DOGEUSDT",
  "TRXUSDT",
  "USDCUSDT",
];

// ---- can't be changed -----
export const WALLETS_CURRENCY_NAMES = {
  Bitcoin: "BTC",
  Ethereum: "ETH",
  Litecoin: "LTC",
  USDT: "USDT",
  BNB: "BNB",
  Dogecoin: "DOGE",
  Solana: "SOL",
  XRP: "XRP",
  TRON: "TRX",
  USDC: "USDC",
};
//----------------------------
export async function format_prc(num, symbol) {
  switch (symbol) {
    case "BTCUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    case "ETHUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    case "BNBUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    case "SOLUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    case "XRPUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    case "LTCUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    case "DOGEUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,5})?/)[0];
    case "TRXUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    case "USDCUSDT":
      return num.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    default:
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  }
}
//-----------------------using gmail -------------------------
export const GMAIL_SMTP_SERVER_ADDRESS = "smtp.gmail.com";
export const GMAIL_USER = "madoreal951@gmail.com";
export const GMAIL_PASS = "hpzm fuwa rqtg tjsn";

export const GMAIL_COMPANY_FROM_ADDRESS_pwd =
  "BTC Dinance [ Password Reset ] <madoreal951@gmail.com>";
//---------------------------- using outlook ---------------------
// export const OUTLOOK_SMTP_SERVER_ADDRESS = "smtp-mail.outlook.com";
// export const OUTLOOK_USER = "btcdinance@hotmail.com";
// export const OUTLOOK_PASS = "Lifeisastormmyyoungfriend2455";
// export const OUTLOOK_COMPANY_FROM_ADDRESS_pwd =
//   "BTC Dinance [ Password Reset ] <btcdinance@hotmail.com>";
//-------------------------------------------------

export const SUBJECT_pwd = "BTC Dinance Password Reset";
export const HTML_MSG = async (name, otp, duration) => {
  return /*html*/ `<p>Dear <b>${name}</b> we appreciate your worry about your forgotten password. <br>
          you can use this <b>code</b> to reset your password.</p>
          <br>
          <br>
          <p style ="color: orange; font-size:25px; letter-spacing:2px;"><b>${otp}</b></p>
          <br>
          <p>This code is valid for ${duration} hour .</p>
          <br>
          <br>
          <p>Best Regards</p>
          <p>BTC Dinance</p>
          `;
};

//################# Protect ################
//------- [ token ] ------------
export const JWT_ACCESS_SECRET = "Lifeisastormmyyoungfriend2455#";
export const TOKEN_EXPIRE = "7d";
//------- [ cookie ] ------------
export const COOKIE_NAME = "tk";
export const COOKIE_SIGNING_SECRET = "vegasnerva";
export const COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000; // 7 days
export const CookieOptions = {
  httpOnly: true,
  signed: true,
  maxAge: COOKIE_EXPIRE,
};
//###########################################

import crypto from "crypto";
const encrypt_decrypt_key = "25lkoiy251lkojiu25lkoiy251lkojiu";
const encrypt_decrypt_iv = "25lkoiy251lkojiu";

export const encrypt = async function encrypt(text) {
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    encrypt_decrypt_key,
    encrypt_decrypt_iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted.toString();
};

export const decrypt = async function decrypt(encryptedText) {
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encrypt_decrypt_key,
    encrypt_decrypt_iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted.toString();
};

export const RESET_PASS_OTP_LENGTH = 4;

export function validAmount(value) {
  // Allow digits && '.' only && only one leading zero before dot using a RegExp.
  return /^(?!0\d)\d+(?:\.\d+)?$/.test(value);
}
