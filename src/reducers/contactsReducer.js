import CONTACT from '../constants/contactActions';
import _ from 'lodash'

const initState = []


const contactsReducer = (state = initState, action) => {    
    switch (action.type) {
        case CONTACT.ADD_PENDING:            
            let { email } = action.payload
            let contact = _.find(state, {'email':email})
            if (_.isEmpty(contact)) {
                return [
                    ...state,
                    action.payload
                ]
            }
            return [
                ...state,
            ]
        
        default:
            return state
    }

}

export default contactsReducer
