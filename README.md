# Kamusi Here

Multi-platform dictionary app, using [Apache Cordova] and the [Ionic framework].

## Setup

Install [Node.js], [Cordova] and [Ionic]. You then need to add the platform you want to work on
(android, ios, browser) with `cordova platform add <platform name>` and the required
Cordova plugins.

### The files

Almost all important files are in the `www` folder.

- `index.html` and `css/kamusi.css` define the layout of the app
- `js/kamusi.js` is the main code controlling the logic of the app
- `po` and `translations` contain the ui localization files
- `res` contains the assets
- `js/jquery.min.js`, `js/angular-gettext.min.js` and the `lib` folder are libraries

In the root folder `config.xml` defines the properties of the app.

### Useful commands

- `ionic serve` to preview the app in a web browser
- `ionic serve --lab` to preview the app with both Android and iOS layout
- `ionic run <platform>` to install and run the app on a connected phone
- `ionic emulate <platform>` to run the app in an emulator (requires Android Studio or Xcode)
- `cordova platform list` to list the installed and available platforms
- `cordova plugin list` to list the installed plugins

## Dependencies

### Cordova plugins

Run `cordova plugin add <plugin name>` to install the plugins.

- [whitelist], [statusbar], [device], [splashscreen] for compatibility and security
- [cordova-plugin-inappbrowser] for opening the sources links

### External libraries

- [angular-gettext], used to generate the localization of the app
- [Grunt], required by angular-gettext
- [ng-walkthrough], for onboarding

## Building the app

A more detailed guide is available [here].

### Android

Run `cordova build android --release` to generate the unsigned apk (in `platforms/android/build/outputs/apk`).

You then need to sign it with the key contained in the keystore by running
`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /path/to/keystore /path/to/apk alias_name`.

Finally run the zip align tool to optimize the apk:
`zipalign -v 4 /path/to/signed/apk /path/to/final/apk/Kamusi.apk`.  
`zipalign` is located in the `build-tools` subfolder of the Android sdk folder.

The `Kamusi.apk` file is the file that can be uploaded to the Google Play Store.

### iOS

When building for iOS, change the package name in `config.xml` from `com.ionicframework.kamusi454359`
to `org.kamusigold.kamusihere` (because Apple apparently did not like the original package name).

Build the app with `ionic build ios --release`. You then need to generate the archive:
open `platforms/ios/Kamusi.xcodeproj` and check that the package name and the version are correct.

Select `Product -> Scheme -> Edit Scheme` then `Archive` with `Build configuration`
set to `Release`. Select `Generic iOS Device` from the scheme toolbar menu and then
`Product -> Archive` to generate the archive that you can upload with the `Upload to App Store`
button.

### Updates

Increment the version number in the `config.xml` file and then follow the procedure to
build the app for the desired platform.

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
[whitelist]: http://cordova.apache.org/docs/en/6.x/reference/cordova-plugin-whitelist/
[statusbar]: http://cordova.apache.org/docs/en/6.x/reference/cordova-plugin-statusbar/
[device]: http://cordova.apache.org/docs/en/6.x/reference/cordova-plugin-device/
[splashscreen]: http://cordova.apache.org/docs/en/6.x/reference/cordova-plugin-splashscreen/
[cordova-plugin-inappbrowser]: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/
[angular-gettext]: https://angular-gettext.rocketeer.be/
[Grunt]: https://gruntjs.com/
[ng-walkthrough]: https://github.com/souly1/ng-walkthrough
[here]: http://ionicframework.com/docs/guide/publishing.html#building-the-app-for-production
[Poedit]: https://poedit.net/
