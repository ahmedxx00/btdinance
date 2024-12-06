import {
  WALLETS_CURRENCIES,
  validAmount,
} from "../../Constants/API_DB_Constants.js";

import {
  getUserByIdAndTheOneToTransferToByEmail,
  getUserByIdAndTheOneToTransferToByName,
} from "../user/user.model.js";
import {
  getWalletForUserIdAndCurType,
  transferBetweenTwoWallets,
} from "../wallet/wallet.model.js";

export const getSpecificTransferPage = (req, res, next) => {
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
          res.render("specific_transfer.ejs", {
            isLoggedIn: true,
            isAdmin: isAdmin,
            curImg: curImg ? curImg : "/usdt.svg",
            cur_type: cur_type,
            wallet: wallet,

            na: req.t("nav_bar.nav_btns.nav_about"),
            nex: req.t("nav_bar.nav_btns.nav_ex"),
            ntr: req.t("nav_bar.nav_btns.nav_tr"),
            nwith: req.t("nav_bar.nav_btns.nav_with"),
            ndep: req.t("nav_bar.nav_btns.nav_dep"),
            nhm: req.t("nav_bar.nav_btns.nav_hm"),
            lgt: req.t("nav_bar.logout_tit"),

            tit: req.t("specific_transfer.tit"),
            av: req.t("specific_transfer.av"),
            nm: req.t("specific_transfer.nm"),
            em: req.t("specific_transfer.em"),
            nm_nt: req.t("specific_transfer.nm_nt"),
            nm_plc: req.t("specific_transfer.nm_plc"),
            am_tit: req.t("specific_transfer.am_tit"),
            btn: req.t("specific_transfer.btn"),
            em_nt: req.t("specific_transfer.em_nt"),
            em_plc: req.t("specific_transfer.em_plc"),
          });
        })
        .catch((err) => {
          res.redirect("/transfer"); // back to transfer page
        });
    } else {
      res.redirect("/transfer"); // back to transfer page
    }
  } else {
    res.redirect("/transfer"); // back to transfer page
  }
};

