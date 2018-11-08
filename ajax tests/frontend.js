function getText() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("magictext").innerHTML = this.responseText;
        };
    };
    xhttp.open("GET", "servertext.txt", true);
    xhttp.send();
}