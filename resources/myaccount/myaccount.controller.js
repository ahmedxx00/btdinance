import { encrypt } from "../../Constants/API_DB_Constants.js";

import {
  getUserById,
  updateUserEmail,
} from "../user/user.model.js";

export const editEmail = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { email, key } = req.body;

  if (id) {
    // email can be empty
    if (key) {
      getUserById(id)
        .then(async (user) => {
          if (user.isOur) {
            res.json({
              success: false,
              msg: req.t('WRONG_KEY'),
            });
          } else {
            let encKey = await encrypt(key);
            if (encKey == user.key) {
              updateUserEmail(id, email)
                .then(() => {
                  res.json({
                    success: true,
                    msg: req.t('EMAIL_EDIT_SUCCESSFUL'),
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
                msg: req.t('WRONG_KEY'),
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
