
// init parser triggers
var newline = '^';
var space = '~';
var speedSet = '≈';
var wait = '˚';

var htmlStart = 'ƒ';
var htmlEnd = 'ß';

// init default auto-scroll speed
var speed = 50;
var cachedSpeeds = [];
var cachedSpeedsIndex = 0;

var cachedHtmlLines = [];
var cachedHtmlIndex = 0;
var interpretHTML = 0;


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

			case "^": // On new line
				//if (++count > 5)
				//element.style.paddingLeft = "50px";

				element.innerHTML += "<br>";
				break;

			case "~":
				element.innerHTML += "&nbsp";
				break;

			case "≈":
				speed = cachedSpeeds[cachedSpeedsIndex++];
				break;

			case "˚":
				timer = setTimeout(frameLooper.bind(null, array, element), cachedSpeeds[cachedSpeedsIndex++]);
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

/* getTime: Gets the specified time in the auto-scroll txt files for the set time command ('≈') */
function getTime(str, index){
	var time = "", c = "";
	while ((c = str[++index]) != '\n')
		time += c;

	// return the time and new index value
	return [Number(time), index];
}

/* formatStr: accepts raw string and converts to a "screen-drawable" format */
function formatStr(str){	

	var output = "", line = "";

	// loop each character of accepted string
	for (var i = 0, len = str.length, c = ""; i < len; i++){
		c = str[i];
			
		// switch-case on a given character
		switch(c){
			case '\n': // new-line
				line += newline;
				if (interpretHTML == 1) cachedHtmlLines.push(line);
				output += line;
				line = "";
				break;

			case '\t': // tab
				line += "~~~~~~~~"; // NOTE: A '~' character indicates a space
				break;

			case speedSet: // speed change
				var get = getTime(str, i);
				var time = get[0];
				var index = get[1];

				cachedSpeeds.push(time);
				output += '≈';

				i = index;
				break;

			case wait:
				var get = getTime(str, i);
				var time = get[0];
				var index = get[1];

				cachedSpeeds.push(time);
				output += '˚';

				i = index;
				break;

			case htmlStart:
				interpretHTML = 1;
				break;

			case htmlEnd:
				interpretHTML = 0;
				break;

			default: // default behavior
				line += c;
				
		}

	}

	// return formated string
	return output;
}


function writeOut(file, element){
	
	getFileContents(file, function(str) {
		var output = formatStr(str);	
	
		frameLooper(output.split(""), element)		

	});
}

	