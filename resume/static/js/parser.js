

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



function frameLooper(array, element) {

 	var timer;
 	var temp

	if (array.length > 0){
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
	}

	timer = setTimeout(frameLooper.bind(null, array, element), 0);

}


function formatStr(str){


	var output = "";
	var line = "";
	for (var i = 0, len = str.length, c = ""; i < len; i++){
		c = str[i];
		
		switch(c){
			case '\n':
				line += '^';
				output += line;
				line = "";
				break;

			case '\t':
				line += "~~~~~~~~";
				break;

			default:
				line += c;
		}

	}


	return output;
}


function writeOut(file, element){
	
	getFileContents("", function(str) {
		var output = formatStr(str);	
	
		frameLooper(output.split(""), element)		

	});
}





	