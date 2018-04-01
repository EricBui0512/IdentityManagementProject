import {
    ADD_ETHEREUM_KEY,
    METAMASK,
    ADD_NEW_TOAST,
    RESET_TOAST
} from '../constants/ActionTypes';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';

const config = require('../config/app.json');

const initialState = {
    ethereumKeys: [
        {
            address: '00db0ea96fe6fc6f4ce92be786387a6cf4a710c0a31601a92e7642cd06185c88',
            key: '00db0ea96fe6fc6f4ce92be786387a6cf4a710c0a31601a92e7642cd06185c88',
            account_name: 'dump'
        }
    ],
    isMetamask: false,
    toast: {
        id: '',
        message: '',
        option: {
            type: toast.TYPE.SUCCESS,
            autoClose: '2000'
        },
        isOpen: false,
    }
};

const AppReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ETHEREUM_KEY:
            let newState = getNewState(state, action.data);
            saveEthereumKeyToLocal(newState.ethereumKeys);
            return newState;
        case METAMASK:
            return {
              ...state,
              isMetamask:action.data
            }
        case ADD_NEW_TOAST:
            return {
              ...state,
              toast: {
                ...state.toast,
                ...action.data
              }
            }
        case RESET_TOAST:
            return {
                ...state,
                toast: {
                    id: '',
                    message: '',
                    option: {
                        type: toast.TYPE.SUCCESS,
                        autoClose: '2000'
                    },
                    isOpen: false,
                }
            }
        default:
            return state;
    }
    return state;
};

const getNewState = (rootState, data) => {
    let isExist = false;

    rootState.ethereumKeys.map(rootEthereumKey => {
        if(rootEthereumKey.address === data.address) {
            isExist = true;
        }
    });
    if(isExist) {
        return rootState;
    }

   return {
       ethereumKeys: [...rootState.ethereumKeys, data]
   };
};

export const saveEthereumKeyToLocal = (ethereumKeys) => {
    const ethereumKeyEncoded = jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
            data: ethereumKeys
        },
        config.security_keys
    );
    localStorage.setItem(config.save_ethereum_key, ethereumKeyEncoded);
};

export default AppReducer;
