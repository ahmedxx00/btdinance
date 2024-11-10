import { WALLETS_CURRENCY_NAMES } from "../../Constants/API_DB_Constants.js";
import { getDepositNetworksOfSpecificCurrency} from "../crypto-networks/crypto-networks.model.js";


export const getSpecificDepositPage = (req, res, next) => {
  let cur_type = req.params.cur_type;
  let isAdmin = req.payload.isAdmin;

  if (Object.values(WALLETS_CURRENCY_NAMES).includes(cur_type)) {
    getDepositNetworksOfSpecificCurrency(cur_type)
      .then((networks) => {
        res.render("specific_deposit.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          cur_type: cur_type,
          networks: networks,
        });
      })
      .catch(() => {
        res.redirect("/deposit"); // back to deposit page
      });
  } else {
    res.redirect("/deposit"); // back to deposit page
  }
};
