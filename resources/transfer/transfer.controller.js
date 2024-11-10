import { WALLETS_CURRENCY_NAMES } from "../../Constants/API_DB_Constants.js";
import { getWalletForUserIdAndCurType } from "../wallet/wallet.model.js";

export const getSpecificTransferPage = (req, res, next) => {
  let cur_type = req.params.cur_type;
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (Object.values(WALLETS_CURRENCY_NAMES).includes(cur_type)) {

    // get that specific wallet of this use 

    getWalletForUserIdAndCurType(id,cur_type).then((wallet) => {
      
        res.render("specific_transfer.ejs", {
            isLoggedIn: true,
            isAdmin: isAdmin,
            cur_type: cur_type,
            wallet : wallet,
          });

    }).catch((err) => {
      res.redirect("/transfer"); // back to transfer page
    });

  



  } else {
    res.redirect("/transfer"); // back to transfer page
  }
};
