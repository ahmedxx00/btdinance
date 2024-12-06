import { createOrupdateConversionRateByCurType, removeConversionRateByCurType } from "./conversion_rates.model.js";

export const removeConvRate = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type } = req.body;

  if (id) {
    removeConversionRateByCurType(cur_type)
      .then(() => {
        res.json({
          success: true,
          msg: req.t('CONV_RATE_REMOVED'),
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
export const addOrUpdateConvRate = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;

  const { cur_type, rate } = req.body;

  if (id) {
    if (cur_type && rate) {
      createOrupdateConversionRateByCurType(cur_type, rate)
        .then(() => {
          res.json({
            success: true,
            msg: req.t('CONV_RATE_ADDED_UPDATED'),
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
      msg: "error",
    });
  }
};
