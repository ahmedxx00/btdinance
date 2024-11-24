import { encrypt } from "../../Constants/API_DB_Constants.js";
import {
  EMAIL_EDIT_SUCCESSFUL,
  WRONG_KEY,
} from "../../Constants/Error_Constants.js";
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
              msg: WRONG_KEY,
            });
          } else {
            let encKey = await encrypt(key);
            if (encKey == user.key) {
              updateUserEmail(id, email)
                .then(() => {
                  res.json({
                    success: true,
                    msg: EMAIL_EDIT_SUCCESSFUL,
                  });
                })
                .catch((errMsg1) => {
                  console.log(errMsg1);
                  res.json({
                    success: false,
                    msg: errMsg1 ? errMsg1 : "error",
                  });
                });
            } else {
              res.json({
                success: false,
                msg: WRONG_KEY,
              });
            }
          }
        })
        .catch((errMsg2) => {
          console.log(errMsg2);
          res.json({
            success: false,
            msg: errMsg2 ? errMsg2 : "error",
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
