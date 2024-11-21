import {
  WALLETS_CURRENCIES,
  validAmount,
} from "../../Constants/API_DB_Constants.js";
import {
  Empty_Credentials_ERROR,
  HE_MUST_BE_VIP1,
  NOT_SUFFICIENT_AMOUNT,
  TRANSFER_SUCCESSFUL,
  WRONG_AMOUNT,
  YOU_CANT_TRANSFER_TO_YOURSELF,
  YOU_MUST_BE_VIP1,
} from "../../Constants/Error_Constants.js";
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
        });
      })
      .catch((err) => {
        res.redirect("/transfer"); // back to transfer page
      });
  } else {
    res.redirect("/transfer"); // back to transfer page
  }
};

export const transferToName = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, nameOrEmail, amount } = req.body;

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
        msg: "error",
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
        msg: "error",
      });
    }
  } else {
    res.json({
      success: false,
      msg: Empty_Credentials_ERROR,
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
