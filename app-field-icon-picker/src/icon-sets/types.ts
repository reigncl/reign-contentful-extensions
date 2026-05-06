import type { ReactNode } from 'react';

export interface IconValue {
  set: string;
  name: string;
}

export interface IconEntry {
  name: string;
  label: string;
  keywords: string[];
}

export interface IconRenderOptions {
  size?: number;
}

export interface IconSetProvider {
  id: string;
  label: string;
  list(): IconEntry[];
  render(name: string, opts?: IconRenderOptions): ReactNode;
}
