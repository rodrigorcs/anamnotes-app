export const convertCamelCaseToKebabCase = (text: string) => {
  return text.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())
}
