import { IconSetProvider } from './types';

const providers = new Map<string, IconSetProvider>();

export const DEFAULT_ICON_SET_ID = 'phosphor';

export const registerIconSet = (provider: IconSetProvider): void => {
  providers.set(provider.id, provider);
};

export const getIconSet = (id?: string): IconSetProvider | undefined => {
  if (!id) return providers.get(DEFAULT_ICON_SET_ID);
  return providers.get(id);
};

export const listIconSets = (): IconSetProvider[] => {
  return Array.from(providers.values());
};

export const hasIconSet = (id: string): boolean => providers.has(id);
