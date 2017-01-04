
// define the parser's triggers
var PTrigger = {
	nline : '^',
	space : '~',
	speed : '≈',
	wait : '˚',
	htmlS : 'ƒ',
	htmlE : 'ß',
};

// init parser triggers
var newlineChar = '^';
var spaceChar = '~';
var speedSetChar = '≈';
var waitChar = '˚';
var interpretHTMLStartChar = 'ƒ';
var interpretHTMLEndChar = 'ß';


// init default auto-scroll speed
var speed = 50;


var cachedHtmlLines = [];
var cachedHtmlIndex = 0;
var interpretHTML = 0;


var buffer = [];
var index = 0;

function push(obj){
	buffer.push(obj);
}

function pop(){
	return buffer.shift();
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


var count = 0; 
function frameLooper(array, element) {

 	var timer;
 	var temp

	if (array.length > 0){
		element.scrollTop = element.scrollHeight;
		temp = array.shift();

		switch(temp) {

			case newlineChar: // On new line
				element.innerHTML += "<br>";
				break;

			case spaceChar:
				element.innerHTML += "&nbsp";
				break;

			case speedSetChar:
				speed = buffer[index++];
				break;

			case waitChar:
				timer = setTimeout(frameLooper.bind(null, array, element), buffer[index++]);
				return;

			default:
				element.innerHTML += temp;
		}

	}else{

		clearTimeout(timer);
		//console.log("here");
		//return;
	}

	timer = setTimeout(frameLooper.bind(null, array, element), speed);

	//timer = setTimeout(frameLooper.bind(null, array, element), 1);

}


/* formatStr: accepts raw string and converts to a "screen-drawable" format */
function formatStr(str){	

	var output = "", line = "";

	// loop each character of accepted string
	for (var i = 0, len = str.length, c = ""; i < len; i++){
		c = str[i];
			
		// switch-case on a given character
		switch(c){

			/* NEW LINES */
			case '\n': // new-line
				line += PTrigger.nline;
				output += line;
				line = "";
				break;

			/* TAB */ 
			case '\t': // tab
				line += "~~~~~~~~"; // NOTE: A '~' character indicates a space
				break;

			/* SPEED SET */
			case PTrigger.speed:
				i = pushInteger(str, i);
				output += PTrigger.speed;
				break;

			/* WAIT CHAR */
			case PTrigger.wait:
				i = pushInteger(str, i);
				output += PTrigger.wait;
				break;

			/* INTERPRET HTML START */
			case PTrigger.htmlS:
				interpretHTML = 1;
				break;

			/* INTERPRET HTML END */
			case PTrigger.htmlE:
				interpretHTML = 0;
				break;

			/* DEFAULT */
			default: // default behavior
				line += c;
				
		}

	}

	// return formated string
	return output;
}


/* pushInteger: pulls one-line integer from text file and pushes it to the buffer */
function pushInteger(str, index){
	var val = "", c = "";
	while ((c = str[++index]) != '\n')
		val += c;

	// push the value 
	push(Number(val));

	// return the new index
	return index;
}



function writeOut(file, element){
	
	getFileContents(file, function(str) {
		var output = formatStr(str);	
	
		frameLooper(output.split(""), element)		

	});
}

	