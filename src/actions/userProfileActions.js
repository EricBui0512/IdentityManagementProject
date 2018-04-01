import USER_PROFILE from "../constants/userProfile";

export function addUserProfile(userProfile) {
  return {
    type: USER_PROFILE.CREATE,
    payload: userProfile
  }
}
export function addVerifyUserProfile(userProfile) {
  return {
    type: USER_PROFILE.VERIFY_CREATE,
    payload: userProfile
  }
}

export function updateUserProfile(userProfile) {
  return {
    type: USER_PROFILE.UPDATE,
    payload: userProfile
  }
}

export function addKeysToUserProfile(userProfile) {
  return {
    type: USER_PROFILE.ADD_KEYS,
    payload: userProfile
  }
}

export function deployPrimaryDataOnUserProfile() {
  return {
    type: USER_PROFILE.DEPLOYING_PRIMARY_PENDING,
    payload: {
      deployingPrimary: true
    }
  }
}

export function deployPrimaryDataOnUserProfileCompleted() {
  return {
    type: USER_PROFILE.DEPLOYING_PRIMARY_FINISHED,
    payload: {
      deployingPrimary: false
    }
  }
}
