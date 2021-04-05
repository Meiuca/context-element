import { CSSResult } from 'lit-element';

declare interface ThemeRegistry {
  [id: string]: any;
}

export function getComponentTheme<Theme>(component: string, defaultTheme?: Theme): Theme;

export function updateRegisteredComponents(): CSSResult[][];

export function clearTheme(): void;

export function setTheme(url: string): Promise<void>;

export function setTheme(id: string, value: any): Promise<void>;

export function setTheme(id: string, url: string): Promise<void>;

export function setTheme(theme: ThemeRegistry): Promise<void>;
