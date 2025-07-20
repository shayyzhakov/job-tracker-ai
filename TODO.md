# Project Tasks

## Authentication & Security

- [ ] Redirect unauthenticated users to the Amplify authentication app
- [ ] Explore options for completing the authentication flow by making the token directly accessible to Claude, avoiding the need to hardcode it in the mcp config.
- [ ] Support Google login
- [ ] Add token expiry validation
- [ ] Instead of login tool, return "unauthenticated" response with the login link to indicate that tool usage failed because it is required to login
- [ ] Refresh flow: keep the creds in memory and whenever refresh applies, write the new tokens to file (and load it on startup)

## Contacts

- [ ] Contacts don't have to include company relation, in case these contacts are just referrers (headhunters, friends that referred me to a position, etc)

## Deployment

- [ ] Add the authentication app to git
- [ ] Deploy the authentication app to AWS Amplify

## Documentation

- [ ] Document the complete authentication flow
- [ ] Add instructions for handling the authentication token in the auth app UI
