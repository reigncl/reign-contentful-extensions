import set from 'set-value'

const setValue = (object: object, path: set.InputType, value: any): any => {
  const newValue = set(object, path, value)
  return newValue
}

const getValue = (object: any, pathFind: string, pathAcc = ''): any => {
  for (let i = 0; i < Object.keys(object).length; i++) {
    let value = object[Object.keys(object)[i]]
    let key = Object.keys(object)[i]
    let pathKey = (pathAcc ? pathAcc + '.' : pathAcc) + key

    if (pathKey === pathFind) {
      return value
    }
    if (typeof value === 'object' && Object.keys(value).length) {
      return getValue(value, pathFind, pathKey)
    }
  }
  return null
}

export { setValue, getValue }