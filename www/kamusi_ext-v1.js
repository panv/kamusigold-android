// To DO:

// 2. search for languages




window.onload = function() {

	
	var formTarget = document.getElementById("form");
	
	var legendBigDiv = document.createElement("div");
	
	var wordDiv = document.createElement("div");
	wordDiv.setAttribute('class','wordDiv w3-container');
	//	$(wordDiv).data("stack", []);   // to store the deleted li definintions
	
	legendBigDiv.setAttribute('class','legendDiv w3-container');
	legendBigDiv.setAttribute('id','legendBigDiv');
	
	var srcLangDiv = document.createElement("div");
	srcLangDiv.setAttribute('class','language w3-container');
	
	var t = document.createTextNode("Language");
	srcLangDiv.appendChild(t);
	legendBigDiv.appendChild(srcLangDiv);

	var inputTermDiv = document.createElement("div");
	
	inputTermDiv.setAttribute('class','inputTermDiv w3-container');
	
	var inputTerm = document.createElement("div");
	inputTerm.setAttribute('class','inputTerm w3-container');
	var t = document.createTextNode("Term");
	inputTerm.appendChild(t);
	inputTermDiv.appendChild(inputTerm);

	legendBigDiv.appendChild(inputTermDiv);

	

	var sourceInfo = document.createElement("div");
	sourceInfo.setAttribute('class','sourceInfo w3-container');
	

	
	var singleInfoDiv = document.createElement("div");
	singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
	var t = document.createTextNode("Definition - Context Example");
	singleInfoDiv.appendChild(t);
	sourceInfo.appendChild(singleInfoDiv);

	legendBigDiv.appendChild(sourceInfo);


	$(legendBigDiv).hide();
	formTarget.appendChild(legendBigDiv);



	document.getElementById("input_word")
	.addEventListener("keyup", function(event) {
		event.preventDefault();
		
		if (event.keyCode == 13) {
			
			run();
		}
	});
 document.getElementById("submit_btn").onclick= run();
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

	var displayEnglish = false;

	if(src_lang != "eng_3_1" && trgt_lang != "eng_3_1"){
		displayEnglish = true;
	}

	//dumpTarget.innerHTML = "before server request";

	//$.get("http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/:term"+input_word+"/:srclang"+src_lang+"/:dstlang"+trgt_lang
	$.get("http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/"+input_word+"/"+src_lang+"/"+trgt_lang
	//$.get("http://128.179.142.191:3000/preD/termTranslate/"+input_word+"/"+src_lang+"/"+trgt_lang
	//$.get("http://lsir-kamusi.epfl.ch:3000/preD/termTranslate/"+input_word+"/"+src_lang+"/"+trgt_lang
	,function (data) {
             	//dumpTarget.innerHTML = "before function call request";
             	//alert(JSON.stringify(data))
             	displayResults(data, input_word, src_lang, trgt_lang, dumpTarget, displayEnglish ,trgt_lang_word, src_lang_word);
             });

	
	
}

