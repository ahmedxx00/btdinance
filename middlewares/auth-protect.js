import { verifyTk } from "../helpers/jwt-helper.js";

//------------------------------------------------------------

const authProtect = async (req, res, next) => {
  let sc = req.signedCookies;

  if (sc["tk"]) {
    // there is a cookie with tk

    verifyTk(sc["tk"])
      .then((payload) => {
        // already logged in
        return res.redirect('/'); // back to home
      })
      .catch((errNOtVerified) => {
        return next();
      });
  } else {
    // no cookie with token or token is edited manually
    return next();
  }
};
export default authProtect;
