import constants from "./constants";

export default class ServerService {
    constructor() {

    }

    request(path,params){
        console.info("Request ", params, constants.REMOTE_API_HOST + path)
        return fetch(constants.REMOTE_API_HOST + path, {
            method: 'post',
            body: JSON.stringify(params),
            headers: {
                'content-type': 'application/json'
            },
        }).then(function(response) {
            return response.json();
        })
    }

    downloadFacetFile(fileUrl, facetKey) {
        return this.request("/api/facet/download",{fileUrl: fileUrl, facetKey: facetKey})
    }
    getListFacetActivities(accountAddress) {
        return this.request("/api/facet/activitiesByAccount",{account: accountAddress})
    }
    addFacetField(facetAddress, fieldName, fieldValueHash, fieldValue) {
        return this.request("/api/facet/field/add",{
            facetAddress: facetAddress,
            fieldName: fieldName,
            fieldValueHash: fieldValueHash,
            fieldValue: fieldValue
        });
    }

    retreiveAccount(ethAddress, userName, email){
        return this.request("/api/account/retreive",{ethAddress: ethAddress, email: email, userName: userName})
    }

    upload(params){
        return this.request("/api/facet/upload",params)
    }

    createFacet(title, owner, facetAddress){
        return this.request("/api/facet/add",{owner: owner, title: title, facetAddress: facetAddress})
    }

    updateFacet(facetAddress,newFacetAddress){
        return this.request("/api/facet/update",{facetAddress: facetAddress, newFacetAddress: newFacetAddress})
    }
    syncFacetFields(facetAddress,updatedFields, deleteFields){
        return this.request("/api/facet/field/sync",{
            facetAddress: facetAddress,
            updatedFields: updatedFields,
            deleteFields: deleteFields
        })
    }

    deleteFacet(facetAddress){
        return this.request("/api/facet/delete",{facetAddress: facetAddress})
    }

    retrieveFacet(title,owner,facetAddress){
        return this.request("/api/facet/retrieve",{owner: owner, title: title, facetAddress: facetAddress})
    }

    addActivity(facetAddress, status, account, fromEmail, type, facetKey, publicKey, toEmail, clientURL=null, dateTime){
        return this.request("/api/facet/activity/add",{
            facetAddress: facetAddress,
            status: status,
            account: account,
            fromEmail: fromEmail,
            toEmail: toEmail,
            type: type,
            facetKey: facetKey,
            publicKey: publicKey,
            clientURL: clientURL,
            dateTime: dateTime
        })
    }
    reShareData(reShareData) {
        return this.request("/api/facet/activity/reShareData",{reShareData:reShareData})
    }
    updateActivity(activityId, newStatus) {
        return this.request("/api/facet/activity/update",{
            activityId: activityId,
            newStatus: newStatus
        })
    }
    revokeFacet(facet) {
        return this.request("/api/facet/activity/revoke",{
            facet: facet
        });
    }

    loadFacet(facetAddress){
        return this.request("/api/facet/load",{ facetAddress: facetAddress})
    }

    updateFacetField(facetAddress, fieldName, fieldValueHash, fieldValue){
        return this.request("/api/facet/field/update",{ facetAddress: facetAddress, fieldName: fieldName, fieldValueHash: fieldValueHash, fieldValue: fieldValue})
    }
    deleteFacetField(facetAddress, fieldName){
        return this.request("/api/facet/field/delete",{ facetAddress: facetAddress, fieldName: fieldName })
    }
    getStatusActivity(facetAddress, shareKey){
        return this.request("/api/facet/getStatusActivity",{ facetAddress: facetAddress, shareKey: shareKey })
    }
    loadFacetByAddress(facetAddress){
        return this.request("/api/facet/loadByAddress",{ facetAddress: facetAddress})
    }
    getFacetFromAccountAddress(accountAddress) {
        return this.request("/api/facet/shared_accounts",{ account: accountAddress})
    }
    createShareKey(facetKey, email) {
        return this.request('/api/facet/createShareKey',{facetKey: facetKey, email:email})
    }
}
