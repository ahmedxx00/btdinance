import {
  COOKIE_NAME,
  EXCHANGE_TO_FIXED,
  MEMBERSHIPS,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import { getAllMemberships } from "../membership/membership.model.js";
import { getUserById } from "../user/user.model.js";
import { getConversionRates } from "../../resources/conversion-rates/conversion_rates.model.js";

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
        getConversionRates()
          .then(async (ratesDocument) => {
            let fiats = Object.values(WALLETS_CURRENCIES).filter(
              (v) => v.isFiat
            );
            let fiats_names_array = fiats.map((v) => v.name);
            let crypto_wallets = user.wallets.filter((w) => w.isCrypto);
            //======================================================

            const promises = crypto_wallets.map((c_wlt) => {
              return new Promise((resolve, reject) => {
                let c_wlt_obj = c_wlt.toObject();
                let bb = [];
                fiats_names_array.forEach((f_name) => {
                  let fiatImg = fiats.find((v) => v.name == f_name).img;
                  bb.push({
                    name: f_name,
                    img: fiatImg,
                    rate:
                      parseFloat(
                        (1 / ratesDocument.rates[c_wlt_obj.currency]) *
                          ratesDocument.rates[f_name]
                      ).toFixed(EXCHANGE_TO_FIXED) * 1,
                  });
                });
                c_wlt_obj["conv_rates"] = bb;
                resolve(c_wlt_obj);
              });
            });
            //======================================================

            Promise.all(promises)
              .then((wallets_array) => {
                res.render("exchange.ejs", {
                  isLoggedIn: true,
                  isAdmin: isAdmin,
                  wallets_array: wallets_array,
                });
              })
              .catch((err1) => {
                console.log("err1 : " + err1);
                res.redirect("/");
              });
          })
          .catch((err2) => {
            console.log("err2 : " + err2);
            res.redirect("/");
          });
      })
      .catch((err3) => {
        console.log("err3 : " + err3);
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
