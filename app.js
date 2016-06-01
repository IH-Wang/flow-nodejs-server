process.env.TMPDIR = "upload";

var express = require('express');
var multipart = require('connect-multiparty');
var flow = require('./flow-node.js')('upload');
var app = express();
const PORT = 3000;

var ACCESS_CONTROL_ALLOW_ORIGIN = false;

app.use(express.static(__dirname + '/public'));

app.post('/upload', multipart(), function(req, res) {
    flow.post(req, function(status, filename, original_filename, identifier) {
        console.log('POST', status, original_filename, identifier);
        if (ACCESS_CONTROL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
        }
        res.status(status).send();
    });
});

app.options('/upload', function(req, res) {
    console.log('OPTIONS');
    if (ACCESS_CONTROL_ALLOW_ORIGIN) {
        res.header("Access-Control-Allow-Origin", "*");
    }
    res.status(200).send();
});

app.get('/upload', function(req, res) {
    flow.get(req, function(status, filename, original_filename, identifier) {
        console.log('GET', status);
        if (ACCESS_CONTROL_ALLOW_ORIGIN) {
            res.header("Access-Control-Allow-Origin", "*");
        }

        if (status == 'found') {
            status = 200;
        } else {
            status = 204;
        }

        res.status(status).send();
    });
});

app.get('/download/:identifier&:fileName', function(req, res) {
    flow.write(req.params.identifier,req.paramsfileName, res);
});
app.listen(PORT, function() {
    console.log(`Listen to http://localhost:${PORT}`);
});
