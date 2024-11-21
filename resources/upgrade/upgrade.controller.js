import { getSingleMembership } from "../../resources/membership/membership.model.js";
import {
  MEMBERSHIPS,
  WALLETS_CURRENCIES,
} from "../../Constants/API_DB_Constants.js";
import { getConversionRates } from "../../other-models/conversion_rates.model.js";
import {
  getDepositNetworksNamesOf_USDT_BTC_ETH,
  getSingleDepositNetworkAddress,
} from "../crypto-networks/crypto-networks.model.js";
import {
  Empty_Credentials_ERROR,
  TRANSACTION_ID_SAVED,
  WRONG_AMOUNT,
} from "../../Constants/Error_Constants.js";

import url from "url";
import { getUserNameById, User } from "../user/user.model.js";
import { saveTransactionID } from "../../other-models/transaction_id.model.js";

export const getSpecificUpgradePage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  let vip_type = req.params.vip; //[vip1 || vip2 || vip3 || vip4 ]

  if (
    Object.values(MEMBERSHIPS)
      .map((v) => v.name)
      .includes(vip_type)
  ) {
    getSingleMembership(vip_type)
      .then((membership) => {
        getConversionRates()
          .then((ratesDocument) => {
            let usdt_rate = ratesDocument.rates[WALLETS_CURRENCIES.USDT.name],
              btc_rate = ratesDocument.rates[WALLETS_CURRENCIES.Bitcoin.name],
              eth_rate = ratesDocument.rates[WALLETS_CURRENCIES.Ethereum.name];

            let usdt_price =
                parseFloat(membership.fee * usdt_rate).toFixed(10) * 1,
              btc_price = parseFloat(membership.fee * btc_rate).toFixed(10) * 1,
              eth_price = parseFloat(membership.fee * eth_rate).toFixed(10) * 1;

            let usdt_img = WALLETS_CURRENCIES.USDT.img,
              btc_img = WALLETS_CURRENCIES.Bitcoin.img,
              eth_img = WALLETS_CURRENCIES.Ethereum.img;

            getDepositNetworksNamesOf_USDT_BTC_ETH()
              .then(
                ({
                  usdt_networks_names,
                  btc_networks_names,
                  eth_networks_names,
                }) => {
                  res.render("specific_upgrade.ejs", {
                    isLoggedIn: true,
                    isAdmin: isAdmin,
                    usdt_cur_type: WALLETS_CURRENCIES.USDT.name,
                    usdt_price: usdt_price,
                    usdt_img: usdt_img,
                    usdt_networks_names: usdt_networks_names,
                    btc_cur_type: WALLETS_CURRENCIES.Bitcoin.name,
                    btc_price: btc_price,
                    btc_img: btc_img,
                    btc_networks_names: btc_networks_names,
                    eth_cur_type: WALLETS_CURRENCIES.Ethereum.name,
                    eth_price: eth_price,
                    eth_img: eth_img,
                    eth_networks_names: eth_networks_names,
                    membership: membership,
                  });
                }
              )
              .catch((err) => {
                res.redirect("/upgrade"); // back to upgrade page
              });
          })
          .catch((err) => {
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

export const getSpecificConfirmUpgradePage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  let { vip_type, cur_type, network_name, price, dep_address } = req.query;

  if (id && vip_type && cur_type && network_name && price && dep_address) {
    res.render("specific_confirm_upgrade.ejs", {
      isLoggedIn: true,
      isAdmin: isAdmin,
      vip_type: vip_type,
      cur_type: cur_type,
      network_name: network_name,
      price: price,
      dep_address: dep_address,
    });
  } else {
    res.redirect("/upgrade");
  }
};

// from Ajax
export const payVip = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { vip_type, cur_type, network_name, price } = req.body;

  if (id) {
    if (vip_type && cur_type && network_name && price) {
      if (
        Object.values(MEMBERSHIPS)
          .map((v) => v.name)
          .includes(vip_type)
      ) {
        if (
          Object.values(WALLETS_CURRENCIES)
            .map((v) => v.name)
            .includes(cur_type)
        ) {
          getSingleMembership(vip_type)
            .then((membership) => {
              getConversionRates()
                .then((ratesDocument) => {
                  let cur_type_rate = ratesDocument.rates[cur_type];
                  let cur_type_price =
                    parseFloat(membership.fee * cur_type_rate).toFixed(10) * 1;

                  if (parseFloat(price) == cur_type_price) {
                    getSingleDepositNetworkAddress(cur_type, network_name)
                      .then((our_deposit_address) => {
                        res.json({
                          success: true,
                          msg: "Done",
                          redirectUrl: url.format({
                            pathname: "/upgrade/confirm-upgrade",
                            query: {
                              vip_type: vip_type,
                              cur_type: cur_type,
                              network_name: network_name,
                              price: price,
                              dep_address: our_deposit_address,
                            },
                          }),
                        });
                      })
                      .catch((errMsg1) => {
                        res.json({
                          success: false,
                          msg: errMsg1 ? errMsg1 : "error",
                        });
                      });
                  } else {
                    res.json({
                      success: false,
                      msg: WRONG_AMOUNT,
                    });
                  }
                })
                .catch((errMsg2) => {
                  res.json({
                    success: false,
                    msg: errMsg2 ? errMsg2 : "error",
                  });
                });
            })
            .catch((errMsg3) => {
              res.json({
                success: false,
                msg: errMsg3 ? errMsg3 : "error",
              });
            });
        } else {
          res.json({
            success: false,
            msg: "error",
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
        msg: Empty_Credentials_ERROR,
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};

// from Ajax
export const confirmTransaction = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, amount, network_name, vip_needed, transaction_id } = req.body;

  if (id) {
    if (cur_type && amount && network_name && vip_needed && transaction_id) {
      if (
        Object.values(MEMBERSHIPS)
          .map((v) => v.name)
          .includes(vip_needed)
      ) {
        if (
          Object.values(WALLETS_CURRENCIES)
            .map((v) => v.name)
            .includes(cur_type)
        ) {
          getSingleMembership(vip_needed)
            .then((needed_membership) => {
              getConversionRates()
                .then((ratesDocument) => {
                  let cur_type_rate = ratesDocument.rates[cur_type];
                  let cur_type_price =
                    parseFloat(needed_membership.fee * cur_type_rate).toFixed(
                      10
                    ) * 1;

                  if (parseFloat(amount) == cur_type_price) {
                    getUserNameById(id)
                      .then((name) => {
                        saveTransactionID(
                          name,
                          cur_type,
                          amount,
                          network_name,
                          vip_needed,
                          transaction_id
                        )
                          .then(() => {
                            res.json({
                              success: true,
                              msg: TRANSACTION_ID_SAVED(vip_needed),
                              redirectUrl: "/upgrade",
                            });
                          })
                          .catch((errMsg1) => {
                            res.json({
                              success: false,
                              msg: errMsg1 ? errMsg1 : "error",
                            });
                          });
                      })
                      .catch((errMsg2) => {
                        res.json({
                          success: false,
                          msg: errMsg2 ? errMsg2 : "error",
                        });
                      });
                  } else {
                    res.json({
                      success: false,
                      msg: WRONG_AMOUNT,
                    });
                  }
                })
                .catch((errMsg3) => {
                  res.json({
                    success: false,
                    msg: errMsg3 ? errMsg3 : "error",
                  });
                });
            })
            .catch((errMsg4) => {
              res.json({
                success: false,
                msg: errMsg4 ? errMsg4 : "error",
              });
            });
        } else {
          res.json({
            success: false,
            msg: "error",
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
        msg: Empty_Credentials_ERROR,
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};
