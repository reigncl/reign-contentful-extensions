import { EditorTypeValue } from "./switch-editor";

export interface Editor {
  parentKey?: string;
  prevParentKey?: string;
  currentKey?: string;
  index?: number;
  value?: EditorTypeValue;
  handleUpdate?: Function;
}
