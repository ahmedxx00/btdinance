import mongoose from "mongoose";
import ejs from "ejs";
import {
  DB_URI,
  WALLETS_CURRENCY_NAMES,
} from "../../Constants/API_DB_Constants.js";
import {
  NO_DEPOSIT_ADDRESS_AVAILABLE,
  NO_NETWORK_WITH_THAT_NAME,
} from "../../Constants/Error_Constants.js";
const Schema = mongoose.Schema;

const withdrawNetworkSchema = new Schema({
  name: { type: String, required: true },
  fee: { type: String, default: "0.0" },
  minimum_withdrawal: { type: String, default: "0.0" },
  arrival_time: { type: String, required: false },
});

const depositNetworkSchema = new Schema({
  name: { type: String, required: true },
  block_confirmations: { type: String, default: "1" },
  minimum_deposit: { type: String, default: "0.0" },
  est_arrival: { type: String, required: false },
  our_deposit_address: { type: String, required: false },
});

//====================== withdraw networks =======================
const Bitcoin_Withdraw_Network = mongoose.model(
  "bitcoin_withdraw_network",
  withdrawNetworkSchema
);

const Ethereum_Withdraw_Network = mongoose.model(
  "ethereum_withdraw_network",
  withdrawNetworkSchema
);

const USDT_Withdraw_Network = mongoose.model(
  "usdt_withdraw_network",
  withdrawNetworkSchema
);
const BNB_Withdraw_Network = mongoose.model(
  "bnb_withdraw_network",
  withdrawNetworkSchema
);
const Litecoin_Withdraw_Network = mongoose.model(
  "litecoin_withdraw_network",
  withdrawNetworkSchema
);
const Dogecoin_Withdraw_Network = mongoose.model(
  "dogecoin_withdraw_network",
  withdrawNetworkSchema
);
const Solana_Withdraw_Network = mongoose.model(
  "solana_withdraw_network",
  withdrawNetworkSchema
);
const XRP_Withdraw_Network = mongoose.model(
  "xrp_withdraw_network",
  withdrawNetworkSchema
);
const USDC_Withdraw_Network = mongoose.model(
  "usdc_withdraw_network",
  withdrawNetworkSchema
);
const TRX_Withdraw_Network = mongoose.model(
  "trx_withdraw_network",
  withdrawNetworkSchema
);
//====================== deposit networks =======================

const Bitcoin_Deposit_Network = mongoose.model(
  "bitcoin_deposit_network",
  depositNetworkSchema
);

const Ethereum_Deposit_Network = mongoose.model(
  "ethereum_deposit_network",
  depositNetworkSchema
);

const USDT_Deposit_Network = mongoose.model(
  "usdt_deposit_network",
  depositNetworkSchema
);
const BNB_Deposit_Network = mongoose.model(
  "bnb_deposit_network",
  depositNetworkSchema
);
const Litecoin_Deposit_Network = mongoose.model(
  "litecoin_deposit_network",
  depositNetworkSchema
);
const Dogecoin_Deposit_Network = mongoose.model(
  "dogecoin_deposit_network",
  depositNetworkSchema
);
const Solana_Deposit_Network = mongoose.model(
  "solana_deposit_network",
  depositNetworkSchema
);
const XRP_Deposit_Network = mongoose.model(
  "xrp_deposit_network",
  depositNetworkSchema
);
const USDC_Deposit_Network = mongoose.model(
  "usdc_deposit_network",
  depositNetworkSchema
);
const TRX_Deposit_Network = mongoose.model(
  "trx_deposit_network",
  depositNetworkSchema
);
//===============================================================
export const getWithdrawNetworksOfSpecificCurrency = async (cur_type) => {
  let network_to_use = await whichWithdrawNetworkModel(cur_type);

  if (network_to_use != null) {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(DB_URI)
        .then(() => {
          if (network_to_use != null) {
            network_to_use
              .find({})
              .then((networks) => {
                mongoose.disconnect();
                resolve(networks);
              })
              .catch((err1) => {
                console.log("err1 : " + err1);
                mongoose.disconnect();
                reject();
              });
          } else {
            console.log("network_to_use is null");
            mongoose.disconnect();
            reject();
          }
        })
        .catch((err2) => {
          console.log("err2 : " + err2);
          mongoose.disconnect();
          reject();
        });
    });
  }
};

