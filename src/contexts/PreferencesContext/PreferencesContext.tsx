import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as i18n from 'i18n/i18n';

export type AppTheme = 'light' | 'dark' | 'system';

export type UsePreferencesReturn = {
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
  setAppLanguage: (language: string) => void;
};

export const PreferencesContext = React.createContext<UsePreferencesReturn | null>(null);

const getInitialTheme = (): AppTheme => {
  const stored = localStorage.appTheme;

  // Setting is stored, return it
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }

  // No setting stored, check system
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const getInitialLanguage = (): string => {
  const stored = localStorage.appLanguage;

  // Setting is stored, return it
  if (stored)
      return stored;
  
  // No setting stored, check system
  let locale = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0] as any;
  if (locale && locale in i18n.resources) {
    return locale;
  }

  return 'en';
};

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<AppTheme>(getInitialTheme());
  const [appLanguage, setAppLanguage] = React.useState<string>(getInitialLanguage());
  const { i18n } = useTranslation();

  const onAppLanguageChange = (language: string) => {
    localStorage.appLanguage = language;
    setAppLanguage(language);
    i18n.changeLanguage(language);
  }

  const onAppThemeChange = (theme: AppTheme) => {
    localStorage.appTheme = theme;
    setAppTheme(theme);

    let newTheme: AppTheme = theme;

    if (theme === 'system') {
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Update HTML attribute
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // On mount, set the HTML attribute to the current theme
  React.useEffect(() => {
    onAppThemeChange(appTheme);
    onAppLanguageChange(appLanguage);
  }, []);

  const value = React.useMemo(() => ({ appTheme, setAppTheme: onAppThemeChange, setAppLanguage: onAppLanguageChange }), [appTheme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
