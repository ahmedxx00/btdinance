// [transaction ID/Hash | TXID | ]
//------------------------------------------
import mongoose from "mongoose";
import { DB_URI } from "../Constants/API_DB_Constants.js";
import { TRANSACTION_ID_ERROR } from "../Constants/Error_Constants.js";
const Schema = mongoose.Schema;
const transactionIDSchema = new Schema({
  user_name: {
    type: String,
  },
  cur_type: {
    type: String,
  },
  transaction_id: {
    type: String,
  },
});

//------------------------------------------
export const Transaction_ID = mongoose.model(
  "transaction_id",
  transactionIDSchema
);
//------------------------------------------

export const saveTransactionID = (user_name, cur_type, transaction_id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        Transaction_ID.find({
          cur_type: cur_type,
          transaction_id: transaction_id,
        })
          .then((TransactionIDDocument) => {
            if (TransactionIDDocument) {
              // one found before
              mongoose.disconnect();
              reject(TRANSACTION_ID_ERROR);
            } else {
              let newTransactionID = new Transaction_ID({
                user_name: user_name,
                cur_type: cur_type,
                transaction_id: transaction_id,
              });

              newTransactionID
                .save()
                .then(() => {
                  mongoose.disconnect();
                  resolve();
                })
                .catch((err1) => {
                  console.log("err1 : " + err1);
                  mongoose.disconnect();
                  reject();
                });
            }
          })
          .catch((err2) => {
            console.log("err2 : " + err2);
            mongoose.disconnect();
            reject();
          });
      })
      .catch((err3) => {
        console.log("err3 : " + err3);
        mongoose.disconnect();
        reject();
      });
  });
};

