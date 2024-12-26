const USER_LOCAL_STORAGE_KEY = 'user'
const getCurrentUser = () => {
  if (!localStorage) {
    return
  }
  const lsValue: string | null = localStorage.getItem(USER_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }
  try {
    const user: any = JSON.parse(lsValue)
    if (user) {
      return user
    }
  } catch (_err: any) {
    new Error('USER LOCAL STORAGE PARSE ERROR')
  }
}

const setCurrentUser = (user: any) => {
  if (!localStorage) {
    return
  }
  try {
    const lsValue = JSON.stringify(user)
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, lsValue)
  } catch (_err: any) {
    new Error('USER LOCAL STORAGE SAVE ERROR')
  }
}

const removeCurrentUser = () => {
  if (!localStorage) {
    return
  }
  try {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
  } catch (_err: any) {
    new Error('USER LOCAL STORAGE REMOVE ERROR')
  }
}

export {getCurrentUser, removeCurrentUser, setCurrentUser, USER_LOCAL_STORAGE_KEY}
