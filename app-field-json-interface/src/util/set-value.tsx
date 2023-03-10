import set from "set-value";
import objectPath from 'object-path'

const setValue = (object: object, path: set.InputType, value: any): any => {
  const newValue = set(object, path, value);
  return newValue;
};

const getValue = (object: any, pathFind: string): any => {
  return objectPath.get(object, pathFind)
};

const updateValue = (
  object: any,
  pathFind: string,
  value: any
) => {
  return setValue(object, pathFind, value);
};

export { setValue, getValue, updateValue };
