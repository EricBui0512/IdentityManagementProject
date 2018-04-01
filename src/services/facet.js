import * as ethUtil from 'ethereumjs-util'
import constants from "../services/constants"
import { sealTxByKeystore } from "../utils/sealer"
import userProfile from '../constants/userProfile';
export function deployFacet(title, accountAddress, profileAddress, isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce) {

    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.addFacetData(title, profileAddress, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        // to: accountAddress,
        value: 0,
        data: txData
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}

export function destroyFacet(accountAddress, facetAddress, userProfileAddress, isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce){
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.destroyFacetData(facetAddress,userProfileAddress, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData,
        from: accountAddress
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}

export function updateFacetAttributes(accountAddress, facetAddress, fieldKeys, fieldValues, deletedKeys, isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce) {
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.updateFacetAttributesData(facetAddress,fieldKeys, fieldValues, deletedKeys, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData,
        from: accountAddress
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}

export function deleteFacetAttributes(accountAddress, facetAddress, fieldKeys, isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce) {
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.deleteFacetAttributesData(facetAddress,fieldKeys, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData,
        from: accountAddress
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}

export function deployFacetField(name, value, facetAddress, accountAddress,isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce){
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.addFacetFieldData({name: name, value: value},facetAddress, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}


export function shareToAccount(address, facetAddress, accountAddress,isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce, shareKey){
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.shareToAccountData(address,facetAddress, shareKey, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}

export function inviteToVerify(address, facetAddress, accountAddress,isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce, shareKey, email){
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }
    console.log(address);
    if (address == "0x0000000000000000000000000000000000000000") {
        var txData = ethereum.inviteToVerifyByEmailData(email,facetAddress,shareKey ,opts)
    } else {
        var txData = ethereum.inviteToVerifyData(address,facetAddress,shareKey ,opts)
    }



    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}
export function revokeShare(address, facetAddress, accountAddress,isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce){
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }

    let txData = ethereum.revokeShareData(address,facetAddress, opts)


    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}
export function verifyFacet(address, facetAddress, accountAddress, isMetaMask, gas, gasPrice, password, keystring, ethereum, nonce, email, statusVerify, inNetwork){
    const opts = {
        gasPrice: gasPrice,
        gasLimit: gas,
        from: accountAddress
    }
    if (inNetwork) {
        var txData = ethereum.verifyFacetByAccount(address, facetAddress, statusVerify, opts)
    } else {
        var txData = ethereum.verifyFacetByEmail(email, facetAddress, statusVerify, opts)
    }

    const txParams = {
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: facetAddress,
        value: 0,
        data: txData
    }
    var tx = ""
    if (isMetaMask == false)
        tx = sealTxByKeystore(txParams, keystring, password)
    const broadcasted = ethereum.sendRawTransaction(tx, ethereum, txParams, isMetaMask)
    return broadcasted
}
