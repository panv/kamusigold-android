var app = angular.module('main', ['ionic', 'gettext']);

// Factory used to return http promises from the language api
app.factory("languageApi", function($http) {
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
                {name: "English", code: "en"},
                {name: "French", code: "fr"}
            ];
        }
    }
});

function swapLanguages() {
    var trgt_idx = document.getElementById("target_language").selectedIndex;
    var src_idx = document.getElementById("source_language").selectedIndex;

    document.getElementById("target_language").selectedIndex = src_idx;
    document.getElementById("source_language").selectedIndex = trgt_idx;
}

// Map the event functionality
window.onload = function() {
    // When we click swap button
    document.getElementById("swap").onclick = swapLanguages;

    function onConfirmQuit(button){
        if (button == "1") {
            navigator.app.exitApp();
        }
    }

    // When we click leftArrow button
    $(".leftArrow").click(function() {
        $("#form").show();
        $(".leftArrow").css('visibility','hidden');
        $(".searchButton").css('visibility','hidden');
        $("#sample").hide();
    });

    // When we click search button
    $(".searchButton").click(function() {
        window.scrollTo(0, 0);
        $("#within").show();
        $(".leftArrow").css('visibility','visible');
        $(".searchButton").css('visibility','visible');
        $("#sample").show();
    });
};

// ------------ Double back button press to exit---------------
document.addEventListener('backbutton', () => {
    if (this.nav.canGoBack()) {
        this.nav.pop();
        return;
    }
    if (!this.backPressed) {
        this.backPressed = true;
        window.plugins.toast.show('Presiona el boton atras de nuevo para cerrar', 'short', 'bottom');
        setTimeout(() => this.backPressed = false, 2000);
        return;
    }
    navigator.app.exitApp();
}, false);

app.controller('displayCtrl', function($scope, $ionicPlatform, languageApi, $window, gettextCatalog) {

    // TODO: optimize this
    // Languages used in the language selection drop-down menu
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
            $scope.language_list.push({"name": keys[i], "code": language_obj[keys[i]]});
        }
    }
    languageApi.getApi().then(loadListOfLanguages);

    // Load the list of available translations in the drop-down selector
    $scope.translations = languageApi.getAvailableUiLanguages();

    // Get data and show
    $scope.run = function() {
        var input_word = $scope.input_word.trim();
        var src_lang = $scope.source_language;
        var trgt_lang = $scope.target_language;

        $scope.wordSearch(input_word, src_lang, trgt_lang);

        // This functionality should happen even when 'Enter' is pressed.
        $("#form").hide();
        $(".leftArrow").css('visibility','visible');
        $(".searchButton").css('visibility','visible');
        $("#sample").show();
    };

    // Function called when clicking on one of the result terms.
    // It first parses the source and target languages and then calls wordSearch
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
        $.get("https://kamusigold.org/preD/termTranslate/" + input_word + "/" + src_lang + "/" + trgt_lang)
            .then(function(data) {
                $("#within").hide();
                displayResults(data, input_word, trgt_lang);
                displaySources(src_lang, trgt_lang);
                $window.scrollTo(0, 0);
            });
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

    function displayResults(data, input_word, target_language) {
        $scope.result = data;
        $scope.search_term = input_word;
        $scope.target_language = target_language;
        languageApi.getDict().then(function(dict) {
            $scope.target_language_name = dict[target_language];
        });

        $scope.$apply();
    }

    // Opens the given url in the cordova browser using the InAppBrowser cordova plugin
    $scope.openUrl = function(url) {
        let target = "_blank"; // use _system to open with the platform default browser
        let options = "location=yes";
        cordova.InAppBrowser.open(url, target, options);
    }

    // Switch the language to the one selected in the drop-down menu
    $scope.switchLanguage = function() {
        gettextCatalog.setCurrentLanguage($scope.selected_translation);
    }

    // Returns the translation of term (used for translating language names)
    $scope.translate = function(term) {
        return gettextCatalog.getString(term);
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
