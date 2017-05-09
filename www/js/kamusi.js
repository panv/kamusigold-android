var app = angular.module('main', ['ionic', 'gettext', 'ng-walkthrough']);

// Factory used to return http promises from the language api
app.factory('languageApi', function($http) {
    let api_url = "https://kamusigold.org/api/languages";
    return {
        // The api, JSON dict mapping language name to language code
        getApi: function() {
            return $http.get(api_url).then(function(response) {
                return response.data;
            });
        },
        // Inverts the keys and values of the api, language code -> language name
        getDict: function() {
            return $http.get(api_url).then(function(response) {
                let json = response.data;
                let dict = {};
                for (lang in json) {
                    if (json.hasOwnProperty(lang)) {
                        dict[json[lang]] = lang;
                    }
                }
                return dict;
            });
        },
        // Returns the list of available translations
        getAvailableUiLanguages: function() {
            return [
                {name: "العربية", code: "ar"},
                {name: "Darija", code: "ary"},
                {name: "English", code: "en"},
                {name: "Español", code: "es"},
                {name: "Euskara", code: "eu"},
                {name: "Français", code: "fr"},
                {name: "فارسی", code: "fa"},
                {name: "Język polski", code: "pl_PL"},
                {name: "Română", code: "ro"},
                {name: "ру́сский язы́к", code: "ru_RU"},
                {name: "Swahili", code: "sw"},
                {name: "اُردُو", code: "ur"}
            ];
        }
    }
});

// Factory used to access local storage
app.factory('storage', function($window) {
    let search_stack = [];
    return {
        // Stores the current UI language
        setUiLanguage: function(language) {
            $window.localStorage.setItem('uiLanguage', language);
        },
        // Returns the previous UI language, or English if none was selected
        getUiLanguage: function() {
            let language = $window.localStorage.getItem('uiLanguage');
            return language ? language : "en";
        },
        // Tests whether this is the initial launch of the app
        isInitialLaunch: function() {
            return $window.localStorage.getItem('initial_launch');
        },
        // Called after initial launch of the app
        setLaunch: function() {
            $window.localStorage.setItem('initial_launch', "nope");
        },
        // Push search query into stack
        push_search: function(search_term, src_lang, target_lang) {
            search_stack.push({source: src_lang, target: target_lang, term: search_term});
        },
        // Pop last search from stack
        pop_search: function() {
            // Double pop because last element of stack is the current search
            search_stack.pop();
            return search_stack.pop();
        }
    }
});

// Map the event functionality
window.onload = function() {
    function onConfirmQuit(button){
        if (button == "1") {
            navigator.app.exitApp();
        }
    }

    // When we click home button
    $(".homeButton").click(function() {
        $("#form").show();
        $(".homeButton").css('visibility', 'hidden');
        $(".searchButton").css('visibility', 'hidden');
        $("#sample").hide();
    });

    // When we click search button
    $(".searchButton").click(function() {
        window.scrollTo(0, 0);
        $("#within").show();
        $(".homeButton").css('visibility', 'visible');
        $(".searchButton").css('visibility', 'visible');
        $("#sample").show();
    });
};

