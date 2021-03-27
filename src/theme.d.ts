interface JotaThemeRegistry {
  [component: string]: any;
}

export function getComponentTheme<Theme>(component: string, defaultTheme: Theme = {}): Theme;

export function setTheme(url: string): Promise<void>;

export function setTheme(id: string, value: JotaThemeRegistry): Promise<void>;

export function setTheme(id: string, url: string): Promise<void>;

export function setTheme(theme: JotaThemeRegistry): Promise<void>;
