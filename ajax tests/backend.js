const http = require(`http`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const url = require(`url`);
const websocket = require(`websocket`).server;

const siteDirectory = `./`;

http.createServer(function(req,res) {

    var trueURL = req.url.split("?");

    if (trueURL[1]) {
        var q = url.parse(`/?${trueURL[1]}`, true).query;
        console.log(q);
        if (q.message) {
            try {
                fs.appendFileSync(`${siteDirectory}messages.html`, `<br>\n${q.user}: ${q.message}`);
            } catch (err) {
                console.log(chalk.red(`Error logging message: ${err}`))
            };
        };

        //parses the stuff in the url as human readable - q[] is the contents of the url, base 0
        var objects = "";
        for (object in q) {
            var objects = objects + `"${object} = ${q[object]}",`;
        };
        var objects = objects.slice(0, -1);
    } else {
        var objects = "none";
    };

    console.log(`Request from ${req.connection.remoteAddress.slice(7)}: wanting ${trueURL[0]}`)

    //how use fs lol
    if (trueURL[0] === `/`) {
        sendData(`${siteDirectory}/index.html`);
    } else {
        fs.readFile(`${siteDirectory}${trueURL[0]}`, function(err,data) {
            if (err) {
                sendData(`${siteDirectory}/404.html`);
            } else {
                sendData(`${siteDirectory}${trueURL[0]}`);
            };
        });
    };

    function sendData(file) {
        fs.readFile(file, function(err,data) {
            res.write(data);
            res.end();
        });
    };
}).listen(8080); //port 8080 because i cant be bothered to change the forward