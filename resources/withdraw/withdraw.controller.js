import {
  decrypt,
  validAmount,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";

import { getWithdrawNetworksOfSpecificCurrency } from "../crypto-networks/crypto-networks.model.js";
import { getUserById } from "../user/user.model.js";
import {
  getWalletForUserIdAndCurType,
  withdrawFromWallet,
} from "../wallet/wallet.model.js";

export const getSpecificWithdrawPage = (req, res, next) => {
  let cur_type = req.params.cur_type;
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  if (id) {
    if (
      Object.values(WALLETS_CURRENCIES)
        .map((v) => v.name)
        .includes(cur_type)
    ) {
      // get that specific wallet of this use

      getWalletForUserIdAndCurType(id, cur_type)
        .then((wallet) => {
          let curImg = Object.values(WALLETS_CURRENCIES).find(
            (v) => v.name === cur_type
          ).img;

          if (
            Object.values(WALLETS_CURRENCIES)
              .filter((v) => v.isCrypto)
              .map((v) => v.name)
              .includes(cur_type)
          ) {
            // is crypto

            getWithdrawNetworksOfSpecificCurrency(cur_type)
              .then((networks) => {
                res.render("specific_withdraw.ejs", {
                  isLoggedIn: true,
                  isAdmin: isAdmin,
                  curImg: curImg ? curImg : "/usdt.svg",
                  cur_type: cur_type,
                  wallet: wallet,
                  networks: networks,

                  na: req.t("nav_bar.nav_btns.nav_about"),
                  nex: req.t("nav_bar.nav_btns.nav_ex"),
                  ntr: req.t("nav_bar.nav_btns.nav_tr"),
                  nwith: req.t("nav_bar.nav_btns.nav_with"),
                  ndep: req.t("nav_bar.nav_btns.nav_dep"),
                  nhm: req.t("nav_bar.nav_btns.nav_hm"),
                  lgt: req.t("nav_bar.logout_tit"),

                  tit: req.t("specific_with.tit"),
                  av1: req.t("specific_with.av1"),
                  recp_add: req.t("specific_with.recp_add"),
                  recp_add_plc: req.t("specific_with.recp_add_plc"),
                  am: req.t("specific_with.am"),
                  av2: req.t("specific_with.av2"),
                  nt_tp: req.t("specific_with.nt_tp"),
                  nt_slct: req.t("specific_with.nt_slct"),
                  sec: req.t("specific_with.sec"),
                  sec_plc: req.t("specific_with.sec_plc"),
                  btn: req.t("specific_with.btn"),
                });
              })
              .catch(() => {
                res.redirect("/withdraw"); // back to withdraw page
              });
          } else if (
            Object.values(WALLETS_CURRENCIES)
              .filter((v) => v.isFiat)
              .map((v) => v.name)
              .includes(cur_type)
          ) {
            // is Fiat
            res.render("specific_withdraw_fiat.ejs", {
              isLoggedIn: true,
              isAdmin: isAdmin,
              curImg: curImg ? curImg : "/usd.svg",
              cur_type: cur_type,
              wallet: wallet,

              na: req.t("nav_bar.nav_btns.nav_about"),
              nex: req.t("nav_bar.nav_btns.nav_ex"),
              ntr: req.t("nav_bar.nav_btns.nav_tr"),
              nwith: req.t("nav_bar.nav_btns.nav_with"),
              ndep: req.t("nav_bar.nav_btns.nav_dep"),
              nhm: req.t("nav_bar.nav_btns.nav_hm"),
              lgt: req.t("nav_bar.logout_tit"),

              tit: req.t("specific_with_fiat.tit"),
              av1: req.t("specific_with_fiat.av1"),
              iban: req.t("specific_with_fiat.iban"),
              iban_plc: req.t("specific_with_fiat.iban_plc"),
              swft: req.t("specific_with_fiat.swft"),
              swft_plc: req.t("specific_with_fiat.swft_plc"),
              am: req.t("specific_with_fiat.am"),
              av2: req.t("specific_with_fiat.av2"),
              sec: req.t("specific_with_fiat.sec"),
              sec_plc: req.t("specific_with_fiat.sec_plc"),
              btn: req.t("specific_with_fiat.btn"),
            });
          }
        })
        .catch((err) => {
          res.redirect("/withdraw"); // back to withdraw page
        });
    } else {
      res.redirect("/withdraw"); // back to withdraw page
    }
  } else {
    res.redirect("/withdraw"); // back to withdraw page
  }
};

export const withdrawCurrency = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const {
    cur_type,
    recipient_address,
    key,
    network_name,
    network_fee,
    total,
    received,
  } = req.body;

  if (id) {
    if (
      cur_type &&
      recipient_address &&
      key &&
      network_name &&
      network_fee &&
      total &&
      received
    ) {
      if (
        Object.values(WALLETS_CURRENCIES)
          .filter((v) => v.isCrypto)
          .map((v) => v.name)
          .includes(cur_type)
      ) {
        if (validAmount(total)) {
          getUserById(id)
            .then(async (user) => {
              if (user.isOur) {
                res.json({
                  success: false,
                  msg: req.t("WRONG_KEY"),
                });
              } else {
                let plain_key = await decrypt(user.key);
                if (plain_key === key) {
                  if (user.vip > 0) {
                    withdrawFromWallet(id, cur_type, total)
                      .then((msg) => {
                        res.json({
                          success: true,
                          msg: req.t("WITHDRAW_SUCCESSFUL"),
                          redirectUrl: "/withdraw",
                        });
                      })
                      .catch((errMsg1) => {
                        res.json({
                          success: false,
                          msg: errMsg1 ? req.t(errMsg1) : "error",
                        });
                      });
                  } else {
                    res.json({
                      success: false,
                      msg: req.t("YOU_MUST_BE_VIP1_TO_WITHDRAW"),
                      hint: "vip",
                    });
                  }
                } else {
                  res.json({
                    success: false,
                    msg: req.t("WRONG_KEY"),
                  });
                }
              }
            })
            .catch((errMsg2) => {
              res.json({
                success: false,
                msg: errMsg2 ? req.t(errMsg2) : "error",
              });
            });
        } else {
          res.json({
            success: false,
            msg: req.t("WRONG_AMOUNT"),
          });
        }
      } else {
        res.json({
          success: false,
          msg: "error",
        });
      }
    } else {
      res.json({
        success: false,
        msg: req.t("Empty_Credentials_ERROR"),
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};

export const withdrawFiatCurrency = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, key, iban, swift, total } = req.body;

  if (id) {
    if (cur_type && key && iban && swift && total) {
      if (
        Object.values(WALLETS_CURRENCIES)
          .filter((v) => v.isFiat)
          .map((v) => v.name)
          .includes(cur_type)
      ) {
        if (validAmount(total)) {
          getUserById(id)
            .then(async (user) => {
              if (user.isOur) {
                res.json({
                  success: false,
                  msg: req.t("WRONG_KEY"),
                });
              } else {
                let plain_key = await decrypt(user.key);
                if (plain_key === key) {
                  if (user.vip > 0) {
                    withdrawFromWallet(id, cur_type, total)
                      .then((msg) => {
                        res.json({
                          success: true,
                          msg: msg,
                          redirectUrl: "/withdraw",
                        });
                      })
                      .catch((errMsg1) => {
                        res.json({
                          success: false,
                          msg: errMsg1 ? req.t(errMsg1) : "error",
                        });
                      });
                  } else {
                    res.json({
                      success: false,
                      msg: req.t("YOU_MUST_BE_VIP1_TO_WITHDRAW"),
                      hint: "vip",
                    });
                  }
                } else {
                  res.json({
                    success: false,
                    msg: req.t("WRONG_KEY"),
                  });
                }
              }
            })
            .catch((errMsg2) => {
              res.json({
                success: false,
                msg: errMsg2 ? req.t(errMsg2) : "error",
              });
            });
        } else {
          res.json({
            success: false,
            msg: req.t("WRONG_AMOUNT"),
          });
        }
      } else {
        res.json({
          success: false,
          msg: "error",
        });
      }
    } else {
      res.json({
        success: false,
        msg: req.t("Empty_Credentials_ERROR"),
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};
