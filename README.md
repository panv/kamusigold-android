# Kamusi Here

Multi-platform dictionary app, using [Apache Cordova] and the [Ionic framework].

## Setup

Install [Node.js], [Cordova] and [Ionic]. You then need to add the platform you want to work on
(android, ios, browser) and the required cordova plugins (for now only the InAppBrowser plugin).

### The files

Almost all important files are in the `www` folder.

- `index.html` and `css/kamusi.css` define the layout of the app
- `js/kamusi.js` is the main code controlling the logic of the app
- `po` and `translations` contain the ui localization files

In the root folder `config.xml` defines the properties of the app.

### Useful commands

- `ionic serve` to preview the app in a web browser
- `ionic serve --lab` to preview the app with an android and ios layout
- `ionic run <platform>` to install and run the app on a connected phone
- `ionic emulate <platform>` to run the app in an emulator (requires android studio or xcode)

## Dependencies

### Cordova plugins

Run `cordova plugin add <plugin name>` to install the plugins.

- [cordova-plugin-inappbrowser]

### External libraries

- [angular-gettext], used to generate the localization of the app
- [Grunt], required by angular-gettext

## Translations

When modifying the `index.html` file, you need to mark the strings you want translated
with the `translate` directive, or use the `translate(term)` function when markup is
not applicable (typically in interpolations). If you need to translate a string in a
javascript file, use the `gettext` function (it requires a `gettext` dependency).

When all strings have been marked for translation, run `grunt extract` in the command line
to extract them and generate the template file `www/po/template.pot` that is used as a basis
for the translations. The easiest way to translate the strings is to use [Poedit].
The translations are saved in a `<language code>.po` file in the `www/po` folder.

When the translation is done, run `grunt compile` to generate the `translations.js`
file that contains the translated strings that will be automatically injected back into the app.

When adding a new language to the available translations, you need to add it to the
`getAvailableUiLanguages` list in the factory, in the `www/js/kamusi.js` file.

When a new language is added to the available source and target languages in the database,
you need to add its name to the list in `www/js/language-names.js`.


[Apache Cordova]: http://cordova.apache.org/
[Ionic framework]: http://ionicframework.com/
[Node.js]: https://nodejs.org/
[Cordova]: http://cordova.apache.org/#getstarted
[Ionic]: http://ionicframework.com/getting-started/
[cordova-plugin-inappbrowser]: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
[angular-gettext]: https://angular-gettext.rocketeer.be/
[Grunt]: https://gruntjs.com/
[Poedit]: https://poedit.net/
