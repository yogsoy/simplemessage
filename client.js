getMessages();
scrollMessages();
var messageform = document.getElementById(`messageform`);
function autoGet() {
    if (document.getElementById("autoget").elements.namedItem("wantmessages").value === `yes`) {
        getMessages();
        setInterval(getMessages, 1500);
    } else {
        clearInterval(getMessages);
    };
};
function getMessages() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("messages").value = this.responseText;
        }
    };
    xhttp.open("GET", "messages.txt", true);
    xhttp.send();
    scrollMessages();
};
function sendMessage() {
    var username = document.getElementById(`messageform`).elements[0].value;
    var messagetext = document.getElementById(`messageform`).elements[1].value;
    if (username != `` && messagetext != ``) {
        var messageContent = `/?usr=${username}&msg=${messagetext}`;
        var xhttp = new XMLHttpRequest;
	xhttp.open(`POST`, messageContent, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById(`messagestatus`).innerHTML = `Message sent.`;
		setTimeout(500, function() { document.getElementById(`messagestatus`).innerHTML = ``})
            }
        };
    } else {
        document.getElementById(`messagestatus`).innerHTML = `Please make sure you include both a username and a message.`;
    };
    document.getElementById(`messages`).value = document.getElementById(`messages`).value + `\n${username}:${messagetext}`;
    document.getElementById(`messageform`).elements[1].value = ``;
    getMessages()
};

function scrollMessages() {
	var t = document.getElementById(`messages`);
	t.scrollTop = t.scrollHeight;
}
