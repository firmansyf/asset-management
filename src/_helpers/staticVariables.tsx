export const staticDate = () => {
  const dates: any = []
  for (let i = 1; i <= 31; i++) {
    let value: string = ''
    const label: string = `${i}`
    if (i?.toString()?.length === 1) {
      value = `0${i}`
    } else {
      value = `${i}`
    }
    dates?.push({value: value, label: label})
  }
  return dates
}

export const staticMonth = () => {
  const month: any = [
    {id: 1, value: 'January', label: 'January'},
    {id: 2, value: 'February', label: 'February'},
    {id: 3, value: 'March', label: 'March'},
    {id: 4, value: 'April', label: 'April'},
    {id: 5, value: 'May', label: 'May'},
    {id: 6, value: 'June', label: 'June'},
    {id: 7, value: 'July', label: 'July'},
    {id: 8, value: 'August', label: 'August'},
    {id: 9, value: 'September', label: 'September'},
    {id: 10, value: 'October', label: 'October'},
    {id: 11, value: 'November', label: 'November'},
    {id: 12, value: 'December', label: 'December'},
  ]
  return month
}

export const staticDay = () => {
  const day: any = [
    {value: 'monday', label: 'Monday'},
    {value: 'tuesday', label: 'Tuesday'},
    {value: 'wednesday', label: 'Wednesday'},
    {value: 'thursday', label: 'Thursday'},
    {value: 'friday', label: 'Friday'},
    {value: 'saturday', label: 'Saturday'},
    {value: 'sunday', label: 'Sunday'},
  ]
  return day
}

export const staticDayWithId = () => {
  const day: any = [
    {id: 1, value: 'monday', label: 'Monday'},
    {id: 2, value: 'tuesday', label: 'Tuesday'},
    {id: 3, value: 'wednesday', label: 'Wednesday'},
    {id: 4, value: 'thursday', label: 'Thursday'},
    {id: 5, value: 'friday', label: 'Friday'},
    {id: 6, value: 'saturday', label: 'Saturday'},
    {id: 7, value: 'sunday', label: 'Sunday'},
  ]
  return day
}

export const staticDayLists = () => {
  const dayList: any = [
    ['Monday', 'monday'],
    ['Tuesday', 'tuesday'],
    ['Wednesday', 'wednesday'],
    ['Thursday', 'thursday'],
    ['Friday', 'friday'],
    ['Saturday', 'saturday'],
    ['Sunday', 'sunday'],
  ]
  return dayList
}

export const staticDatePeriod = () => {
  const datePeriod: any = [
    {value: 'daily', label: 'Daily'},
    {value: 'weekly', label: 'Weekly'},
    {value: 'monthly', label: 'Monthly'},
    {value: 'yearly', label: 'Yearly'},
  ]
  return datePeriod
}
