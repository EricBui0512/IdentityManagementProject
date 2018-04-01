import FACET from "../constants/facetActions";

export function initFacet(userProfile) {
    return {
        type: FACET.INIT,
        payload: userProfile
    }
}

export function initFacetWithoutReset(userProfile) {
    return {
        type: FACET.INIT_WITHOUT_RESET,
        payload: userProfile
    }
}

export function loadFacetsFromEthereum(facets) {
    return {
        type: FACET.LOAD_FACETS,
        payload: facets
    }
}

export function deleteFacet(facetAddress) {
    return {
        type: FACET.DELETE_FACET,
        payload: facetAddress
    }
}

export function addNewField(facetIndex, field) {
    return {
        type: FACET.ADD_NEW_FIELD_PENDING,
        payload: { facetIndex: facetIndex, field: field }
    }
}

export function addNewFacet(data){
    return {
        type: FACET.NEW_PENDING,
        payload: {
            ...data
        }
    }
}

export function shareData(facetIndex,share){
    return {
        type: FACET.SHARE_PENDING,
        payload: { facetIndex: facetIndex, share: share }
    }
}
export function reShareData(facetIndex,share){
    return {
        type: FACET.RE_SHARE_PENDING,
        payload: { facetIndex: facetIndex, share: share }
    }
}

export function revokeShare(facetIndex,share){
    return {
        type: FACET.REVOKE_SHARE,
        payload: { facetIndex: facetIndex, share: share }
    }
}

export function addVerifier(facetIndex,verifier){
    return {
        type: FACET.ADD_VERIFIER_PENDING,
        payload: { facetIndex: facetIndex, verifier: verifier }
    }
}
export function editField(facetIndex,newField){
    return {
        type: FACET.EDIT_FIELD_PENDING,
        payload: {
            facetIndex: facetIndex,
            newField: newField,
        }
    }
}
export function deleteField(facetIndex,fieldName){
    return {
        type: FACET.DELETE_FIELD_PENDING,
        payload: {
            facetIndex: facetIndex,
            fieldName: fieldName,
        }
    }
}
export function syncFacetFields(facetIndex){
    return {
        type: FACET.SYNC_FIELD_PENDING,
        payload: {
            facetIndex: facetIndex
        }
    }
}
