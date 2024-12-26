const PREFERENCE_KEY = 'preference'
const getPreference = () => {
  if (!localStorage) {
    return
  }
  const lsValue: string | null = localStorage.getItem(PREFERENCE_KEY)
  if (!lsValue) {
    return
  }
  try {
    const preference: any = JSON.parse(lsValue)
    if (preference) {
      return preference
    }
  } catch (_err: any) {
    new Error('PREFERENCE LOCAL STORAGE PARSE ERROR')
  }
}

const setPreference = (preference: any) => {
  if (!localStorage) {
    return
  }
  try {
    const lsValue = JSON.stringify(preference)
    localStorage.setItem(PREFERENCE_KEY, lsValue)
  } catch (_err: any) {
    new Error('PREFERENCE LOCAL STORAGE SAVE ERROR')
  }
}

const removePreference = () => {
  if (!localStorage) {
    return
  }
  try {
    localStorage.removeItem(PREFERENCE_KEY)
  } catch (_err: any) {
    new Error('PREFERENCE LOCAL STORAGE REMOVE ERROR')
  }
}

export {getPreference, PREFERENCE_KEY, removePreference, setPreference}
