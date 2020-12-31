import credentials from "@shared/constants/credentialTypes"
import redmineLogo from "../images/redmine-logo.png"

export const credentialOptions = [
  {
    value: credentials.Redmine,
    label: "Redmine",
    logo: redmineLogo
  }
]

const credentialTypes = {}
for (let i = 0; i < credentialOptions.length; i++) {
  const option = credentialOptions[i]
  credentialTypes[option.value] = option
}

export default credentialTypes
