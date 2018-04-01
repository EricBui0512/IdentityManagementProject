let target = {
  CREATE: 'USER_PROFILE.CREATE',
  VERIFY_CREATE: 'USER_PROFILE.VERIFY_CREATE',
  UPDATE: 'USER_PROFILE.UPDATE',
  ADD_KEYS: 'USER_PROFILE.ADD_KEYS',
  DEPLOYING_PRIMARY_PENDING: 'USER_PROFILE.DEPLOYING_PRIMARY_PENDING',
  DEPLOYING_PRIMARY_FINISHED: 'USER_PROFILE.DEPLOYING_PRIMARY_FINISHED'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy
