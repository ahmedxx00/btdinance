import {getAllWithdrawNetworks,getAllDepositNetworks} from '../crypto-networks/crypto-networks.model.js';

export const getEditWithdrawNetworksPage = (req,res,next)=>{
    let isAdmin = req.payload.isAdmin;
    getAllWithdrawNetworks().then((networks_object) => {// {'USDT' : [array of its networks] , 'Bitcoin' : [array of its networks] ,}
        res.render('edit_withdraw_networks.ejs',{isLoggedIn: true, isAdmin: isAdmin, networks_object : networks_object})
    }).catch((errMsg) => {
        res.redirect('/')
    });
}
export const getEditDepositNetworksPage = (req,res,next)=>{
    let isAdmin = req.payload.isAdmin;
    getAllDepositNetworks().then((networks_object) => {// {'USDT' : [array of its networks] , 'Bitcoin' : [array of its networks] ,}
        res.render('edit_deposit_networks.ejs',{isLoggedIn: true, isAdmin: isAdmin, networks_object : networks_object})
    }).catch((errMsg) => {
        res.redirect('/')
    });
}

