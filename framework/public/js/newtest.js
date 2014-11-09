function addUp() {
	var questionsJSON = {};
	questionsJSON.test = {
		"name": document.getElementsByName("testName")[0].value,
		"points": document.getElementsByName("datetimeTest")[0].value,
		"time": document.getElementsByName("datetimeTest")[0].value
	};
	questionsJSON.questions = [];
	for (var i = 0; i < qNumber + 1; i++) {
		questionsJSON.questions[i] = {
			"type": document.getElementsByName("type" + i)[0][document.getElementsByName("type" + i)[0].selectedIndex].value,
			"randomized": document.getElementsByName("randomized" + i)[0].checked,
			"points": parseInt(document.getElementsByName("points" + i)[0].value),
			"content": document.getElementsByName("question" + i)[0].value,
			"amtAnswers": parseInt(document.getElementsByName("amtAnswers" + i)[0].value),
			"correctAnswer": document.getElementsByName("correctAnswer" + i)[0][document.getElementsByName("correctAnswer" + i)[0].selectedIndex].value,
			"answers": answerChoices(document.getElementsByName("amtAnswers" + i)[0].value, i)
		};
	}
	return questionsJSON;
}
function answerChoices(amt, qNumbers) {
	var returnArr = [];
	for (var i = 0; i < amt; i++) {
		returnArr.push(document.getElementsByName("answer" + qNumbers)[i].value);
	}
	return returnArr;
}
function sendQuestionsToServer() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/newtest/", false);
	xhr.send(JSON.stringify(addUp()));
	alert("yay");
	return false;
}

var qNumber = 0;
function newQuestion(number) {
	var innerHTML = '<div class="row"><div class="callout panel"><div class="row"><div class="large-3 columns"><center><h4>Question Type</h4></center><select form="newtestCreation" class="question-type" name="type' + number + '"><option value="mtpl">Multiple Choice</option><option value="shrt">Short Answer</option><option value="mtch">Matching</option><option value="othr">Other</option></select><row><div class="large-12 columns"><center><input name="randomized' + number + '" type="checkbox"><label for="random">Randomize?</label></center></div><div class="row collapse"><div class="small-5 columns"><span class="prefix">Worth</span></div><div class="small-4 columns"><input type="number" placeholder="" name="points' + number + '"></div><div class="small-3 columns"><span class="postfix">Pts.</span></div></div></row></div><div class="large-1 columns"><br></div><div class="large-8 columns"><center><h4>Question Info</h4></center><div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-2 columns"><span class="prefix">Question:</span></div><div class="small-10 columns"><input type="text" placeholder="e.g. How big is China?" class="form-control medform" name="question' + number + '"></div></div></div></div><div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-2 columns"><br><center><h6># Answer Choices</h6></center><select form="newtestCreation" name="amtAnswers' + number + '"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><center><h6>Correct Answer<select form="newtestCreation" name="correctAnswer' + number + '"><div ng-repeat="answer in answers"><div class="form-group"><option value="a">A</option></div></div></select></h6></center></div><div class="small-9 columns"><div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-2 columns"><span class="prefix">A:</span></div><div class="small-10 columns"><input type="text" name="answer' + number + '" placeholder="Apple"></div></div></div></div><div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-2 columns"><span class="prefix">B:</span></div><div class="small-10 columns"><input type="text" name="answer' + number + '" placeholder="Banana"></div></div></div></div><div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-2 columns"><span class="prefix">C:</span></div><div class="small-10 columns"><input type="text" name="answer' + number + '" placeholder="Carrot"></div></div></div></div><div class="row"><div class="large-12 columns"><div class="row collapse"><div class="small-2 columns"><span class="prefix">D:</span></div><div class="small-10 columns"><input type="text" placeholder="Daikon" name="answer' + number + '"></div></div></div></div></div></div></div><h4 style="float:right;margin-top:-125px;margin-right:-25px;" align="right"><font color="F21111">x</font></h4></div></div><div class="large-2 columns"><a></a><div class="row"><br><br></div></div></div></div></div>';
	var div = document.createElement("div");
	div.className = "form-group";
	div.innerHTML = innerHTML;
	document.getElementsByClassName("question-block")[0].appendChild(div);
	
}