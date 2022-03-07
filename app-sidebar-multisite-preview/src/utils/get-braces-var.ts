export function GetBracesVar(
  txt: string,
  returnSingle = true
): Array<string> | string {
  if (txt) {
    const myRex = new RegExp(/{([\w])\w+}/, "g");
    const matchResult = txt.match(myRex);
    if (matchResult && matchResult?.length > 0 && returnSingle) {
      return returnSingle ? matchResult[0] : matchResult;
    }
  }
  return returnSingle ? "" : [];
}
