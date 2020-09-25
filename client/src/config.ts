// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ae09da87g0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-j28i8kn3.auth0.com',            // Auth0 domain
  clientId: 'zYK20ZEKCST0EIfFwqyr1Vm2JCfeN9SL',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
