# Translations
The project uses [react-i18next](https://react.i18next.com/) and [i18next](https://www.i18next.com/) for it's translations needs. It is set up for 100% TypeScript compatibility, so you will not be able to use a translation key which does not exist.

### Namespaces
It is set up to use namespaces, which will allow contributors to add new pages or components, without having to merge their new translations in a huge JSON file where some keys might already exist.

For example, if someone would like to add a new page called "Compatibility", here are the steps needed:

- Add new files **src/i18n/translations/\**/page.compability.json** for all languages
- Edit **src/i18n/i18n.ts** to import the new translation files and add them to the corresponding language namespaces. You will need to choose the namespace, you could choose "compability" for this new page.
- You can now consume you new translations by calling the **useTranslation('compatibility')**

