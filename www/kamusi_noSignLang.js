var app = angular.module('main', ['ionic']);

function swapLanguages(){	 
	var trgt_idx = document.getElementById("target_language").selectedIndex;
	var src_idx =  document.getElementById("source_language").selectedIndex;
	document.getElementById("target_language").selectedIndex = src_idx;
	document.getElementById("source_language").selectedIndex = trgt_idx;
}

window.onload = function() {
	document.getElementById("swap").title = "Swap Languages";
	document.getElementById("swap").onclick = swapLanguages;

	$(document.getElementById("input_word")).bind('change', function(){
		var input_word = document.getElementById("input_word").value;
	});

	// Saving Settings on input change
	$(document.getElementById("source_language")).bind('change', function(){
		var src_idx =  document.getElementById("source_language").selectedIndex;
	});

	$(document.getElementById("target_language")).bind('change', function(){
		var trgt_idx =  document.getElementById("target_language").selectedIndex;
	});
    
	document.getElementById("input_word")
	.addEventListener("keyup", function(event) {
		event.preventDefault();
		
		if (event.keyCode == 13) {
			run();
		}
	});
	
	document.getElementById("submit_btn").onclick = run;
};

function run() {
	var dumpTarget = document.getElementById("dump");
	var s = document.getElementById("source_language");
	var src_lang = s.options[s.selectedIndex].value;
	var src_lang_word = s.options[s.selectedIndex].text;
	
	var t = document.getElementById("target_language");
	var trgt_lang = t.options[t.selectedIndex].value;
	var trgt_lang_word = t.options[t.selectedIndex].text;

	var input_word = document.getElementById("input_word").value;

	var trgt_idx = document.getElementById("target_language").selectedIndex;
	var src_idx = document.getElementById("source_language").selectedIndex;

	var displayEnglish = false;

	if(src_lang != "eng_3_1" && trgt_lang != "eng_3_1"){
		displayEnglish = true;
	}

	//$.get("http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/:term"+input_word+"/:srclang"+src_lang+"/:dstlang"+trgt_lang
	$.get("http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/"+input_word+"/"+src_lang+"/"+trgt_lang
	//$.get("http://128.179.142.191:3000/preD/termTranslate/"+input_word+"/"+src_lang+"/"+trgt_lang
	//$.get("http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/"+input_word+"/"+src_lang+"/"+trgt_lang
	,function (data) {
		angular.element(document.querySelector('[ng-controller="displayCtrl"]')).scope()
		.displayResults(data, input_word, src_lang, trgt_lang, dumpTarget, displayEnglish ,trgt_lang_word, src_lang_word);             	;     	
     });	
}

//Android code

$(document).ready(function() {
	$("#submit_btn").click(function() {
	    $("#form").hide();
	    $(".leftArrow").css('visibility','visible');
	    $("#sample").show();
	});


	$(".leftArrow").click(function() {
		$("#dump").hide();
		$("#form").show();
		$(".leftArrow").css('visibility','hidden');
		$("#sample").hide();
	})
}); 

app.controller('displayCtrl', function($scope, $http, $ionicPlatform) {

	$ionicPlatform.onHardwareBackButton(function() {
		event.preventDefault();
		event.stopPropagation();
		alert("Are you sure you want to exit ?");
	})


  $scope.displayResults = function(data, input_word, src_lang, trgt_lang, displayEnglish, trgt_lang_word, src_lang_word) {
   	$scope.result = data;
  	$scope.input_word = input_word;
  	$scope.source_language = source_language;
  	$scope.target_language = target_language;

  	var t = document.getElementById("target_language");
	$scope.target_language = t.options[t.selectedIndex].text;

	$scope.$apply();
  }

  $scope.listTerms = function(terms) {
  	var words = "";
  	for (var i = 0; i < terms.length; i++) {
  		words = words + terms[i].lemma + " (" + terms[i].pos  + ")" ;
  		// Use the below ss_type, if 'pos' is not available.
  		// ({{ob.english_concept.ss_type}})
  		if (i != terms.length - 1) {
  			words = words + ", "
  		}
  	}
  	return words;
  }

  $scope.pos = function(t1,t2) {

   if (t1 ==undefined) {
   	  var pos = t2
   } else {
   	var pos = t1
   }

   pos = pos.slice(-1);
   return pos;
  }

  $scope.defn =function(t1,t2) {

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