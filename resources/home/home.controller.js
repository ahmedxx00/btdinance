import {
  COOKIE_NAME,
  EXCHANGE_TO_FIXED,
  MEMBERSHIPS,
  WALLETS_CURRENCIES,
  SITE_NAME,
  SITE_EMAIL,
} from "../../Constants/API_DB_Constants.js";
import { getAllMemberships } from "../membership/membership.model.js";
import { getUserById } from "../user/user.model.js";
import { getConversionRates } from "../conversion-rates/conversion_rates.model.js";

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
          na: req.t("nav_bar.nav_btns.nav_about"),
          nex: req.t("nav_bar.nav_btns.nav_ex"),
          ntr: req.t("nav_bar.nav_btns.nav_tr"),
          nwith: req.t("nav_bar.nav_btns.nav_with"),
          ndep: req.t("nav_bar.nav_btns.nav_dep"),
          nhm: req.t("nav_bar.nav_btns.nav_hm"),
          lgt: req.t("nav_bar.logout_tit"),
          cur_tp: req.t("withdraw.cur_tp"),
          av: req.t("withdraw.av"),
          btn: req.t("withdraw.btn"),
          no_wlts: req.t("withdraw.no_wlts"),
          can_dep_now: req.t("withdraw.can_dep_now"),
          dep: req.t("withdraw.dep"),
          p_tit: req.t("home.main_buttons.hwith"),
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
      na: req.t("nav_bar.nav_btns.nav_about"),
      nex: req.t("nav_bar.nav_btns.nav_ex"),
      ntr: req.t("nav_bar.nav_btns.nav_tr"),
      nwith: req.t("nav_bar.nav_btns.nav_with"),
      ndep: req.t("nav_bar.nav_btns.nav_dep"),
      nhm: req.t("nav_bar.nav_btns.nav_hm"),
      lgt: req.t("nav_bar.logout_tit"),
      p_tit: req.t("home.main_buttons.dep"),

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

          na: req.t("nav_bar.nav_btns.nav_about"),
          nex: req.t("nav_bar.nav_btns.nav_ex"),
          ntr: req.t("nav_bar.nav_btns.nav_tr"),
          nwith: req.t("nav_bar.nav_btns.nav_with"),
          ndep: req.t("nav_bar.nav_btns.nav_dep"),
          nhm: req.t("nav_bar.nav_btns.nav_hm"),
          lgt: req.t("nav_bar.logout_tit"),

          tit: req.t("transfer.tit"),
          av1: req.t("transfer.av1"),
          no_assts: req.t("transfer.no_assts"),
          can_dep_now: req.t("transfer.can_dep_now"),
          dep: req.t("transfer.dep"),
          p_tit: req.t("home.main_buttons.trns"),
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

              na: req.t("nav_bar.nav_btns.nav_about"),
              nex: req.t("nav_bar.nav_btns.nav_ex"),
              ntr: req.t("nav_bar.nav_btns.nav_tr"),
              nwith: req.t("nav_bar.nav_btns.nav_with"),
              ndep: req.t("nav_bar.nav_btns.nav_dep"),
              nhm: req.t("nav_bar.nav_btns.nav_hm"),
              lgt: req.t("nav_bar.logout_tit"),

              tit: req.t("upgrade.tit"),
              lmts: req.t("upgrade.lmts"),
              hwith: req.t("upgrade.hwith"),
              dep: req.t("upgrade.dep"),
              trans: req.t("upgrade.trans"),
              rec: req.t("upgrade.rec"),

              per_wlt: req.t("upgrade.per_wlt"),
              daily: req.t("upgrade.daily"),
              grntd: req.t("upgrade.grntd"),
              btn: req.t("upgrade.btn"),
              btm_note: req.t("upgrade.btm_note"),
              p_tit: req.t("home.main_buttons.up"),

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

                  na: req.t("nav_bar.nav_btns.nav_about"),
                  nex: req.t("nav_bar.nav_btns.nav_ex"),
                  ntr: req.t("nav_bar.nav_btns.nav_tr"),
                  nwith: req.t("nav_bar.nav_btns.nav_with"),
                  ndep: req.t("nav_bar.nav_btns.nav_dep"),
                  nhm: req.t("nav_bar.nav_btns.nav_hm"),
                  lgt: req.t("nav_bar.logout_tit"),

                  tit: req.t("exchange.tit"),
                  av1: req.t("exchange.av1"),
                  scrt: req.t("exchange.scrt"),
                  am_tit: req.t("exchange.am_tit"),
                  p_tit: req.t("home.main_buttons.ex"),

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

          na: req.t("nav_bar.nav_btns.nav_about"),
          nex: req.t("nav_bar.nav_btns.nav_ex"),
          ntr: req.t("nav_bar.nav_btns.nav_tr"),
          nwith: req.t("nav_bar.nav_btns.nav_with"),
          ndep: req.t("nav_bar.nav_btns.nav_dep"),
          nhm: req.t("nav_bar.nav_btns.nav_hm"),
          lgt: req.t("nav_bar.logout_tit"),

          nm: req.t("myaccount.pers_data.nm"),
          em: req.t("myaccount.pers_data.em"),

          tit: req.t("myaccount.wlts.tit"),
          av: req.t("myaccount.wlts.av"),
          hwith: req.t("myaccount.wlts.hwith"),
          dep: req.t("myaccount.wlts.dep"),
          trns: req.t("myaccount.wlts.trns"),
          p_tit: req.t("home.main_buttons.acc"),

        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};
export const getAboutPage = (req, res, next) => {
  if (req.payload && req.payload != null) {
    // logged in
    let isAdmin = req.payload.isAdmin;

    res.render("about.ejs", {
      isLoggedIn: true,
      isAdmin: isAdmin,
      site_name: SITE_NAME,
      site_email: SITE_EMAIL,

      na: req.t("nav_bar.nav_btns.nav_about"),
      nex: req.t("nav_bar.nav_btns.nav_ex"),
      ntr: req.t("nav_bar.nav_btns.nav_tr"),
      nwith: req.t("nav_bar.nav_btns.nav_with"),
      ndep: req.t("nav_bar.nav_btns.nav_dep"),
      nhm: req.t("nav_bar.nav_btns.nav_hm"),
      lgt: req.t("nav_bar.logout_tit"),
    });
  } else {
    // not logged in
    res.render("about.ejs", {
      site_name: SITE_NAME,
      site_email: SITE_EMAIL,

      na: req.t("nav_bar.nav_btns.nav_about"),
      nex: req.t("nav_bar.nav_btns.nav_ex"),
      ntr: req.t("nav_bar.nav_btns.nav_tr"),
      nwith: req.t("nav_bar.nav_btns.nav_with"),
      ndep: req.t("nav_bar.nav_btns.nav_dep"),
      nhm: req.t("nav_bar.nav_btns.nav_hm"),
      lgt: req.t("nav_bar.logout_tit"),
    });
  }
};

export const logOut = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  res.clearCookie(COOKIE_NAME).redirect("/");
};
