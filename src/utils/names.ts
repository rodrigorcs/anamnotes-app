export const getFirstNameFromFullName = (fullName?: string) => {
  const [firstName] = fullName?.split(' ') ?? []

  return firstName
}
