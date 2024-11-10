import { verifyTk } from "../helpers/jwt-helper.js";

//------------------------------------------------------------

const homeProtect = async (req, res, next) => {
  let sc = req.signedCookies;

  if (sc["tk"]) { // there is a cookie with tk
    verifyTk(sc["tk"])
      .then((payload) => {
        req.payload = payload; // { id : String , isAdmin: Boolean }
        return next();
      })
      .catch((errNOtVerified) => {
        req.payload = null; // null
        return next();
      });
  } else {
    // no cookie with token or token is edited manually
    req.payload = null; // null
    return next();
  }
};

export default homeProtect;