import {
  updateTransactionIDAndUpgradeUser,
  deleteTransactionId,
} from "./transaction_id.model.js";


export const setDoneAndUpgradeUser = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { user_name, vip_needed, transaction_doc_id } = req.body;

  updateTransactionIDAndUpgradeUser(user_name, vip_needed, transaction_doc_id)
    .then(() => {
      res.json({
        success: true,
        msg: req.t('UPGRADED_USER'),
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
};

export const deleteTransactionDoc = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { transaction_doc_id } = req.body;

  deleteTransactionId(transaction_doc_id)
    .then(() => {
      res.json({
        success: true,
        msg: req.t('TRANSACTION_DOC_DELETED'),
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? req.t(errMsg) : "error",
      });
    });
};
