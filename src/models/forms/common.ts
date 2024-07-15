export const regexValidators = Object.freeze({
  fullName: /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,}$/g,
  emailAddress: /^[\w+\-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g,
})
