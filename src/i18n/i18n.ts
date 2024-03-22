import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonEn from './translations/en/common.json';
import loginEn from './translations/en/login.json';
import navigationEn from './translations/en/navigation.json';
import actionsEn from './translations/en/page.actions.json';
import clientEn from './translations/en/page.client.json';
import clientsEn from './translations/en/page.clients.json';
import homeEn from './translations/en/page.home.json';
import networkEn from './translations/en/page.network.json';
import setupEn from './translations/en/page.setup.json';
import systemEn from './translations/en/page.system.json';
import wirelessEn from './translations/en/page.wireless.json';
import commonFr from './translations/fr/common.json';
import loginFr from './translations/fr/login.json';
import navigationFr from './translations/fr/navigation.json';
import actionsFr from './translations/fr/page.actions.json';
import clientFr from './translations/fr/page.client.json';
import clientsFr from './translations/fr/page.clients.json';
import homeFr from './translations/fr/page.home.json';
import networkFr from './translations/fr/page.network.json';
import setupFr from './translations/fr/page.setup.json';
import systemFr from './translations/fr/page.system.json';
import wirelessFr from './translations/fr/page.wireless.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    actions: actionsEn,
    client: clientEn,
    clients: clientsEn,
    common: commonEn,
    home: homeEn,
    login: loginEn,
    navigation: navigationEn,
    setup: setupEn,
    network: networkEn,
    system: systemEn,
    wireless: wirelessEn,
  },
  fr: {
    actions: actionsFr,
    client: clientFr,
    clients: clientsFr,
    common: commonFr,
    home: homeFr,
    login: loginFr,
    navigation: navigationFr,
    setup: setupFr,
    network: networkFr,
    system: systemFr,
    wireless: wirelessFr,
  },
} as const;

i18next.use(initReactI18next).init({
  lng: 'en',
  resources,
  returnNull: false,
  defaultNS,
});
