var app = angular.module('main', ['ionic']);

// app.run(function($ionicPlatform, $ionicPopup) {

//   //  $ionicPlatform.onHardwareBackButton(function () {
//   // event.preventDefault();
//   // event.stopPropagation();
//   //   alert("Are you sure you want to exit ?");
//   //  });
// });

// Disable BACK button on home
// var deregisterHardBack = $ionicPlatform.registerBackButtonAction(
//     doCustomBack, 101
// );

// document.addEventListener('backbutton', () => {
// let nav = this.app.getComponent('nav');
// if (!nav.canGoBack()) {
// return navigator.app.exitApp();
// }
// return nav.pop();
// }, false);

function swapLanguages () {
    var trgt_idx = document.getElementById("target_language").selectedIndex;
    var src_idx =  document.getElementById("source_language").selectedIndex;

    document.getElementById("target_language").selectedIndex = src_idx;
    document.getElementById("source_language").selectedIndex = trgt_idx;
}

// Map the event functionality
window.onload = function () {
    // When we click swap button
    document.getElementById("swap").onclick = swapLanguages;

    // document.addEventListener("deviceready", onDeviceReady, false);

    // function onDeviceReady() {
    //   document.addEventListener("backbutton", function () {
    //   alert("Hey!");
    //   // navigator.notification.confirm(
    //   //   'Do you want to quit',
    //   //   onConfirmQuit,
    //   //   'QUIT TITLE',
    //   //   'OK,Cancel'
    //   // );
    //   alert("cool down");
    // }, false);
    // }

    // document.addEventListener("backbutton", function () {
    //   //alert("Hey!");
    //   navigator.notification.confirm(
    //     'Do you want to quit',
    //     onConfirmQuit,
    //     'QUIT TITLE',
    //     'OK,Cancel'
    //   );
    // }, true);

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
        $("#within").show();
        $(".leftArrow").css('visibility','visible');
        $(".searchButton").css('visibility','visible');
        $("#sample").show();
    });
};

// ------------ Double back button press to exit---------------
document.addEventListener('backbutton', () => {
    if (this.nav.canGoBack()) {
        this.nav.pop()
        return;
    }
    if (!this.backPressed) {
        this.backPressed = true
        window.plugins.toast.show('Presiona el boton atras de nuevo para cerrar', 'short', 'bottom')
        setTimeout(() => this.backPressed = false, 2000)
        return;
    }
    // this.platform.exitApp()
    navigator.app.exitApp()
}, false);

app.controller('displayCtrl', function ($scope, $http, $ionicPlatform) {

    // function callLanguageListAPI() {
    //   var req = new XMLHttpRequest();
    //   req.onreadystatechange = function() {
    //       if (req.readyState == 4 && req.status == 200)
    //           loadListOfLanguages(JSON.parse(req.responseText));
    //   }
    //   url = "https://kamusigold.org/api/languages"
    //   req.open("GET", url, true); // true for asynchronous
    //   req.send(null);
    // }

    $.get("https://kamusigold.org/api/languages")
        .then(loadListOfLanguages);

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

    // callLanguageListAPI();

    // Get data and show
    $scope.run = function() {
        var input_word = $scope.input_word.trim(); //document.getElementById("input_word").value;

        //var s = document.getElementById("source_language");
        var src_lang = $scope.source_language; // s.options[s.selectedIndex].value;

        //var t = document.getElementById("target_language");
        var trgt_lang = $scope.target_language ; //t.options[t.selectedIndex].value;

        $.get(
        //"http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/:term" + input_word + "/:srclang" + src_lang + "/:dstlang" + trgt_lang,
        //"http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/" + input_word + "/" + src_lang + "/" + trgt_lang,
        "https://kamusigold.org/preD/termTranslate/" + input_word + "/" + src_lang + "/" + trgt_lang,

        //"http://128.179.142.191:3000/preD/termTranslate/" + input_word + "/" + src_lang + "/" + trgt_lang,
        function (data) {
            displayResults(data, input_word, trgt_lang);
        });

        displaySources(src_lang, trgt_lang);

        // This functionality should happen even when 'Enter' is pressed.
        $("#form").hide();
        $(".leftArrow").css('visibility','visible');
        $(".searchButton").css('visibility','visible');
        $("#sample").show();
    };

    displaySources = function (src_lang, trgt_lang) {
        function buildSrcArray(dict) {
            let url_root = "https://kamusigold.org/info/";
            $scope.src_langs = [];

            $scope.src_langs.push({name: dict[src_lang], link: url_root + src_lang});

            if (src_lang != trgt_lang) {
                $scope.src_langs.push({name: dict[trgt_lang], link: url_root + trgt_lang});
            }

            let eng_code = "eng_3_1";
            if (src_lang != eng_code && trgt_lang != eng_code) {
                $scope.src_langs.push({name: dict[eng_code], link: url_root + eng_code});
            }
        }

        $.get("https://kamusigold.org/api/languages")
            .then(function(lang_json) {
                let dict = {};
                for (lang in lang_json) {
                    if (lang_json.hasOwnProperty(lang)) {
                        dict[lang_json[lang]] = lang;
                    }
                }
                return dict;})
            .then(buildSrcArray);
    }

    displayResults = function (data, input_word, target_language) {
        $scope.result = data;
        $scope.search_term = input_word;
        $scope.target_language = target_language

        $scope.$apply();
    }

    $scope.listTerms = function (terms) {
        var words = "";
        for (var i = 0; i < terms.length; i++) {
            // Use the below ss_type, if 'pos' is not available.
            // ({{ob.english_concept.ss_type}})
            words = words + terms[i].lemma + " (" + terms[i].pos  + ")";

            if (i != terms.length - 1) {
                words = words + ", "
            }
        }
        return words;
    }

    $scope.pos = function (t1, t2) {
        if (t1 == undefined) {
            var pos = t2
        } else {
            var pos = t1
        }

        pos = pos.slice(-1);
        return pos;
    }

    $scope.defn = function (t1, t2) {
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
