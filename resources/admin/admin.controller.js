import { getConversionRates } from "../../resources/conversion-rates/conversion_rates.model.js";
import {
  getAllWithdrawNetworks,
  getAllDepositNetworks,
} from "../crypto-networks/crypto-networks.model.js";
import { getAllMemberships } from "../membership/membership.model.js";

import { getAllMemberships } from "../../resources/membership/membership.model.js";
import { getOurUsers } from "../../resources/user/user.model.js";
import { getNOtDoneTransactionIDs } from "../../resources/transaction-ids/transaction_id.model.js";

//-----------------------------------------------------------------
export const getEditWithdrawNetworksPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  if (id) {
    getAllWithdrawNetworks()
      .then((networks_object) => {
        // {'USDT' : [array of its networks] , 'Bitcoin' : [array of its networks] ,}
        res.render("edit_withdraw_networks.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          networks_object: networks_object,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/"); // back to home page
  }
};
//-----------------------------------------------------------------

//-----------------------------------------------------------------
export const getEditDepositNetworksPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  if (id) {
    getAllDepositNetworks()
      .then((networks_object) => {
        // {'USDT' : [array of its networks] , 'Bitcoin' : [array of its networks] ,}
        res.render("edit_deposit_networks.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          networks_object: networks_object,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/"); // back to home page
  }
};
//-----------------------------------------------------------------

//-----------------------------------------------------------------
export const getEditConversionRatesPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  if (id) {
    getConversionRates()
      .then((ratesDocument) => {
        /* {
            'name' : 'rates' ,
              'rates' : { 
              'USDT' : 1 ,
              'ETH' : 0.001452 ,
              'BTC' : 0.00001163 ,
              'USD' : 1 ,
              'EUR' : 0.95
                }
             } */
        res.render("edit_conversion_rates.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          ratesDocument: ratesDocument,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/"); // back to home page
  }
};
//-----------------------------------------------------------------

//-----------------------------------------------------------------
export const getEditMembershipsPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  if (id) {
    getAllMemberships()
      .then((membershipsArray) => {
        /*   
        [ 
          {
          "_id": "string",
          "type": "vip1",
          "fee": Number,
          "img": "/vip1.png",
          "max_deposit": "150,000",
          "max_receive": "unlimited",
          "max_transfer": "unlimited",
          "max_withdraw": "200,000",
          "number": 1 
          },
          {.......} ,
          {.......} 
        ]
        */

        res.render("edit_memberships.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          membershipsArray: membershipsArray,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/"); // back to home page
  }
};
//-----------------------------------------------------------------

//-----------------------------------------------------------------
export const getEditOurUsersPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  if (id) {
    getOurUsers()
      .then((ourUsersArray) => {
        /*
   [
        {
        "_id": "string",
        "name": "string",
        "email": "string",
        "password": "string",
        "key": "string",
        "wallets": [
          {
            "$oid": "string"
          },
          {
            "$oid": "string"
          },
        ],
        "vip": Number ,
        "isOur": true,
        "created_at": "Date"
      },
      {.......},
      {.......},

    ]
 */

        res.render("edit_our_users.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          ourUsersArray: ourUsersArray,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/"); // back to home page
  }
};
//-----------------------------------------------------------------

//-----------------------------------------------------------------
export const getVipRequestsPage = (req, res, next) => {
  let id = req.payload.id;
  let isAdmin = req.payload.isAdmin;
  if (id) {
    getNOtDoneTransactionIDs()
      .then((transactionIDsList) => {
        /*
   [
        {
        "_id": "string",
        "user_name": "string",
        "cur_type": "string",
        "amount": "string",
        "network_name": "string",
        "vip_needed": "string" ,
        "transaction_id": "string",
        "done": false
      },
      {.......},
      {.......},

    ]
 */
        res.render("vip_requests.ejs", {
          isLoggedIn: true,
          isAdmin: isAdmin,
          transactionIDsList: transactionIDsList,
        });
      })
      .catch((errMsg) => {
        res.redirect("/");
      });
  } else {
    res.redirect("/"); // back to home page
  }
};
//-----------------------------------------------------------------
