import { KeyValueMap } from "contentful-management";

export type Entry<T> = T & {
  sys: { [k: string]: any };
  fields: { [k: string]: any };
};

export const cleanContentfulEntry = <T = Record<string, unknown & { fields?: Record<string, unknown> }>>(
  entry: Entry<T>,
  parameters: KeyValueMap,
  references: Map<string, any>,
): T => {
  let result: any = {};

  const id = entry.sys?.contentType?.sys?.id;
  const keyMappings = parameters[id]?.keyMappings || {};
  const valueMappings = parameters[id]?.valueMappings || {};

  const reference = references.get(entry.sys?.id);

  if (reference) {
    entry = reference;
  }

  const { fields } = entry;

  result.CONTENT_TYPE = entry.sys?.contentType?.sys?.id;
  result.CONTENTFUL_ID = entry.sys?.id;

  Object.keys(fields).forEach((k) => {
    const key = keyMappings[k] || k;
    
    if (fields[k]['en-US']) {
      fields[key] = fields[k]['en-US'];
    }

    const objectKey = key.toLowerCase();
    const field = (fields as Record<string, any>)[key];

    if (field.fields) {
      result = {
        ...result,
        [objectKey]: {
          ...cleanContentfulEntry(field, parameters, references),
        },
      };
      return;
    }

    if (field?.constructor === Object) {
      result = {
        ...result,
        [key]: {
          ...cleanContentfulEntry(field, parameters, references),
        },
      };
      return;
    }

    if (Array.isArray(field)) {
      const hasFields = field.some((item: Entry<T>) => !!item.fields);

      if (!hasFields) {
        result = { ...result, [objectKey]: field };
        return;
      }

      result = {
        ...result,
        [objectKey]: field.map((item) => ({
          ...cleanContentfulEntry(item, parameters, references),
        })),
      };
      return;
    }

    result[objectKey] = valueMappings[field] || field;
  });

  return result as unknown as T;
};
