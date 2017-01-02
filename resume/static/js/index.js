/**
	

**/

function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("demo").innerHTML = this.responseText;
		}
	};
  xhttp.open("GET", "/static/js/test.txt", true);
  xhttp.send();
}




writeOut("/static/auto-scroll/test.txt", document.getElementById("main"));
