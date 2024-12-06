import { Router } from "express";
const router = Router();

import {
  addDepositNetwork,
  addWithdrawNetwork,
  deleteDepositNetwork,
  deleteWithdrawNetwork,
  editDepositNetwork,
  editWithdrawNetwork,
} from "./crypto-networks.model.js";

router.post("/add_withdraw_network", (req, res, next) => {
  const { cur_type, name, fee, minimum_withdrawal, arrival_time } = req.body;

  addWithdrawNetwork(cur_type, name, fee, minimum_withdrawal, arrival_time)
    .then((x) => {
      res.json({
        success: true,
        msg: "added successfully",
        data: x, // html rendered string
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
});

router.put("/edit_withdraw_network", (req, res, next) => {
  const { id, cur_type, name, fee, minimum_withdrawal, arrival_time } =
    req.body;

  editWithdrawNetwork(id, cur_type, name, fee, minimum_withdrawal, arrival_time)
    .then((x) => {
      res.json({
        success: true,
        msg: "updated successfully",
        data: x, // html rendered string
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
});

router.delete("/delete_withdraw_network", (req, res, next) => {
  const { cur_type, id } = req.body;

  deleteWithdrawNetwork(cur_type, id)
    .then(() => {
      res.json({
        success: true,
        msg: "deleted successfully",
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
});

//----------------------------------------------------------------------------
router.post("/add_deposit_network", (req, res, next) => {
  const {
    cur_type,
    name,
    block_confirmations,
    minimum_deposit,
    est_arrival,
    our_deposit_address,
  } = req.body;

  addDepositNetwork(
    cur_type,
    name,
    block_confirmations,
    minimum_deposit,
    est_arrival,
    our_deposit_address
  )
    .then((x) => {
      res.json({
        success: true,
        msg: "added successfully",
        data: x, // html rendered string
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
});

router.put("/edit_deposit_network", (req, res, next) => {
  const {
    id,
    cur_type,
    name,
    block_confirmations,
    minimum_deposit,
    est_arrival,
    our_deposit_address,
  } = req.body;

  editDepositNetwork(
    id,
    cur_type,
    name,
    block_confirmations,
    minimum_deposit,
    est_arrival,
    our_deposit_address
  )
    .then((x) => {
      res.json({
        success: true,
        msg: "updated successfully",
        data: x, // html rendered string
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
});

router.delete("/delete_deposit_network", (req, res, next) => {
  const { cur_type, id } = req.body;

  deleteDepositNetwork(cur_type, id)
    .then(() => {
      res.json({
        success: true,
        msg: "deleted successfully",
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
});

export default router;
