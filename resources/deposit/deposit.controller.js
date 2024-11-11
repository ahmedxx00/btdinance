import { WALLETS_CURRENCY_NAMES } from "../../Constants/API_DB_Constants.js";
import { Empty_Credentials_ERROR } from "../../Constants/Error_Constants.js";
import {
  getDepositNetworksOfSpecificCurrency,
  getSingleDepositNetworkAddress,
} from "../crypto-networks/crypto-networks.model.js";

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

export const depositCurrency = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, network_name } = req.body;

  if (cur_type && network_name) {
    if (Object.values(WALLETS_CURRENCY_NAMES).includes(cur_type)) {
      getSingleDepositNetworkAddress(cur_type, network_name)
        .then((deposit_address) => {
          res.json({
            success: true,
            msg: deposit_address,
          });
        })
        .catch((errMsg) => {
          res.json({
            success: false,
            msg: errMsg ? errMsg : "error",
          });
        });
    } else {
      res.redirect("/deposit"); // back to deposit page
    }
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
    });
  }
};
