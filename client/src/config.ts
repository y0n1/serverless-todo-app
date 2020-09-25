// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'u1kbtoie97'
const region = 'us-east-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-77wcjs5i.eu.auth0.com',
  clientId: 'XJ7Vc8IHVIS1rcC43pUA1912c8c5pqcR',
  callbackUrl: 'http://localhost:3000/callback'
}
