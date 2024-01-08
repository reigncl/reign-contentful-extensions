import { FieldState } from "./field-reducer";
import { EditorTypeValue } from "./switch-editor";

export interface MainEditorProps {
  value?: EditorTypeValue;
  structure?: EditorTypeValue;
  handleUpdate?: Function
}
