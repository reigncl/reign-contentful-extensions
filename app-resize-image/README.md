This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

# Image resize tool

The application is a tool that allows the functionality to resize an asset type field (image) showing this feature in a popup that keeps the user focused on the task of changing the dimensions of the image.

## How to use

1. In contentful, in the "Content Model" tab, locate the content type you want to add the functionality to.

2. Select the image asset type field and select the "Settings" option.

3. Under the "Appearance" tab, select "image resize tool" to add the functionality to that field.

## Available Scripts

In the project directory, you can run:

#### `npm run dev`

Runs the app in development mode. Open your app to view it in the browser. The page will reload if you make edits.

#### `npm run build`

Builds the app for production to the `.next` folder. It correctly bundles Next in production mode and optimizes the build for the best performance. Your app is ready to be deployed!

#### `npm run upload`

Uploads the build folder to contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is  
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set:

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)

## Libraries to use

To make your app look and feel like Contentful use the following libraries:

- [Forma 36](https://f36.contentful.com/) – Contentful's design system
- [Contentful Field Editors](https://www.contentful.com/developers/docs/extensibility/field-editors/) – Contentful's field editor React components
- [React Apps Toolkit](https://www.contentful.com/developers/docs/extensibility/app-framework/react-apps-toolkit/) – Library to simplify build Contentful apps with React
- [Styled Components](https://styled-components.com/) - Utilising tagged template literals and the power of CSS, styled-components allows you to write actual CSS code to style your components
- [React rnd](https://github.com/bokuweb/react-rnd) - Library to handle image resizing

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

