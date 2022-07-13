export const isRegex = (val: string) => {
  let isValid = true
  try {
    // eslint-disable-next-line no-new
    new RegExp(val)
  } catch (e) {
    isValid = false
  }
  return isValid
}