app.controller('displayCtrl', function($scope, $ionicPlatform, languageApi,
                                       storage, $window, gettextCatalog) {

    // Load the previously selected language
    gettextCatalog.setCurrentLanguage(storage.getUiLanguage());

    // Executed on app launch
    document.addEventListener('deviceready', function() {
        // Display help on initial launch
        if (!storage.isInitialLaunch()) {
            displayWalkthrough(6);
        }

        // Prompt user to rate the app
        AppRate.preferences = {
            displayAppName: "Kamusi Here!",
            usesUntilPrompt: 2,
            promptAgainForEachNewVersion: true,
            storeAppURL: {
                ios: "org.kamusigold.kamusihere",
                android: "market://details?id=com.ionicframework.kamusi454359"
            },
            customLocale: {
                title: gettextCatalog.getString("Rate Kamusi Here!"),
                message: gettextCatalog.getString(
                    "We hope you are enjoying Kamusi Here!\n" +
                    "If we have earned your appreciation, please give us a rating now!\n" +
                    "If we still have work to earn your highest rating, please send us feedback at https://kamusigold.org/info/contact"),
                cancelButtonLabel: gettextCatalog.getString("No Thanks"),
                laterButtonLabel: gettextCatalog.getString("Remind Me Later"),
                rateButtonLabel: gettextCatalog.getString("Rate It Now")
            }
        };
        AppRate.promptForRating(false);

        // Goes back to previous searches on back button press
        $ionicPlatform.registerBackButtonAction(function() {
            let previous_search = storage.pop_search();
            if (previous_search) {
                $scope.wordSearch(previous_search.term, previous_search.source,
                    previous_search.target);
            }
        }, 100);
    }, false);

    // Called when clicking on the help button
    function displayWalkthrough(walkthrough_id) {
        switch (walkthrough_id) {
            case 0:
                $scope.walkthrough_active_0 = true;
                break;
            case 1:
                $scope.walkthrough_active_1 = true;
                break;
            case 2:
                $scope.walkthrough_active_2 = true;
                break;
            case 3:
                $scope.walkthrough_active_3 = true;
                $scope.where_are_french_and_german =
                    // Explanation to why french is not yet in the database
                    "Mais où est le français?\n" +
                    "Malheureusement, aucune donnée pour le français n'est actuellement disponible qui soit:\n" +
                    "√ facilement alignable avec les concepts existants\n" +
                    "√ de bonne qualité\n" +
                    "√ et gratuite.\n" +
                    "Une future version de l'application vous permettra de soumettre des termes français pour Kamusi, en commençant par des données imparfaites à améliorer.\n" +
                    "Vous pouvez participer au projet pour améliorer nos données dès maintenant.\n" +
                    "email: taskforce+french@kamusi.org\n\n\n" +
                    // Explanation to why german is not yet in the database
                    "Wo ist Deutsch?\n" +
                    "Leider sind keine Daten für Deutsch verfügbar, die:\n" +
                    "√ einfach an unseren Konzeptsatz auszurichten,\n" +
                    "√ hoher Qualität und\n" +
                    "√ frei\n" +
                    "sind. Eine künftige Version dieser App wird dich um deine Hilfe bitten, einen Datensatz von 17.000 Begriffen auszurichten, um Deutsch in Kamusi anzupflanzen.\n" +
                    "Mach bei der Arbeitsgruppe mit, um uns zu helfen, eine großartige deutsche Ressource zu erstellen.\n" +
                    "E-Mail: taskforce+german@kamusi.org"
                break;
            case 4:
                $scope.walkthrough_active_4 = true;
                break;
            case 5:
                $scope.walkthrough_active_5 = true;
                break;
            case 6:
                $scope.walkthrough_active_6 = true;
                break;
            case 7:
                $scope.walkthrough_active_7 = true;
                break;
        }
    }

    // Builds the links for the language sources at the bottom of the result page
    function displaySources(src_lang, trgt_lang) {
        function buildSrcArray(dict) {
            let url_root = "https://kamusigold.org/info/";

            let eng_url = "eng";
            let eng_code = "eng_3_1";

            // Parses the eng code because for english the code and url are different
            dict[eng_url] = dict[eng_code];
            src_lang = src_lang == eng_code ? eng_url : src_lang;
            trgt_lang = trgt_lang == eng_code ? eng_url : trgt_lang;

            $scope.src_langs = [];
            $scope.src_langs.push({name: dict[src_lang], link: url_root + src_lang});

            // Adds target language link if source and target are different
            if (src_lang != trgt_lang) {
                $scope.src_langs.push({name: dict[trgt_lang], link: url_root + trgt_lang});
            }

            // Adds english link if both source and target languages are not english
            if (src_lang != eng_url && trgt_lang != eng_url) {
                $scope.src_langs.push({name: dict[eng_code], link: url_root + eng_url});
            }
        }
        languageApi.getDict().then(buildSrcArray);
    }

    function displayResults(data, input_word, source_language, target_language) {
        $scope.result = data;
        $scope.search_term = input_word;
        $scope.target_language = target_language;
        languageApi.getDict().then(function(dict) {
            $scope.target_language_name = dict[target_language];
            $scope.source_language_name = dict[source_language];
        });

        $scope.$apply();
    }

    // TODO: optimize this
    // Loads the list of languages in the language selection drop-down menus (source and target)
    function loadListOfLanguages(language_obj) {
        $scope.language_list = [];
        keys = []
        for (k in language_obj) {
            if (language_obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        keys.sort()
        for (i = 0; i < keys.length; i++) {
            $scope.language_list.push({name: keys[i], code: language_obj[keys[i]]});
        }
    }

    // Load the databases languages in the drop-down menus
    languageApi.getApi().then(loadListOfLanguages);

    // Called when clicking on the swap button
    $scope.swapLanguages = function() {
        let temp_src = $scope.source_language;
        let temp_trgt = $scope.target_language;
        $scope.target_language = temp_src;
        $scope.source_language = temp_trgt;
    }

    // Loads the list of available UI translations in the drop-down selector
    $scope.translations = languageApi.getAvailableUiLanguages();

    // Called when clicking on the submit button
    $scope.run = function() {
        // Replace spaces in query by underscores
        var input_word = $scope.input_word.trim().replace(/ /g, '_');
        var src_lang = $scope.source_language;
        var trgt_lang = $scope.target_language;

        // Prevent searches when source or target language are not selected
        if (typeof src_lang != 'undefined' && typeof trgt_lang != 'undefined') {
            $scope.wordSearch(input_word, src_lang, trgt_lang);

            $("#form").hide();
            $(".homeButton").css('visibility', 'visible');
            $(".searchButton").css('visibility', 'visible');
            $("#sample").show();
        }
    };

    // Called when clicking on one of the result terms
    // First parses the source and target languages and then calls wordSearch
    $scope.targetTermOnClick = function(input_word, source, target) {
        languageApi.getDict().then(function(dict) {
            languageApi.getApi().then(function(api) {
                let src_lang = api[source];
                if (!(target in dict)) {
                    $scope.wordSearch(input_word, src_lang, api[target]);
                } else {
                    $scope.wordSearch(input_word, src_lang, target);
                }
            });
        });
    }

    // Sends a translation request to the database and displays the response
    $scope.wordSearch = function(input_word, src_lang, trgt_lang) {
        storage.push_search(input_word, src_lang, trgt_lang);
        $.get("https://kamusigold.org/preD/termTranslate/" + input_word + '/' + src_lang + '/' + trgt_lang)
            .then(function(data) {
                $("#within").hide();
                displayResults(data, input_word, src_lang, trgt_lang);
                displaySources(src_lang, trgt_lang);
                // Go to top of page on new search
                $window.scrollTo(0, 0);
            });
    }

    $scope.displayWalkthrough = function(walkthrough_id) {
        displayWalkthrough(walkthrough_id);
    }

    // Opens the given url in the cordova browser using the InAppBrowser cordova plugin
    $scope.openUrl = function(url) {
        let target = "_blank"; // use _system to open with the platform default browser
        let options = "location=yes";
        cordova.InAppBrowser.open(url, target, options);
    }

    // Switches the UI language to the one selected in the drop-down menu
    $scope.switchLanguage = function() {
        gettextCatalog.setCurrentLanguage($scope.selected_translation);
        storage.setUiLanguage($scope.selected_translation);
        // Display help on first launch after selecting the language
        if (!storage.isInitialLaunch()) {
            storage.setLaunch();
            displayWalkthrough(1);
        }
    }

    // Returns the translation of term (used for translating language names)
    $scope.translate = function(term) {
        return gettextCatalog.getString(term);
    }

    // Replaces underscores by spaces in the result terms
    $scope.parse = function(term) {
        return term.replace(/_/g, ' ');
    }

    $scope.pos = function(t1, t2) {
        let pos = t1 == undefined ? t2 : t1;
        pos = pos.slice(-1);
        return pos;
    }

    $scope.defn = function(t1, t2) {
        if (t1 != undefined) {
            var defn = t1;
        } else if (t2 != undefined) {
            var defn = t2;
        } else {
            var defn = "";
        }
        return defn;
    }
});
