import USER_PROFILE from "../constants/userProfile";
import ACC_ACTION from "../constants/accActions";
import { METAMASK } from "../components/Modal/constants";
const initState = {
    data: {}
}

const userProfileReducer = (state = initState, action) => {
    var data = {}
    switch (action.type) {
        case USER_PROFILE.CREATE:
            delete action.payload.errors;
            delete action.payload.ethereum;
            return {
                ...state,
                data: action.payload
            }
        case USER_PROFILE.VERIFY_CREATE:
            delete action.payload.ethereum;
            return {
                ...state,
                data: action.payload
            }
        case USER_PROFILE.UPDATE:
            delete action.payload.errors;
            return {
                ...state,
                data: action.payload
            }
        case USER_PROFILE.ADD_KEYS:
            data = state.data
            return {
                ...state,
                data: {
                    ...data,
                    ...action.payload
                }
            }

        case USER_PROFILE.DEPLOYING_PRIMARY_PENDING:
            data = state.data
            return {
                ...state,
                data: {
                    ...data,
                    ...action.payload
                }
            }
        case USER_PROFILE.DEPLOYING_PRIMARY_FINISHED:
            data = state.data
            return {
                ...state,
                data: {
                    ...data,
                    ...action.payload
                }
        }
        case ACC_ACTION.LOG_OUT:
            return {
                ...state,
                data: {}
            }
        default:
            return state
    }

}

export default userProfileReducer
