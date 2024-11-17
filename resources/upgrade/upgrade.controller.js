import {
  getSingleMembership,
  buyMembershipWithUSDT,
} from "../../resources/membership/membership.model.js";
import { MEMBERSHIPS, USD_EURO_CONVERSION_RATE, WALLETS_CURRENCIES } from "../../Constants/API_DB_Constants.js";
import { getWalletForUserIdAndCurType } from "../wallet/wallet.model.js";

export const getSpecificUpgradePage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  let vipType = req.params.vip; //[vip1 || vip2 || vip3 || vip4 ]

  if (Object.values(MEMBERSHIPS).map(v => v.name).includes(vipType)) {
    getSingleMembership(vipType)
      .then((membership) => {


        getWalletForUserIdAndCurType(id,WALLETS_CURRENCIES.USDT.name).then((wallet) => {
          res.render("specific_upgrade.ejs", {
            isLoggedIn: true,
            isAdmin: isAdmin,
            wallet : wallet,
            euro_conv_rate : USD_EURO_CONVERSION_RATE,
            membership: membership,
          });
        }).catch((err) => {
          res.redirect("/upgrade"); // back to upgrade page
        });
      })
      .catch((err) => {
        res.redirect("/upgrade"); // back to upgrade page
      });
  } else {
    res.redirect("/upgrade"); // back to upgrade page
  }
};

export const buyWithUSDT = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  let {vipType} = req.body ; //[vip1 || vip2 || vip3 || vip4 ]

  if (Object.values(MEMBERSHIPS).map(v => v.name).includes(vipType)) {
    buyMembershipWithUSDT(id, vipType)
      .then(() => {
        res.json({
          success: true,
          msg: "Done",
        });
      })
      .catch((errMsg) => {
        res.json({
          success: false,
          msg: errMsg ? errMsg : "error",
        });
      });
  } else {
    res.redirect("/upgrade"); // back to upgrade page
  }
};
