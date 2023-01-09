This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## Configuring the application

The first step to configure the app is to update the `./src/components.tsx` file with the components that the app will be able to render (usually the atomic library of components).

For example:
```tsx
import { AtIcon, MlInfoPanel } from '@atlassian/hubba-components-library';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components: Record<string, (props: any) => JSX.Element> = {
  AtIcon: (props) => <AtIcon {...props} />,
  MlInfoPanel: (props) => (
    <MlInfoPanel {...props}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{props.description}</ReactMarkdown>
    </MlInfoPanel>
  ),
}
```
The developer gets the flexibility of doing transformations or wrapping up props of the component when rendering them. A simple example would be the `AtIcon`, which just takes the props and renders. A more complex case would be the `MlInfoPanel`, which wraps the `description` in a markdown component.

After populating the `components.tsx` file, those components will show up in the list of components when choosing them inside the configuration screen of the Contentful app.

Some other options that you have access to when configuring the preview for a specific content type are:
- **Key mappings**: change the way the fields are passed as props to the components. For example, the 'name' field in Contentful can be mapped to be passed as 'title' to the component.
- **Value mappings**: change the way the field values are passed as props to the components. For example, the color code 'N0' can be translated to be passed as '#FFFFFF' to the component.

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

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

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.
