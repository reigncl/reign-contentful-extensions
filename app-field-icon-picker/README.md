# app-field-icon-picker

Contentful field app: pick icons from bundled sets (e.g. [Phosphor Icons](https://phosphoricons.com/)) on **Short text (Symbol)**, **Long text (Text)**, or **JSON Object** fields. Other icon sets can be registered in code.

## Entry field values

Behavior depends on the **field type** in the content model and on the optional **`extraFields`** list in the app installation row for that field.

| Field type | `extraFields` in install row | Stored value |
|------------|------------------------------|--------------|
| **Symbol** | ignored (omit or `[]`) | Plain **string** — PascalCase icon id for the configured `iconSet`, e.g. `"Users"`. |
| **Text** | ignored | Same as Symbol — plain string (CMA type `Text`). |
| **Object** | absent or empty | **`{ "set": "phosphor", "name": "ArrowDown" }`** — `set` is the icon-set id, `name` the icon id in that set. |
| **Object** | non-empty array | **JSON array** — ordered list of `{ "icon": "Users", "<extraId>": "..." }` objects; keys other than `icon` match each `extraFields[].id`. |

`extraFields` is only used when the field is **Object**. If it appears in JSON for a Symbol/Text mapping, the app ignores it at runtime.

This app renders icons from **`@phosphor-icons/core` regular SVGs** (not `@phosphor-icons/react`) so the upload stays within Contentful’s bundle size limits.

On your **website** you can still use React components, for example:

```tsx
import * as PhosphorReact from "@phosphor-icons/react";
const Icon = (PhosphorReact as Record<string, any>)[value.name];
```

(Adjust if the value is a list row’s `icon` string or a full `{ set, name }` object.)

## Configure (App installation UI)

On the **App config** screen, **Add config** and choose a content type, a field (**Symbol**, **Text**, or **Object**), and an icon set. Saving wires the app to that field.

- The table shows an **Extra fields** column: **—** when list mode is off; otherwise a comma-separated list of extra field ids.
- For **JSON Object** fields only, you can add **Extra fields (list mode)** in the dialog. Each extra is a text field (`type: "text"`). With at least one extra field, editors use a **step list** (icon + text inputs per row, add/remove/reorder).

**Symbol** vs **Text** is not shown as a separate column; both store a plain icon name string.

## App definition (org)

In the Contentful org **app definition**, the **Entry field** location must allow field types **`Symbol`**, **`Text`**, and **`Object`**. Without **Text**, long-text fields cannot use this app as their editor.

## Installation parameters (canonical shape)

The app reads `sdk.parameters.installation`. The same JSON is what the config UI saves and what automation can write via the Management API.

```json
{
  "items": [
    {
      "contentType": "stepperBlock",
      "field": "steps",
      "iconSet": "phosphor",
      "fieldType": "Object",
      "extraFields": [
        { "id": "label", "label": "Label", "type": "text", "required": true },
        { "id": "description", "label": "Description", "type": "text", "required": false }
      ]
    },
    {
      "contentType": "hero",
      "field": "leadingIcon",
      "iconSet": "phosphor",
      "fieldType": "Symbol"
    }
  ]
}
```

- **`items`** — one object per mapped field. Matching at runtime: `contentType` + `field` equal the current entry’s type and field id.
- **`iconSet`** — registered provider id (e.g. `phosphor`).
- **`fieldType`** — `Symbol` | `Text` | `Object`; stored when the row is saved so the config screen can restore the correct built-in widget if you remove or move a mapping.
- **`extraFields`** — optional; only meaningful for **Object** fields. Each entry: `id`, `label`, `type: "text"`, optional `required`.

## Programmatic setup (CMA)

You can set the same `parameters` object with the [Contentful Management API](https://www.contentful.com/developers/docs/references/content-management-api/) on the **app installation** resource for your space and app definition. This is independent of uploading the app bundle.

Recommended pattern: **read** the current installation parameters, **merge** or upsert `items` (e.g. by `contentType` + `field`), then **write** the full `parameters` back so you do not drop unrelated mappings.

## Add another icon set

Implement [`IconSetProvider`](src/icon-sets/types.ts) in a new file under [`src/icon-sets/`](src/icon-sets/) and register it in [`src/icon-sets/index.ts`](src/icon-sets/index.ts):

```ts
import { registerIconSet } from "./registry";
import { mySetProvider } from "./my-set";
registerIconSet(mySetProvider);
```

The new set shows up in the config select; object-mode values keep working because each value carries its own `set` id.

## Scripts

Tooling is **Vite** + **Vitest** (no Create React App).

- `npm start` — dev server (port 3000).
- `npm run build` — TypeScript check + production bundle to `./build` (for `upload`).
- `npm run upload` / `upload-ci` — upload bundle to Contentful.
- `npm test` — unit tests (`vitest run`). Use `npm run test:watch` during development.
