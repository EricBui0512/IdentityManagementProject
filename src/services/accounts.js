import Account from "./account"
import store from "../store"

export function newAccountInstance(address, keystring, name, desc) {
  var account = new Account(address, keystring, name, desc)
  return account.sync(
    store.getState().connection.ethereum)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}
