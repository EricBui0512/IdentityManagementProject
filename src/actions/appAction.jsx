import {
    ADD_ETHEREUM_KEY,
    METAMASK,
    ADD_NEW_TOAST,
    RESET_TOAST
} from '../constants/ActionTypes';
import jwt from 'jsonwebtoken';
const config = require('../config/app.json');

export const addEthereumKey = (dispatch, data) => {
    dispatch({ type: ADD_ETHEREUM_KEY, data: data});
};
export const useMetamask = (data) => {
  return {
    type: METAMASK,
    data: data
  }
};


export const getEthereumKeyFromLocal = (dispatch) => {
    let dataEthereumKeyDecoded = jwt.decode(localStorage[config.save_ethereum_key]);
    if (dataEthereumKeyDecoded !== null) {
        dataEthereumKeyDecoded.data.map(data => addEthereumKey(dispatch, data));
    }
};

export const deleteEthereumKeyFromLocal = () => {
    localStorage.removeItem(config.save_ethereum_key);
};

export const addNewToast = (toastData) => {
    return {
        type: ADD_NEW_TOAST,
        data: toastData
    }
};

export const resetToast = () => {
    return {
        type: RESET_TOAST,
    }
};
