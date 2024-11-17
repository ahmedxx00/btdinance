import mongoose from "mongoose";
import { DB_URI } from "../Constants/API_DB_Constants.js";

//------------------------------------------
const Schema = mongoose.Schema;
const ratesSchema = new Schema({
  name: {
    type: String,
  },
  rates: {
    type: Object,
  },
});
//------------------------------------------
export const Conversion_Rates = mongoose.model("conversion_rate", ratesSchema);
//------------------------------------------

export const getConversionRates = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Conversion_Rates.findOne({ name: "rates" })
          .then((ratesDocument) => {
            mongoose.disconnect();
            resolve(ratesDocument);
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};
export const getSpecificCurrencyConversionRate = (cur_type) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Conversion_Rates.findOne({ name: "rates" })
          .then((ratesDocument) => {
            mongoose.disconnect();
            resolve(ratesDocument.rates[cur_type]);
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};

export const updateConversionRates = (ratesObject) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Conversion_Rates.findOneAndUpdate({ name: "rates" } , {rates : ratesObject},{upsert : true})
          .then(() => {
            mongoose.disconnect();
            resolve();
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};
