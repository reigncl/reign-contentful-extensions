import set from "set-value";

const setValue = (object: object, path: set.InputType, value: any): any => {
  const newValue = set(object, path, value);
  return newValue;
};

const getValue = (object: any, pathFind: string, pathAcc = ""): any => {
  for (let i = 0; i < Object.keys(object).length; i++) {
    let value = object[Object.keys(object)[i]];
    let key = Object.keys(object)[i];
    let pathKey = (pathAcc ? pathAcc + "." : pathAcc) + key;

    if (pathKey === pathFind) {
      return value;
    }
    if (typeof value === "object" && Object.keys(value).length) {
      return getValue(value, pathFind, pathKey);
    }
  }
  return null;
};

const updateValue = (
  object: any,
  pathFind: string,
  value: any,
  arrayIndex?: number,
  currentKey?: string
) => {
  let newValue;
  if (typeof arrayIndex !== "undefined" && arrayIndex > -1) {
    console.log(`updateValue pathFind=${pathFind} arrayIndex=${arrayIndex}`)
    let currentValue = getValue(object, pathFind);
    if (typeof currentValue === "undefined" || !currentValue) {
      currentValue = [];
      currentValue[arrayIndex] = {}
      currentValue[arrayIndex][currentKey as string] = value
    } else if (Array.isArray(currentValue)) {
      const currentIndexValue = currentValue[arrayIndex] ?? {}
      currentIndexValue[currentKey as string] = value
      currentValue[arrayIndex] = currentIndexValue
    }
    newValue = setValue(object, pathFind, currentValue);
  } else {
    newValue = setValue(object, pathFind, value);
  }
  console.log(`updateValue newValue=${JSON.stringify(newValue)}`)
  return newValue;
};

export { setValue, getValue, updateValue };
