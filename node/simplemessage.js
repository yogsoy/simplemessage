const http = require(`http`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const url = require(`url`);

const siteDirectory = `../`;
const storageLocation = `/smbshare/simplemessage`;

http.createServer(function(req,res) {

    if (req.method == `POST`) {
        console.log(`Someone tried to send a post!`);
        console.log(req.url);
        fs.appendFile(`${siteDirectory}messages.txt`, `\n${req.url.slice(1)}<br>`, function (err) {
            if (err) {
                console.log(chalk.red(`Error logging message: ${err}`));
            };
        });
        //console.log(req);
    } else {
        //trueURL is an array containing [0]: the base for the request (/pages/help.html) and [1]: the URL contents (?name=broken&near=death)
        var trueURL = req.url.split("?");

        if (trueURL[1]) {
            //q[] is the contents of the url, base 0
            var q = url.parse(`/?${trueURL[1]}`, true).query;
            //console.log(q);

            /*
            //attempt to log an attached message to the messages.txt file (not really needed anymore, but people who know how this works can submit messages)
            if (q.message) {
                try {
                    fs.appendFileSync(`${siteDirectory}messages.txt`, `\n${q.user}: ${q.message}<br>`);
                } catch (err) {
                    console.log(chalk.red(`Error logging message: ${err}`))
                };
            };
            */

            //parses the stuff in the url as human readable
            var objects = "";
            for (object in q) {
                var objects = objects + `"${object} = ${q[object]}",`;
            };
            //$objects is a human readable version of the contents of the URL, mainly for logging
            var objects = objects.slice(0, -1);
        } else {
            var objects = "none";
        };

        console.log(chalk.yellow(`Request from ${chalk.green(req.connection.remoteAddress.slice(7))}: ${chalk.blue(trueURL[0])}`));

        //how use fs lol
        if (trueURL[0] === `/`) {
            sendData(`${storageLocation}/index.html`);
        } else {
            fs.readFile(`${storageLocation}${trueURL[0]}`, function(err,data) {
                if (err) {
                    sendData(`${storageLocation}/404.html`);
                } else {
                    sendData(`${storageLocation}${trueURL[0]}`);
                };
            });
        };

        function sendData(file) {
            fs.readFile(file, function(err,data) {
                //console.log(file);

                //to prevent non-harmful warnings in browsers: define the css files as actual css files so they don't complain
                if (file.split(".").pop() === `css`) {
                    res.setHeader("Content-Type", "text/css");
                };

                res.write(data);
                res.end();
            });
        };
    };
}).listen(81); //port 8080 because i cant be bothered to change the forward