angular.module("languageNames").controller("dummy", function(gettext) {
    let language_names = [
        gettext("Arabic"),
        gettext("Basque"),
        gettext("Catalan"),
        gettext("English"),
        gettext("Galician"),
        gettext("Italian"),
        gettext("Persian"),
        gettext("Portuguese"),
        gettext("Romanian"),
        gettext("Slovak"),
        gettext("Spanish")
    ];
});
