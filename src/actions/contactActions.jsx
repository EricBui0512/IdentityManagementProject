import CONTACT from "../constants/contactActions";

export function addContact(contact) {
    return {
        type: CONTACT.ADD_PENDING,
        payload: contact
    }
}

