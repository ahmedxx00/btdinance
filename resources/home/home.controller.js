import {
  COOKIE_NAME,
  MEMBERSHIPS,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import { getAllMemberships } from "../membership/membership.model.js";
import { getUserById } from "../user/user.model.js";
import {getConversionRates} from '../../other-models/conversion_rates.model.js';

export const getWithdrawPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    getUserById(id)
      .then((user) => {
        res.render("withdraw.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          wallets: user.wallets,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};

export const getDepositPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    res.render("deposit.ejs", {
      isLoggedIn: true,
      isAdmin: isAdmin,
      wallets_currencies: WALLETS_CURRENCIES,
    });
  } else {
    res.redirect("/");
  }
};

export const getTransferPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    getUserById(id)
      .then((user) => {
        res.render("transfer.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          wallets: user.wallets,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};

export const getUpgradePage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    getUserById(id)
      .then((user) => {
        getAllMemberships()
          .then((membershipsArray) => {
            let vipType = Object.keys(MEMBERSHIPS).find(
              (key) => MEMBERSHIPS[key].number == user.vip
            );

            res.render("upgrade.ejs", {
              isLoggedIn: true,
              isAdmin: isAdmin,
              vipType: vipType ? vipType : "Basic",
              vip: user.vip,
              membershipsArray: membershipsArray,
            });
          })
          .catch((err1) => {
            res.redirect("/");
          });
      })
      .catch((err2) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};


export const getExchangePage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    getUserById(id)
      .then((user) => {


        getConversionRates().then(async (ratesDocument) => {
          
          // user.wallets.forEach(wallet => {
          //   wallet['usd_conv_rate'] = ratesDocument.rates['USD'];// float
          //   wallet['euro_conv_rate'] = ratesDocument.rates['EURO'];// float
          // });
          let xx = await stashConvRates(user.wallets , ratesDocument);

          console.log(xx)
          console.log(ratesDocument)
          res.render("exchange.ejs", { isLoggedIn: true, isAdmin: isAdmin });

        }).catch((err1) => {
          res.redirect("/");

        });
        


      })
      .catch((err2) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};


// ---------------------
export const getMyAccountPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    getUserById(id)
      .then((user) => {
        let memImg = Object.values(MEMBERSHIPS).find(
          (v) => v.number == user.vip
        ).img;

        res.render("myaccount.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          user: user,
          memImg: memImg ? memImg : "/basic.png",
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};

export const logOut = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  res.clearCookie(COOKIE_NAME).redirect("/");
};


async function stashConvRates(wallets , ratesDocument) {
  let new_wallets = []
  wallets.forEach(wallet =>{
    wallet.usd_conv_rate = ratesDocument.rates['USD'];// float
    wallet.euro_conv_rate = ratesDocument.rates['EUR'];// float
    new_wallets.push(wallet)
    
  })
  return new_wallets;
}