function displayResults(data, input_word, src_lang, trgt_lang, dumpTarget, displayEnglish, trgt_lang_word, src_lang_word){
	//$(dumpTarget).fadeOut();
	dumpTarget.innerHTML = "";

	dumpTarget = document.createElement("div");

	if(data==""){

		var h = document.createElement("H3");
		var t = document.createTextNode("No data yet for "+ input_word +" in "+src_lang_word);
		h.appendChild(t);
		dumpTarget.appendChild(h);

		var dumpDiv = document.getElementById("dump");
		dumpTarget.style.display= "none";
		
		$(dumpTarget).appendTo($(dumpDiv)).slideDown();;
		return;
	}
	
	serverWords=[];
	var searchTerms = [];
	
	for (var i = 0; i < data.length; i++) {
		var obj = {};
		
		var src_concecpt = data[i].source_concept;
		if(src_concecpt != null){
			//alert("src_cncpt not null");
			var src_definition = src_concecpt.definition;
			var src_pos = src_concecpt.synset_ID_3_1;

			if (src_pos == undefined){
				src_pos = src_concecpt.synset_ID_3_0;
			}
			src_pos = src_pos.slice(-1);
			var src_gloss = "";

			if(src_definition == undefined ){
				src_definition = "";
				src_gloss = src_concecpt.gloss;
				if(src_gloss == undefined){
					src_gloss="";
				}
			}
			var src_example_sents  = src_concecpt.example_sents;
			
			if(src_example_sents != undefined && src_example_sents != ""){
				src_example_sent = src_example_sents[0];
			}
			else{
				src_example_sent = "";
			}

			var src_language = src_concecpt.language;

			obj.src_term = input_word + " ("+ src_pos +")";
			obj.src_definition = src_definition;
			obj.src_example_sents = src_example_sent;
			obj.src_gloss = src_gloss;
			obj.src_language = src_language;

		}

		var trgt_concept = data[i].target_concept;
		
		if(trgt_concept != null){ 

			
			
			var trgt_definition = trgt_concept.definition;
			var trgt_example_sents  = trgt_concept.example_sents;
			if(trgt_example_sents != undefined && trgt_example_sents != ""){
				trgt_example_sent = trgt_example_sents[0];
			}

			else{
				trgt_example_sent ="";
			}
			
			var trgt_language = trgt_concept.language;
			var trgt_gloss = "";

			if(trgt_definition == undefined){
				trgt_definition = "";
				trgt_gloss = trgt_concept.gloss;
				if(trgt_gloss == undefined){
					trgt_gloss="";
				}
			}
			

			var dest_terms = [];
			var terms = data[i].target_terms;
			for (var j = 0; j < terms.length; j++){
				dest_terms.push(terms[j].lemma +" (" + terms[j].pos + ")");
			}

			obj.dest_definition = trgt_definition;
			obj.dest_example_sents = trgt_example_sent;
			obj.dest_gloss = trgt_gloss;
			obj.dest_terms  = dest_terms;	
			obj.dest_language = trgt_language;
			obj.dest_concept = true; //it means that we find dest terms!
		}

		else{
			obj.dest_definition = "";
			obj.dest_example_sents = "";
			obj.dest_gloss = "";
			obj.dest_terms  = "";
			obj.dest_language = trgt_lang_word;
			obj.dest_concept = false; //it means that we couldn't find dest terms!
		}

		var eng_terms = [];
		var found = false;
		if(displayEnglish && data[i].english_concept != null){
			//alert("dispalying english!!");
			var terms = data[i].eng_terms;

			for (var j = 0; j < terms.length; j++){
				eng_terms.push(terms[j].lemma +" (" + terms[j].pos + ")");

				if(terms[j].lemma == 'cat'){
					
					found = terms[j].lemma;
				}

				else if(terms[j].lemma == 'dog'){
					
					found = terms[j].lemma;
				}

				else if(terms[j].lemma == 'police'){
					
					found = terms[j].lemma;
				}
				
			}

			searchTerms.push(found);

			var english_definition = data[i].english_concept.definition;
			var english_example_sents  = data[i].english_concept.example_sents;
			if(english_example_sents != undefined && english_example_sents != ""){
				english_example_sent = english_example_sents[0];
			}

			else{
				english_example_sent ="";
			}

			obj.english_definition = english_definition;
			obj.english_example_sents = english_example_sent;
			obj.eng_terms = eng_terms;
			obj.eng_concept = true;
			
		}
		else{
			obj.english_definition = "";
			obj.english_example_sents = "";
			obj.eng_terms = "";
			obj.eng_concept = false;
			
		}


		
		/*var trgt_language = data[i].target_concept.language;
		var trgt_gloss = "";

		if(trgt_definition == undefined){
			trgt_definition = "";
			trgt_gloss = data[i].target_concept.gloss;
			if(trgt_gloss == undefined){
				trgt_gloss="";
			}
		}*/
		
		
		

		

		serverWords.push(obj);	
		
	}

	if(trgt_lang =='hds' || trgt_lang =='nps'){
		
		for (var i=0; i < serverWords.length; i++){

			var wordDiv = document.createElement("div");
			var sourceDiv = document.createElement("div");
			var targetDiv = document.createElement("div");
			var englishDiv = document.createElement("div");

			wordDiv.setAttribute('class','wordDiv w3-container');
		//	$(wordDiv).data("stack", []);   // to store the deleted li definintions
		
		sourceDiv.setAttribute('class','sourceDiv w3-container');
		
		var srcLangDiv = document.createElement("div");
		srcLangDiv.setAttribute('class','language w3-container');
		
		var t = document.createTextNode(serverWords[i].src_language);
		srcLangDiv.appendChild(t);
		sourceDiv.appendChild(srcLangDiv);

		var inputTermDiv = document.createElement("div");
		
		inputTermDiv.setAttribute('class','inputTermDiv w3-container');
		
		var inputTerm = document.createElement("div");
		inputTerm.setAttribute('class','inputTerm w3-container');
		var t = document.createTextNode(serverWords[i].src_term);
		inputTerm.appendChild(t);
		inputTermDiv.appendChild(inputTerm);

		sourceDiv.appendChild(inputTermDiv);

		

		var sourceInfo = document.createElement("div");
		sourceInfo.setAttribute('class','sourceInfo w3-container');
		

		if(serverWords[i].src_definition !=""){
			var singleInfoDiv = document.createElement("div");
			singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
			var t = document.createTextNode(serverWords[i].src_definition);
			singleInfoDiv.appendChild(t);
			sourceInfo.appendChild(singleInfoDiv);
		}

		if(serverWords[i].src_example_sents !=""){
			var singleInfoDiv = document.createElement("div");
			singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
			var t = document.createTextNode(serverWords[i].src_example_sents);
			singleInfoDiv.appendChild(t);
			sourceInfo.appendChild(singleInfoDiv);
		}

		if(serverWords[i].src_gloss !=""){
			var singleInfoDiv = document.createElement("div");
			singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
			var t = document.createTextNode(serverWords[i].src_gloss);
			singleInfoDiv.appendChild(t);
			sourceInfo.appendChild(singleInfoDiv);
		}

		sourceDiv.appendChild(sourceInfo);


		targetDiv.setAttribute('class','targetDiv w3-container');
		

		var trgtLangDiv = document.createElement("div");
		trgtLangDiv.setAttribute('class','language w3-container');
		var t = document.createTextNode(serverWords[i].dest_language);
		trgtLangDiv.appendChild(t);
		targetDiv.appendChild(trgtLangDiv);

		var termsDump = document.createElement('div');
			termsDump.className ="w3-container termsDump";// w3-border";
			//ul.className ="w3-ul w3-border";
			
			// creating an li radio button for each definition
			if(searchTerms[i] || src_language == 'English'){
				searchTerm = searchTerms[i];
				if(src_language == 'English'){
					searchTerms[i] = input_word;
				}
				var targetInfo = document.createElement("div");
				targetInfo.setAttribute('class','wordInfo w3-container');

				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','noInfo w3-container');
				




				if(trgt_lang =='hds'){

					if(src_language == 'English'){
							var searchTerm = input_word;
							
						}
						
					
						
						if(searchTerm == 'cat'){
							var link = 'https://www.youtube.com/watch?v=ckcml3_IdF8&feature=youtu.be';
							var link = link.replace("watch?v=", "v/");
							
							
							singleInfoDiv.innerHTML += '<iframe src=' +link+"> </iframe>";

						}

						else if(searchTerm == 'dog'){
							var link = 'https://www.youtube.com/watch?v=O9idnHAH3fo&feature=youtu.be';
							link = link.replace("watch?v=", "v/");
							
							singleInfoDiv.innerHTML += '<iframe src=' +link+"> </iframe>";

						}
						else if(searchTerm == 'police'){
							var link = 'https://www.youtube.com/watch?v=F8IAlGnJes0&feature=youtu.be';
							link = link.replace("watch?v=", "v/");
							
							singleInfoDiv.innerHTML += '<iframe  src=' +link+"> </iframe>";
						}
					}

				else if(trgt_lang =='nps'){
						
						if(src_language == 'English'){
							var searchTerm = input_word;
							
						}
						
						if(searchTerm == 'cat'){
							var link = 'https://www.youtube.com/watch?v=oIpwXLE9a7w&feature=youtu.be';
							link = link.replace("watch?v=", "v/");
							
							singleInfoDiv.innerHTML += '<iframe src=' +link+"> </iframe>";

						}

						else if(searchTerm == 'dog'){
							var link = 'https://www.youtube.com/watch?v=C8FW6t3Yt6Y&feature=youtu.be';
							link = link.replace("watch?v=", "v/");
							
						singleInfoDiv.innerHTML += '<iframe  src=' +link+"> </iframe>";

						}
						else if(searchTerm == 'police'){
							var link = 'https://www.youtube.com/watch?v=WysZ9BjALC4&feature=youtu.be';
							link = link.replace("watch?v=", "v/");
							
							singleInfoDiv.innerHTML += '<iframe src=' +link+"> </iframe>";

						}
					}
								

				
				targetInfo.appendChild(singleInfoDiv)

				
			}

			else{

				var targetInfo = document.createElement("div");
				targetInfo.setAttribute('class','wordInfo w3-container');

				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','noInfo w3-container');
				var t = document.createTextNode("No matches yet for this term in "+serverWords[i].dest_language);
				singleInfoDiv.appendChild(t);


				var t2 = document.createTextNode("Upcoming Feature: Suggest a Term");
				singleInfoDiv.appendChild(t2);

				targetInfo.appendChild(singleInfoDiv)
			}
			targetDiv.appendChild(targetInfo);

			wordDiv.appendChild(sourceDiv);
			wordDiv.appendChild(targetDiv);

			if(displayEnglish){
				englishDiv.setAttribute('class','englishDiv w3-container');
				
				

				var engLangDiv = document.createElement("div");
				engLangDiv.setAttribute('class','language w3-container');
				var t = document.createTextNode("English");
				engLangDiv.appendChild(t);
				englishDiv.appendChild(engLangDiv);

				var termsDump = document.createElement('div');
			termsDump.className ="w3-container termsDump";// w3-border";
			
			for (var j = 0; j < serverWords[i].eng_terms.length; j++){

				var singleTermDiv = document.createElement("div");
				singleTermDiv.setAttribute('class','terms w3-hover-yellow w3-container ');
				singleTermDiv.title = "Copy '"+serverWords[i].eng_terms[j]+"' ";

				var t = document.createTextNode(serverWords[i].eng_terms[j]);

				var copyText = document.createElement("TEXTAREA");
				
				copyText.value = serverWords[i].eng_terms[j];
				$(copyText).hide();
				
				singleTermDiv.appendChild(copyText);
				singleTermDiv.appendChild(t);

				singleTermDiv.addEventListener('click', function () {
					$(this.firstChild).show();
					this.firstChild.select();
					document.execCommand('copy');
					$(this.firstChild).hide();
					
				});

				termsDump.appendChild(singleTermDiv);

			}

			
			englishDiv.appendChild(termsDump);



			var englishInfo = document.createElement("div");
			englishInfo.setAttribute('class','wordInfo w3-container');

			if(serverWords[i].english_definition !=""){
				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
				var t = document.createTextNode(serverWords[i].english_definition);
				singleInfoDiv.appendChild(t);
				englishInfo.appendChild(singleInfoDiv);
			}

			if(serverWords[i].english_example_sents !=""){
				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
				var t = document.createTextNode(serverWords[i].english_example_sents);
				singleInfoDiv.appendChild(t);
				englishInfo.appendChild(singleInfoDiv);
			}

			
			englishDiv.appendChild(englishInfo);

			wordDiv.appendChild(englishDiv);
		}

		
		

		
		dumpTarget.appendChild(wordDiv);
	}
	var legendBigDiv = document.getElementById("legendBigDiv");
	$(legendBigDiv).show();
	document.getElementById("dump").style ="overflow-y : scroll; height:415px; width: 800px";

	var dumpDiv = document.getElementById("dump");
	dumpTarget.style.display= "none";
	
		//$(dumpTarget).appendTo($(dumpDiv)).show('slow');
		//$(dumpTarget).appendTo($(dumpDiv)).slideDown(1500);
		$(dumpTarget).appendTo($(dumpDiv)).fadeIn();
	}
	

	else{
		

		for (var i=0; i < serverWords.length; i++){

			var wordDiv = document.createElement("div");
			var sourceDiv = document.createElement("div");
			var targetDiv = document.createElement("div");
			var englishDiv = document.createElement("div");

			wordDiv.setAttribute('class','wordDiv w3-container');
		//	$(wordDiv).data("stack", []);   // to store the deleted li definintions
		
		sourceDiv.setAttribute('class','sourceDiv w3-container');
		
		var srcLangDiv = document.createElement("div");
		srcLangDiv.setAttribute('class','language w3-container');
		
		var t = document.createTextNode(serverWords[i].src_language);
		srcLangDiv.appendChild(t);
		sourceDiv.appendChild(srcLangDiv);

		var inputTermDiv = document.createElement("div");
		
		inputTermDiv.setAttribute('class','inputTermDiv w3-container');
		
		var inputTerm = document.createElement("div");
		inputTerm.setAttribute('class','inputTerm w3-container');
		var t = document.createTextNode(serverWords[i].src_term);
		inputTerm.appendChild(t);
		inputTermDiv.appendChild(inputTerm);

		sourceDiv.appendChild(inputTermDiv);

		

		var sourceInfo = document.createElement("div");
		sourceInfo.setAttribute('class','sourceInfo w3-container');
		

		if(serverWords[i].src_definition !=""){
			var singleInfoDiv = document.createElement("div");
			singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
			var t = document.createTextNode(serverWords[i].src_definition);
			singleInfoDiv.appendChild(t);
			sourceInfo.appendChild(singleInfoDiv);
		}

		if(serverWords[i].src_example_sents !=""){
			var singleInfoDiv = document.createElement("div");
			singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
			var t = document.createTextNode(serverWords[i].src_example_sents);
			singleInfoDiv.appendChild(t);
			sourceInfo.appendChild(singleInfoDiv);
		}

		if(serverWords[i].src_gloss !=""){
			var singleInfoDiv = document.createElement("div");
			singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
			var t = document.createTextNode(serverWords[i].src_gloss);
			singleInfoDiv.appendChild(t);
			sourceInfo.appendChild(singleInfoDiv);
		}

		sourceDiv.appendChild(sourceInfo);


		targetDiv.setAttribute('class','targetDiv w3-container');
		

		var trgtLangDiv = document.createElement("div");
		trgtLangDiv.setAttribute('class','language w3-container');
		var t = document.createTextNode(serverWords[i].dest_language);
		trgtLangDiv.appendChild(t);
		targetDiv.appendChild(trgtLangDiv);

		var termsDump = document.createElement('div');
			termsDump.className ="w3-container termsDump";// w3-border";
			//ul.className ="w3-ul w3-border";
			
			// creating an li radio button for each definition
			if(serverWords[i].dest_concept){

				for (var j = 0; j < serverWords[i].dest_terms.length; j++){

					var singleTermDiv = document.createElement("div");
					singleTermDiv.setAttribute('class','terms w3-hover-yellow w3-container ');
					singleTermDiv.title = "Copy '"+serverWords[i].dest_terms[j]+"' ";

					var t = document.createTextNode(serverWords[i].dest_terms[j]);

					var copyText = document.createElement("TEXTAREA");
					
					copyText.value = serverWords[i].dest_terms[j];
					$(copyText).hide();
					
					singleTermDiv.appendChild(copyText);
					singleTermDiv.appendChild(t);

					singleTermDiv.addEventListener('click', function () {
						$(this.firstChild).show();
						this.firstChild.select();
						document.execCommand('copy');
						$(this.firstChild).hide();
						
					});

					termsDump.appendChild(singleTermDiv);

				}
				


				targetDiv.appendChild(termsDump);


				var targetInfo = document.createElement("div");
				targetInfo.setAttribute('class','wordInfo w3-container');


				if(serverWords[i].dest_definition !=""){
					var singleInfoDiv = document.createElement("div");
					singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
					var t = document.createTextNode(serverWords[i].dest_definition);
					singleInfoDiv.appendChild(t);
					targetInfo.appendChild(singleInfoDiv);
				}

				if(serverWords[i].dest_example_sents !=""){
					var singleInfoDiv = document.createElement("div");
					singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
					var t = document.createTextNode(serverWords[i].dest_example_sents);
					singleInfoDiv.appendChild(t);
					targetInfo.appendChild(singleInfoDiv);
				}

				if(serverWords[i].dest_gloss !=""){
					var singleInfoDiv = document.createElement("div");
					singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
					var t = document.createTextNode(serverWords[i].dest_gloss);
					singleInfoDiv.appendChild(t);
					targetInfo.appendChild(singleInfoDiv);
				}
			}

			else{

				var targetInfo = document.createElement("div");
				targetInfo.setAttribute('class','wordInfo w3-container');

				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','noInfo w3-container');
				var t = document.createTextNode("No matches yet for this term in "+serverWords[i].dest_language);
				singleInfoDiv.appendChild(t);
				targetInfo.appendChild(singleInfoDiv)
			}
			targetDiv.appendChild(targetInfo);

			wordDiv.appendChild(sourceDiv);
			wordDiv.appendChild(targetDiv);

			if(displayEnglish){
				englishDiv.setAttribute('class','englishDiv w3-container');
				
				

				var engLangDiv = document.createElement("div");
				engLangDiv.setAttribute('class','language w3-container');
				var t = document.createTextNode("English");
				engLangDiv.appendChild(t);
				englishDiv.appendChild(engLangDiv);

				var termsDump = document.createElement('div');
			termsDump.className ="w3-container termsDump";// w3-border";
			
			for (var j = 0; j < serverWords[i].eng_terms.length; j++){

				var singleTermDiv = document.createElement("div");
				singleTermDiv.setAttribute('class','terms w3-hover-yellow w3-container ');
				singleTermDiv.title = "Copy '"+serverWords[i].eng_terms[j]+"' ";

				var t = document.createTextNode(serverWords[i].eng_terms[j]);

				var copyText = document.createElement("TEXTAREA");
				
				copyText.value = serverWords[i].eng_terms[j];
				$(copyText).hide();
				
				singleTermDiv.appendChild(copyText);
				singleTermDiv.appendChild(t);

				singleTermDiv.addEventListener('click', function () {
					$(this.firstChild).show();
					this.firstChild.select();
					document.execCommand('copy');
					$(this.firstChild).hide();
					
				});

				termsDump.appendChild(singleTermDiv);

			}

			
			englishDiv.appendChild(termsDump);



			var englishInfo = document.createElement("div");
			englishInfo.setAttribute('class','wordInfo w3-container');

			if(serverWords[i].english_definition !=""){
				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
				var t = document.createTextNode(serverWords[i].english_definition);
				singleInfoDiv.appendChild(t);
				englishInfo.appendChild(singleInfoDiv);
			}

			if(serverWords[i].english_example_sents !=""){
				var singleInfoDiv = document.createElement("div");
				singleInfoDiv.setAttribute('class','singleInfoDiv w3-container');
				var t = document.createTextNode(serverWords[i].english_example_sents);
				singleInfoDiv.appendChild(t);
				englishInfo.appendChild(singleInfoDiv);
			}

			
			englishDiv.appendChild(englishInfo);

			wordDiv.appendChild(englishDiv);
		}

		
		

		
		dumpTarget.appendChild(wordDiv);
	}
	var legendBigDiv = document.getElementById("legendBigDiv");
	$(legendBigDiv).show();
	document.getElementById("dump").style ="overflow-y : scroll; height:415px; width: 800px";

	var dumpDiv = document.getElementById("dump");
	dumpTarget.style.display= "none";
	
		//$(dumpTarget).appendTo($(dumpDiv)).show('slow');
		//$(dumpTarget).appendTo($(dumpDiv)).slideDown(1500);
		$(dumpTarget).appendTo($(dumpDiv)).fadeIn();
	}
}

