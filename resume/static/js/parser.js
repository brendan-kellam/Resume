

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


var speed = 1;
function frameLooper(array, element) {

 	var timer;
 	var temp

	if (array.length > 0){
		element.scrollTop = element.scrollHeight;
		temp = array.shift();

		switch(temp) {
			case "^":
				element.innerHTML += "<br>";
				break;
			case "~":
				element.innerHTML += "&nbsp";
				break;
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

	var output = "";
	var line = "";

	// loop each character of accepted string
	for (var i = 0, len = str.length, c = ""; i < len; i++){
		c = str[i];
			
		// switch-case on a given character
		switch(c){
			case '\n': // new-line
				line += '^';
				output += line;
				line = "";
				break;

			case '\t': // tab
				line += "~~~~~~~~"; // NOTE: A '~' character indicates a space
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

	