export const getDepositNetworksOfSpecificCurrency = async (cur_type) => {
  let network_to_use = await whichDepositNetworkModel(cur_type);

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        if (network_to_use != null) {
          network_to_use
            .find({})
            .then((networks) => {
              mongoose.disconnect();
              resolve(networks);
            })
            .catch((err1) => {
              console.log("err1 : " + err1);
              mongoose.disconnect();
              reject();
            });
        } else {
          console.log("network_to_use is null");
          mongoose.disconnect();
          reject();
        }
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};
export const getSingleDepositNetworkAddress = async (cur_type, name) => {
  let network_to_use = await whichDepositNetworkModel(cur_type);

  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        if (network_to_use != null) {
          network_to_use
            .findOne({ name: name })
            .then((network) => {
              mongoose.disconnect();
              if (network) {
                if (network.our_deposit_address != null) {
                  resolve(network.our_deposit_address);
                } else {
                  console.log(NO_DEPOSIT_ADDRESS_AVAILABLE);
                  reject(NO_DEPOSIT_ADDRESS_AVAILABLE);
                }
              } else {
                console.log(NO_NETWORK_WITH_THAT_NAME);
                reject(NO_NETWORK_WITH_THAT_NAME);
              }
            })
            .catch((err1) => {
              console.log("err1 : " + err1);
              mongoose.disconnect();
              reject();
            });
        } else {
          console.log("network_to_use is null");
          mongoose.disconnect();
          reject();
        }
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        reject();
      });
  });
};
//=================================================================
async function whichWithdrawNetworkModel(cur_type) {
  switch (cur_type) {
    case WALLETS_CURRENCY_NAMES.Bitcoin:
      return Bitcoin_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.Ethereum:
      return Ethereum_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.Litecoin:
      return Litecoin_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.BNB:
      return BNB_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.USDT:
      return USDT_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.USDC:
      return USDC_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.XRP:
      return XRP_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.Dogecoin:
      return Dogecoin_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.Solana:
      return Solana_Withdraw_Network;
    case WALLETS_CURRENCY_NAMES.TRON:
      return TRX_Withdraw_Network;
    default:
      return null;
  }
}

async function whichDepositNetworkModel(cur_type) {
  switch (cur_type) {
    case WALLETS_CURRENCY_NAMES.Bitcoin:
      return Bitcoin_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.Ethereum:
      return Ethereum_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.Litecoin:
      return Litecoin_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.BNB:
      return BNB_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.USDT:
      return USDT_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.USDC:
      return USDC_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.XRP:
      return XRP_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.Dogecoin:
      return Dogecoin_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.Solana:
      return Solana_Deposit_Network;
    case WALLETS_CURRENCY_NAMES.TRON:
      return TRX_Deposit_Network;
    default:
      return null;
  }
}
//=================================================================
export const getAllWithdrawNetworks = () => {
  let obj = {}; // {'USDT' : [array of its networks] , 'Bitcoin' : [array of its networks] ,}

  return new Promise((majorResolve, majorReject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        let x = Object.values(WALLETS_CURRENCY_NAMES); // array of values String[]

        let promises = x.map(async (value) => {
          let network_to_use = await whichWithdrawNetworkModel(value);

          if (network_to_use != null) {
            return new Promise((minorResolve, minorReject) => {
              network_to_use
                .find({})
                .then((networks) => {
                  obj[value] = networks;
                  minorResolve();
                })
                .catch((err1) => {
                  console.log(
                    `err when fetching withdraw networks of ${value} : ${err1}`
                  );
                  minorReject();
                });
            });
          }
        });

        Promise.all(promises)
          .then(() => {
            mongoose.disconnect();
            majorResolve(obj);
          })
          .catch(() => {
            mongoose.disconnect();
            majorReject();
          });
      })

      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        majorReject();
      });
  });
};

export const getAllDepositNetworks = () => {
  let obj = {}; // {'USDT' : [array of its networks] , 'Bitcoin' : [array of its networks] ,}

  return new Promise((majorResolve, majorReject) => {
    mongoose
      .connect(DB_URI)
      .then(() => {
        let x = Object.values(WALLETS_CURRENCY_NAMES); // array of values String[]

        let promises = x.map(async (value) => {
          let network_to_use = await whichDepositNetworkModel(value);

          if (network_to_use != null) {
            return new Promise((minorResolve, minorReject) => {
              network_to_use
                .find({})
                .then((networks) => {
                  obj[value] = networks;

                  minorResolve();
                })
                .catch((err1) => {
                  console.log(
                    `err when fetching deposit networks of ${value} : ${err1}`
                  );
                  minorReject();
                });
            });
          }
        });

        Promise.all(promises)
          .then(() => {
            mongoose.disconnect();
            majorResolve(obj);
          })
          .catch(() => {
            mongoose.disconnect();
            majorReject();
          });
      })

      .catch((err2) => {
        console.log("err2 : " + err2);
        mongoose.disconnect();
        majorReject();
      });
  });
};
//=================================================================