export const transferToName = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, nameOrEmail, amount } = req.body;

  if (id) {
    if (cur_type && nameOrEmail && amount) {
      if (
        Object.values(WALLETS_CURRENCIES)
          .map((v) => v.name)
          .includes(cur_type)
      ) {
        if (validAmount(amount)) {
          getUserByIdAndTheOneToTransferToByName(id, nameOrEmail)
            .then(({ user, userToTransferTo }) => {
              if (user.name !== userToTransferTo.name) {
                let userWallet = user.wallets.find(
                  (wallet) => wallet.currency == cur_type
                );
                let userToTransferToWallet = userToTransferTo.wallets.find(
                  (wallet) => wallet.currency == cur_type
                );

                if (parseFloat(userWallet.available) >= parseFloat(amount)) {
                  transferBetweenTwoWallets(
                    id,
                    userToTransferTo._id,
                    userToTransferTo.name,
                    user.vip,
                    userToTransferTo.vip,
                    userWallet,
                    userToTransferToWallet, // may be null
                    userToTransferTo.name, // his name
                    cur_type,
                    amount,
                    user.isOur
                  )
                    .then(() => {
                      res.json({
                        success: true,
                        msg: req.t("TRANSFER_SUCCESSFUL"),
                        redirectUrl: "/transfer",
                      });
                    })
                    .catch((errMsg1) => {
                      if (errMsg1 && errMsg1.m == "basic_exceed") {
                        res.json({
                          success: false,
                          msg: req.t("BASIC_TRANSFER_LIMIT_ERROR", {
                            receiverNameOrEmail: errMsg1.a,
                            maxToBeInWallet: errMsg1.b,
                            cur_type: errMsg1.c,
                          }),
                        });
                      } else {
                        res.json({
                          success: false,
                          msg: errMsg1 ? req.t(errMsg1) : "error",
                        });
                      }
                    });
                } else {
                  res.json({
                    success: false,
                    msg: req.t("NOT_SUFFICIENT_AMOUNT"),
                  });
                }
              } else {
                res.json({
                  success: false,
                  msg: req.t("YOU_CANT_TRANSFER_TO_YOURSELF"),
                });
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

export const transferToEmail = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, nameOrEmail, amount } = req.body;

  if (id) {
    if (cur_type && nameOrEmail && amount) {
      if (
        Object.values(WALLETS_CURRENCIES)
          .map((v) => v.name)
          .includes(cur_type)
      ) {
        if (validAmount(amount)) {
          getUserByIdAndTheOneToTransferToByEmail(id, nameOrEmail)
            .then(({ user, userToTransferTo }) => {
              if (user.email !== userToTransferTo.email) {
                let userWallet = user.wallets.find(
                  (wallet) => wallet.currency == cur_type
                );
                let userToTransferToWallet = userToTransferTo.wallets.find(
                  (wallet) => wallet.currency == cur_type
                );

                if (parseFloat(userWallet.available) >= parseFloat(amount)) {
                  transferBetweenTwoWallets(
                    id,
                    userToTransferTo._id,
                    userToTransferTo.name,
                    user.vip,
                    userToTransferTo.vip,
                    userWallet,
                    userToTransferToWallet, // may be null
                    userToTransferTo.email, // his email
                    cur_type,
                    amount,
                    user.isOur
                  )
                    .then(() => {
                      res.json({
                        success: true,
                        msg: req.t("TRANSFER_SUCCESSFUL"),
                        redirectUrl: "/transfer",
                      });
                    })
                    .catch((errMsg1) => {
                      if (errMsg1 && errMsg1.m == "basic_exceed") {
                        res.json({
                          success: false,
                          msg: req.t("BASIC_TRANSFER_LIMIT_ERROR", {
                            receiverNameOrEmail: errMsg1.a,
                            maxToBeInWallet: errMsg1.b,
                            cur_type: errMsg1.c,
                          }),
                        });
                      } else {
                        res.json({
                          success: false,
                          msg: errMsg1 ? req.t(errMsg1) : "error",
                        });
                      }
                    });
                } else {
                  res.json({
                    success: false,
                    msg: req.t("NOT_SUFFICIENT_AMOUNT"),
                  });
                }
              } else {
                res.json({
                  success: false,
                  msg: req.t("YOU_CANT_TRANSFER_TO_YOURSELF"),
                });
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

/* ---- restrict transfer to vip1 or more only -----------
export const transferToName = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, nameOrEmail, amount } = req.body;

  if (cur_type && nameOrEmail && amount) {
    if (Object.values(WALLETS_CURRENCIES).map(v => v.name).includes(cur_type)) {
      if (validAmount(amount)) {
        getUserByIdAndTheOneToTransferToByName(id, nameOrEmail)
          .then(({ user, userToTransferTo }) => {
            if (user.vip > 0) {
              if (userToTransferTo.vip > 0) {
                if (user.name !== userToTransferTo.name) {
                  let userWallet = user.wallets.find(
                    (wallet) => wallet.currency == cur_type
                  );

                  if (parseFloat(userWallet.available) > parseFloat(amount)) {
                    transferBetweenTwoWallets(
                      id,
                      userToTransferTo._id,
                      cur_type,
                      amount
                    )
                      .then(() => {
                        res.json({
                          success: true,
                          msg: TRANSFER_SUCCESSFUL,
                          redirectUrl: "/transfer",
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
                      msg: NOT_SUFFICIENT_AMOUNT,
                    });
                  }
                } else {
                  res.json({
                    success: false,
                    msg: YOU_CANT_TRANSFER_TO_YOURSELF,
                  });
                }
              } else {
                res.json({
                  success: false,
                  msg: HE_MUST_BE_VIP1,
                });
              }
            } else {
              res.json({
                success: false,
                msg: YOU_MUST_BE_VIP1,
              });
            }
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
    } else {
     res.json({
        success: false,
        msg: 'error',
      });
    }
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
    });
  }
};
export const transferToEmail = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, nameOrEmail, amount } = req.body;

  if (cur_type && nameOrEmail && amount) {
    if (Object.values(WALLETS_CURRENCIES).map(v => v.name).includes(cur_type)) {
      if (validAmount(amount)) {
        getUserByIdAndTheOneToTransferToByEmail(id, nameOrEmail)
          .then(({ user, userToTransferTo }) => {
            if (user.vip > 0) {
              if (userToTransferTo.vip > 0) {
                if (user.email !== userToTransferTo.email) {
                  let userWallet = user.wallets.find(
                    (wallet) => wallet.currency == cur_type
                  );

                  if (parseFloat(userWallet.available) > parseFloat(amount)) {
                    transferBetweenTwoWallets(
                      id,
                      userToTransferTo._id,
                      cur_type,
                      amount
                    )
                      .then(() => {
                        res.json({
                          success: true,
                          msg: TRANSFER_SUCCESSFUL,
                          redirectUrl: "/transfer",
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
                      msg: NOT_SUFFICIENT_AMOUNT,
                    });
                  }
                } else {
                  res.json({
                    success: false,
                    msg: YOU_CANT_TRANSFER_TO_YOURSELF,
                  });
                }
              } else {
                res.json({
                  success: false,
                  msg: HE_MUST_BE_VIP1,
                });
              }
            } else {
              res.json({
                success: false,
                msg: YOU_MUST_BE_VIP1,
              });
            }
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
    } else {
        res.json({
        success: false,
        msg: 'error',
      });
    }
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
    });
  }
};
*/
