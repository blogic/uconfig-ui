import * as React from 'react';

export type AppTheme = 'light' | 'dark' | 'system';

export type UsePreferencesReturn = {
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
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

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [appTheme, setAppTheme] = React.useState<AppTheme>(getInitialTheme());

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
  }, []);

  const value = React.useMemo(() => ({ appTheme, setAppTheme: onAppThemeChange }), [appTheme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
