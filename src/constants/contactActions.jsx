let target = {
    ADD_PENDING: 'CONTACT.ADD_PENDING',
    ADD_FINISHED: 'CONTACT.ADD_FINISHED',   
}
let handler = {
    get: (target, key) => {
        if (target.hasOwnProperty(key)) return target[key];
        else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
    }
}
const proxy = new Proxy(target, handler)
export default proxy
