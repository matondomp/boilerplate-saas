export const useAvatar = () => {
  return {
    initials: (fullName: string) => {
      if (!fullName) return ''

      if (fullName.length <= 3) {
        return fullName
      }

      const names = fullName.split(' ')

      if (names.length === 1) {
        return names[0][0]
      }

      return names[0][0] + names[names.length - 1][0]
    },
  }
}
