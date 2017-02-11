console.log("running...");

var displayed = document.getElementById("display-content");
var interpreted = document.getElementById("interpreted-content");

var file = "/static/auto-scroll/test.html";

var contents = "";
var index = 0;


var timer;
var line = "";
var isInterpreted = true;
var isDisplayed = false;

// CSS related input
var cssBuffer = "";
var isCSS = false;

// speed related input
var setSpeed = false;

function looper() {

	// get current character
	var c = contents[index];

	switch (c) {
		case '\n':
			displayed.innerHTML += "<br>";
			if (isInterpreted) interpret();
			isInterpreted = true;

			line = "";
			
			iterate();
			return;

		case '\t':
			displayed.innerHTML += "&nbsp&nbsp&nbsp&nbsp";
			iterate();
			return;

		case '~':
			isInterpreted = false;
			iterate();
			return;

		// speed set
		case '≈':
			setSpeed = true;
			isDisplayed = false;
			iterate();
			return;

		default:
			break;
	}


	if (isDisplayed) displayed.innerHTML += c;
	line += c;

	iterate();
}

function interpret() {

	switch (line) {
		case "<style>":
			cssStart();
			break;

		case "</style>":
			cssStop();
			break;

		default:
			if (isCSS) 
				cssBuffer += line;
			else if(setSpeed) {
				speed = parseInt(line);
				setSpeed = false;
				isDisplayed = true;
			} else
				interpreted.innerHTML += line;
			
			break;
	}

}

var speed = 100;
function iterate() {
	if (index < contents.length-1) {
		timer = setTimeout(looper.bind(null), speed);
		index++;
	}
}

function cssStart() {
	displayed.style.color = "red";



	console.log("style START");
	cssBuffer += line;
	isCSS = true;
}

function cssStop() {
	displayed.style.color = "#00FF00";

	console.log("style FIN");
	cssBuffer += line; 
	interpreted.innerHTML += cssBuffer;

	cssBuffer = "";
	isCSS = false;
}


/* getFileContents: Handles reading from local resources */
function getFileContents(file, callback) {

	// ajax linker
	$.ajax({
		url : file,

		// on success, call callback
		success : function(result){
			if ($.isFunction(callback))
				callback.apply(null, [result]);
		}

	});
}

// START
getFileContents(file, 
	function(result) {
		contents = result;
		looper();
	});