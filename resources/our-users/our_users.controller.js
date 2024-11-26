import { decrypt } from "../../Constants/API_DB_Constants.js";
import {
  EMAIL_EDIT_SUCCESSFUL,
  OUR_USER_ADDED,
  VIP_EDITED,
  WALLET_ADDED,
  WALLET_REMOVED,
  WALLET_UPDATED,
} from "../../Constants/Error_Constants.js";
import {
  CreateOurUser,
  getUserById,
  updateUserEmail,
  upgradeUserMembershipById,
} from "../user/user.model.js";
import {
  addWalletToUser,
  editWalletAvailable,
  walletRemove,
} from "../wallet/wallet.model.js";

export const editEmail = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id, email } = req.body;

  if (id) {
    // email can be empty
    updateUserEmail(user_id, email)
      .then(() => {
        res.json({
          success: true,
          msg: EMAIL_EDIT_SUCCESSFUL,
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
      msg: "error",
    });
  }
};
export const editVip = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id, vip } = req.body;

  let vipInt = parseInt(vip);

  if (id) {
    // email can be empty
    upgradeUserMembershipById(user_id, vipInt)
      .then(() => {
        res.json({
          success: true,
          msg: VIP_EDITED,
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
      msg: "error",
    });
  }
};
export const editWalletAv = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id, cur_type, amount } = req.body;

  if (id) {
    editWalletAvailable(user_id, cur_type, amount)
      .then(() => {
        res.json({
          success: true,
          msg: WALLET_UPDATED,
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
      msg: "error",
    });
  }
};
export const removeWallet = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id, wallet_id } = req.body;

  if (id) {
    walletRemove(user_id, wallet_id)
      .then(() => {
        res.json({
          success: true,
          msg: WALLET_REMOVED,
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
      msg: "error",
    });
  }
};

export const getPlainPass = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id } = req.query;

  if (id) {
    getUserById(user_id)
      .then(async (user) => {
        let plainPass = await decrypt(user.password);
        res.json({
          success: true,
          msg: plainPass,
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
      msg: "error",
    });
  }
};
export const getPlainKey = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id } = req.query;

  if (id) {
    getUserById(user_id)
      .then(async (user) => {
        let plainKey = await decrypt(user.key);
        res.json({
          success: true,
          msg: plainKey,
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
      msg: "error",
    });
  }
};

export const addWallet = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_id, user_name, cur_type } = req.body;

  if (id) {
    addWalletToUser(user_id, user_name, cur_type)
      .then(() => {
        res.json({
          success: true,
          msg: WALLET_ADDED,
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
      msg: "error",
    });
  }
};

export const addNewOurUser = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { name, email, vip, password, key } = req.body;

  if (id) {
    if (name && vip && password && key) {
      CreateOurUser(name, email, vip, password, key)
        .then(() => {
          res.json({
            success: true,
            msg: OUR_USER_ADDED,
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
        msg: "error",
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};
