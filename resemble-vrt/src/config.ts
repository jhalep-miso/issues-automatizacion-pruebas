import { ComparisonOptions } from "resemblejs"

export const options: ComparisonOptions = {
  output: {
    errorColor: {
      "red": 255,
      "green": 0,
      "blue": 255
    },
    errorType: "movement",
    largeImageThreshold: 1200,
    useCrossOrigin: false
  },
  scaleToSameSize: true,
  ignore: "antialiasing"
}
