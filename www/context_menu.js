





var contexts = ["selection"];

for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Kamusi Here! Translate '%s'..";

  chrome.contextMenus.removeAll();
 chrome.contextMenus.create({"title": title, "contexts":[context],
	                               "onclick": openWindow});
  
}



function openWindow(info) {

var input_word = info.selectionText;
chrome.storage.sync.set({'input_word': input_word}, function() {
			var myWindow = window.open('kamusi_ext-v1.html', 'MsgWindow',"width=850,height=600");
		});

}



/*var src_lang = "eng_3_1";
var src_lang_word = "English";
var trgt_lang = "eus";
var trgt_lang_word = "Basque"; */

chrome.runtime.onInstalled.addListener(function(details){

var trgt_idx = 6;
var src_idx = 5;
var input_word = "client";

	chrome.storage.sync.set({'src_idx': src_idx}, function() {
			
		});

		chrome.storage.sync.set({'trgt_idx': trgt_idx}, function() {
			
		});

	chrome.storage.sync.set({'input_word': input_word}, function() {
			
		});


    /*if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }*/
});