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

When modifying the `index.html` file, you need to add the `translate` directive
to the strings you want translated, then run `grunt extract` in the command line to generate
the template file `po/template.pot` that is used as a basis for the translations.

When the strings are translated, run `grunt compile` to generate the `translations.js`
file that contains the translations.

When adding a new language to the available translations, you need to add it to the `getAvailableUiLanguages`
list in the factory.

[Apache Cordova]: http://cordova.apache.org/
[Ionic framework]: http://ionicframework.com/
[Node.js]: https://nodejs.org/
[Cordova]: http://cordova.apache.org/#getstarted
[Ionic]: http://ionicframework.com/getting-started/
[cordova-plugin-inappbrowser]: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
[angular-gettext]: https://angular-gettext.rocketeer.be/
[Grunt]: https://gruntjs.com/
