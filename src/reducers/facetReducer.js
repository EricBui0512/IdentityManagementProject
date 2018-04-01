import FACET from '../constants/facetActions';
import crypto from 'crypto'
import _ from "lodash"

const initState = {
    data: {
    }
}

const facetReducer = (state = initState, action) => {
    var facets = []
    switch (action.type) {
        case FACET.INIT:
            let userProfile = action.payload
            var fields = []

            // fields.push({
            //     type: FACET.FACET_FIELD_PLAIN_TEXT,
            //     name: "Account Address",
            //     value: userProfile.accountAddress,
            // })

            // fields.push({
            //     type: FACET.FACET_FIELD_PLAIN_TEXT,
            //     name: "Username",
            //     value: userProfile.userName,
            // })

            // fields.push({
            //     type: FACET.FACET_FIELD_PLAIN_TEXT,
            //     name: "Email",
            //     value: userProfile.email,
            // })

            // fields.push({
            //     type: FACET.FACET_FIELD_PLAIN_TEXT,
            //     name: "User Profile Address",
            //     value: userProfile.userProfileAddress,
            // })

            // let facet = {
            //     title: 'Primary',
            //     fields: fields,
            //     activity: {
            //         authorization: [],
            //         verification: [],
            //     }
            // }
            return {
                ...state,
                // facets: [facet]
                facets: []
            }
        case FACET.INIT_WITHOUT_RESET:
                return {
                    ...state,
                    time: Date.now()
                }
        case FACET.LOAD_FACETS:
            facets = action.payload
            return {
                ...state,
                facets: facets
            }
        case FACET.NEW_PENDING:
            facets = state.facets
            if (_.isUndefined(facets)) {
                facets = []
            }
            facets.push({
                title: action.payload.title,
                facetAddress: action.payload.facetAddress,
                facetKey: action.payload.facetKey,
                status: "pending",
                fields: [],
                changes: {
                    updated: [],
                    deleted: []
                },
                activity: {
                    authorization: [],
                    verification: [],
                }
            })
            console.log("[facet reducer]",facets)
            return {
                ...state,
                facets: facets
            }
            return state

        case FACET.DELETE_FACET:
            let facetAddress = action.payload
            facets = state.facets
            _.remove(facets, { 'facetAddress': facetAddress})

            return {
                ...state,
                facets: facets
            }

        case FACET.NEW_FINISHED:
            facets = state.facets
            var facet = _.find(facets, { 'facetAddress': action.payload.facetAddress});
            facet.status = "finished"
            return {
                ...state,
                facets: facets
            }
        case FACET.ADD_NEW_FIELD_PENDING:
            let { facetIndex, field } = action.payload
            field.pending = true;
            facets = state.facets
            try {
                facets[facetIndex].fields.push(field)
                facets[facetIndex].changes.updated.push(field);

            } catch (e) {
                console.log(e);
                facets[facetIndex].fields = [];
                facets[facetIndex].fields.push(field)
                facets[facetIndex].changes.updated.push(field);
            }
            if (facets[facetIndex].changes.deleted.length > 0) {
                var facetDeleteds = facets[facetIndex].changes.deleted.filter((data) => {
                    return data != field.name;
                });
                facets[facetIndex].changes.deleted = facetDeleteds;
            }
            return {
                ...state,
                facets: facets
            }
        case FACET.EDIT_FIELD_PENDING:
            var { facetIndex, newField} = action.payload
            facets = state.facets
            for (var i = 0; i < facets[facetIndex].fields.length; i++) {
                if (facets[facetIndex].fields[i].name == newField.name) {
                    facets[facetIndex].fields[i].value = newField.value;
                    try {
                        if (facets[facetIndex].changes.updated.length > 0) {
                            var found = false;
                            for (var i = 0; i < facets[facetIndex].changes.updated.length; i++) {
                                if (facets[facetIndex].changes.updated[i].name == newField.name) {
                                    found = true;
                                    facets[facetIndex].changes.updated[i].value = newField.value;
                                }
                            }
                            if (!found) {
                                facets[facetIndex].changes.updated.push(newField);
                            }
                        } else {
                            facets[facetIndex].changes.updated.push(newField);
                        }
                        if (facets[facetIndex].changes.deleted.length > 0) {
                            var facetDeleteds = facets[facetIndex].changes.deleted.filter((field) => {
                                return field != newField.name;
                            });
                            facets[facetIndex].changes.deleted = facetDeleteds;
                        }

                    } catch (e) {
                        console.log(e)
                    }
                    return {
                        ...state,
                        facets: facets,
                    }
                }
            }
        case FACET.DELETE_FIELD_PENDING:
            var { facetIndex, fieldName} = action.payload
            facets = state.facets
            for (var i = 0; i < facets[facetIndex].fields.length; i++) {
                if (facets[facetIndex].fields[i].name == fieldName) {
                    var facetsData = facets[facetIndex].fields.filter((field) => {
                        return field.name != fieldName;
                    });
                    var facetsUpdatedData = facets[facetIndex].changes.updated.filter((field) => {
                        return field.name != fieldName;
                    });
                    var facetsFieldDelete = _.find(facets[facetIndex].changes.updated, function(o) {
                        return o.name == fieldName;
                    });
                    var facetsDeletedData = facets[facetIndex].changes.deleted.filter((field) => {
                        return field != fieldName;
                    });
                    facets[facetIndex].fields = facetsData;
                    facets[facetIndex].changes.updated = facetsUpdatedData;
                    facets[facetIndex].changes.deleted = facetsDeletedData;
                    if (facetsFieldDelete) {
                        if (facetsFieldDelete.pending !== true) {
                            try {
                                facets[facetIndex].changes.deleted.push(fieldName);
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    } else {
                        try {
                            facets[facetIndex].changes.deleted.push(fieldName);
                        } catch (e) {
                            console.log(e)
                        }
                    }


                    return {
                        ...state,
                        facets: facets,
                    }
                }
            }
        case FACET.SYNC_FIELD_PENDING:
            var { facetIndex } = action.payload
            facets = state.facets
            facets[facetIndex].changes.updated = [];
            facets[facetIndex].changes.deleted = [];
            return {
                ...state,
                facets: facets,
            }
        case FACET.SHARE_PENDING:

            let share = action.payload.share
            var facetIndex = _.findIndex(state.facets, ['facetAddress', share.facetAddress]);
            facets = state.facets
            facets[facetIndex].activity.authorization.push(share)
            return {
                ...state,
                facets: facets
            }
        case FACET.REVOKE_SHARE:
            facetIndex = action.payload.facetIndex
            var share = action.payload.share
            facets = state.facets
            var rowIndex = _.findIndex(facets[facetIndex].activity.authorization, function (author) {
                return author.dateTime == share.dateTime && author.email == share.email && author.account == share.account;
            });
            facets[facetIndex].activity.authorization[rowIndex].status = 2;
            console.log(rowIndex, facets[facetIndex].activity.authorization);
            return {
                ...state,
                facets: facets
            }
        case FACET.RE_SHARE_PENDING:
            facetIndex = action.payload.facetIndex
            var share = action.payload.share
            facets = state.facets
            var rowIndex = _.findIndex(facets[facetIndex].activity.authorization, function (author) {
                return author.dateTime == share.currentDateTime && author.email == share.email && author.account == share.account;
            });
            console.log(rowIndex, share, facets[facetIndex].activity.authorization,'==========');
            facets[facetIndex].activity.authorization[rowIndex].dateTime = share.dateTime;
            console.log(rowIndex, facets[facetIndex].activity.authorization);
            return {
                ...state,
                facets: facets
            }

        case FACET.ADD_VERIFIER_PENDING:
            facetIndex = action.payload.facetIndex
            let verifier = action.payload.verifier
            facets = state.facets
            facets[facetIndex].activity.verification.push(verifier)
            return {
                ...state,
                facets: facets
            }
        default:
            return state
    }

}

export default facetReducer
