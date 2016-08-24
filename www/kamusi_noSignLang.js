var app = angular.module('main', ['ionic']);

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

	// When we press enter after entering the word
  document.getElementById("input_word")
	.addEventListener("keyup", function (event) {
		event.preventDefault();
		
    if(event.keyCode == 13) {
      run();
		}
	});
	
  // When we click submit button
	document.getElementById("submit_btn").onclick = run;

  // When we click back button
  $(".leftArrow").click(function () {
    $("#form").show();
    $(".leftArrow").css('visibility','hidden');
    $("#sample").hide();
  })
};

// Get data and show
function run () {
	var input_word = document.getElementById("input_word").value;

  var s = document.getElementById("source_language");
  var src_lang = s.options[s.selectedIndex].value;

  var t = document.getElementById("target_language");
  var trgt_lang = t.options[t.selectedIndex].value;

  $.get(
    //"http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/:term" + input_word + "/:srclang" + src_lang + "/:dstlang" + trgt_lang,
    "http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/" + input_word + "/" + src_lang + "/" + trgt_lang,
	  //"http://128.179.142.191:3000/preD/termTranslate/" + input_word + "/" + src_lang + "/" + trgt_lang,
    function (data) {
  		angular
      .element(document.querySelector('[ng-controller="displayCtrl"]'))
      .scope()
  		.displayResults(data, input_word, trgt_lang);
  });

  // This functionality should happen even when 'Enter' is pressed.
  $("#form").hide();
  $(".leftArrow").css('visibility','visible');
  $("#sample").show();	
}

app.controller('displayCtrl', function ($scope, $http, $ionicPlatform) {

	// $ionicPlatform.onHardwareBackButton(function () {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	alert("Are you sure you want to exit ?");
	// })

  $scope.displayResults = function (data, input_word, target_language) {
   	$scope.result = data;
  	$scope.input_word = input_word;
  	$scope.target_language = target_language

    $scope.$apply();
  }

  $scope.listTerms = function (terms) {
  	var words = "";
  	for (var i = 0; i < terms.length; i++) {
      // Use the below ss_type, if 'pos' is not available.
      // ({{ob.english_concept.ss_type}})
      words = words + terms[i].lemma + " (" + terms[i].pos  + ")" ;
  		
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