export const convert = {
  fromPercentageToPx({ dataToConvert, relatedTo }: any) {
    return (dataToConvert * relatedTo) / 100
  },
  fromPxToPercentage({ dataToConvert, relatedTo }: any) {
    return (dataToConvert * 100) / relatedTo
  },
}
