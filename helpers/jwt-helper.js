import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  TOKEN_EXPIRE,
  decrypt,
  encrypt,
} from "../Constants/API_DB_Constants.js";

//--------------------- id used in Login----------------------
export const getTk = async (id, isAdmin) => {
  let plain_tk = jwt.sign({ id, isAdmin }, JWT_ACCESS_SECRET, {
    expiresIn: TOKEN_EXPIRE,
  });
  //-------- encrypt tokens before send in cookie -----
  let enc_tk = await encrypt(plain_tk);
  //---------------------------------------------------
  return enc_tk;
};
//---------------------------------------------------
//----------------------- is used in protect --------------------
export const verifyTk = (reqTk) => {
  return new Promise(async (resolve, reject) => {
    let plainTk = await decrypt(reqTk);
    try {
      let payload = jwt.verify(plainTk, JWT_ACCESS_SECRET);
      resolve(payload);
    } catch (err) {
      reject(err);
    }
  });
};
//---------------------------------------------------
