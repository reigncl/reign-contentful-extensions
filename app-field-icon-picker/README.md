# app-field-icon-picker

Contentful field app that renders an icon picker on a JSON Object field. Ships with [Phosphor Icons](https://phosphoricons.com/) bundled at build time, but the icon-set layer is decoupled so other libraries can be added by registering a provider — no API calls, no rate limits, no runtime cache.

## How it looks

A single field with three pieces:

- **Preview tile** (left, non-clickable) — renders the currently selected icon.
- **Text input** — type to filter; shows the icon name once one is picked.
- **Grid dropdown** — 4-column grid of icons + names, opens on focus or typing. Shows `No results found` when the filter has zero matches.

## Stored value

The field must be of type **JSON Object**. The value persisted is:

```json
{ "set": "phosphor", "name": "ArrowDown" }
```

`set` is the icon-set provider id and `name` is the canonical icon id (PascalCase for Phosphor). Frontend consumers reading the field can either look the icon up in their own bundle or directly via `@phosphor-icons/react`:

```tsx
import * as PhosphorReact from '@phosphor-icons/react';

const Icon = (PhosphorReact as Record<string, any>)[value.name];
return Icon ? <Icon size={20} /> : null;
```

## Configuring the app

1. Install the app on the space.
2. On the **App config** screen, click **Add config** and pick:
   - the **content type**,
   - a **JSON Object** field on it,
   - the **icon set** (Phosphor by default).
3. Saving the config wires the app to the field automatically (the editor interface widget is updated to point to this app).

You can edit / delete each mapping later from the same screen.

## Adding a new icon set (decoupling contract)

Each icon set implements the `IconSetProvider` interface in [`src/icon-sets/types.ts`](src/icon-sets/types.ts):

```ts
export interface IconEntry {
  name: string;        // canonical id stored in the field value
  label: string;       // human readable label for filtering and display
  keywords: string[];  // lowercase tags used by the search filter
}

export interface IconSetProvider {
  id: string;                                       // value persisted as `set`
  label: string;                                    // shown in the ConfigScreen Select
  list(): IconEntry[];                              // sync (bundled at build time)
  render(name: string, opts?: { size?: number }):   // returns a React node
    React.ReactNode;
}
```

To add a new set:

1. Create `src/icon-sets/<my-set>.tsx` exporting a provider that conforms to `IconSetProvider`.
2. Register it in `src/icon-sets/index.ts`:

   ```ts
   import { registerIconSet } from './registry';
   import { mySetProvider } from './my-set';

   registerIconSet(mySetProvider);
   ```

3. Rebuild and redeploy. The new set will appear in the **Icon set** select on the ConfigScreen and existing values stay valid because every value carries its own `set` id.

## Available scripts

- `npm start` — dev mode.
- `npm run build` — production build to `./build`.
- `npm run upload` — interactive bundle upload.
- `npm run upload-ci` — CI bundle upload (requires `CONTENTFUL_ORG_ID`, `CONTENTFUL_APP_DEF_ID`, `CONTENTFUL_ACCESS_TOKEN`).
- `npm test` — run unit tests.

## Updating bundled icons

Icons ship inside the bundle via `@phosphor-icons/core` (metadata) and `@phosphor-icons/react` (components). To pick up new icons, bump those packages and redeploy — there is no runtime fetch or cache to invalidate.