export const addWithdrawNetwork = (
  cur_type,
  name,
  fee,
  minimum_withdrawal,
  arrival_time
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(async () => {
        let network_to_use = await whichWithdrawNetworkModel(cur_type);

        let newNetwork = new network_to_use({
          name: name,
          fee: fee.toString(),
          minimum_withdrawal: minimum_withdrawal.toString(),
          arrival_time: arrival_time ? arrival_time.toString() : null,
        });

        newNetwork
          .save()
          .then(async () => {
            ejs
              .renderFile("./views/snippets/withdraw_network_snippet.ejs", {
                network: newNetwork,
                cur_type: cur_type,
              })
              .then((str) => {
                resolve(str);
              })
              .catch((err) => {
                reject(err.toString());
              });
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        reject();
      });
  });
};

export const editWithdrawNetwork = (
  id,
  cur_type,
  name,
  fee,
  minimum_withdrawal,
  arrival_time
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(async () => {
        let network_to_use = await whichWithdrawNetworkModel(cur_type);

        network_to_use
          .findByIdAndUpdate(
            id,
            {
              name: name,
              fee: fee.toString(),
              minimum_withdrawal: minimum_withdrawal.toString(),
              arrival_time: arrival_time ? arrival_time.toString() : null,
            },
            { new: true }
          )
          .then((updatedNetwork) => {
            ejs
              .renderFile("./views/snippets/withdraw_network_snippet.ejs", {
                network: updatedNetwork,
                cur_type: cur_type,
              })
              .then((str) => {
                resolve(str);
              })
              .catch((err) => {
                reject(err.toString());
              });
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        reject();
      });
  });
};

export const deleteWithdrawNetwork = (cur_type, id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(async () => {
        let network_to_use = await whichWithdrawNetworkModel(cur_type);

        network_to_use
          .findByIdAndDelete(id)
          .then(() => {
            resolve();
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        reject();
      });
  });
};
//=================================================================

export const addDepositNetwork = (
  cur_type,
  name,
  block_confirmations,
  minimum_deposit,
  est_arrival,
  our_deposit_address
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(async () => {
        let network_to_use = await whichDepositNetworkModel(cur_type);

        let newNetwork = new network_to_use({
          name: name,
          block_confirmations: block_confirmations.toString(),
          minimum_deposit: minimum_deposit.toString(),
          est_arrival: est_arrival ? est_arrival.toString() : null,
          our_deposit_address: our_deposit_address
            ? our_deposit_address.toString()
            : null,
        });

        newNetwork
          .save()
          .then(async () => {
            ejs
              .renderFile("./views/snippets/deposit_network_snippet.ejs", {
                network: newNetwork,
                cur_type: cur_type,
              })
              .then((str) => {
                resolve(str);
              })
              .catch((err) => {
                reject(err.toString());
              });
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        reject();
      });
  });
};

export const editDepositNetwork = (
  id,
  cur_type,
  name,
  block_confirmations,
  minimum_deposit,
  est_arrival,
  our_deposit_address
) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(async () => {
        let network_to_use = await whichDepositNetworkModel(cur_type);

        network_to_use
          .findByIdAndUpdate(
            id,
            {
              name: name,
              block_confirmations: block_confirmations.toString(),
              minimum_deposit: minimum_deposit.toString(),
              est_arrival: est_arrival ? est_arrival.toString() : null,
              our_deposit_address: our_deposit_address
                ? our_deposit_address.toString()
                : null,
            },
            { new: true }
          )
          .then((updatedNetwork) => {
            ejs
              .renderFile("./views/snippets/deposit_network_snippet.ejs", {
                network: updatedNetwork,
                cur_type: cur_type,
              })
              .then((str) => {
                resolve(str);
              })
              .catch((err) => {
                reject(err.toString());
              });
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        reject();
      });
  });
};

export const deleteDepositNetwork = (cur_type, id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI)
      .then(async () => {
        let network_to_use = await whichDepositNetworkModel(cur_type);

        network_to_use
          .findByIdAndDelete(id)
          .then(() => {
            resolve();
          })
          .catch((err1) => {
            console.log("err1 : " + err1);
            reject();
          });
      })
      .catch((err2) => {
        console.log("err2 : " + err2);
        reject();
      });
  });
};
