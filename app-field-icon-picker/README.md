# app-field-icon-picker

Contentful field app: an icon picker for **JSON Object** fields. Bundled with [Phosphor Icons](https://phosphoricons.com/) at build time and pluggable for other icon sets.

## Field setup

The Contentful field this app is wired to **must be of type JSON Object**. The app stores the selected icon as the following JSON shape:

```json
{ "set": "phosphor", "name": "ArrowDown" }
```

- `set` — icon-set provider id (e.g. `"phosphor"`).
- `name` — canonical icon id within that set (PascalCase for Phosphor, e.g. `"ArrowDown"`).

This app renders icons from **`@phosphor-icons/core` regular SVGs** (not `@phosphor-icons/react`) so the upload stays within Contentful’s bundle size limits.

On your **website** you can still use React components, for example:

```tsx
import * as PhosphorReact from "@phosphor-icons/react";
const Icon = (PhosphorReact as Record<string, any>)[value.name];
```

## Configure

On the **App config** screen click **Add config** and pick a content type, a JSON Object field, and the icon set. Saving wires the app to the field automatically.

## Add another icon set

Implement [`IconSetProvider`](src/icon-sets/types.ts) in a new file under [`src/icon-sets/`](src/icon-sets/) and register it in [`src/icon-sets/index.ts`](src/icon-sets/index.ts):

```ts
import { registerIconSet } from "./registry";
import { mySetProvider } from "./my-set";
registerIconSet(mySetProvider);
```

The new set shows up in the ConfigScreen select; existing values stay valid because each one carries its own `set` id.

## Scripts

Tooling is **Vite** + **Vitest** (no Create React App).

- `npm start` — dev server (port 3000).
- `npm run build` — TypeScript check + production bundle to `./build` (for `upload`).
- `npm run upload` / `upload-ci` — upload bundle to Contentful.
- `npm test` — unit tests (`vitest run`). Use `npm run test:watch` during development.
