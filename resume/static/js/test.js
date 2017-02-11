console.log("running...");

var displayed = document.getElementById("display-content");
var interpreted = document.getElementById("interpreted-content");


var file = "/static/auto-scroll/test.html";

var contents = "";
var index = 0;


var timer;
var line = "";
var cssBuffer = "";
var isCSS = false;

var isInterpreted = true;
function looper() {

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

		case '|':
			isInterpreted = false;
			iterate();
			return;

		default:
			break;
	}


	displayed.innerHTML += c;
	line += c;

	iterate();
}

function interpret() {

	console.log(line);

	switch (line) {
		case "<style>":
			console.log("style START");
			cssBuffer += line;
			isCSS = true;
			break;

		case "</style>":
			cssBuffer += line; 
			console.log("style FIN");
			interpreted.innerHTML += cssBuffer;

			cssBuffer = "";
			isCSS = false;
			break;

		default:
			if (isCSS) {
				cssBuffer += line;
				break;
			}
			interpreted.innerHTML += line;
			break;
	}

}

function iterate() {
	if (index < contents.length-1) {
		timer = setTimeout(looper.bind(null), 40);
		index++;
	}
}

/* getLine: handles getting a line */
function getLine(index, str) {

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

getFileContents(file, 
	function(result) {
		contents = result;
		looper();
	});