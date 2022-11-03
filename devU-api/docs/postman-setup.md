# Postman Setup

[JSON configuration file for Postman](https://www.getpostman.com/collections/b817928ddd3489a9f8a4)

Postman is a great tool for testing API endpoints. The link above is a configuration file that 
will help setup the basic configuration for working with most of the basic endpoints.

### Get Started
1. Install/Open Postman
2. Copy JSON configuration file link
3. Select `Import > Link`
4. Paste the link, click continue, and then click `Import`

### Setup Auth
See `docs/localAuth.md` for examples

1. Using the auth folder, run `retrieve auth token`
2. Copy the **content** of the refresh token
3. Under the devU collection, set a variable called `authorization` to the content of the previous step
4. Run all the requests you want!
