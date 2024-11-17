import { EMAIL_EDIT_SUCCESSFUL } from "../../Constants/Error_Constants.js";
import { updateUserEmail } from "../../resources/user/user.model.js";


export const editEmail = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { email } = req.body;

  updateUserEmail(id, email)
    .then(() => {
      res.json({
        success: true,
        msg: EMAIL_EDIT_SUCCESSFUL,
      });
    })
    .catch((errMsg) => {
      res.json({
        success: false,
        msg: errMsg ? errMsg : "error",
      });
    });
};
