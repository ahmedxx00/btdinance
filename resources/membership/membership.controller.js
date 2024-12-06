import { MEMBERSHIPS } from "../../Constants/API_DB_Constants.js";

import {
  CreateMembership,
  membershipRemove,
  updateMaxDeposit,
  updateMaxReceive,
  updateMaxTransfer,
  updateMaxWithdraw,
  updateMemFee,
} from "./membership.model.js";

export const editFee = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { mem_id, fee } = req.body;

  if (id) {
    updateMemFee(mem_id, fee)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('FEE_EDITED'),
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
      msg: "error",
    });
  }
};
export const editMaxWithdraw = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { mem_id, max_withdraw } = req.body;

  if (id) {
    updateMaxWithdraw(mem_id, max_withdraw)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('MAX_WITHDRAW_EDITED'),
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
      msg: "error",
    });
  }
};
export const editMaxDeposit = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { mem_id, max_deposit } = req.body;

  if (id) {
    updateMaxDeposit(mem_id, max_deposit)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('MAX_DEPOSIT_EDITED'),
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
      msg: "error",
    });
  }
};
export const editMaxTransfer = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { mem_id, max_transfer } = req.body;

  if (id) {
    updateMaxTransfer(mem_id, max_transfer)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('MAX_TRANSFER_EDITED'),
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
      msg: "error",
    });
  }
};
export const editMaxReceive = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { mem_id, max_receive } = req.body;

  if (id) {
    updateMaxReceive(mem_id, max_receive)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('MAX_RECEIVE_EDITED'),
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
      msg: "error",
    });
  }
};

export const removeMembership = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { mem_id } = req.body;

  if (id) {
    membershipRemove(mem_id)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('MEM_REMOVED'),
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
      msg: "error",
    });
  }
};
export const addMembership = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { number, fee, max_withdraw, max_deposit, max_receive, max_transfer } =
    req.body;

  if (id) {
    if (
      Object.values(MEMBERSHIPS)
        .map((v) => v.number)
        .includes(number)
    ) {
      if (
        number &&
        fee &&
        max_withdraw &&
        max_deposit &&
        max_receive &&
        max_transfer
      ) {
        CreateMembership(
          number,
          fee,
          max_withdraw,
          max_deposit,
          max_receive,
          max_transfer
        )
          .then(() => {
            res.json({
              success: true,
              msg: req.t('MEM_ADDED'),
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
          msg: req.t('Empty_Credentials_ERROR'),
        });
      }
    } else {
      res.json({
        success: false,
        msg: req.t('WRONG_MEMBERSHIP_NUMBER'),
      });
    }
  } else {
    res.json({
      success: false,
      msg: "error",
    });
  }
};
