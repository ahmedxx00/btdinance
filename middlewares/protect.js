
import { COOKIE_NAME } from '../Constants/API_DB_Constants.js';
import {verifyTk} from '../helpers/jwt-helper.js'

//------------------------------------------------------------ 

const protect = async (req, res, next) => {

  let sc = req.signedCookies;

  if (sc['tk']) {// there is a cookie with tk
    
    verifyTk(sc['tk']).then((payload) => {
      req.payload = payload; // { id : String , isAdmin: Boolean }
      return next()
    }).catch((errNOtVerified) => {
      return res.clearCookie(COOKIE_NAME).redirect('/auth');
      // return res.redirect('/auth')
    });

  } else {
    // no cookie with token or token is edited manually
    return res.clearCookie(COOKIE_NAME).redirect('/auth');

    // return res.redirect('/auth')
  }

};
export default protect;