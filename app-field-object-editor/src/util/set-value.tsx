import set from 'set-value'

const setValue = (
  object: object,
  path: set.InputType,
  value: any,
  arrOptions?: { index?: number; prevParentKey?: string; key?: string }
): any => {
  const index = arrOptions?.index
  const prevParentKey = arrOptions?.prevParentKey
  const key = arrOptions?.key
  /*console.log('setValue object', JSON.stringify(object))
  console.log('setValue path', path)
  console.log('setValue value', value)
  console.log('setValue index', index)
  console.log('setValue prevParentKey', prevParentKey)
  console.log('setValue key', key)*/
  let newValue
  if (typeof index !== 'undefined' && index > -1 && key && prevParentKey) {
    let currentValue = getValue(object, prevParentKey as string)
    console.log(`setValue currentValue index=${index}`, JSON.stringify(currentValue))
    if (!Array.isArray(currentValue)) {
      let item: Record<string, unknown> = {}
      item[key] = value
      currentValue = [item]
    } else {
      let item = currentValue[index] ?? {}
      item[key] = value
      currentValue[index] = item
    }
    //console.log('setValue newValue', JSON.stringify(currentValue))
    console.log('setValue newValue set', JSON.stringify(set(object, prevParentKey, currentValue)))
    newValue = set(object, prevParentKey, currentValue)
  } else {
    newValue = set(object, path, value)
  }
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
